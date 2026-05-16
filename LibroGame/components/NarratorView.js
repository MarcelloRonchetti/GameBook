// components/NarratorView.js
// Componente visuale della modalità "narrazione" della CircoStanzaScreen.
// Mostra: sfondo della stanza, sprite del personaggio, box dialogo con typewriter.
//
// LOGICA TYPEWRITER:
//   - Il testo del narratore è diviso in blocchi (array di stringhe in scenes.json).
//   - Ogni blocco esce carattere per carattere con un intervallo di ~30ms.
//   - TAP 1 durante scrittura → completa il blocco istantaneamente.
//   - TAP 1 a blocco completato → passa al blocco successivo.
//   - Ultimo blocco completato → mostra il bottone "Anagramma".
//
// Props:
//   scene           — oggetto scena da scenes.json (ha .title, .narratorBlocks, .theme)
//   sceneId         — id della scena (es. 'acrobata')
//   onStartAnagram  — callback chiamata quando il player preme "Anagramma"
//   characterAsset  — require() dello sprite personaggio (o null → emoji placeholder)
//   backgroundAsset — require() dello sfondo (o null → colore placeholder)
//   skipNarration   — se true (ritorno dall'anagramma) mostra subito sfondo + bottoni
//                     senza ripetere il typewriter automaticamente

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, Image, ScrollView,
  TouchableWithoutFeedback, TouchableOpacity, Animated,
  useWindowDimensions,
} from 'react-native';

import AutoHintEffect from './AutoHintEffect';
import { circoStanzaStyles as styles } from '../styles/player';
import { getNpcTheme, BG_ASPECT_RATIO } from '../styles/theme';

const TYPEWRITER_SPEED = 28;
const INITIAL_DELAY = 200;

