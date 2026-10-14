// lib/realtimeHub.js
// Canali realtime Supabase condivisi fra le schermate.
//
// PERCHE' ESISTE:
// supabase.channel(topic) restituisce il canale GIA' esistente se ce n'e'
// uno con lo stesso topic. Con navigation.replace la nuova schermata monta
// prima che la vecchia abbia finito di chiudere il suo canale (removeChannel
// e' asincrono: il canale resta nella lista finche' il server non conferma).
// La nuova schermata riceveva quindi il canale vecchio, gia' sottoscritto, e
// .on() lanciava "cannot add 'postgres_changes' callbacks ... after
// 'subscribe()'". Su web la transizione e' istantanea e non succedeva; su
// APK (animazione di transizione) crashava passando Mappa <-> Stanza.
//
// SOLUZIONE:
// un solo canale per topic, creato la prima volta e tenuto aperto per tutta
// la sessione. Le schermate aggiungono/rimuovono solo il proprio listener.
// I topic sono pochi (per stanza / giocatore), quindi tenerli aperti e'
// trascurabile.

import { supabase } from './supabase';

// topic -> { channel, listeners: Set<function> }
const hubs = new Map();

// Restituisce il canale condiviso per `topic`, creandolo se serve.
// `bindings` = lista di [type, filter] (es. ['postgres_changes', {...}] o
// ['broadcast', { event: 'new_hint' }]): usata SOLO alla creazione, quindi
// lo stesso topic deve avere sempre gli stessi binding.
function getHub(topic, bindings) {
  let hub = hubs.get(topic);
  if (hub) return hub;

  const listeners = new Set();
  let channel = supabase.channel(topic);
  bindings.forEach(([type, filter]) => {
    channel = channel.on(type, filter, (payload) => {
      listeners.forEach((listener) => listener(payload));
    });
  });
  channel.subscribe();

  hub = { channel, listeners };
  hubs.set(topic, hub);
  return hub;
}

// Iscrive `listener` al canale condiviso. Ritorna la funzione di cleanup
// da usare nel return di useEffect.
export function subscribeShared(topic, bindings, listener) {
  const hub = getHub(topic, bindings);
  hub.listeners.add(listener);
  return () => hub.listeners.delete(listener);
}

// Canale condiviso senza listener, per chi deve solo inviare broadcast
// (es. GM che spinge un nuovo hint al player).
export function getSharedChannel(topic) {
  return getHub(topic, []).channel;
}
