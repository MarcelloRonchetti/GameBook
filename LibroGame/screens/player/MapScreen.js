// screens/player/MapScreen.js
// Mappa interattiva del circo con fog of war progressivo.
//
// STATI DI OGNI NODO:
//   'fog'       → bloccato: arco grigio + overlay scuro + "?"
//   'available' → sbloccato e selezionabile: arco normale + bordo oro + sprite
//   'visited'   → già risolto: arco + sprite + badge verde ✓
//   'entry'     → nodo entrata (tenda speciale, non cliccabile)
//
// NODI SPECIALI:
//   'intro'      → tenda ENTRATA (node_tent_entry.png), sempre visibile
//   'direttrice' → tenda FINALE  (node_tent_final.png), cliccabile se available
//
// TUNING — regola queste costanti se sprite/label non sono allineati:
const FRAME_RATIO      = 1.85; // frameH = frameW * FRAME_RATIO
const INTERIOR_TOP     = 0.08; // posizione verticale area sprite (% di frameH)
const INTERIOR_SIZE    = 0.60; // dimensione area sprite (% di frameW)
const INTERIOR_OFFSET_X = 0.01;    // scostamento orizzontale sprite/? dentro l'arco (% di frameW)
const INTERIOR_OFFSET_Y = 0.23;  // scostamento verticale   sprite/? dentro l'arco (% di frameH)
const SPRITE_SCALE      = 0.9;  // dimensione sprite/? (moltiplicatore su intSize, es. 0.8 = più piccolo)
const BANNER_BOTTOM     = 0.31; // posizione verticale label dal fondo (% di frameH)
const LABEL_FONT_SCALE  = 0.084; // dimensione testo label (% di frameW)
// Override per-scena del font label — utile per nomi lunghi (CONTORSIONISTA,
// CAVALLERIZZA...) che sforerebbero il banner di legno.
const LABEL_FONT_OVERRIDES = {
  funambolo:      0.07,
  cavallerizza:   0.069,
  contorsionista: 0.055,
  controfigura:   0.06,
  equilibrista:   0.07,
  sputafuoco:     0.07,
  illusionista:   0.069,
};
// Override per-scena della POSIZIONE del nome sul banner.
//   bottom → % di frameH dal fondo dell'arco (default BANNER_BOTTOM = 0.31).
//            Aumenta per salire, diminuisci per scendere.
//   left   → % di frameW da sinistra (default 0.1).
//            Aumenta per spostare a destra, diminuisci per sinistra.
// Aggiungi qui solo le scene che vuoi spostare, le altre usano i default.
const LABEL_POSITION_OVERRIDES = {
  contorsionista: { bottom: 0.32, left: 0.1 },
  cavallerizza:   { bottom: 0.32, left: 0.1 },
  controfigura:   { bottom: 0.319, left: 0.11 },
  illusionista:   { bottom: 0.318, left: 0.11 },
};
const ARCH_SCALE    = 3;  // moltiplicatore dimensione archi normali
const TENT_SCALE    = 3.8;  // moltiplicatore dimensione tende speciali

// DEBUG: forza tutti i nodi a 'available' per controllare l'overflow dei nomi
// degli NPC sul banner. RIMETTERE A false PRIMA DEL COMMIT/BUILD.
const DEBUG_SHOW_ALL = false;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, Image, TouchableOpacity, useWindowDimensions,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

import { supabase } from '../../lib/supabase';
import { useDisableAndroidBack } from '../../lib/useRoomClosedListener';

import { mapStyles as styles } from '../../styles/player';
import {
  MAP_NODES,
  STORY_GRAPH,
  ASSETS,
  BANNER_CONFIG,
  getNpcTheme,
  getCharacterAsset,
} from '../../styles/theme';

