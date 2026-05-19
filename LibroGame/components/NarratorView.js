// components/NarratorView.js
// Componente visuale della modalità "narrazione" della CircoStanzaScreen.
// Mostra: sfondo della stanza, sprite del personaggio, box dialogo con typewriter.
//
// LOGICA TYPEWRITER:
//   - Il testo del narratore è diviso in blocchi (array di stringhe in scenes.json).
//   - Ogni blocco esce carattere per carattere con un intervallo di ~14ms.
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
  View, Text, ScrollView,
  TouchableWithoutFeedback, TouchableOpacity, Animated,
  useWindowDimensions,
} from 'react-native';
// expo-image: decode off-thread + cache disco automatica. Drasticamente piu'
// veloce di <Image> RN per le immagini pesanti (background scena, sprite NPC)
// e risolve il "esci e rientra per farla apparire" sui telefoni.
import { Image } from 'expo-image';

import AutoHintEffect from './AutoHintEffect';
import { circoStanzaStyles as styles } from '../styles/player';
import { getNpcTheme, BG_ASPECT_RATIO, colors, fontFamilies, useResponsiveScale } from '../styles/theme';
import { formatQuotes } from '../lib/helpers';

// Typewriter: 2 caratteri ogni 28ms → cadence visiva equivalente a 14ms/char
// ma metà delle setState (= metà dei render del componente). Determinante su
// mobile dove ogni re-render passa per la riconciliazione di tutto il subtree.
const TYPEWRITER_TICK_MS = 28;
const TYPEWRITER_CHARS_PER_TICK = 2;
const INITIAL_DELAY = 200;

