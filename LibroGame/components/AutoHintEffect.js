// components/AutoHintEffect.js
// Effetto visivo dell'aiuto automatico.
//
// Se riceve `hintImage` + `hintImageStyle`:
//   - L'immagine è sempre visibile in posizione fissa sullo sfondo.
//   - Quando `active` è true → la stessa immagine tinta d'oro pulsa sopra,
//     creando un glow che segue la sagoma esatta (funziona con PNG trasparente).
// Altrimenti: fallback al bordo oro lampeggiante su tutta la schermata.

import React, { useEffect, useRef } from 'react';
import { View, Image, Animated } from 'react-native';
import { autoHintEffectStyles as styles } from '../styles/components';
import { colors } from '../styles/theme';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function AutoHintEffect({ active, hintImage, hintImageStyle }) {
  const glowOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (active) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, { toValue: 0.75, duration: 600, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 0,    duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      glowOpacity.stopAnimation();
      glowOpacity.setValue(0);
    }
  }, [active]);

  if (hintImage) {
    return (
      <AnimatedImage
        source={hintImage}
        style={[
          styles.hintImage,
          hintImageStyle,
          { tintColor: colors.primary, opacity: glowOpacity },
        ]}
        resizeMode="contain"
        pointerEvents="none"
      />
    );
  }

  // Fallback: bordo oro su tutta la schermata
  if (!active) return null;
  return (
    <Animated.View
      style={[styles.overlay, { opacity: glowOpacity }]}
      pointerEvents="none"
    />
  );
}