// ---------------------------------------------------------------------------
// HELPER — calcola lo stato di ogni nodo
// ---------------------------------------------------------------------------
function computeNodeStates(visitedScenes, allChoices) {
  const states = {};
  Object.keys(MAP_NODES).forEach((id) => {
    if (DEBUG_SHOW_ALL) {
      states[id] = id === 'intro' ? 'entry' : 'available';
      return;
    }
    if (id === 'intro') { states[id] = 'entry'; return; }
    if (visitedScenes.includes(id)) { states[id] = 'visited'; return; }
    if (allChoices && allChoices.includes(id)) { states[id] = 'available'; return; }
    states[id] = 'fog';
  });
  if (visitedScenes.includes('intro') || visitedScenes.includes('acrobata')) {
    if (states['acrobata'] === 'fog') states['acrobata'] = 'revealed';
  }
  return states;
}

// ---------------------------------------------------------------------------
// HELPER — calcola i percorsi da disegnare
// ---------------------------------------------------------------------------
function computePaths(nodeStates) {
  const paths = [];
  Object.entries(STORY_GRAPH).forEach(([from, { next }]) => {
    next.forEach((to) => {
      const isActive = nodeStates[from] !== 'fog' && nodeStates[to] !== 'fog';
      paths.push({ from, to, active: isActive });
    });
  });
  return paths;
}