// Layer di sfondo (immagine + overlay + sprite/emoji).
// Memoizzato così non si re-renderizza ad ogni tick del typewriter: dipende
// solo da background/character/overlay, che cambiano una volta per scena.
// L'AutoHintEffect è RENDERIZZATO FUORI da qui per non invalidare il memo
// quando hintActive cambia.
const BackdropLayer = React.memo(function BackdropLayer({
  backgroundAsset,
  characterAsset,
  hideCharacter,
  characterPosition,
  npc,
  overlayOpacity,
}) {
  return (
    <>
      <View style={[styles.background, { backgroundColor: npc.color, opacity: 0.4 }]} />
      {backgroundAsset && (
        <Image
          source={backgroundAsset}
          style={[styles.background, styles.backgroundImage]}
          contentFit="cover"
          transition={0}
          cachePolicy="memory-disk"
        />
      )}
      <View style={[styles.overlay, overlayOpacity !== null && { backgroundColor: `rgba(0,0,0,${overlayOpacity})` }]} />
      {!hideCharacter && characterAsset ? (
        <View style={[styles.characterContainer, characterPosition, { zIndex: 2 }]} pointerEvents="none">
          <Image source={characterAsset} style={styles.characterImage} contentFit="contain" transition={0} cachePolicy="memory-disk" />
        </View>
      ) : !hideCharacter ? (
        <View style={[styles.characterContainer, characterPosition, { alignItems: 'center', justifyContent: 'center', zIndex: 2 }]} pointerEvents="none">
          <Text style={{ fontSize: 100 }}>{npc.emoji}</Text>
        </View>
      ) : null}
    </>
  );
});

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
  anagramButtonLabel = "Affronta l'anagramma",
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
  // Su phone alziamo l'altezza del dialog box. Su web/tablet i fattori
  // sono 1/0: dialogMaxHeightRatio resta 0.22 e safeBottom resta 0 →
  // layout invariato.
  const { dialogMaxHeightRatio, safeBottom, isPhone } = useResponsiveScale();

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
        charIndexRef.current = Math.min(
          charIndexRef.current + TYPEWRITER_CHARS_PER_TICK,
          currentBlockText.length,
        );
        setDisplayed(currentBlockText.slice(0, charIndexRef.current));
        if (charIndexRef.current >= currentBlockText.length) {
          clearInterval(timerRef.current);
          setIsTyping(false);
          setBlockDone(true);
        }
      }, TYPEWRITER_TICK_MS);
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

  // Il backdrop (sfondo + overlay + personaggio) è incapsulato in un
  // componente memoizzato a parte (BackdropLayer in cima al file) così non
  // si re-renderizza ad ogni tick del typewriter.
  const hintStyle = computeHintStyle(hintPosition);
  const backdrop = (
    <BackdropLayer
      backgroundAsset={backgroundAsset}
      characterAsset={characterAsset}
      hideCharacter={hideCharacter}
      characterPosition={characterPosition}
      npc={npc}
      overlayOpacity={overlayOpacity}
    />
  );

  // --- QUICK VIEW: ritorno dall'anagramma ---
  if (quickView) {
    return (
      <View style={styles.container}>
        {backdrop}
        <AutoHintEffect active={hintActive} hintImage={hintAsset} hintImageStyle={hintStyle} />
        <View style={[styles.quickViewPanel, { bottom: safeBottom }]}>
          <Text style={styles.dialogName}>{npc.label}</Text>
          <View style={styles.quickViewButtons}>
            <TouchableOpacity
              style={styles.rereadButton}
              onPress={handleReread}
              activeOpacity={0.8}
            >
              <Text style={styles.rereadButtonText}>Rileggi il testo</Text>
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
  // Altezza del dialog box:
  //   - Su web/tablet: maxHeight 22% → il box cresce col contenuto fino al
  //     limite, poi scrolla. Comportamento storico, non oscilla perche'
  //     i testi web sono raramente sotto la threshold.
  //   - Su phone: HEIGHT fissa 35% → il box NON cresce dinamicamente col
  //     typewriter (eliminato l'effetto "respiro" che spostava il box su
  //     e giu' mentre il testo veniva digitato).
  const dialogH = screenH * dialogMaxHeightRatio;
  const dialogSizeStyle = isPhone ? { height: dialogH } : { maxHeight: dialogH };
  const isCharacter = blocks[blockIndex]?.speaker === 'character';
  // Su native il file font caricato e' la variante italic
  // (CormorantGaramond_500Medium_Italic): `fontStyle: 'normal'` da solo NON
  // basta a renderlo tondo perche' il font face stesso e' italic e RN non
  // sintetizza il romano. Per le battute personaggio passiamo esplicitamente
  // alla variante upright (`serifUpright`). Su web il browser sintetizza
  // tondo/italic via CSS, quindi anche li' funziona.
  const characterTextStyle = isCharacter
    ? { fontStyle: 'normal', fontFamily: fontFamilies.serifUpright }
    : null;
  return (
    <View style={styles.container}>
      {backdrop}
      <AutoHintEffect active={hintActive} hintImage={hintAsset} hintImageStyle={hintStyle} />
      {/* Area "tappable" SOPRA il dialog box: tap per saltare/avanzare la
          narrazione. Non copre il dialog box stesso, cosi' lo ScrollView
          interno mantiene il controllo dei gesti drag verticali. */}
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: dialogH, zIndex: 2 }} />
      </TouchableWithoutFeedback>
      <View style={{ position: 'absolute', bottom: safeBottom, left: 0, right: 0, zIndex: 3 }}>
        <View style={[styles.dialogBox, dialogSizeStyle]}>
          {/* Header: nome NPC (o "Narratore") + filetto oro + "batt. N/M".
              Wrappato in TWF cosi' un tap sull'header avanza la narrazione. */}
          <TouchableWithoutFeedback onPress={handleTap}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogName}>
                {isCharacter ? npc.label : 'Narratore'}
              </Text>
              <View style={styles.dialogRule} />
              <Text style={{ fontFamily: fontFamilies.body, fontSize: 11, color: colors.velvet.champagneMuted, letterSpacing: 0.5 }}>
                batt.{' '}
                <Text style={{ fontFamily: fontFamilies.typewriter, fontSize: 12 }}>
                  {blockIndex + 1}
                </Text>
                {' / '}
                <Text style={{ fontFamily: fontFamilies.typewriter, fontSize: 12 }}>
                  {blocks.length}
                </Text>
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {/* ScrollView libero: i gesti drag verticali non sono piu' intercettati
              dal TWF esterno (che ora copre solo l'area sopra il dialog box). */}
          <ScrollView
            style={isPhone ? { flex: 1 } : { flexGrow: 0 }}
            contentContainerStyle={styles.dialogScrollContent}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            <Text style={[styles.dialogText, characterTextStyle]}>
              {isCharacter ? formatQuotes(displayed) : displayed}
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
    </View>
  );
}
