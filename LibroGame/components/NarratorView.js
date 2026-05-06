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
//   scene         — oggetto scena da scenes.json (ha .title, .narratorBlocks, .theme)
//   sceneId       — id della scena (es. 'acrobata')
//   onStartAnagram — callback chiamata quando il player preme "Anagramma"
//   characterAsset — require() dello sprite personaggio (o null → emoji placeholder)
//   backgroundAsset — require() dello sfondo (o null → colore placeholder)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, Image, ImageBackground,
  TouchableWithoutFeedback, TouchableOpacity, Animated,
} from 'react-native';

import { circoStanzaStyles as styles } from '../styles/player';
import { getNpcTheme, colors } from '../styles/theme';

// Velocità typewriter: ms per carattere
const TYPEWRITER_SPEED = 28;
// Pausa iniziale prima di iniziare a scrivere (ms)
const INITIAL_DELAY = 200;

export default function NarratorView({
  scene,
  sceneId,
  onStartAnagram,
  characterAsset,
  backgroundAsset,
}) {
  const npc = getNpcTheme(sceneId);

  // I blocchi di testo narrativi — array di stringhe
  // Se scenes.json ha .narratorBlocks usa quelli, altrimenti wrappa .text come unico blocco
  const blocks = scene.narratorBlocks || [scene.text || ''];

  const [blockIndex, setBlockIndex] = useState(0);   // blocco corrente
  const [displayed, setDisplayed] = useState('');     // testo mostrato finora
  const [isTyping, setIsTyping] = useState(false);    // il typewriter sta scrivendo?
  const [blockDone, setBlockDone] = useState(false);  // blocco corrente completato?
  const [allDone, setAllDone] = useState(false);      // tutti i blocchi completati?

  const timerRef = useRef(null);
  const charIndexRef = useRef(0);

  // Cursore lampeggiante
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Avvia il cursor blink
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

  // Avvia il typewriter quando cambia il blocco corrente
  useEffect(() => {
    startTyping();
  }, [blockIndex]);

  const startTyping = useCallback(() => {
    setDisplayed('');
    charIndexRef.current = 0;
    setBlockDone(false);
    setIsTyping(true);

    const currentBlock = blocks[blockIndex] || '';

    // Delay iniziale prima di iniziare a scrivere
    const startTimer = setTimeout(() => {
      timerRef.current = setInterval(() => {
        charIndexRef.current += 1;
        const slice = currentBlock.slice(0, charIndexRef.current);
        setDisplayed(slice);

        if (charIndexRef.current >= currentBlock.length) {
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

  // Gestione tap
  const handleTap = () => {
    if (isTyping) {
      // TAP durante scrittura → completa istantaneamente
      clearInterval(timerRef.current);
      setDisplayed(blocks[blockIndex] || '');
      charIndexRef.current = (blocks[blockIndex] || '').length;
      setIsTyping(false);
      setBlockDone(true);
      return;
    }

    if (blockDone) {
      // TAP a blocco completato → blocco successivo o fine
      const nextIndex = blockIndex + 1;
      if (nextIndex < blocks.length) {
        setBlockIndex(nextIndex);
      } else {
        // Tutti i blocchi mostrati
        setAllDone(true);
      }
    }
  };

  return (
    <View style={styles.container}>

      {/* SFONDO — fissato dietro lo ScrollView, non scrolla */}
      {backgroundAsset ? (
        <Image
          source={backgroundAsset}
          style={[styles.background, styles.backgroundImage]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.background, { backgroundColor: npc.color, opacity: 0.3 }]} />
      )}

      {/* OVERLAY scuro — anch'esso fisso */}
      <View style={styles.overlay} />

      {/* SPRITE PERSONAGGIO — assoluto, fuori dal flusso scroll */}
      {characterAsset ? (
        <View style={styles.characterContainer} pointerEvents="none">
          <Image
            source={characterAsset}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </View>
      ) : (
        <View style={[styles.characterContainer, { alignItems: 'center', justifyContent: 'center' }]} pointerEvents="none">
          <Text style={{ fontSize: 100 }}>{npc.emoji}</Text>
        </View>
      )}

      {/* DIALOG BOX — assoluto in fondo */}
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2 }}>
            <View style={styles.dialogBox}>
              <View style={styles.dialogHeader}>
                <Text style={styles.dialogName}>
                  {npc.label.toUpperCase()}
                </Text>
                {!allDone && (
                  <Text style={styles.dialogTapHint}>
                    {isTyping ? 'tocca per saltare' : 'tocca per continuare ›'}
                  </Text>
                )}
              </View>

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
                  <Text style={styles.anagramButtonText}>
                    🔤 Affronta l'anagramma
                  </Text>
                </TouchableOpacity>
              )}
            </View>

          </View>
        </TouchableWithoutFeedback>
    </View>
  );
}
