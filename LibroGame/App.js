// App.js
// Punto di ingresso principale dell'app.
// Importa e renderizza AppNavigator che gestisce
// tutta la navigazione tra le schermate.

import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

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

function AppWithScrollFix() {
  useWebScrollFix();
  return <AppNavigator />;
}

export default AppWithScrollFix;
