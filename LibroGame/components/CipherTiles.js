// components/CipherTiles.js
// Rende un messaggio cifrato come tiles ("caselle"), raggruppati parola per parola.
// Convenzione del JSON sorgente:
//   - parole separate da 2+ spazi consecutivi
//   - atomi di una parola separati da `-`
//   - eventuale punteggiatura attaccata a un atomo (es. `1'`) viene
//     estratta tramite regex e renderizzata fuori dalla casella
//
// Usato sia da `IntroScreen` (modalità cifrario di benvenuto) sia da
// `AnagramOverlay` (sezione cifrario dell'Illusionista). Adotta gli stili
// condivisi di `circoStanzaStyles` (`cipherWrap`, `cipherWordGroup`,
// `cipherTile`, `cipherTileText`, `cipherSuffix`).

import React from 'react';
import { View, Text } from 'react-native';

import { circoStanzaStyles as styles } from '../styles/player';

// Memoizzato: il contenuto dipende solo dalla stringa `cipher` (immutabile per scena).
// Senza memo veniva ricostruito ad ogni keystroke nell'input anagramma del padre.
function CipherTilesImpl({ cipher }) {
  const words = cipher.split(/\s{2,}/);
  return (
    <View style={styles.cipherWrap}>
      {words.map((word, wi) => (
        <View key={wi} style={styles.cipherWordGroup}>
          {word.split('-').map((atom, ai) => {
            const m = atom.match(/^(\d+)(.*)$/);
            const num = m ? m[1] : atom;
            const suffix = m ? m[2] : '';
            return (
              <React.Fragment key={ai}>
                <View style={styles.cipherTile}>
                  <Text style={styles.cipherTileText}>{num}</Text>
                </View>
                {suffix ? (
                  <Text style={styles.cipherSuffix}>{suffix}</Text>
                ) : null}
              </React.Fragment>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export default React.memo(CipherTilesImpl);
