// DirectriceScreen.js
// Schermata finale — la Direttrice.
// Il giocatore deve risolvere i 12 anagrammi dei nomi degli artisti del circo.
// Navigazione libera: può saltare un anagramma e tornarci dopo.
// Quando tutti sono risolti, appare il messaggio di completamento.
//
// Comportamenti extra:
//  - se il GM chiude la stanza -> torna a JoinRoom
//  - tasto back hardware di Android disabilitato
//  - alla ripresa dopo chiusura app: se è già presente un record
//    progress 'direttrice' con solved=true, il gioco è completato;
//    altrimenti si ricomincia la lista (senza memoria dei singoli anagrammi
//    risolti, che non vengono persistiti nel DB)

import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { normalizeText } from '../../lib/helpers';
import { useRoomClosedListener, useDisableAndroidBack } from '../../lib/useRoomClosedListener';

import AnagramInput from '../../components/AnagramInput';
import NarratorView from '../../components/NarratorView';
import { circoStanzaStyles } from '../../styles/player';
import {
  getCharacterAsset,
  getBackgroundAsset,
  getCharacterPosition,
  colors,
  fontFamilies,
  radius,
} from '../../styles/theme';

// Dati della scena Direttrice dal JSON
import scenes from '../../story/storia_1/scenes.json';

