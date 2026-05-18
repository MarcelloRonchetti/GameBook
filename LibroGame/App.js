// App.js
// Punto di ingresso principale dell'app.
// Importa e renderizza AppNavigator che gestisce
// tutta la navigazione tra le schermate.

import React, { useEffect } from 'react';
import { Platform, View, Image, ActivityIndicator } from 'react-native';
import {
  useFonts as useCormorant,
  CormorantGaramond_500Medium,
  CormorantGaramond_500Medium_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { SpecialElite_400Regular } from '@expo-google-fonts/special-elite';
import AppNavigator from './navigation/AppNavigator';
import ErrorBoundary from './components/ErrorBoundary';
import VelvetBackdrop from './components/VelvetBackdrop';
import { ASSETS, colors } from './styles/theme';

function useWebScrollFix() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const STYLE_ID = 'librogame-web-scroll-fix';
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
        html, body {
          height: 100% !important;
          overflow: hidden !important;
          margin: 0 !important;
        }
        #root {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
        }
        #root > div {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
}

function ImagePreloader() {
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(id);
  }, []);

  if (!ready) return null;

  const allAssets = [
    ...Object.values(ASSETS.map),
    ...Object.values(ASSETS.backgrounds),
    ...Object.values(ASSETS.characters),
  ];
  return (
    <View style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      {allAssets.map((source, i) => (
        <Image key={i} source={source} style={{ width: 1, height: 1 }} />
      ))}
    </View>
  );
}

// Splash velluto teatrale: mostrato finche' i Google Fonts non sono caricati.
// Sfondo bordeaux pieno + VelvetBackdrop animato + spinner oro. Evita il
// flash dei font di sistema al primo paint.
function VelvetSplash() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.velvet.bgDeep, alignItems: 'center', justifyContent: 'center' }}>
      <VelvetBackdrop particleCount={6} />
      <ActivityIndicator size="large" color={colors.velvet.gold} />
    </View>
  );
}

function AppWithScrollFix() {
  useWebScrollFix();
  const [fontsLoaded] = useCormorant({
    CormorantGaramond_500Medium,
    CormorantGaramond_500Medium_Italic,
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
    SpecialElite_400Regular,
  });

  if (!fontsLoaded) {
    return <VelvetSplash />;
  }

  return (
    <ErrorBoundary>
      <ImagePreloader />
      <AppNavigator />
    </ErrorBoundary>
  );
}

export default AppWithScrollFix;
