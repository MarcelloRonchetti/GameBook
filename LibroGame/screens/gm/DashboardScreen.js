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
  View, Text, FlatList, TouchableOpacity, Animated, Easing,
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { confirm } from '../../lib/session';
import { notify } from '../../lib/helpers';
import VelvetBackdrop from '../../components/VelvetBackdrop';
import { dashboardStyles as styles } from '../../styles/gm';
import { colors } from '../../styles/theme';

function PulsingDot() {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={[styles.emptyDot, { opacity }]} />;
}

export default function DashboardScreen({ route, navigation }) {
  const { room } = route.params;

  const [players, setPlayers] = useState([]);
  const [roomStatus, setRoomStatus] = useState(room.status);

  const fetchPlayersRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.velvet.bgDeeper, shadowOpacity: 0, elevation: 0, borderBottomWidth: 1, borderBottomColor: colors.velvet.goldFaint },
      headerTintColor: colors.velvet.goldSoft,
      headerTitleStyle: {
        color: colors.velvet.champagne,
        letterSpacing: 2,
        fontWeight: '700',
      },
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
    fetchPlayers();

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

  const fetchPlayers = useCallback(async () => {
    const { data: roomPlayers, error: rpError } = await supabase
      .from('room_players')
      .select('player_id, users (username)')
      .eq('room_id', room.id);

    if (rpError) {
      notify('Errore', 'Impossibile caricare i giocatori');
      return;
    }

    const { data: progressData } = await supabase
      .from('progress')
      .select('player_id, scene_id, solved, entered_at')
      .eq('room_id', room.id);

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

  fetchPlayersRef.current = fetchPlayers;

  const handleCloseRoom = () => {
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
      true
    );
  };

  const handleRemovePlayer = (player) => {
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

        setPlayers(prev => prev.filter(p => p.id !== player.id));
      },
      true
    );
  };

  const renderPlayer = ({ item }) => (
    <View style={styles.playerCard}>
      <TouchableOpacity
        style={styles.playerCardInfo}
        onPress={() => navigation.navigate('PlayerDetail', {
          player: item,
          roomId: room.id
        })}
        activeOpacity={0.75}
      >
        <Text style={styles.playerName}>{item.username}</Text>
        <View style={styles.playerSceneRow}>
          <View style={styles.scenePill}>
            <Text style={styles.scenePillText}>{item.currentScene}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemovePlayer(item)}
        activeOpacity={0.75}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <VelvetBackdrop />
      <FlatList
        data={players}
        keyExtractor={item => item.id}
        renderItem={renderPlayer}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <PulsingDot />
            <Text style={styles.emptyText}>In attesa che il pubblico prenda posto…</Text>
          </View>
        }
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <Text style={styles.heroEyebrow}>Codice della Stanza</Text>
              <View style={styles.brassPlateBig}>
                <Text style={styles.brassPlateBigText}>{room.code}</Text>
              </View>
              <View style={styles.heroStatusRow}>
                <View style={[
                  styles.heroStatusDot,
                  roomStatus === 'open' ? styles.heroStatusDotOpen : styles.heroStatusDotClosed,
                ]} />
                <Text style={styles.heroStatusText}>
                  {roomStatus === 'open' ? 'Aperta — pronta ad accogliere' : 'Chiusa — sipario calato'}
                </Text>
              </View>
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Pubblico in sala</Text>
              <Text style={styles.sectionCount}>{players.length.toString().padStart(2, '0')}</Text>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={styles.closeButtonWrapper}>
            <TouchableOpacity
              style={[
                styles.closeButton,
                roomStatus === 'closed' && styles.closeButtonDisabled,
              ]}
              onPress={handleCloseRoom}
              disabled={roomStatus === 'closed'}
              activeOpacity={0.75}
            >
              <Text style={styles.closeButtonText}>
                {roomStatus === 'open' ? 'Chiudi stanza' : 'Stanza chiusa'}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
