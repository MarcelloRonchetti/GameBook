// AnagramScreen.js
// Schermata di risoluzione dell'anagramma per ogni circo-stanza.
// Il giocatore deve risolvere l'anagramma per sbloccare le scelte.
// Dopo la risoluzione appaiono i due NPC tra cui scegliere.
// Include: timer Aiuto Automatico, suggerimenti GM, cifrario per l'Illusionista.
//
// Comportamenti extra:
//  - inizializza `solved` dal DB (importante alla ripresa dopo chiusura app)
//  - se il GM chiude la stanza -> torna a JoinRoom
//  - cleanup corretto della sottoscrizione ai suggerimenti
//  - tasto back hardware di Android disabilitato

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { normalizeText } from '../../lib/helpers';
import { useRoomClosedListener, useDisableAndroidBack } from '../../lib/useRoomClosedListener';

import AnagramInput from '../../components/AnagramInput';
import AutoHintEffect from '../../components/AutoHintEffect';
import GmHint from '../../components/GmHint';

// Dati delle scene e degli anagrammi dal JSON
import scenes from '../../story/storia_1/scenes.json';
import anagrams from '../../story/storia_1/anagrams.json';

// Chiave cifrario — usata solo per l'Illusionista
const CIPHER_KEY = {
  1: 'L', 2: 'A', 3: 'V', 4: 'O', 5: 'N',
  6: 'T', 7: 'D', 8: 'E', 9: 'C', 10: 'I',
  11: 'R', 12: 'S', 13: 'Z', 14: 'B'
};

