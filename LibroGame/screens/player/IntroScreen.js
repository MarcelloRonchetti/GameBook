// IntroScreen.js
// Schermata introduttiva del giocatore — Circo-stanza di Partenza.
//
// Due modalità interne:
//   'narration' → NarratorView con sfondo + testo narrativo + bottone
//                 "Decifra il messaggio" che porta alla modalità cifrario
//   'cipher'    → stesso layout/stile delle altre stanze (anagramPanel su
//                 sfondo intro_bg.png + overlay scuro), con chiave 1-14,
//                 messaggio cifrato a tile, input e coppia di bottoni
//                 "← Immagine / Verifica decodifica" come nelle scene NPC

import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Image,
  ScrollView, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { normalizeText, formatQuotes } from '../../lib/helpers';
import { useRoomClosedListener, useDisableAndroidBack } from '../../lib/useRoomClosedListener';
import { circoStanzaStyles as styles } from '../../styles/player';
import { getBackgroundAsset } from '../../styles/theme';

import NarratorView from '../../components/NarratorView';
import AnagramInput from '../../components/AnagramInput';
import CipherTiles from '../../components/CipherTiles';
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
  // 'cipher'    = sezione cifrario nel pannello stile-anagramma
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
          anagramButtonLabel="Decifra il messaggio"
          overlayOpacity={0.1}
        />
      </View>
    );
  }

  // --- Modalità cifrario: stesso layout/stile delle altre stanze ---
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Placeholder color → poi immagine di sfondo Circo-stanza di Partenza */}
      <View style={[styles.background, { backgroundColor: '#2a1a0a' }]} />
      {introBackground && (
        <Image
          source={introBackground}
          style={[styles.background, styles.backgroundImage]}
          resizeMode="cover"
        />
      )}
      {/* Overlay scuro intenso identico alle altre stanze in modalità anagramma */}
      <View style={[styles.overlay, styles.overlayAnagram]} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.anagramPanel}>
          <View style={styles.anagramPanelHeader}>
            {/* Solo nella Circo-stanza di Partenza: titolo centrato.
                Le scene NPC usano `anagramPanelTitle` di default (left). */}
            <Text style={[styles.anagramPanelTitle, { textAlign: 'center' }]}>
              {intro.title}
            </Text>
          </View>

          <ScrollView
            style={styles.anagramPanelScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sectionTitle}>Messaggio cifrato</Text>
            <CipherTiles cipher={intro.cipher} />

            <View style={styles.keyContainer}>
              <Text style={styles.keyTitle}>Chiave di decodifica</Text>
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

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>La tua decodifica</Text>
            {!solved ? (
              <>
                <AnagramInput
                  value={answer}
                  onChangeText={(text) => { setAnswer(text); setError(false); }}
                  hasError={error}
                  placeholder="Scrivi qui il messaggio decodificato..."
                />
                {error && (
                  <Text style={styles.errorText}>Decodifica non corretta, riprova!</Text>
                )}
                <View style={styles.verifyRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonCompact]}
                    onPress={() => setMode('narration')}
                  >
                    <Text style={styles.buttonText}>← Immagine</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.buttonCompact,
                      !answer.trim() && styles.buttonDisabled,
                    ]}
                    onPress={handleCheck}
                    disabled={!answer.trim()}
                  >
                    <Text style={styles.buttonText}>Verifica decodifica</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.successBox}>
                  <Text style={styles.successText}>Corretto! Il messaggio dice:</Text>
                  <Text style={styles.solutionText}>
                    {formatQuotes(`"${intro.cipherSolution}"`)}
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

            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
