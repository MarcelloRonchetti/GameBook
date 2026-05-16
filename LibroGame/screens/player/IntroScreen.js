// IntroScreen.js
// Schermata introduttiva del giocatore — Circo-stanza di Partenza.
//
// Due modalità interne:
//   'narration' → NarratorView con sfondo + testo narrativo + bottone
//                 "Decifra il messaggio" che porta alla modalità cifrario
//   'cipher'    → chiave di decodifica (1-14) + messaggio cifrato + input
//                 + bottone "← Torna all'immagine" per tornare alla narrazione

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  ScrollView, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { normalizeText } from '../../lib/helpers';
import { useRoomClosedListener, useDisableAndroidBack } from '../../lib/useRoomClosedListener';
import { introStyles as styles } from '../../styles/player';
import { getBackgroundAsset } from '../../styles/theme';

import NarratorView from '../../components/NarratorView';
import scenes from '../../story/storia_1/scenes.json';

// Chiave di decodifica — 14 valori noti al giocatore
const CIPHER_KEY = {
  1: 'L', 2: 'A', 3: 'V', 4: 'O', 5: 'N',
  6: 'T', 7: 'D', 8: 'E', 9: 'C', 10: 'I',
  11: 'R', 12: 'S', 13: 'Z', 14: 'B'
};

export default function IntroScreen({ route, navigation }) {
  const { room } = route.params;
  const intro = scenes.intro;
  const introBackground = getBackgroundAsset('intro');

  useRoomClosedListener(room, navigation);
  useDisableAndroidBack();

  // 'narration' = schermata di benvenuto col sfondo della partenza
  // 'cipher'    = sezione cifrario (comportamento storico)
  const [mode, setMode] = useState('narration');

  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [solved, setSolved] = useState(false);

  // Check progress esistente al montaggio
  useEffect(() => {
    checkExistingProgress();
  }, []);

  const checkExistingProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data } = await supabase
      .from('progress')
      .select('solved')
      .eq('room_id', room.id)
      .eq('player_id', user.id)
      .eq('scene_id', 'intro')
      .maybeSingle();

    if (data && data.solved) {
      // Già risolto in precedenza → salta la narrazione, vai diretto al cifrario in stato successo
      setSolved(true);
      setMode('cipher');
    }
  };

  const handleCheck = () => {
    const userAnswer = normalizeText(answer);
    const correctAnswer = normalizeText(intro.cipherSolution);

    if (userAnswer === correctAnswer) {
      setSolved(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  const handleProceed = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { data: existing } = await supabase
      .from('progress')
      .select('id, solved')
      .eq('room_id', room.id)
      .eq('player_id', user.id)
      .eq('scene_id', 'intro')
      .maybeSingle();

    if (!existing) {
      await supabase.from('progress').insert({
        room_id: room.id,
        player_id: user.id,
        scene_id: 'intro',
        solved: true,
        entered_at: new Date().toISOString(),
      });
    } else if (!existing.solved) {
      await supabase
        .from('progress')
        .update({ solved: true, timestamp: new Date().toISOString() })
        .eq('id', existing.id);
    }

    setLoading(false);

    // Dopo l'intro → mappa con l'Acrobata sbloccato
    navigation.replace('Map', {
      room,
      allChoices: ['acrobata'],
    });
  };

  // --- Modalità narrazione: schermata di benvenuto col sfondo della partenza ---
  if (mode === 'narration') {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <NarratorView
          scene={intro}
          sceneId="intro"
          onStartAnagram={() => setMode('cipher')}
          characterAsset={null}
          backgroundAsset={introBackground}
          hideCharacter={true}
          anagramButtonLabel="📜 Decifra il messaggio"
          overlayOpacity={0.1}
        />
      </View>
    );
  }

  // --- Modalità cifrario: chiave + messaggio + input ---
  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      {/* Sfondo della Circo-stanza di Partenza */}
      {introBackground && (
        <Image
          source={introBackground}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      )}
      {/* Overlay scuro per leggibilità del testo */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)' }} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={[styles.container, { backgroundColor: 'transparent' }]}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Bottone per tornare alla narrazione (immagine) */}
          <TouchableOpacity
            style={localStyles.backToNarration}
            onPress={() => setMode('narration')}
            activeOpacity={0.8}
          >
            <Text style={localStyles.backToNarrationText}>← Torna all'immagine</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{intro.title}</Text>

          <Text style={styles.sectionTitle}>📜 Messaggio cifrato</Text>
          <Text style={styles.cipherText}>{intro.cipher.replace(/-/g, '‑')}</Text>

          <View style={styles.keyContainer}>
            <Text style={styles.keyTitle}>🔑 Chiave di decodifica</Text>
            <View style={styles.keyGrid}>
              {Object.entries(CIPHER_KEY).map(([num, letter]) => (
                <View key={num} style={styles.keyItem}>
                  <Text style={styles.keyNumber}>{num}</Text>
                  <Text style={styles.keyEquals}>=</Text>
                  <Text style={styles.keyLetter}>{letter}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.answerSection}>
            <Text style={styles.sectionTitle}>✏️ La tua decodifica</Text>

            {!solved ? (
              <>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  value={answer}
                  onChangeText={(text) => {
                    setAnswer(text);
                    setError(false);
                  }}
                  placeholder="Scrivi qui il messaggio decodificato..."
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={3}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {error && (
                  <Text style={styles.errorText}>
                    ❌ Decodifica non corretta, riprova!
                  </Text>
                )}

                <TouchableOpacity
                  style={[styles.button, !answer.trim() && styles.buttonDisabled]}
                  onPress={handleCheck}
                  disabled={!answer.trim()}
                >
                  <Text style={styles.buttonText}>Verifica</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.successBox}>
                  <Text style={styles.successText}>
                    ✅ Corretto! Il messaggio dice:
                  </Text>
                  <Text style={styles.solutionText}>
                    "{intro.cipherSolution}"
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.proceedButton, loading && styles.buttonDisabled]}
                  onPress={handleProceed}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Caricamento...' : "Vai dall'Acrobata →"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

import { StyleSheet } from 'react-native';
const localStyles = StyleSheet.create({
  backToNarration: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#c8a45a',
    borderRadius: 8,
    marginBottom: 12,
  },
  backToNarrationText: {
    color: '#c8a45a',
    fontSize: 14,
    fontWeight: '600',
  },
});
