// lib/useRoomClosedListener.js
// Hook personalizzato che sottoscrive in realtime gli aggiornamenti
// della stanza corrente: se il GM cambia lo status a 'closed' mentre
// il giocatore sta giocando, mostra un Alert e lo rimanda al JoinRoom.
//
// Usato nelle schermate del giocatore: Intro, Scene, Anagram, Direttrice.

import { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
// BackHandler — per disabilitare il tasto back hardware su Android

import { supabase } from './supabase';

export function useRoomClosedListener(room, navigation) {
  useEffect(() => {
    if (!room || !room.id) return;

    // Sottoscrizione realtime su UPDATE della riga della stanza
    const channel = supabase
      .channel(`room_status_${room.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${room.id}`
      }, (payload) => {
        // Se lo status è cambiato a 'closed' -> avvisa e riporta a JoinRoom
        if (payload?.new?.status === 'closed') {
          Alert.alert(
            'Stanza chiusa',
            'Il GM ha chiuso la stanza. La sessione di gioco è terminata.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // reset dello stack — il player resta loggato ma torna
                  // alla schermata di ingresso stanza
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'JoinRoom' }],
                  });
                }
              }
            ]
          );
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [room?.id]);
}

// ---------------------------------------------------------------------------
// useDisableAndroidBack
// ---------------------------------------------------------------------------
// Hook che disabilita il tasto back hardware di Android finché la
// schermata è montata. Usato nelle scene critiche dove non si deve
// poter tornare indietro (Intro, Scene, Anagram, Direttrice, Dashboard).
export function useDisableAndroidBack() {
  useEffect(() => {
    const handler = () => {
      // true = evento consumato, il sistema non chiude l'app
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handler
    );

    return () => {
      // Compatibilità RN vecchie/nuove:
      if (subscription && subscription.remove) {
        subscription.remove();
      } else {
        BackHandler.removeEventListener('hardwareBackPress', handler);
      }
    };
  }, []);
}
