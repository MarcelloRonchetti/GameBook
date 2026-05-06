// components/AutoHintEffect.js
// Effetto visivo dell'aiuto automatico.
//
// Se riceve `hintImage` + `hintImageStyle`:
//   - Quando `active` è true → la sagoma dorata dell'immagine pulsa
//     (Animated.View wrappa Image per animazione più fluida su web).
// Altrimenti: fallback al bordo oro lampeggiante su tutta la schermata.

import React, { useEffect, useRef } from 'react';
import { View, Image, Animated } from 'react-native';
import { autoHintEffectStyles as styles } from '../styles/components';
import { colors } from '../styles/theme';

export default function AutoHintEffect({ active, hintImage, hintImageStyle }) {
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, { toValue: 0.85, duration: 700, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 0,    duration: 700, useNativeDriver: true }),
        ])
      ).start();
    } else {
      glowOpacity.stopAnimation();
      glowOpacity.setValue(0);
    }
  }, [active]);

  if (hintImage) {
    // Animated.View wrappa Image: più fluido di Animated.createAnimatedComponent(Image)
    return (
      <Animated.View
        style={[styles.hintImage, hintImageStyle, { opacity: glowOpacity }]}
        pointerEvents="none"
      >
        <Image
          source={hintImage}
          style={{ width: '100%', height: '100%', tintColor: colors.primary }}
          resizeMode="contain"
        />
      </Animated.View>
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
