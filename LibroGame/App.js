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

// ImagePreloader — preload con strategia diversa per piattaforma.
//
// Su web: render 1×1 di TUTTI gli asset al boot. Il browser tiene la decodifica
// nella cache HTTP e i successivi <Image> sono istantanei. Memoria abbondante.
//
// Su native (Android/iOS): renderizzare 32 PNG a piena risoluzione costa
// ~150-200 MB di bitmap RGBA in RAM e causa GC pauses → choppiness.
// Su mobile preloadiamo SOLO gli asset della mappa (piccoli, sempre necessari)
// e l'Acrobata (prima scena reale). Gli altri sfondi decodificano al volo
// quando il giocatore entra nella scena: il delay è di pochi ms, accettabile,
// e il working set di memoria resta basso.
function ImagePreloader() {
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(id);
  }, []);

  if (!ready) return null;

  const isNative = Platform.OS !== 'web';
  const allAssets = isNative
    ? [
        ...Object.values(ASSETS.map),
        ASSETS.backgrounds.intro,
        ASSETS.backgrounds.acrobata,
        ASSETS.characters.acrobata,
      ].filter(Boolean)
    : [
        ...Object.values(ASSETS.map),
        ...Object.values(ASSETS.backgrounds),
        ...Object.values(ASSETS.characters),
      ];
  return (
    <View style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      {allAssets.map((source, i) => (
        <Image key={i} source={source} style={{ width: 1, height: 1 }} fadeDuration={0} />
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