export default function DirectriceScreen({ route, navigation }) {
  const { room } = route.params;

  // --- Hook utilities ---
  useRoomClosedListener(room, navigation);
  useDisableAndroidBack();

  const direttrice = scenes.direttrice;
  const finalAnagrams = direttrice.finalAnagrams;

  // Asset visivi della Direttrice
  const characterAsset = getCharacterAsset('direttrice');
  const backgroundAsset = getBackgroundAsset('direttrice');
  const characterPosition = getCharacterPosition('direttrice');

  // 'narration' = schermata di benvenuto della Direttrice (sfondo+sprite+testo)
  // 'anagrams'  = lista 12 anagrammi finali (comportamento storico)
  const [mode, setMode] = useState('narration');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(finalAnagrams.map(() => ''));
  const [solvedStatus, setSolvedStatus] = useState(finalAnagrams.map(() => false));
  const [errors, setErrors] = useState(finalAnagrams.map(() => false));
  const [allSolved, setAllSolved] = useState(false);
  const [completionSaved, setCompletionSaved] = useState(false);
  const [panelVisible, setPanelVisible] = useState(true);

  const solvedCount = solvedStatus.filter(Boolean).length;

  // Al montaggio: se il player aveva già completato la Direttrice
  // (es. rientro dopo chiusura app), mostra direttamente il messaggio finale
  useEffect(() => {
    checkExistingCompletion();
  }, []);

  const checkExistingCompletion = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data } = await supabase
      .from('progress')
      .select('solved')
      .eq('room_id', room.id)
      .eq('player_id', user.id)
      .eq('scene_id', 'direttrice')
      .maybeSingle();

    if (data && data.solved) {
      // Già completato in precedenza -> mostra subito la schermata di vittoria
      setMode('victory');
      setAllSolved(true);
      setCompletionSaved(true);
      // Segna tutti come risolti visivamente
      setSolvedStatus(finalAnagrams.map(() => true));
    }
  };

  // Quando tutti i 12 anagrammi vengono risolti in questa sessione,
  // salva il completamento su Supabase e passa alla schermata di vittoria
  useEffect(() => {
    if (solvedCount === finalAnagrams.length && !allSolved) {
      setAllSolved(true);
      setMode('victory');
      if (!completionSaved) {
        saveCompletion();
      }
    }
  }, [solvedCount]);

  const saveCompletion = async () => {
    setCompletionSaved(true);
    const { data: { user } } = await supabase.auth.getUser();

    // Evita duplicati — se esiste già un record direttrice lo aggiorna,
    // altrimenti lo crea
    const { data: existing } = await supabase
      .from('progress')
      .select('id')
      .eq('room_id', room.id)
      .eq('player_id', user.id)
      .eq('scene_id', 'direttrice')
      .maybeSingle();

    if (existing) {
      await supabase
        .from('progress')
        .update({ solved: true, timestamp: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      await supabase.from('progress').insert({
        room_id: room.id,
        player_id: user.id,
        scene_id: 'direttrice',
        solved: true,
        entered_at: new Date().toISOString(),
      });
    }
  };

  // handleCheck — verifica la risposta per l'anagramma corrente
  const handleCheck = () => {
    const current = finalAnagrams[currentIndex];
    const userAnswer = normalizeText(answers[currentIndex]);
    const correctAnswer = normalizeText(current.solution);

    if (userAnswer === correctAnswer) {
      const newSolved = [...solvedStatus];
      newSolved[currentIndex] = true;
      setSolvedStatus(newSolved);

      // Passa automaticamente al prossimo non risolto
      const nextUnsolved = findNextUnsolved(currentIndex, newSolved);
      if (nextUnsolved !== -1) {
        setTimeout(() => setCurrentIndex(nextUnsolved), 800);
      }
    } else {
      const newErrors = [...errors];
      newErrors[currentIndex] = true;
      setErrors(newErrors);
      setTimeout(() => {
        const resetErrors = [...newErrors];
        resetErrors[currentIndex] = false;
        setErrors(resetErrors);
      }, 1500);
    }
  };

  const findNextUnsolved = (fromIndex, statusArray) => {
    const total = finalAnagrams.length;
    for (let i = 1; i < total; i++) {
      const idx = (fromIndex + i) % total;
      if (!statusArray[idx]) return idx;
    }
    return -1;
  };

  const handleAnswerChange = (text) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = text;
    setAnswers(newAnswers);

    const newErrors = [...errors];
    newErrors[currentIndex] = false;
    setErrors(newErrors);
  };

  const currentAnagram = finalAnagrams[currentIndex];

  // --- Modalità vittoria: schermata finale del gioco ---
  // Sequenza:
  //   1. Pannello "Complimenti!" visibile per 5s sopra lo sfondo del circo
  //   2. Pannello sparisce, resta solo lo sfondo del circo per 5s
  //   3. Reset automatico a JoinRoom (player resta loggato)
  useEffect(() => {
    if (mode !== 'victory') return;
    const hidePanel = setTimeout(() => setPanelVisible(false), 5000);
    const goToJoin = setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'JoinRoom' }] });
    }, 10000);
    return () => {
      clearTimeout(hidePanel);
      clearTimeout(goToJoin);
    };
  }, [mode]);

  if (mode === 'victory') {
    let victoryBg = null;
    try {
      victoryBg = getBackgroundAsset('victory');
    } catch (e) {
      victoryBg = null;
    }

    return (
      <View style={victoryStyles.container}>
        <StatusBar hidden />
        {victoryBg ? (
          <Image
            source={victoryBg}
            style={victoryStyles.bgImage}
            resizeMode="cover"
          />
        ) : (
          <View style={victoryStyles.bgFallback} />
        )}

        {panelVisible && (
          <View style={victoryStyles.panel}>
            <Text style={victoryStyles.title}>Complimenti!</Text>
            <Text style={victoryStyles.text}>
              Avete rimesso in ordine tutti i costumi delle circo-stanze.{'\n'}
              Il vostro viaggio nel Circo delle Circostanze è completo.
            </Text>
            <Text style={victoryStyles.subtext}>
              Sia fatta la vostra volontà.
            </Text>
          </View>
        )}
      </View>
    );
  }

  // --- Modalità narrazione: schermata di benvenuto della Direttrice ---
  if (mode === 'narration') {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <NarratorView
          scene={direttrice}
          sceneId="direttrice"
          onStartAnagram={() => setMode('anagrams')}
          characterAsset={characterAsset}
          backgroundAsset={backgroundAsset}
          characterPosition={characterPosition}
          anagramButtonLabel="Risolvi gli anagrammi finali"
        />
      </View>
    );
  }

  // --- Modalità anagrammi: lista 12 anagrammi finali ---
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      {/* Sfondo + overlay + sprite Direttrice (stesso pattern delle altre stanze in modalità anagramma) */}
      <View style={[circoStanzaStyles.background, { backgroundColor: '#2a1a0a' }]} />
      {backgroundAsset && (
        <Image
          source={backgroundAsset}
          style={[circoStanzaStyles.background, circoStanzaStyles.backgroundImage]}
          resizeMode="cover"
        />
      )}
      <View style={[circoStanzaStyles.overlay, circoStanzaStyles.overlayAnagram]} />
      {characterAsset && (
        <View style={[circoStanzaStyles.characterContainer, characterPosition, { zIndex: 0 }]} pointerEvents="none">
          <Image
            source={characterAsset}
            style={circoStanzaStyles.characterImage}
            resizeMode="contain"
          />
        </View>
      )}

    <KeyboardAvoidingView
      style={[styles.flex, circoStanzaStyles.anagramPanel]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Bottone per tornare alla narrazione (immagine + sprite Direttrice) */}
        <TouchableOpacity
          style={styles.backToNarration}
          onPress={() => setMode('narration')}
          activeOpacity={0.8}
        >
          <Text style={styles.backToNarrationText}>← Torna alla Direttrice</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{direttrice.title}</Text>

        {/* Contatore progressi */}
        <View style={styles.progressBar}>
          <Text style={styles.progressText}>
            <Text style={{ fontFamily: fontFamilies.typewriter }}>{solvedCount}</Text>
            {' / '}
            <Text style={{ fontFamily: fontFamilies.typewriter }}>{finalAnagrams.length}</Text>
            {' risolti'}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[
              styles.progressFill,
              { width: `${(solvedCount / finalAnagrams.length) * 100}%` }
            ]} />
          </View>
        </View>

        {/* Griglia navigazione */}
        <View style={styles.navGrid}>
          {finalAnagrams.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.navDot,
                index === currentIndex && styles.navDotActive,
                solvedStatus[index] && styles.navDotSolved,
              ]}
              onPress={() => setCurrentIndex(index)}
            >
              <Text style={[
                styles.navDotText,
                solvedStatus[index] && styles.navDotTextSolved,
              ]}>
                {solvedStatus[index] ? '✓' : index + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {!allSolved ? (
          <>
            <View style={styles.anagramBox}>
              <Text style={styles.anagramLabel}>
                Anagramma{' '}
                <Text style={{ fontFamily: fontFamilies.typewriter }}>{currentIndex + 1}</Text>
              </Text>
              <Text style={styles.anagramText}>
                {currentAnagram.anagram}
              </Text>
            </View>

            {solvedStatus[currentIndex] ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>Risolto!</Text>
                <Text style={styles.solutionText}>
                  {currentAnagram.solution}
                </Text>
              </View>
            ) : (
              <>
                <AnagramInput
                  value={answers[currentIndex]}
                  onChangeText={handleAnswerChange}
                  hasError={errors[currentIndex]}
                />

                {errors[currentIndex] && (
                  <Text style={styles.errorText}>
                    Non è corretto, riprova!
                  </Text>
                )}

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.checkButton,
                      !answers[currentIndex].trim() && styles.buttonDisabled
                    ]}
                    onPress={handleCheck}
                    disabled={!answers[currentIndex].trim()}
                  >
                    <Text style={styles.buttonText}>Verifica</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => {
                      const next = findNextUnsolved(currentIndex, solvedStatus);
                      if (next !== -1) setCurrentIndex(next);
                    }}
                  >
                    <Text style={styles.skipText}>Salta →</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        ) : (
          // TUTTI RISOLTI — messaggio di completamento
          <View style={styles.completionBox}>
            <Text style={styles.completionTitle}>
              Complimenti!
            </Text>
            <Text style={styles.completionText}>
              Avete rimesso in ordine tutti i costumi delle circo-stanze.
              Il vostro viaggio nel Circo delle Circostanze è completo.
            </Text>
            <Text style={styles.completionSubtext}>
              Sia fatta la vostra volontà.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
    </View>
  );
}

