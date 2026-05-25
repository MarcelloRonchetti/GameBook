// lib/useRoomClosedListener.js
// Hook personalizzato che sottoscrive in realtime gli aggiornamenti
// della stanza corrente: se il GM cambia lo status a 'closed' mentre
// il giocatore sta giocando, mostra una notify cross-platform e lo
// rimanda al JoinRoom.
//
// Usato nelle schermate del giocatore: Intro, Scene, Anagram, Direttrice.

import { useEffect } from 'react';
import { BackHandler } from 'react-native';
// BackHandler — per disabilitare il tasto back hardware su Android

import { supabase } from './supabase';
import { notify } from './helpers';

export function useRoomClosedListener(room, navigation) {
  useEffect(() => {
    if (!room || !room.id) return;

    // Idempotente: la chiusura puo' arrivare sia via postgres_changes
    // sia via broadcast; evitiamo doppi notify/reset.
    let fired = false;
    const kick = () => {
      if (fired) return;
      fired = true;
      // notify() e' cross-platform (web + native).
      notify(
        'Stanza chiusa',
        'Il GM ha chiuso la stanza. La sessione di gioco è terminata.'
      );
      // reset dello stack — il player resta loggato ma torna
      // alla schermata di ingresso stanza
      navigation.reset({
        index: 0,
        routes: [{ name: 'JoinRoom' }],
      });
    };

    // Canale 1 — postgres_changes UPDATE su rooms.
    // Richiede che la tabella sia in pg_publication supabase_realtime.
    const pgChannel = supabase
      .channel(`room_status_${room.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${room.id}`
      }, (payload) => {
        if (payload?.new?.status === 'closed') kick();
      })
      .subscribe();

    // Canale 2 — broadcast esplicito GM → player.
    // Belt-and-suspenders: se la publication regredisce o postgres_changes
    // ritarda, il broadcast bypassa il DB e arriva subito.
    const bcChannel = supabase
      .channel(`room_close_${room.id}`)
      .on('broadcast', { event: 'room_closed' }, () => kick())
      .subscribe();

    return () => {
      supabase.removeChannel(pgChannel);
      supabase.removeChannel(bcChannel);
    };
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
