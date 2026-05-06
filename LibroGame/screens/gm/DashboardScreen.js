// DashboardScreen.js
// Schermata principale del GM dopo aver creato/aperto una stanza.
// Mostra il codice stanza, la lista dei giocatori con la scena attuale
// (aggiornata in realtime) e permette di:
//  - entrare nel dettaglio di un giocatore
//  - rimuovere un giocatore dalla stanza (lasciandola aperta)
//  - chiudere la stanza
//  - tornare alla lista delle proprie stanze (header)

import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { confirm } from '../../lib/session';
import { notify } from '../../lib/helpers';

export default function DashboardScreen({ route, navigation }) {
  // route.params.room — dati della stanza passati da CreateRoomScreen / RoomList
  const { room } = route.params;

  const [players, setPlayers] = useState([]);
  const [roomStatus, setRoomStatus] = useState(room.status);

  // fetchPlayersRef — ref che punta sempre alla versione più recente di fetchPlayers.
  // Serve perché il callback della subscription Supabase viene creato una volta sola
  // (useEffect con []), e senza il ref chiamerebbe sempre la versione "vecchia"
  // della funzione (stale closure). Con il ref invece chiama sempre quella aggiornata.
  const fetchPlayersRef = useRef(null);

  // Inserisce un bottone "Stanze" nell'header che riporta alla RoomList.
  // Usa goBack() invece di navigate('RoomList'): RoomList è sempre sotto
  // Dashboard nello stack (push da RoomList o replace da CreateRoom),
  // e goBack() smonta Dashboard in modo pulito evitando race con il
  // remount alla riapertura (causa dello "schermo bianco" su web).
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>← Stanze</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    // Prima fetch al montaggio
    fetchPlayers();

    // Sottoscrizione realtime — usa fetchPlayersRef.current() invece di fetchPlayers()
    // direttamente, così il callback chiama SEMPRE la versione aggiornata della funzione
    // e non quella catturata al primo render (stale closure).
    const subscription = supabase
      .channel(`room_changes_${room.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'room_players',
        filter: `room_id=eq.${room.id}`
      }, () => fetchPlayersRef.current?.())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'progress',
        filter: `room_id=eq.${room.id}`
      }, () => fetchPlayersRef.current?.())
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  // useCallback con [] — fetchPlayers usa solo setPlayers (stabile da useState)
  // e supabase (importazione stabile), quindi non ha dipendenze da ri-creare.
  const fetchPlayers = useCallback(async () => {
    // Passo 1 — recupera i giocatori nella stanza (con username)
    const { data: roomPlayers, error: rpError } = await supabase
      .from('room_players')
      .select('player_id, users (username)')
      .eq('room_id', room.id);

    if (rpError) {
      notify('Errore', 'Impossibile caricare i giocatori');
      return;
    }

    // Passo 2 — recupera tutti i progressi di questa stanza
    const { data: progressData } = await supabase
      .from('progress')
      .select('player_id, scene_id, solved, entered_at')
      .eq('room_id', room.id);

    // Unisci: per ogni giocatore prendi la scena più recente
    const formatted = (roomPlayers || []).map(entry => {
      const playerProgress = (progressData || [])
        .filter(p => p.player_id === entry.player_id);

      const latest = playerProgress.length > 0
        ? [...playerProgress].sort((a, b) =>
            new Date(b.entered_at) - new Date(a.entered_at)
          )[0]
        : null;

      return {
        id: entry.player_id,
        username: entry.users?.username || 'Sconosciuto',
        currentScene: latest ? latest.scene_id : 'Non ancora iniziato',
      };
    });

    setPlayers(formatted);
  }, []);

  // Mantieni il ref sincronizzato con la versione più recente della funzione.
  // Questo viene eseguito ad ogni render, prima che qualsiasi effetto venga ri-attivato.
  fetchPlayersRef.current = fetchPlayers;

  const handleCloseRoom = () => {
    // ⚠️ Alert.alert non funziona sul web — usiamo confirm() da session.js
    //    che usa window.confirm su web e Alert.alert su mobile
    confirm(
      'Chiudi stanza',
      'Sei sicuro di voler chiudere la stanza? I giocatori non potranno più accedere.',
      async () => {
        const { error } = await supabase
          .from('rooms')
          .update({ status: 'closed' })
          .eq('id', room.id);

        if (error) {
          notify('Errore', 'Impossibile chiudere la stanza');
          return;
        }

        setRoomStatus('closed');
        notify('Stanza chiusa', 'La stanza è stata chiusa con successo.');
      },
      true // destructive
    );
  };

  const handleRemovePlayer = (player) => {
    // Rimuove il giocatore dalla stanza lasciandola aperta.
    // ⚠️ Richiede la policy Supabase: "gm rimuove giocatore da stanza"
    //    su room_players per DELETE — vedi nota in fondo al file.
    confirm(
      'Rimuovi giocatore',
      `Vuoi rimuovere "${player.username}" dalla stanza? Il giocatore dovrà reinserire il codice per rientrare.`,
      async () => {
        const { error } = await supabase
          .from('room_players')
          .delete()
          .eq('room_id', room.id)
          .eq('player_id', player.id);

        if (error) {
          notify('Errore', `Impossibile rimuovere il giocatore: ${error.message}`);
          return;
        }

        // Aggiorna la lista localmente (il realtime lo farebbe già,
        // ma questo evita il ritardo visivo)
        setPlayers(prev => prev.filter(p => p.id !== player.id));
      },
      true // destructive
    );
  };

  const renderPlayer = ({ item }) => (
    <View style={styles.playerCard}>
      {/* Parte sinistra — tap per entrare nel dettaglio */}
      <TouchableOpacity
        style={styles.playerCardInfo}
        onPress={() => navigation.navigate('PlayerDetail', {
          player: item,
          roomId: room.id
        })}
      >
        <Text style={styles.playerName}>{item.username}</Text>
        <Text style={styles.playerScene}>📍 {item.currentScene}</Text>
      </TouchableOpacity>

      {/* Bottone rimozione giocatore */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemovePlayer(item)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    // FlatList come root: il wrapper View con flex:1+padding impediva
    // lo scroll su web quando il contenuto eccedeva la viewport.
    // Padding e bg vivono ora in styles.list / styles.listContent.
    <FlatList
      data={players}
      keyExtractor={item => item.id}
      renderItem={renderPlayer}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <Text style={styles.emptyText}>
          Nessun giocatore ancora connesso
        </Text>
      }
      ListHeaderComponent={
        <>
          {/* Codice stanza — ben visibile per condividerlo con i giocatori */}
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Codice Stanza</Text>
            <Text style={styles.code}>{room.code}</Text>
            <Text style={[
              styles.status,
              roomStatus === 'open' ? styles.statusOpen : styles.statusClosed
            ]}>
              {roomStatus === 'open' ? '🟢 Aperta' : '🔴 Chiusa'}
            </Text>
          </View>

          {/* Lista giocatori */}
          <Text style={styles.sectionTitle}>
            Giocatori ({players.length})
          </Text>
        </>
      }
      ListFooterComponent={
        <TouchableOpacity
          style={[
            styles.closeButton,
            roomStatus === 'closed' && styles.closeButtonDisabled
          ]}
          onPress={handleCloseRoom}
          disabled={roomStatus === 'closed'}
        >
          <Text style={styles.closeButtonText}>
            {roomStatus === 'open' ? 'Chiudi Stanza' : 'Stanza Chiusa'}
          </Text>
        </TouchableOpacity>
      }
    />
  );
}

const styles = StyleSheet.create({
  codeContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  codeLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  code: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 8,
    marginBottom: 8,
  },
  status: { fontSize: 14, fontWeight: '600' },
  statusOpen: { color: 'green' },
  statusClosed: { color: 'red' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  list: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { padding: 20, paddingBottom: 20 },
  playerCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  // Area tappabile per il dettaglio — occupa tutto lo spazio disponibile
  playerCardInfo: {
    flex: 1,
    marginRight: 8,
  },
  playerName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  playerScene: { fontSize: 13, color: '#666' },
  // Bottone ✕ per rimuovere il giocatore dalla stanza
  removeButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  removeButtonText: {
    color: '#cc0000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 15,
  },
  closeButton: {
    backgroundColor: '#cc0000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  closeButtonDisabled: { backgroundColor: '#999' },
  closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  // Header — bottone torna a RoomList
  headerButton: { paddingHorizontal: 14, paddingVertical: 6 },
  headerButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
