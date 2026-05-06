// App.js
// Punto di ingresso principale dell'app.
// Importa e renderizza AppNavigator che gestisce
// tutta la navigazione tra le schermate.

import React, { useEffect } from 'react';
import { Platform, View, Image } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { ASSETS } from './styles/theme';

// --- Fix scroll su web ---------------------------------------------------
// Su react-native-web, gli ScrollView/FlatList con `flex: 1` riescono ad
// abilitare lo scroll solo se TUTTA la catena di antenati ha un'altezza
// definita. Expo per default imposta `#root { height: 100% }` ma alcune
// versioni/configurazioni hanno problemi con la propagazione della height
// nel stack navigator card.
//
// Iniettiamo CSS AGGIUNTIVO che garantisce la height chain completa e
// che il wrapper di React sia flex. Questo lo facciamo in useEffect per
// assicurarci che il DOM sia pronto (non al modulo load time).
function useWebScrollFix() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const STYLE_ID = 'librogame-web-scroll-fix';
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      // Garantisce che tutta la chain sia full-height e flex.
      // Questo sovrascrive eventuali stili conflittuosi da Stack navigator.
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

// Precarica tutte le immagini pesanti mantenendole decodificate in memoria.
// Su web, renderizzare un <Image> nascosto è l'unico modo sicuro per
// evitare che il browser ri-decodifichi il file ad ogni navigazione.
// Precarica le immagini pesanti DOPO che la mappa è già visibile,
// così non blocca il primo render.
function ImagePreloader() {
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(id);
  }, []);

  if (!ready) return null;

  const allAssets = [
    ASSETS.map.background,
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

function AppWithScrollFix() {
  useWebScrollFix();
  return (
    <>
      <ImagePreloader />
      <AppNavigator />
    </>
  );
}

export default AppWithScrollFix;