export default function AnagramScreen({ route, navigation }) {
  const { room, sceneId } = route.params;

  const scene = scenes[sceneId];
  const anagramData = anagrams[sceneId];

  // --- Hook utilities ---
  useRoomClosedListener(room, navigation);
  useDisableAndroidBack();

  // --- Stato anagramma ---
  const [answer, setAnswer] = useState('');
  const [solved, setSolved] = useState(false);
  const [hasError, setHasError] = useState(false);

  // --- Stato cifrario Illusionista ---
  const [cipherAnswer, setCipherAnswer] = useState('');
  const [cipherSolved, setCipherSolved] = useState(false);
  const [cipherError, setCipherError] = useState(false);

  // --- Stato aiuto automatico ---
  const [hintActive, setHintActive] = useState(false);
  const timerRef = useRef(null);
  const hintTimerRef = useRef(null);
  const solvedRef = useRef(false);
  // solvedRef — tiene traccia di solved in modo sincrono,
  // così il timer non ri-parte dopo che l'anagramma è stato risolto

  // --- Stato suggerimenti GM ---
  const [hints, setHints] = useState([]);
  const hintsChannelRef = useRef(null);

  // Aggiorna titolo della schermata
  useEffect(() => {
    navigation.setOptions({ title: scene.title || 'Anagramma' });
  }, [sceneId]);

  // All'avvio:
  //  - carica lo stato 'solved' dal DB (per la ripresa)
  //  - parte il timer aiuto automatico se non risolto
  //  - carica e sottoscrive i suggerimenti GM
  useEffect(() => {
    initialize();

    return () => {
      // Cleanup timer
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);

      // Cleanup canale hint
      if (hintsChannelRef.current) {
        supabase.removeChannel(hintsChannelRef.current);
      }
    };
  }, []);

  const initialize = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    // Leggi lo stato solved del progress (se esiste)
    const { data: progressRow } = await supabase
      .from('progress')
      .select('solved')
      .eq('room_id', room.id)
      .eq('player_id', user.id)
      .eq('scene_id', sceneId)
      .maybeSingle();

    if (progressRow && progressRow.solved) {
      // Alla ripresa: il player aveva già risolto questa scena
      setSolved(true);
      solvedRef.current = true;
      // Per l'Illusionista anche il cifrario era già stato risolto
      if (sceneId === 'illusionista') {
        setCipherSolved(true);
      }
    } else {
      // Non risolto -> avvia il timer dell'aiuto automatico
      startAutoHintTimer();
    }

    // Carica e sottoscrivi i suggerimenti (sempre)
    fetchHints(user.id);
    subscribeToHints(user.id);
  };

  // startAutoHintTimer — avvia il ciclo dell'aiuto automatico
  // Dopo X minuti (impostati dal GM) -> effetto visivo per 10 secondi -> ripeti
  const startAutoHintTimer = () => {
    const delayMs = room.auto_hint_minutes * 60 * 1000;

    timerRef.current = setTimeout(() => {
      setHintActive(true);

      hintTimerRef.current = setTimeout(() => {
        setHintActive(false);
        // Riparte il ciclo solo se l'anagramma non è ancora risolto
        if (!solvedRef.current) {
          startAutoHintTimer();
        }
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

    if (!error && data) {
      setHints(data);
    }
  };

  const subscribeToHints = (userId) => {
    hintsChannelRef.current = supabase
      .channel(`hints_changes_${room.id}_${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'hints',
        filter: `room_id=eq.${room.id}`
      }, () => fetchHints(userId))
      .subscribe();
  };

  // handleCheckAnagram — verifica la risposta all'anagramma
  const handleCheckAnagram = async () => {
    const userAnswer = normalizeText(answer);
    const correctAnswer = normalizeText(anagramData.solution);

    if (userAnswer === correctAnswer) {
      setSolved(true);
      solvedRef.current = true;
      setHasError(false);

      // Ferma il timer dell'aiuto automatico
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      setHintActive(false);

      // Aggiorna il progresso su Supabase -> segna l'anagramma come risolto
      const { data: { user } } = await supabase.auth.getUser();
      await supabase
        .from('progress')
        .update({ solved: true, timestamp: new Date().toISOString() })
        .eq('room_id', room.id)
        .eq('player_id', user.id)
        .eq('scene_id', sceneId);
    } else {
      setHasError(true);
      setTimeout(() => setHasError(false), 1500);
    }
  };

  // handleCheckCipher — verifica la decodifica del cifrario (solo Illusionista)
  const handleCheckCipher = () => {
    const userAnswer = normalizeText(cipherAnswer);
    const correctAnswer = normalizeText(scene.cipherSolution);

    if (userAnswer === correctAnswer) {
      setCipherSolved(true);
      setCipherError(false);
    } else {
      setCipherError(true);
      setTimeout(() => setCipherError(false), 1500);
    }
  };

  const handleChoice = (nextSceneId) => {
    navigation.replace('Scene', { room, sceneId: nextSceneId });
  };

  const handleGoToDirettrice = () => {
    navigation.replace('Direttrice', { room });
  };

  const isIllusionista = sceneId === 'illusionista';

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AutoHintEffect active={hintActive} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <GmHint hints={hints} />

        {/* === SEZIONE CIFRARIO — solo per l'Illusionista === */}
        {isIllusionista && scene.cipher && (
          <View style={styles.cipherSection}>
            <Text style={styles.sectionTitle}>📜 Messaggio cifrato</Text>
            <Text style={styles.cipherText}>{scene.cipher}</Text>

            <View style={styles.keyContainer}>
              <Text style={styles.keyTitle}>🔑 Ricordi la chiave?</Text>
              <View style={styles.keyGrid}>
                {Object.entries(CIPHER_KEY).map(([num, letter]) => (
                  <View key={num} style={styles.keyItem}>
                    <Text style={styles.keyNumber}>{num}</Text>
                    <Text style={styles.keyEquals}>=</Text>
                    <Text style={styles.keyLetter}>{letter}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.keyHint}>
                Ci sono lettere nuove da scoprire...
              </Text>
            </View>

            {!cipherSolved ? (
              <>
                <AnagramInput
                  value={cipherAnswer}
                  onChangeText={(text) => {
                    setCipherAnswer(text);
                    setCipherError(false);
                  }}
                  hasError={cipherError}
                />
                {cipherError && (
                  <Text style={styles.errorText}>❌ Decodifica non corretta!</Text>
                )}
                <TouchableOpacity
                  style={[styles.button, !cipherAnswer.trim() && styles.buttonDisabled]}
                  onPress={handleCheckCipher}
                  disabled={!cipherAnswer.trim()}
                >
                  <Text style={styles.buttonText}>Verifica decodifica</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.successBox}>
                <Text style={styles.successText}>✅ Messaggio decodificato:</Text>
                <Text style={styles.solutionText}>"{scene.cipherSolution}"</Text>
              </View>
            )}

            <View style={styles.divider} />
          </View>
        )}

        {/* === SEZIONE ANAGRAMMA === */}
        <Text style={styles.sectionTitle}>🔤 Anagramma</Text>

        <View style={styles.anagramBox}>
          <Text style={styles.anagramText}>{anagramData.anagram}</Text>
          <Text style={styles.anagramHint}>
            ({anagramData.words} {anagramData.words === 1 ? 'parola' : 'parole'})
          </Text>
        </View>

        {!solved ? (
          <>
            <AnagramInput
              value={answer}
              onChangeText={(text) => {
                setAnswer(text);
                setHasError(false);
              }}
              hasError={hasError}
            />

            {hasError && (
              <Text style={styles.errorText}>❌ Risposta non corretta, riprova!</Text>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                (!answer.trim() || (isIllusionista && !cipherSolved)) && styles.buttonDisabled
              ]}
              onPress={handleCheckAnagram}
              disabled={!answer.trim() || (isIllusionista && !cipherSolved)}
            >
              <Text style={styles.buttonText}>Verifica</Text>
            </TouchableOpacity>

            {isIllusionista && !cipherSolved && answer.trim() && (
              <Text style={styles.warningText}>
                Devi prima decodificare il messaggio cifrato
              </Text>
            )}
          </>
        ) : (
          <>
            <View style={styles.successBox}>
              <Text style={styles.successText}>✅ Corretto!</Text>
              <Text style={styles.solutionText}>{anagramData.solution}</Text>
            </View>

            {/* === SCELTE — appaiono solo dopo la risoluzione === */}
            {isIllusionista ? (
              <>
                <Text style={styles.choiceTitle}>
                  Sia fatta la vostra volontà.
                </Text>
                <TouchableOpacity
                  style={styles.proceedButton}
                  onPress={handleGoToDirettrice}
                >
                  <Text style={styles.buttonText}>
                    Vai dalla Direttrice →
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {scene.question && (
                  <Text style={styles.choiceTitle}>{scene.question}</Text>
                )}
                <Text style={styles.choiceSubtitle}>
                  Sia fatta la vostra volontà.
                </Text>
                <View style={styles.choicesContainer}>
                  {scene.choices.map((choice, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.choiceButton}
                      onPress={() => handleChoice(choice.next)}
                    >
                      <Text style={styles.choiceText}>{choice.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c8a45a',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 24,
  },
  anagramBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#c8a45a',
  },
  anagramText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    textAlign: 'center',
  },
  anagramHint: { fontSize: 13, color: '#999', marginTop: 8 },
  cipherSection: { marginBottom: 0 },
  cipherText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 28,
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 16,
    textAlign: 'center',
  },
  keyContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  keyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#c8a45a',
    marginBottom: 10,
    textAlign: 'center',
  },
  keyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  keyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 60,
    justifyContent: 'center',
  },
  keyNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#c8a45a',
    minWidth: 18,
    textAlign: 'right',
  },
  keyEquals: { fontSize: 12, color: '#666', marginHorizontal: 3 },
  keyLetter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    minWidth: 12,
  },
  keyHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
  warningText: {
    color: '#ff9800',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  successBox: {
    backgroundColor: '#1e2d1e',
    borderRadius: 10,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#4caf50',
    marginVertical: 12,
  },
  successText: {
    color: '#4caf50',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  solutionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  button: {
    backgroundColor: '#c8a45a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: { backgroundColor: '#666' },
  buttonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  proceedButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  choiceTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ddd',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  choiceSubtitle: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  choicesContainer: { gap: 12 },
  choiceButton: {
    backgroundColor: '#2a2a2a',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c8a45a',
  },
  choiceText: {
    color: '#c8a45a',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
