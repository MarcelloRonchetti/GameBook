// lib/session.js
// Utility condivise per la gestione della sessione.
//
// AGGIORNAMENTO rispetto alla versione precedente:
//   resolvePlayerResumeRoute ora punta a 'CircoStanza' e 'Map'
//   invece di 'Scene' e 'Anagram' (vecchio flusso).

import { Alert } from 'react-native';
import { supabase } from './supabase';
import { STORY_GRAPH } from '../styles/theme';

// ---------------------------------------------------------------------------
// LOGOUT
// ---------------------------------------------------------------------------
export async function logout(navigation) {
  const { error } = await supabase.auth.signOut();
  if (error) console.log('Errore logout:', error.message);
  navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
}

// ---------------------------------------------------------------------------
// CONFERMA LOGOUT
// ---------------------------------------------------------------------------
export function confirmLogout(navigation) {
  if (typeof window !== 'undefined' && window.confirm) {
    if (window.confirm('Vuoi davvero uscire? Dovrai accedere di nuovo per continuare.')) {
      logout(navigation);
    }
    return;
  }
  Alert.alert(
    "Esci dall'account",
    'Vuoi davvero uscire? Dovrai accedere di nuovo per continuare.',
    [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Esci', style: 'destructive', onPress: () => logout(navigation) },
    ]
  );
}

// ---------------------------------------------------------------------------
// CONFIRM — cross-platform (web + mobile)
// ---------------------------------------------------------------------------
export function confirm(title, message, onConfirm, destructive = false) {
  if (typeof window !== 'undefined' && window.confirm) {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Annulla', style: 'cancel' },
    {
      text: destructive ? 'Elimina' : 'Conferma',
      style: destructive ? 'destructive' : 'default',
      onPress: onConfirm,
    },
  ]);
}

// ---------------------------------------------------------------------------
// RESUME — calcola la schermata corretta al rientro del player
// ---------------------------------------------------------------------------
// Nuova logica con CircoStanza + Map:
//
//   nessun progress     → Intro
//   intro solved        → Map (con Acrobata available)
//   illusionista solved → Direttrice
//   direttrice          → Direttrice
//   altra scena solved  → Map (con i next di quella scena available)
//   altra scena !solved → CircoStanza in modalità 'anagram'
//                         (il player aveva già visto il testo, era all'anagramma)
export async function resolvePlayerResumeRoute(room, playerId) {
  const { data: progress, error } = await supabase
    .from('progress')
    .select('scene_id, solved, entered_at')
    .eq('room_id', room.id)
    .eq('player_id', playerId)
    .order('entered_at', { ascending: false });

  if (error || !progress || progress.length === 0) {
    return { screen: 'Intro', params: { room } };
  }

  const last = progress[0];

  // Intro non risolta → torna all'Intro
  if (last.scene_id === 'intro' && !last.solved) {
    return { screen: 'Intro', params: { room } };
  }

  // Intro risolta → mappa con Acrobata available
  if (last.scene_id === 'intro' && last.solved) {
    return {
      screen: 'Map',
      params: {
        room,
        allChoices: ['acrobata'],
      },
    };
  }

  // Illusionista risolta → Direttrice
  if (last.scene_id === 'illusionista' && last.solved) {
    return { screen: 'Direttrice', params: { room } };
  }

  // Direttrice → Direttrice
  if (last.scene_id === 'direttrice') {
    return { screen: 'Direttrice', params: { room } };
  }

  // Scena risolta → mappa con i next di quella scena available
  if (last.solved) {
    const nextNodes = STORY_GRAPH[last.scene_id]?.next || [];
    return {
      screen: 'Map',
      params: {
        room,
        justSolvedScene: last.scene_id,
        allChoices: nextNodes,
      },
    };
  }

  // Scena non risolta → CircoStanza in modalità anagramma
  // (aveva già visto il testo della scena, era all'anagramma)
  return {
    screen: 'CircoStanza',
    params: {
      room,
      sceneId: last.scene_id,
      initialMode: 'anagram',
    },
  };
}
