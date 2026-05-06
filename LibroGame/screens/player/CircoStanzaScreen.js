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
import { View, StatusBar, Animated } from 'react-native';

import { supabase } from '../../lib/supabase';
import { useRoomClosedListener, useDisableAndroidBack } from '../../lib/useRoomClosedListener';

import NarratorView from '../../components/NarratorView';
import AnagramOverlay from '../../components/AnagramOverlay';
import AutoHintEffect from '../../components/AutoHintEffect';

import { circoStanzaStyles as styles } from '../../styles/player';
import {
  getCharacterAsset,
  getBackgroundAsset,
} from '../../styles/theme';

import scenes from '../../story/storia_1/scenes.json';
import anagrams from '../../story/storia_1/anagrams.json';

export default function CircoStanzaScreen({ route, navigation }) {
  const { room, sceneId, initialMode = 'narration' } = route.params;

  const scene = scenes[sceneId];
  const anagramData = anagrams[sceneId];

  // Asset grafici (null se non ancora disponibili → placeholder)
  const characterAsset = getCharacterAsset(sceneId);
  const backgroundAsset = getBackgroundAsset(sceneId);

  // Modalità corrente della schermata
  const [mode, setMode] = useState(initialMode);

  // Stato anagramma (letto dal DB all'avvio)
  const [initialSolved, setInitialSolved] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);

  // Aiuto automatico
  const [hintActive, setHintActive] = useState(false);
  const timerRef = useRef(null);
  const hintTimerRef = useRef(null);
  const solvedRef = useRef(false);

  // Hints del GM
  const [hints, setHints] = useState([]);
  const hintsChannelRef = useRef(null);

  // --- Hook utilities ---
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

    // 1. Salva/aggiorna il progress (entered_at per il timer)
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
      // Aggiorna entered_at per ri-avviare il timer al rientro
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

    // 2. Avvia timer aiuto automatico solo se non risolto
    if (!solvedRef.current) {
      startAutoHintTimer();
    }

    // 3. Carica e sottoscrivi hints GM
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

  // --- Handlers ---

  const handleStartAnagram = () => {
    setMode('anagram');
  };

  const handleBackToText = () => {
    setMode('narration');
  };

  const handleChoiceSelect = (nextSceneId) => {
    // Vai alla mappa per scegliere il percorso
    navigation.replace('Map', {
      room,
      justSolvedScene: sceneId,
      nextAvailable: [nextSceneId],
      // Passiamo entrambe le scelte disponibili per sbloccarne 2 sulla mappa
      allChoices: scene.choices?.map(c => c.next) || [],
    });
  };

  const handleGoToDirettrice = () => {
    navigation.replace('Direttrice', { room });
  };

  if (!progressLoaded || !scene) return null;

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <AutoHintEffect active={hintActive} />

      {mode === 'narration' ? (
        <NarratorView
          scene={scene}
          sceneId={sceneId}
          onStartAnagram={handleStartAnagram}
          characterAsset={characterAsset}
          backgroundAsset={backgroundAsset}
        />
      ) : (
        <>
          {/* Lo sfondo resta visibile anche in modalità anagramma */}
          {backgroundAsset && (
            <View style={styles.background} pointerEvents="none">
              <View style={[styles.backgroundImage, styles.overlayAnagram]}>
                {/* Solo overlay scuro — l'immagine è nell'AnagramOverlay */}
              </View>
            </View>
          )}

          {/* Mini sprite in basso a sinistra */}
          {characterAsset && (
            <View style={styles.characterMini} pointerEvents="none">
              <View style={styles.characterMiniImage} />
            </View>
          )}

          <AnagramOverlay
            scene={scene}
            sceneId={sceneId}
            anagramData={anagramData}
            room={room}
            onBackToText={handleBackToText}
            onChoiceSelect={handleChoiceSelect}
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