// ---------------------------------------------------------------------------
// NODO TENDA — per intro (ENTRATA) e direttrice (FINE)
// ---------------------------------------------------------------------------
function TentNode({ sceneId, nodeConf, state, screenW, screenH, onPress }) {
  const npc       = getNpcTheme(sceneId);
  const isFinal   = sceneId === 'direttrice';
  const isFog     = state === 'fog';
  const isAvail   = state === 'available';
  const tentAsset = isFinal ? ASSETS.map.nodeTentFinal : ASSETS.map.nodeTentEntry;

  const cx      = (nodeConf.x / 100) * screenW;
  const cy      = (nodeConf.y / 100) * screenH;
  const tentW   = nodeConf.size * TENT_SCALE;
  const tentH   = tentW;
  const bc = BANNER_CONFIG[sceneId] || {};
  const bannerW      = tentW  * (bc.bannerScale   ?? 0.4);
  const bannerH      = bannerW / 3.18; // aspect ratio scroll: 6525:2052
  const bannerTop    = bc.bannerTop    ?? 0.40;
  const bannerOffsetX  = tentW   * (bc.bannerOffsetX ?? 0);
  const bannerFontSize = bannerW * (bc.fontScale     ?? 0.09);
  const textOffsetX    = bannerW * (bc.textOffsetX   ?? 0);
  const textOffsetY    = bannerH * (bc.textOffsetY   ?? 0);

  return (
    <TouchableOpacity
      style={[
        styles.nodeContainer,
        { left: cx - bannerW / 2, top: cy - tentH / 2, width: bannerW, height: tentH + bannerH * 0.6, overflow: 'visible' },
      ]}
      onPress={() => isAvail && onPress(sceneId)}
      activeOpacity={isAvail ? 0.8 : 1}
      disabled={!isAvail}
    >
      {/* Tenda */}
      <Image
        source={tentAsset}
        style={{
          position: 'absolute',
          left: (bannerW - tentW) / 2, top: 0,
          width: tentW, height: tentH,
          opacity: isFog ? 0.4 : 1,
          ...(isFog ? { tintColor: '#222' } : {}),
        }}
        resizeMode="contain"
      />


      {/* Banner con nome — sovrapposto alla base della tenda */}
      <View style={{
        position: 'absolute',
        top: tentH * bannerTop,
        left: bannerOffsetX,
        width: bannerW,
        height: bannerH,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Image
          source={ASSETS.map.nodeBanner}
          style={{
            position: 'absolute', width: bannerW, height: bannerH,
            opacity: isFog ? 0.4 : 1,
          }}
          resizeMode="contain"
        />
        <Text style={{
          position: 'absolute',
          left:  bannerW * 0.1 + textOffsetX,
          right: bannerW * 0.1 - textOffsetX,
          top:   bannerH * 0.2 + textOffsetY,
          color: isFog ? 'rgba(255,255,255,0.55)' : '#3a2000',
          fontSize: bannerFontSize,
          fontWeight: 'bold',
          letterSpacing: 0.5,
          textAlign: 'center',
          zIndex: 1,
        }}>
          {isFog ? '???' : npc.label.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// NODO ARCO — per tutti gli NPC
// ---------------------------------------------------------------------------
function ArchNode({ sceneId, nodeConf, state, screenW, screenH, onPress }) {
  const npc           = getNpcTheme(sceneId);
  const characterAsset = getCharacterAsset(sceneId);

  const cx       = (nodeConf.x / 100) * screenW;
  const cy       = (nodeConf.y / 100) * screenH;
  const frameW   = nodeConf.size * ARCH_SCALE;
  const frameH   = frameW * FRAME_RATIO;
  const intSize   = frameW * INTERIOR_SIZE;
  const spriteSize = intSize * SPRITE_SCALE;
  const intLeft   = (frameW - spriteSize) / 2 + frameW * INTERIOR_OFFSET_X;
  const intTop    = frameH * INTERIOR_TOP      + frameH * INTERIOR_OFFSET_Y;

  const isFog   = state === 'fog';
  const isAvail = state === 'available';
  const isSolved = state === 'visited';

  return (
    <View style={[
      styles.nodeContainer,
      {
        left:  cx - frameW / 2,
        top:   cy - frameH * (INTERIOR_TOP + INTERIOR_SIZE * 0.5),
        width: frameW, height: frameH,
      },
    ]}>
    <TouchableOpacity
      style={{ width: frameW, height: frameH }}
      onPress={() => isAvail && onPress(sceneId)}
      activeOpacity={isAvail ? 0.85 : 1}
      disabled={!isAvail}
    >
      {/* Frame arco */}
      <Image
        source={ASSETS.map.nodeFrame}
        style={[
          styles.nodeFrameImage,
          isFog && { opacity: 0.45, tintColor: '#888' },
        ]}
        resizeMode="contain"
      />

      {/* Sprite o emoji nell'area interna (solo se non fog) */}
      {!isFog && (
        <View style={[styles.nodeInterior, { width: spriteSize, height: spriteSize, left: intLeft, top: intTop }]}>
          {characterAsset ? (
            <Image source={characterAsset} style={styles.nodeSprite} />
          ) : (
            <Text style={styles.nodeEmoji}>{npc.emoji}</Text>
          )}
        </View>
      )}

      {/* "?" nebbia senza cerchio */}
      {isFog && (
        <View style={[styles.nodeFogOverlay, { width: spriteSize, height: spriteSize, left: intLeft, top: intTop }]}>
          <Text style={[styles.nodeFogIcon, { fontSize: spriteSize * 0.7 }]}>?</Text>
        </View>
      )}


      {/* Nome NPC sul banner */}
      <Text
        style={[
          styles.nodeLabel,
          {
            bottom:   frameH * (LABEL_POSITION_OVERRIDES[sceneId]?.bottom ?? BANNER_BOTTOM),
            left:     frameW * (LABEL_POSITION_OVERRIDES[sceneId]?.left   ?? 0.1),
            width:    frameW * 0.8,
            fontSize: frameW * (LABEL_FONT_OVERRIDES[sceneId] ?? LABEL_FONT_SCALE),
          },
          isFog && styles.nodeLabelFog,
        ]}
        numberOfLines={1}
      >
        {isFog ? '???' : npc.label.toUpperCase()}
      </Text>
    </TouchableOpacity>
    </View>
  );
}

// ---------------------------------------------------------------------------
// MAPSCREEN
// ---------------------------------------------------------------------------
export default function MapScreen({ route, navigation }) {
  const { room, allChoices = [] } = route.params;
  const { width: screenW, height: screenH } = useWindowDimensions();

  useDisableAndroidBack();

  // Stato iniziale derivato sincronicamente da allChoices (passato in route.params):
  // i nodi disponibili appaiono subito come 'available', il resto come 'fog'.
  // Quando arriva la risposta Supabase, le scene gia' risolte passano a 'visited'.
  // Cosi' la mappa e' visibile immediatamente senza attendere la query.
  const initialStates = useMemo(
    () => computeNodeStates([], allChoices),
    [allChoices],
  );
  const [nodeStates, setNodeStates] = useState(initialStates);
  const [paths, setPaths]           = useState(() => computePaths(initialStates));

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: progress } = await supabase
      .from('progress')
      .select('scene_id, solved')
      .eq('room_id', room.id)
      .eq('player_id', user.id);

    const visited = (progress || []).filter(p => p.solved).map(p => p.scene_id);
    const states  = computeNodeStates(visited, allChoices);
    setNodeStates(states);
    setPaths(computePaths(states));
  };

  const handleNodePress = useCallback((sceneId) => {
    navigation.replace('CircoStanza', { room, sceneId, initialMode: 'narration' });
  }, [navigation, room]);

  return (
    <View style={styles.container}>
      {/* SFONDO */}
      <Image
        source={ASSETS.map.background}
        style={[styles.mapBackground, styles.mapImage]}
        resizeMode="cover"
      />

      {/* PERCORSI SVG — linee dorate bezier */}
      <Svg style={styles.svgOverlay} width={screenW} height={screenH}>
        {paths.map(({ from, to, active }, i) => {
          const fn = MAP_NODES[from];
          const tn = MAP_NODES[to];
          if (!fn || !tn) return null;

          const x1 = ((fn.x + (fn.pathAnchorX ?? 0)) / 100) * screenW;
          const y1 = ((fn.y + (fn.pathAnchorY ?? 0)) / 100) * screenH;
          const x2 = ((tn.x + (tn.pathAnchorX ?? 0)) / 100) * screenW;
          const y2 = ((tn.y + (tn.pathAnchorY ?? 0)) / 100) * screenH;
          const mx  = (x1 + x2) / 2;
          const my  = (y1 + y2) / 2;
          const dx  = x2 - x1;
          const dy  = y2 - y1;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const cpx = mx + (-dy / len) * 12;
          const cpy = my + ( dx / len) * 12;

          return (
            <React.Fragment key={i}>
              <Path
                d={`M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`}
                stroke={active ? '#C8A45A' : 'rgba(120,100,60,0.35)'}
                strokeWidth={active ? 4.5 : 2}
                strokeLinecap="round"
                fill="none"
                opacity={active ? 0.92 : 0.4}
              />
              {active && (
                <Circle cx={mx} cy={my} r={3.5} fill="#C8A45A" opacity={0.85} />
              )}
            </React.Fragment>
          );
        })}
      </Svg>

      {/* NODI */}
      {Object.entries(MAP_NODES).map(([sceneId, nodeConf]) => {
        const state    = nodeStates[sceneId] || 'fog';
        const isTent   = sceneId === 'intro' || sceneId === 'direttrice';

        if (isTent) {
          return (
            <TentNode
              key={sceneId}
              sceneId={sceneId}
              nodeConf={nodeConf}
              state={state}
              screenW={screenW}
              screenH={screenH}
              onPress={handleNodePress}
            />
          );
        }
        return (
          <ArchNode
            key={sceneId}
            sceneId={sceneId}
            nodeConf={nodeConf}
            state={state}
            screenW={screenW}
            screenH={screenH}
            onPress={handleNodePress}
          />
        );
      })}

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎪 Il Circo delle Circostanze</Text>
        <Text style={styles.headerHint}>Scegli la prossima circo-stanza</Text>
      </View>
    </View>
  );
}
