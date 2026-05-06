// screens/player/MapScreen.js
// Mappa interattiva del circo con fog of war progressivo.
//
// STATI DI OGNI NODO:
//   'fog'       → sconosciuto, coperto da nebbia (grigio scuro)
//   'revealed'  → visibile ma non selezionabile (nodo che non puoi ancora raggiungere)
//   'available' → selezionabile ora (il player deve scegliere tra questi)
//   'visited'   → già risolto (bordo verde, nessuna nebbia)
//   'entry'     → nodo entrata (sempre visibile, non cliccabile)
//
// LOGICA SBLOCCO:
//   Al caricamento legge tutti i progress del player da Supabase.
//   Calcola quali nodi sono visited, quali available (next del nodo appena risolto),
//   e copre tutto il resto con la nebbia.
//
// PARAMS dalla navigation:
//   room             — oggetto stanza
//   justSolvedScene  — sceneId appena risolto (per calcolare i next)
//   allChoices       — array dei prossimi sceneId disponibili
//
// Dopo che il player sceglie un nodo available → CircoStanzaScreen di quella stanza.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  Animated, Dimensions, useWindowDimensions,
} from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';

import { Asset } from 'expo-asset';

import { supabase } from '../../lib/supabase';
import { useDisableAndroidBack } from '../../lib/useRoomClosedListener';

import { mapStyles as styles } from '../../styles/player';
import {
  colors,
  MAP_NODES,
  STORY_GRAPH,
  ASSETS,
  getNpcTheme,
  getCharacterAsset,
} from '../../styles/theme';

// ---------------------------------------------------------------------------
// HELPER — calcola lo stato di ogni nodo dato l'insieme dei visitati
// ---------------------------------------------------------------------------
function computeNodeStates(visitedScenes, allChoices) {
  const states = {};

  Object.keys(MAP_NODES).forEach((id) => {
    if (id === 'intro') {
      states[id] = 'entry';
      return;
    }
    if (visitedScenes.includes(id)) {
      states[id] = 'visited';
      return;
    }
    if (allChoices && allChoices.includes(id)) {
      states[id] = 'available';
      return;
    }
    states[id] = 'fog';
  });

  // L'Acrobata è sempre revealed dopo l'intro (è il primo nodo fisso)
  if (visitedScenes.includes('intro') || visitedScenes.includes('acrobata')) {
    if (states['acrobata'] === 'fog') states['acrobata'] = 'revealed';
  }

  return states;
}

// ---------------------------------------------------------------------------
// HELPER — calcola tutti i percorsi da disegnare (coppie source→target)
// ---------------------------------------------------------------------------
function computePaths(nodeStates) {
  const paths = [];
  Object.entries(STORY_GRAPH).forEach(([from, { next }]) => {
    next.forEach((to) => {
      const fromState = nodeStates[from];
      const toState = nodeStates[to];
      const isActive =
        fromState !== 'fog' && toState !== 'fog';
      paths.push({ from, to, active: isActive });
    });
  });
  return paths;
}

