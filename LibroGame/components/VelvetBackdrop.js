// components/VelvetBackdrop.js
// Sfondo "velluto teatrale" condiviso dalle schermate Auth/GM ridisegnate.
// Strati:
//  - gradient SVG bordeaux scuro
//  - due tende SVG ancorate ai bordi con sway sinusoidale lentissimo
//  - 8 particelle dorate che fluttuano in loop verticale
// Tutto basato su Animated nativo + react-native-svg (già nelle deps).
//
// Pensato come <VelvetBackdrop /> assoluto a tutto schermo (zIndex 0).
// I figli vanno renderizzati DOPO il backdrop nello stesso parent, con
// posizionamento relativo/flex sopra di esso.

import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, View, useWindowDimensions } from 'react-native';
import Svg, {
  Defs, LinearGradient, Stop, Path, RadialGradient, Rect, G,
} from 'react-native-svg';
import { colors } from '../styles/theme';
import { velvetBackdropStyles as styles } from '../styles/components';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

// Generatore deterministico di particelle: configurate una volta per evitare
// che cambino ad ogni render e per garantire varieta visiva controllata.
function buildParticleSeeds(count) {
  const seeds = [];
  for (let i = 0; i < count; i++) {
    seeds.push({
      leftPct: 6 + (i * 13.7) % 88,
      delay: i * 900,
      duration: 9000 + (i * 1117) % 6000,
      size: 3 + (i % 3),
      driftPx: (i % 2 === 0 ? 1 : -1) * (8 + (i * 5) % 22),
    });
  }
  return seeds;
}

function Particle({ seed, height }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    const loop = () => {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: seed.duration,
        easing: Easing.linear,
        useNativeDriver: true,
        delay: seed.delay,
      }).start(({ finished }) => {
        if (finished && !cancelled) loop();
      });
    };
    loop();
    return () => { cancelled = true; };
  }, [progress, seed.duration, seed.delay]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [height + 40, -60],
  });
  const translateX = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, seed.driftPx, 0],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.15, 0.85, 1],
    outputRange: [0, 0.7, 0.55, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        {
          left: `${seed.leftPct}%`,
          width: seed.size,
          height: seed.size,
          opacity,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    />
  );
}

export default function VelvetBackdrop({ particleCount = 8 }) {
  const { width, height } = useWindowDimensions();
  const sway = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sequence = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(sway, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    sequence.start();
    return () => sequence.stop();
  }, [sway]);

  const swayLeft = sway.interpolate({ inputRange: [0, 1], outputRange: [0, 6] });
  const swayRight = sway.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

  const particles = useMemo(() => buildParticleSeeds(particleCount), [particleCount]);

  const curtainWidth = Math.max(220, width * 0.22);
  const curtainHeight = height;

  return (
    <View pointerEvents="none" style={styles.root}>
      {/* Gradient di base + vignetta radiale ai bordi */}
      <Svg
        width="100%"
        height="100%"
        style={styles.layerFill}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id="velvetBgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.velvet.bgDeep} stopOpacity="1" />
            <Stop offset="0.55" stopColor="#231014" stopOpacity="1" />
            <Stop offset="1" stopColor={colors.velvet.bgDeeper} stopOpacity="1" />
          </LinearGradient>
          <RadialGradient id="velvetVignette" cx="50%" cy="50%" r="75%">
            <Stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <Stop offset="1" stopColor="#000" stopOpacity="0.55" />
          </RadialGradient>
          <LinearGradient id="velvetGoldLine" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={colors.velvet.goldFaint} stopOpacity="0" />
            <Stop offset="0.5" stopColor={colors.velvet.gold} stopOpacity="0.55" />
            <Stop offset="1" stopColor={colors.velvet.goldFaint} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={width} height={height} fill="url(#velvetBgGrad)" />
        <Rect x="0" y="0" width={width} height={height} fill="url(#velvetVignette)" />
        {/* sottile cornice orizzontale stile palco */}
        <Rect x="0" y="0" width={width} height="1.5" fill="url(#velvetGoldLine)" />
        <Rect x="0" y={height - 1.5} width={width} height="1.5" fill="url(#velvetGoldLine)" />
      </Svg>

      {/* Tenda sinistra */}
      <Animated.View
        style={[
          styles.curtain,
          { left: 0, width: curtainWidth, height: curtainHeight, transform: [{ translateX: Animated.multiply(swayLeft, -1) }] },
        ]}
      >
        <Svg width="100%" height="100%" viewBox={`0 0 100 100`} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="curtainLeftFill" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#1c0a0d" stopOpacity="1" />
              <Stop offset="0.4" stopColor="#3a1820" stopOpacity="1" />
              <Stop offset="0.8" stopColor="#581f2a" stopOpacity="0.95" />
              <Stop offset="1" stopColor="#3d1e25" stopOpacity="0" />
            </LinearGradient>
            <LinearGradient id="curtainLeftFold" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#000" stopOpacity="0.35" />
              <Stop offset="1" stopColor="#000" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path
            d="M0 0 L100 0 L92 100 L0 100 Z"
            fill="url(#curtainLeftFill)"
          />
          {/* pieghe verticali */}
          {[12, 28, 44, 60, 76].map((x, i) => (
            <Path
              key={i}
              d={`M${x} 0 Q ${x - 3} 50 ${x - 6} 100`}
              stroke="#000"
              strokeOpacity={0.18}
              strokeWidth={1.2}
              fill="none"
            />
          ))}
          <Path d="M0 0 L20 0 L18 100 L0 100 Z" fill="url(#curtainLeftFold)" />
        </Svg>
      </Animated.View>

      {/* Tenda destra (specchiata) */}
      <Animated.View
        style={[
          styles.curtain,
          { right: 0, width: curtainWidth, height: curtainHeight, transform: [{ translateX: swayRight }] },
        ]}
      >
        <Svg width="100%" height="100%" viewBox={`0 0 100 100`} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="curtainRightFill" x1="1" y1="0" x2="0" y2="0">
              <Stop offset="0" stopColor="#1c0a0d" stopOpacity="1" />
              <Stop offset="0.4" stopColor="#3a1820" stopOpacity="1" />
              <Stop offset="0.8" stopColor="#581f2a" stopOpacity="0.95" />
              <Stop offset="1" stopColor="#3d1e25" stopOpacity="0" />
            </LinearGradient>
            <LinearGradient id="curtainRightFold" x1="1" y1="0" x2="0" y2="0">
              <Stop offset="0" stopColor="#000" stopOpacity="0.35" />
              <Stop offset="1" stopColor="#000" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path
            d="M0 0 L100 0 L100 100 L8 100 Z"
            fill="url(#curtainRightFill)"
          />
          {[24, 40, 56, 72, 88].map((x, i) => (
            <Path
              key={i}
              d={`M${x} 0 Q ${x + 3} 50 ${x + 6} 100`}
              stroke="#000"
              strokeOpacity={0.18}
              strokeWidth={1.2}
              fill="none"
            />
          ))}
          <Path d="M80 0 L100 0 L100 100 L82 100 Z" fill="url(#curtainRightFold)" />
        </Svg>
      </Animated.View>

      {/* Particelle dorate */}
      <View style={styles.particleLayer} pointerEvents="none">
        {particles.map((seed, i) => (
          <Particle key={i} seed={seed} height={height} />
        ))}
      </View>
    </View>
  );
}
