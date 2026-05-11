// screens/player/CircoStanzaScreen.js
// Schermata unificata che sostituisce SceneScreen + AnagramScreen.
// Gestisce due modalità tramite stato interno:
//
//   'narration' → NarratorView (sfondo + sprite + typewriter)
//   'anagram'   → AnagramOverlay (pannello sopra lo sfondo)
//
// Alla risoluzione dell'anagramma → MapScreen (per scegliere il prossimo NPC)
// Tap su "← Testo" in modalità anagramma → torna alla narrazione
//
// Params ricevuti dalla navigation:
//   room         — oggetto stanza
//   sceneId      — id della scena (es. 'acrobata')
//   initialMode  — 'narration' | 'anagram' (default: 'narration')
//                  viene passato 'anagram' dal resume se il player
//                  aveva già visto il testo ma non risolto l'anagramma

import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StatusBar } from 'react-native';

import { supabase } from '../../lib/supabase';
import { useRoomClosedListener, useDisableAndroidBack } from '../../lib/useRoomClosedListener';

import NarratorView from '../../components/NarratorView';
import AnagramOverlay from '../../components/AnagramOverlay';

import { circoStanzaStyles as styles } from '../../styles/player';
import {
  getCharacterAsset,
  getBackgroundAsset,
  getHintAsset,
  getCharacterPosition,
  HINT_POSITIONS,
} from '../../styles/theme';

import scenes from '../../story/storia_1/scenes.json';
import anagrams from '../../story/storia_1/anagrams.json';

export default function CircoStanzaScreen({ route, navigation }) {
  const { room, sceneId, initialMode = 'narration' } = route.params;

  const scene = scenes[sceneId];
  const anagramData = anagrams[sceneId];

  const characterAsset = getCharacterAsset(sceneId);
  const backgroundAsset = getBackgroundAsset(sceneId);
  const hintAsset = getHintAsset(sceneId);
  const hintPosition = HINT_POSITIONS[sceneId] || null;
  const characterPosition = getCharacterPosition(sceneId);

  const [mode, setMode] = useState(initialMode);

  const [initialSolved, setInitialSolved] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);

  const [hintActive, setHintActive] = useState(false);
  const timerRef = useRef(null);
  const hintTimerRef = useRef(null);
  const solvedRef = useRef(false);

  const [hints, setHints] = useState([]);
  const hintsChannelRef = useRef(null);

  const [returnedFromAnagram, setReturnedFromAnagram] = useState(false);

  useRoomClosedListener(room, navigation);
  useDisableAndroidBack();

  useEffect(() => {
    navigation.setOptions({ title: scene?.title || 'Circo-stanza', headerShown: false });
    initialize();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      if (hintsChannelRef.current) supabase.removeChannel(hintsChannelRef.current);
    };
  }, [sceneId]);

  const initialize = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: existing } = await supabase
      .from('progress')
      .select('id, solved')
      .eq('room_id', room.id)
      .eq('player_id', user.id)
      .eq('scene_id', sceneId)
      .maybeSingle();

    if (!existing) {
      await supabase.from('progress').insert({
        room_id: room.id,
        player_id: user.id,
        scene_id: sceneId,
        solved: false,
        entered_at: new Date().toISOString(),
      });
    } else {
      await supabase
        .from('progress')
        .update({ entered_at: new Date().toISOString() })
        .eq('id', existing.id);

      if (existing.solved) {
        setInitialSolved(true);
        solvedRef.current = true;
      }
    }

    setProgressLoaded(true);

    if (!solvedRef.current) {
      startAutoHintTimer();
    }

    fetchHints(user.id);
    subscribeToHints(user.id);
  };

  const startAutoHintTimer = () => {
    const delayMs = room.auto_hint_minutes * 60 * 1000;
    timerRef.current = setTimeout(() => {
      setHintActive(true);
      hintTimerRef.current = setTimeout(() => {
        setHintActive(false);
        if (!solvedRef.current) startAutoHintTimer();
      }, 10000);
    }, delayMs);
  };

  const fetchHints = async (userId) => {
    const { data, error } = await supabase
      .from('hints')
      .select('message, created_at')
      .eq('room_id', room.id)
      .eq('player_id', userId)
      .order('created_at', { ascending: true });
    if (!error && data) setHints(data);
  };

  const subscribeToHints = (userId) => {
    hintsChannelRef.current = supabase
      .channel(`hints_${room.id}_${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'hints',
        filter: `room_id=eq.${room.id}`,
      }, () => fetchHints(userId))
      .subscribe();
  };

  const handleStartAnagram = () => setMode('anagram');

  const handleBackToText = () => {
    setReturnedFromAnagram(true);
    setMode('narration');
  };

  const handleChoiceSelect = (nextSceneId) => {
    navigation.replace('Map', {
      room,
      justSolvedScene: sceneId,
      nextAvailable: [nextSceneId],
      allChoices: scene.choices?.map(c => c.next) || [],
    });
  };

  const handleGoToMap = () => {
    navigation.replace('Map', {
      room,
      justSolvedScene: sceneId,
      nextAvailable: scene.choices?.map(c => c.next) || [],
      allChoices: scene.choices?.map(c => c.next) || [],
    });
  };

  const handleGoToDirettrice = () => {
    navigation.replace('Direttrice', { room });
  };

  if (!scene) return null;

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {mode === 'narration' ? (
        <NarratorView
          scene={scene}
          sceneId={sceneId}
          onStartAnagram={handleStartAnagram}
          characterAsset={characterAsset}
          backgroundAsset={backgroundAsset}
          skipNarration={returnedFromAnagram}
          hintActive={hintActive}
          hintAsset={hintAsset}
          hintPosition={hintPosition}
          characterPosition={characterPosition}
        />
      ) : (
        <>
          {/* Colore placeholder immediato, poi immagine sopra */}
          <View style={[styles.background, { backgroundColor: '#2a1a0a' }]} />
          {backgroundAsset && (
            <Image
              source={backgroundAsset}
              style={[styles.background, styles.backgroundImage]}
              resizeMode="cover"
            />
          )}
          {/* Overlay scuro più intenso per far risaltare il pannello */}
          <View style={[styles.overlay, styles.overlayAnagram]} />
          {/* Personaggio visibile in basso a sinistra (posizione override-able da theme) */}
          {characterAsset && (
            <View style={[styles.characterContainer, characterPosition, { zIndex: 0 }]} pointerEvents="none">
              <Image
                source={characterAsset}
                style={styles.characterImage}
                resizeMode="contain"
              />
            </View>
          )}

          <AnagramOverlay
            scene={scene}
            sceneId={sceneId}
            anagramData={anagramData}
            room={room}
            onBackToText={handleBackToText}
            onChoiceSelect={handleChoiceSelect}
            onGoToMap={handleGoToMap}
            onGoToDirettrice={handleGoToDirettrice}
            characterAsset={characterAsset}
            hints={hints}
            initialSolved={initialSolved}
          />
        </>
      )}
    </View>
  );
}