// ---------------------------------------------------------------------------
// COMPONENTE NODO
// ---------------------------------------------------------------------------
function MapNode({ sceneId, nodeConf, state, screenW, screenH, onPress, pulseAnim }) {
  const npc = getNpcTheme(sceneId);
  const characterAsset = getCharacterAsset(sceneId);

  // Coordinate assolute in dp
  const cx = (nodeConf.x / 100) * screenW;
  const cy = (nodeConf.y / 100) * screenH;
  const size = nodeConf.size;
  const half = size / 2;

  const isFog = state === 'fog';
  const isAvailable = state === 'available';
  const isSolved = state === 'visited';
  const isEntry = state === 'entry';

  const circleStyle = [
    styles.nodeCircle,
    { width: size, height: size },
    isSolved && styles.nodeCircleSolved,
    isFog && styles.nodeCircleFog,
  ];

  // Bordo pulsante per i nodi disponibili
  const animatedBorder = isAvailable
    ? {
        borderColor: colors.mapNodeBorder,
        transform: [{ scale: pulseAnim }],
      }
    : {};

  return (
    <TouchableOpacity
      style={[
        styles.nodeContainer,
        {
          left: cx - half - 24,  // -24 per la label sotto
          top: cy - half - 8,
          width: size + 48,
          paddingHorizontal: 24,
        },
      ]}
      onPress={() => isAvailable && onPress(sceneId)}
      activeOpacity={isAvailable ? 0.75 : 1}
      disabled={!isAvailable}
    >
      <Animated.View style={[circleStyle, animatedBorder]}>
        {/* Sprite personaggio o emoji */}
        {!isFog && characterAsset ? (
          <Image
            source={characterAsset}
            style={styles.nodeSprite}
          />
        ) : (
          <Text style={[styles.nodeEmoji, isFog && { opacity: 0.2 }]}>
            {isFog ? '?' : npc.emoji}
          </Text>
        )}

        {/* Overlay nebbia sopra il nodo */}
        {isFog && (
          <View style={styles.nodeFogOverlay}>
            <Text style={styles.nodeFogIcon}>🌫️</Text>
          </View>
        )}
      </Animated.View>

      {/* Label sotto il nodo */}
      <Text style={[styles.nodeLabel, isFog && styles.nodeLabelFog]}>
        {isFog ? '???' : npc.label.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// MAPSCREEN
// ---------------------------------------------------------------------------
export default function MapScreen({ route, navigation }) {
  const { room, allChoices = [] } = route.params;
  const { width: screenW, height: screenH } = useWindowDimensions();

  useDisableAndroidBack();

  const [visitedScenes, setVisitedScenes] = useState([]);
  const [nodeStates, setNodeStates] = useState({});
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  // Animazione pulsazione per nodi available
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animazioni reveal per ogni nodo (opacity nebbia)
  const fogAnimations = useRef({});
  Object.keys(MAP_NODES).forEach((id) => {
    if (!fogAnimations.current[id]) {
      fogAnimations.current[id] = new Animated.Value(1); // 1 = coperto
    }
  });

  useEffect(() => {
    loadProgress();
    startPulse();
    // Precarica backgrounds e sprites mentre il player vede la mappa,
    // così le immagini sono già decodificate quando entra in una stanza.
    const toPreload = [
      ...Object.values(ASSETS.backgrounds),
      ...Object.values(ASSETS.characters),
    ];
    Asset.loadAsync(toPreload).catch(() => {});
  }, []);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const loadProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: progress } = await supabase
      .from('progress')
      .select('scene_id, solved')
      .eq('room_id', room.id)
      .eq('player_id', user.id);

    // Consideriamo "visitati" solo i nodi risolti
    const visited = (progress || [])
      .filter(p => p.solved)
      .map(p => p.scene_id);

    setVisitedScenes(visited);

    const states = computeNodeStates(visited, allChoices);
    setNodeStates(states);
    setPaths(computePaths(states));

    // Animazione reveal: i nodi newly-available appaiono con un fade
    allChoices.forEach((id) => {
      if (fogAnimations.current[id]) {
        Animated.timing(fogAnimations.current[id], {
          toValue: 0,
          duration: 800,
          delay: 300,
          useNativeDriver: true,
        }).start();
      }
    });

    setLoading(false);
  };

  const handleNodePress = useCallback((sceneId) => {
    navigation.replace('CircoStanza', {
      room,
      sceneId,
      initialMode: 'narration',
    });
  }, [navigation, room]);

  if (loading) return <View style={{ flex: 1, backgroundColor: '#000' }} />;

  return (
    <View style={styles.container}>
      {/* SFONDO MAPPA */}
      <Image
        source={ASSETS.map.background}
        style={[styles.mapBackground, styles.mapImage]}
        resizeMode="cover"
      />

      {/* SVG OVERLAY — linee percorso */}
      <Svg style={styles.svgOverlay} width={screenW} height={screenH}>
        {paths.map(({ from, to, active }, i) => {
          const fromNode = MAP_NODES[from];
          const toNode = MAP_NODES[to];
          if (!fromNode || !toNode) return null;

          const x1 = (fromNode.x / 100) * screenW;
          const y1 = (fromNode.y / 100) * screenH;
          const x2 = (toNode.x / 100) * screenW;
          const y2 = (toNode.y / 100) * screenH;

          return (
            <Line
              key={i}
              x1={x1} y1={y1}
              x2={x2} y2={y2}
              stroke={active ? colors.mapPathColor : colors.mapPathInactive}
              strokeWidth={active ? 2.5 : 1.5}
              strokeDasharray={active ? undefined : '6,4'}
              opacity={active ? 0.85 : 0.35}
            />
          );
        })}
      </Svg>

      {/* NODI */}
      {Object.entries(MAP_NODES).map(([sceneId, nodeConf]) => {
        const state = nodeStates[sceneId] || 'fog';
        return (
          <MapNode
            key={sceneId}
            sceneId={sceneId}
            nodeConf={nodeConf}
            state={state}
            screenW={screenW}
            screenH={screenH}
            onPress={handleNodePress}
            pulseAnim={pulseAnim}
          />
        );
      })}

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          🎪 Il Circo delle Circostanze
        </Text>
        <Text style={styles.headerHint}>
          Scegli la prossima circo-stanza
        </Text>
      </View>
    </View>
  );
}