export default function NarratorView({
  scene,
  sceneId,
  onStartAnagram,
  characterAsset,
  backgroundAsset,
  skipNarration = false,
  hintActive = false,
  hintAsset = null,
  hintPosition = null,
  characterPosition = null,
  anagramButtonLabel = "🔤 Affronta l'anagramma",
  hideCharacter = false,
  overlayOpacity = null,
}) {
  const npc = getNpcTheme(sceneId);
  // Normalizza i blocchi del dialogo in formato uniforme {speaker, text}.
  // Priorità: scene.dialogue (strutturato) > scene.narratorBlocks (legacy) > scene.text
  const blocks = scene.dialogue
    ? scene.dialogue
    : scene.narratorBlocks
      ? scene.narratorBlocks.map(t => ({ speaker: 'narrator', text: t }))
      : [{ speaker: 'narrator', text: scene.text || '' }];
  const { width: screenW, height: screenH } = useWindowDimensions();

  // Converte posizione relativa all'immagine in coordinate assolute schermo,
  // compensando il resizeMode="cover" del background.
  const computeHintStyle = useCallback((pos) => {
    if (!pos) return null;
    const screenAspect = screenW / screenH;
    let renderedW, renderedH, offsetX, offsetY;
    if (screenAspect >= BG_ASPECT_RATIO) {
      renderedW = screenW;
      renderedH = screenW / BG_ASPECT_RATIO;
      offsetX = 0;
      offsetY = (screenH - renderedH) / 2;
    } else {
      renderedH = screenH;
      renderedW = screenH * BG_ASPECT_RATIO;
      offsetX = (screenW - renderedW) / 2;
      offsetY = 0;
    }
    return {
      top:    offsetY + pos.top    * renderedH,
      left:   offsetX + pos.left   * renderedW,
      width:           pos.width   * renderedW,
      height:          pos.height  * renderedH,
    };
  }, [screenW, screenH]);

  const [quickView, setQuickView] = useState(skipNarration);

  const [blockIndex, setBlockIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [blockDone, setBlockDone] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const timerRef = useRef(null);
  const charIndexRef = useRef(0);
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    blink.start();
    return () => {
      blink.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!quickView) startTyping();
  }, [blockIndex, quickView]);

  const startTyping = useCallback(() => {
    setDisplayed('');
    charIndexRef.current = 0;
    setBlockDone(false);
    setIsTyping(true);

    const currentBlockText = blocks[blockIndex]?.text || '';
    const startTimer = setTimeout(() => {
      timerRef.current = setInterval(() => {
        charIndexRef.current += 1;
        setDisplayed(currentBlockText.slice(0, charIndexRef.current));
        if (charIndexRef.current >= currentBlockText.length) {
          clearInterval(timerRef.current);
          setIsTyping(false);
          setBlockDone(true);
        }
      }, TYPEWRITER_SPEED);
    }, INITIAL_DELAY);

    return () => {
      clearTimeout(startTimer);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [blockIndex, blocks]);

  const handleTap = () => {
    if (isTyping) {
      const currentText = blocks[blockIndex]?.text || '';
      clearInterval(timerRef.current);
      setDisplayed(currentText);
      charIndexRef.current = currentText.length;
      setIsTyping(false);
      setBlockDone(true);
      return;
    }
    if (blockDone) {
      const nextIndex = blockIndex + 1;
      if (nextIndex < blocks.length) {
        setBlockIndex(nextIndex);
      } else {
        setAllDone(true);
      }
    }
  };

  const handleReread = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setAllDone(false);
    setBlockDone(false);
    setDisplayed('');
    charIndexRef.current = 0;
    setBlockIndex(0);
    setQuickView(false);
  };

  // Sfondo e personaggio sono inlineati in entrambi i rami del render
  // per evitare che React li smonta/rimonta (causerebbe flash nero).
  const renderBackground = () => (
    <>
      {/* Colore placeholder immediato — visibile mentre il PNG decodifica */}
      <View style={[styles.background, { backgroundColor: npc.color, opacity: 0.4 }]} />
      {backgroundAsset && (
        <Image
          source={backgroundAsset}
          style={[styles.background, styles.backgroundImage]}
          resizeMode="cover"
        />
      )}
      <View style={[styles.overlay, overlayOpacity !== null && { backgroundColor: `rgba(0,0,0,${overlayOpacity})` }]} />
      {!hideCharacter && characterAsset ? (
        <View style={[styles.characterContainer, characterPosition, { zIndex: 2 }]} pointerEvents="none">
          <Image source={characterAsset} style={styles.characterImage} resizeMode="contain" />
        </View>
      ) : !hideCharacter ? (
        <View style={[styles.characterContainer, characterPosition, { alignItems: 'center', justifyContent: 'center', zIndex: 2 }]} pointerEvents="none">
          <Text style={{ fontSize: 100 }}>{npc.emoji}</Text>
        </View>
      ) : null}
    </>
  );

  // --- QUICK VIEW: ritorno dall'anagramma ---
  if (quickView) {
    return (
      <View style={styles.container}>
        {renderBackground()}
        <AutoHintEffect active={hintActive} hintImage={hintAsset} hintImageStyle={computeHintStyle(hintPosition)} />
        <View style={styles.quickViewPanel}>
          <Text style={styles.dialogName}>{npc.label.toUpperCase()}</Text>
          <View style={styles.quickViewButtons}>
            <TouchableOpacity
              style={styles.rereadButton}
              onPress={handleReread}
              activeOpacity={0.8}
            >
              <Text style={styles.rereadButtonText}>📖 Rileggi il testo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.anagramButton}
              onPress={onStartAnagram}
              activeOpacity={0.8}
            >
              <Text style={styles.anagramButtonText}>{anagramButtonLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // --- NARRAZIONE NORMALE con typewriter ---
  // Altezza dinamica del dialog box: 22% dello schermo come massimo
  // (testi corti restano compatti; testi lunghi crescono fino al limite + scroll)
  const dialogMaxH = screenH * 0.22;
  return (
    <View style={styles.container}>
      {renderBackground()}
      <AutoHintEffect active={hintActive} hintImage={hintAsset} hintImageStyle={computeHintStyle(hintPosition)} />
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2 }}>
          <View style={[styles.dialogBox, { maxHeight: dialogMaxH }]}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogName}>
                {blocks[blockIndex]?.speaker === 'character'
                  ? npc.label.toUpperCase()
                  : 'NARRATORE'}
              </Text>
              {!allDone && (
                <Text style={styles.dialogTapHint}>
                  {isTyping ? 'tocca per saltare' : 'tocca per continuare ›'}
                </Text>
              )}
            </View>
            <ScrollView
              style={{ flexGrow: 0 }}
              contentContainerStyle={styles.dialogScrollContent}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.dialogText}>
                {displayed}
                {!allDone && (
                  <Animated.Text style={[styles.dialogCursor, { opacity: cursorOpacity }]}>
                    {blockDone ? '' : '▌'}
                  </Animated.Text>
                )}
              </Text>
              {allDone && (
                <TouchableOpacity
                  style={styles.anagramButton}
                  onPress={onStartAnagram}
                  activeOpacity={0.8}
                >
                  <Text style={styles.anagramButtonText}>{anagramButtonLabel}</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
