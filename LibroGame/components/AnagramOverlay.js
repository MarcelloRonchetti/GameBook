// components/AnagramOverlay.js
// Pannello anagramma che si sovrappone alla stanza (sfondo sempre visibile dietro).
// Contiene: mini-sprite NPC, hints GM, sezione cifrario (solo Illusionista),
// input anagramma, feedback, scelte dopo risoluzione.
//
// Props:
//   scene           — oggetto scena da scenes.json
//   sceneId         — id della scena
//   anagramData     — oggetto da anagrams.json
//   room            — oggetto stanza (per Supabase)
//   onBackToText    — callback per tornare alla narrazione
//   onChoiceSelect  — callback(nextSceneId) dopo risoluzione + scelta NPC
//   onGoToDirettrice — callback per l'Illusionista
//   characterAsset  — require() sprite mini NPC (o null)
//   hints           — array di hint dal GM
//   initialSolved   — se true, l'anagramma era già risolto al caricamento

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';

import { supabase } from '../lib/supabase';
import { normalizeText } from '../lib/helpers';

import AnagramInput from './AnagramInput';
import GmHint from './GmHint';

import { circoStanzaStyles as styles } from '../styles/player';
import { getNpcTheme } from '../styles/theme';

// Chiave cifrario — solo per l'Illusionista
const CIPHER_KEY = {
  1:'L', 2:'A', 3:'V', 4:'O', 5:'N',
  6:'T', 7:'D', 8:'E', 9:'C', 10:'I',
  11:'R', 12:'S', 13:'Z', 14:'B'
};

export default function AnagramOverlay({
  scene,
  sceneId,
  anagramData,
  room,
  onBackToText,
  onChoiceSelect,
  onGoToMap,
  onGoToDirettrice,
  characterAsset,
  hints,
  initialSolved,
}) {
  const npc = getNpcTheme(sceneId);
  const isIllusionista = sceneId === 'illusionista';

  const [answer, setAnswer] = useState('');
  const [solved, setSolved] = useState(initialSolved || false);
  const [hasError, setHasError] = useState(false);

  const [cipherAnswer, setCipherAnswer] = useState('');
  const [cipherSolved, setCipherSolved] = useState(initialSolved && isIllusionista);
  const [cipherError, setCipherError] = useState(false);

  const solvedRef = useRef(initialSolved || false);

  // Verifica cifrario (solo Illusionista)
  const handleCheckCipher = () => {
    const user = normalizeText(cipherAnswer);
    const correct = normalizeText(scene.cipherSolution || '');
    if (user === correct) {
      setCipherSolved(true);
      setCipherError(false);
    } else {
      setCipherError(true);
      setTimeout(() => setCipherError(false), 1500);
    }
  };

  // Verifica anagramma
  const handleCheckAnagram = async () => {
    const user = normalizeText(answer);
    const correct = normalizeText(anagramData.solution);

    if (user === correct) {
      setSolved(true);
      solvedRef.current = true;
      setHasError(false);

      // Aggiorna progress su Supabase
      const { data: { user: authUser } } = await supabase.auth.getUser();
      await supabase
        .from('progress')
        .update({ solved: true, timestamp: new Date().toISOString() })
        .eq('room_id', room.id)
        .eq('player_id', authUser.id)
        .eq('scene_id', sceneId);
    } else {
      setHasError(true);
      setTimeout(() => setHasError(false), 1500);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.anagramPanel}>

        {/* Header: nome NPC + bottone torna al testo */}
        <View style={styles.anagramPanelHeader}>
          <Text style={styles.anagramPanelTitle}>
            {npc.emoji}  {npc.label}
          </Text>
          <TouchableOpacity
            style={styles.backToTextButton}
            onPress={onBackToText}
          >
            <Text style={styles.backToTextText}>← Testo</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.anagramPanelScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hint GM */}
          <GmHint hints={hints} />

          {/* Sezione cifrario — solo Illusionista */}
          {isIllusionista && scene.cipher && (
            <View style={styles.cipherSection}>
              <Text style={styles.sectionTitle}>📜 Messaggio cifrato</Text>
              <Text style={styles.cipherText}>{scene.cipher.replace(/-/g, '‑')}</Text>

              <View style={styles.keyContainer}>
                <Text style={styles.keyTitle}>🔑 La chiave</Text>
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
                    onChangeText={(t) => { setCipherAnswer(t); setCipherError(false); }}
                    hasError={cipherError}
                    placeholder="Decodifica il messaggio..."
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

          {/* Anagramma */}
          <Text style={styles.sectionTitle}>🔤 Anagramma</Text>
          <View style={styles.anagramBox}>
            <Text style={styles.anagramText}>{anagramData.anagram}</Text>
            <Text style={styles.anagramHint}>
              ({anagramData.words || '?'} {(anagramData.words || 1) === 1 ? 'parola' : 'parole'})
            </Text>
          </View>

          {!solved ? (
            <>
              <AnagramInput
                value={answer}
                onChangeText={(t) => { setAnswer(t); setHasError(false); }}
                hasError={hasError}
              />
              {hasError && (
                <Text style={styles.errorText}>❌ Non è corretto, riprova!</Text>
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

              {/* Bottone prosegui dopo risoluzione */}
              {isIllusionista ? (
                <TouchableOpacity
                  style={styles.proceedButton}
                  onPress={onGoToDirettrice}
                >
                  <Text style={styles.buttonText}>🎩 Vai dalla Direttrice →</Text>
                </TouchableOpacity>
              ) : (
                <>
                  {scene.question && (
                    <Text style={styles.choiceTitle}>{scene.question}</Text>
                  )}
                  <Text style={[styles.choiceTitle, { fontSize: 12, opacity: 0.6 }]}>
                    Sia fatta la vostra volontà.
                  </Text>
                  <TouchableOpacity
                    style={styles.proceedButton}
                    onPress={onGoToMap}
                  >
                    <Text style={styles.buttonText}>🗺️ Vai alla mappa →</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
