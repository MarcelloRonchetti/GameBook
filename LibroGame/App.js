// App.js
// Punto di ingresso principale dell'app.
// Importa e renderizza AppNavigator che gestisce
// tutta la navigazione tra le schermate.

import React, { useEffect } from 'react';
import { Platform, View, Image, ActivityIndicator } from 'react-native';
// expo-image: cache disco condivisa con i componenti che renderizzeranno
// successivamente le stesse immagini (NarratorView background, MapScreen
// background). Image.prefetch popola la cache senza dover renderizzare.
import { Image as ExpoImage } from 'expo-image';
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

// ImagePreloader — preload tramite expo-image.
//
// expo-image popola la sua cache disco/memoria con `Image.prefetch(source)`
// senza dover renderizzare. La cache e' condivisa con i successivi <Image>
// di expo-image (NarratorView background, MapScreen background): quando il
// giocatore entra in una scena, l'immagine e' gia' decodificata e appare
// istantaneamente.
//
// Strategia:
//   FASE 1 (boot): mappa + intro + acrobata preloadati subito.
//   FASE 2 (post-boot, in background): tutti gli altri background/character/
//   hint preloadati a batch di pochi alla volta, con pause, per non saturare
//   il decoder e bloccare l'UI thread. Picco di memoria controllato.
//
// Gli asset con tintColor/banner (map/* tranne il background) restano gestiti
// da <Image> RN e non passano da qui — sono piccoli e usati sempre insieme.
const PRELOAD_BATCH_SIZE = 3;
const PRELOAD_BATCH_DELAY_MS = 800;

function ImagePreloader() {
  useEffect(() => {
    const isNative = Platform.OS !== 'web';
    const bootAssets = isNative
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
          ...Object.values(ASSETS.hints || {}),
        ];

    // Boot prefetch (sincrono, fire-and-forget — expo-image fa il lavoro
    // off-thread internamente).
    try {
      ExpoImage.prefetch(bootAssets);
    } catch (e) {
      // ignore — preload e' best-effort
    }

    if (!isNative) return undefined;

    // FASE 2 (solo native): preload progressivo del resto, dopo 1.5s di
    // grace period per non competere col first paint.
    const phase1Set = new Set(bootAssets);
    const remaining = [
      ...Object.values(ASSETS.backgrounds),
      ...Object.values(ASSETS.characters),
      ...Object.values(ASSETS.hints || {}),
    ].filter((a) => a && !phase1Set.has(a));

    let cancelled = false;
    let index = 0;
    const timers = [];

    const loadNextBatch = () => {
      if (cancelled || index >= remaining.length) return;
      const batch = remaining.slice(index, index + PRELOAD_BATCH_SIZE);
      index += PRELOAD_BATCH_SIZE;
      try {
        ExpoImage.prefetch(batch);
      } catch (e) {
        // ignore
      }
      const t = setTimeout(loadNextBatch, PRELOAD_BATCH_DELAY_MS);
      timers.push(t);
    };

    const initial = setTimeout(loadNextBatch, 1500);
    timers.push(initial);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  // Nessun render: la prefetch popola la cache senza UI.
  return null;
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
