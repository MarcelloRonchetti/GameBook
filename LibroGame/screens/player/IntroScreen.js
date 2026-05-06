// IntroScreen.js
// Schermata introduttiva del giocatore — Circo-stanza di Partenza.
// Mostra il testo narrativo, la chiave di decodifica (1–14)
// e il messaggio cifrato che il giocatore deve decodificare
// per scoprire l'obiettivo e proseguire verso l'Acrobata.

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { normalizeText } from '../../lib/helpers';
import { useRoomClosedListener, useDisableAndroidBack } from '../../lib/useRoomClosedListener';
import { introStyles as styles } from '../../styles/player';

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

  useRoomClosedListener(room, navigation);
  useDisableAndroidBack();

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

    if (data && data.solved) setSolved(true);
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

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>{intro.title}</Text>
        <Text style={styles.storyText}>{intro.text}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>📜 Messaggio cifrato</Text>
        <Text style={styles.cipherText}>{intro.cipher}</Text>

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
  );
}
