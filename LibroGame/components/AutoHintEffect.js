// components/AutoHintEffect.js
// Effetto visivo dell'aiuto automatico: un bordo dorato lampeggiante
// che si sovrappone alla schermata per attirare l'attenzione del giocatore.
// Si attiva quando lo prop `active` diventa true.

import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { autoHintEffectStyles as styles } from '../styles/components';

export default function AutoHintEffect({ active }) {
  // useRef — crea una Animated.Value persistente tra i render
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      // Loop di lampeggio: 0 -> 1 -> 0 -> 1 ...
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Stop loop e fade out
      opacity.stopAnimation();
      opacity.setValue(0);
    }
  }, [active]);

  if (!active) return null;

  return <Animated.View style={[styles.overlay, { opacity }]} />;
}
