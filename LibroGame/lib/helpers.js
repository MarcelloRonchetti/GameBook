// helpers.js
// Funzioni di utilità condivise in tutta l'app.

import { Alert, Platform } from 'react-native';

// ---------------------------------------------------------------------------
// normalizeText — rimuove accenti, spazi multipli, punteggiatura e porta in maiuscolo.
// Usato per confrontare la risposta del giocatore con la soluzione dell'anagramma
// in modo tollerante (ignora apostrofi, accenti, maiuscole/minuscole).
// ---------------------------------------------------------------------------
export function normalizeText(text) {
  return text
    .toUpperCase()
    .normalize('NFD')                     // separa caratteri base da diacritici
    .replace(/[\u0300-\u036f]/g, '')      // rimuove diacritici (accenti)
    .replace(/[''`]/g, '')                // rimuove apostrofi
    .replace(/[^A-Z0-9 ]/g, '')           // rimuove tutto tranne lettere, numeri, spazio
    .replace(/\s+/g, ' ')                 // normalizza spazi multipli
    .trim();
}

// ---------------------------------------------------------------------------
// checkAnagram — confronta la risposta dell'utente con la soluzione.
// Restituisce true se corrispondono dopo normalizzazione.
// ---------------------------------------------------------------------------
export function checkAnagram(userAnswer, solution) {
  return normalizeText(userAnswer) === normalizeText(solution);
}

// ---------------------------------------------------------------------------
// generateRoomCode — genera un codice stanza numerico di 6 cifre.
// Usato da CreateRoomScreen per creare codici univoci.
// ---------------------------------------------------------------------------
export function generateRoomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ---------------------------------------------------------------------------
// formatTime — converte secondi in stringa mm:ss.
// Usato per mostrare il timer dell'aiuto automatico.
// ---------------------------------------------------------------------------
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ---------------------------------------------------------------------------
// notify — mostra un avviso all'utente in modo cross-platform.
// ---------------------------------------------------------------------------
// Risolve il problema noto: `Alert.alert` non funziona sul web di Expo,
// per cui chiamarlo lì faceva sembrare che "non succedesse nulla" quando
// in realtà dietro le quinte il codice stava cercando di mostrare un alert.
//
// - Su WEB → usa `window.alert` (popup browser nativo).
// - Su MOBILE → usa `Alert.alert` (popup nativo iOS/Android).
//
// Da preferire ovunque ad `Alert.alert` diretto quando si vuole un
// semplice messaggio informativo.
export function notify(title, message) {
  // Compone il testo: titolo + corpo separati da una riga vuota
  const fullText = message ? `${title}\n\n${message}` : title;

  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
    window.alert(fullText);
    return;
  }

  Alert.alert(title, message);
}