const v = colors.velvet;
const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: v.bgDeep },
  content: { padding: 20, paddingBottom: 40 },
  // Bottone "← Torna alla Direttrice" outline oro
  backToNarration: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(200,164,90,0.45)',
    borderRadius: radius.sm,
    marginBottom: 12,
  },
  backToNarrationText: {
    fontFamily: fontFamilies.bodyMedium,
    color: v.goldSoft,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  // Titolo pagina — Cormorant italic crema
  title: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    fontSize: 30,
    color: v.champagne,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  storyText: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontSize: 16,
    color: v.champagne,
    lineHeight: 26,
    textAlign: 'justify',
    marginBottom: 20,
  },
  progressBar: { marginBottom: 20 },
  // "N / M risolti" — numeri Special Elite gestiti inline
  progressText: {
    fontFamily: fontFamilies.body,
    color: v.champagneMuted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(26,12,15,0.55)',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: v.goldFaint,
  },
  progressFill: {
    height: '100%',
    backgroundColor: v.gold,
    borderRadius: 3,
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  navDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(26,12,15,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: v.goldFaint,
  },
  navDotActive: { borderColor: v.goldSoft, borderWidth: 2 },
  navDotSolved: {
    backgroundColor: 'rgba(122,163,122,0.18)',
    borderColor: v.success,
  },
  // Numeri 1-12 nei dot → Special Elite
  navDotText: {
    fontFamily: fontFamilies.typewriter,
    color: v.champagneMuted,
    fontSize: 14,
  },
  navDotTextSolved: { color: v.success },
  anagramBox: {
    backgroundColor: 'rgba(26,12,15,0.55)',
    borderRadius: radius.md,
    padding: 22,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: v.goldFaint,
  },
  // "Anagramma 7" → eyebrow oro
  anagramLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 11,
    color: v.gold,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
  },
  // L'anagramma stesso (parole) — Cormorant italic crema
  anagramText: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    fontSize: 24,
    color: v.champagne,
    letterSpacing: 1,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: fontFamilies.body,
    color: v.danger,
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 10,
  },
  successBox: {
    backgroundColor: 'rgba(122,163,122,0.15)',
    borderRadius: radius.md,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: v.success,
    marginVertical: 12,
  },
  successText: {
    fontFamily: fontFamilies.bodyMedium,
    color: v.success,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 6,
  },
  // Soluzione rivelata — Cormorant italic crema
  solutionText: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    color: v.champagne,
    fontSize: 20,
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  checkButton: {
    flex: 1,
    backgroundColor: v.gold,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: v.goldSoft,
  },
  buttonDisabled: { backgroundColor: v.taupe, borderColor: v.taupe },
  buttonText: {
    fontFamily: fontFamilies.bodyBold,
    color: v.ink,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(200,164,90,0.45)',
  },
  skipText: {
    fontFamily: fontFamilies.bodyBold,
    color: v.goldSoft,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  completionBox: {
    backgroundColor: 'rgba(58,22,30,0.92)',
    borderRadius: radius.lg,
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: v.goldFaint,
  },
  completionTitle: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    fontSize: 30,
    color: v.champagne,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  completionText: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontSize: 16,
    color: v.champagne,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 12,
  },
  completionSubtext: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontSize: 15,
    color: v.goldSoft,
    textAlign: 'center',
  },
});

// --- Schermata finale di vittoria ---
const victoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0d05',
  },
  bgImage: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%', height: '100%',
  },
  bgFallback: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#1a0d05',
  },
  panel: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -250 }, { translateY: -120 }],
    width: 500,
    maxWidth: '90%',
    backgroundColor: 'rgba(50,35,20,0.78)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e8c46a',
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  title: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    fontSize: 34,
    color: v.champagne,
    marginBottom: 14,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  text: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontSize: 17,
    color: v.champagne,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtext: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontSize: 15,
    color: v.goldSoft,
    textAlign: 'center',
  },
});
