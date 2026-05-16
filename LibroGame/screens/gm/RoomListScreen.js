// RoomListScreen.js
// Schermata principale del GM dopo il login.
// Mostra tutte le stanze con nome, codice, stato.
// Permette di entrare, riaprire, chiudere ed eliminare le stanze.

import React, { useState, useCallback, useLayoutEffect, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, Animated, Easing,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { confirmLogout, confirm } from '../../lib/session';
import { notify } from '../../lib/helpers';
import VelvetBackdrop from '../../components/VelvetBackdrop';
import { roomListStyles as styles } from '../../styles/gm';
import { colors } from '../../styles/theme';

function FabGlow() {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.85, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View pointerEvents="none" style={[styles.fabGlow, { opacity }]} />;
}

export default function RoomListScreen({ navigation }) {

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

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
          onPress={() => confirmLogout(navigation)}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>Esci</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, [])
  );

  const fetchRooms = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('rooms')
      .select('id, name, code, status, auto_hint_minutes, created_at, stories (title)')
      .eq('gm_id', user.id)
      .order('created_at', { ascending: false });

    setLoading(false);

    if (error) {
      notify('Errore', 'Impossibile caricare le stanze');
      return;
    }

    setRooms(data);
  };

  const handleEnterRoom = (room) => {
    navigation.push('Dashboard', { room });
  };

  const handleReopenRoom = (room) => {
    confirm(
      'Riapri stanza',
      `Vuoi riaprire "${room.name || room.code}"?`,
      async () => {
        setActionLoading(room.id);
        const { error } = await supabase.from('rooms').update({ status: 'open' }).eq('id', room.id);
        setActionLoading(null);
        if (error) { notify('Errore', 'Impossibile riaprire la stanza'); return; }
        const updatedRoom = { ...room, status: 'open' };
        setRooms(prev => prev.map(r => r.id === room.id ? updatedRoom : r));
        navigation.navigate('Dashboard', { room: updatedRoom });
      }
    );
  };

  const handleCloseRoom = (room) => {
    confirm(
      'Chiudi stanza',
      `Vuoi chiudere "${room.name || room.code}"? I giocatori non potranno più accedere.`,
      async () => {
        setActionLoading(room.id);
        const { error } = await supabase.from('rooms').update({ status: 'closed' }).eq('id', room.id);
        setActionLoading(null);
        if (error) { notify('Errore', 'Impossibile chiudere la stanza'); return; }
        setRooms(prev => prev.map(r => r.id === room.id ? { ...r, status: 'closed' } : r));
      },
      true
    );
  };

  const handleDeleteRoom = (room) => {
    confirm(
      'Elimina stanza',
      `Sei sicuro di voler eliminare "${room.name || room.code}"? Questa azione è irreversibile.`,
      async () => {
        setActionLoading(room.id);
        await supabase.from('progress').delete().eq('room_id', room.id);
        await supabase.from('hints').delete().eq('room_id', room.id);
        await supabase.from('room_players').delete().eq('room_id', room.id);
        const { error } = await supabase.from('rooms').delete().eq('id', room.id);
        setActionLoading(null);
        if (error) { notify('Errore', 'Impossibile eliminare la stanza'); return; }
        setRooms(prev => prev.filter(r => r.id !== room.id));
      },
      true
    );
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('it-IT', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const renderRoom = ({ item }) => {
    const isOpen = item.status === 'open';
    const isActing = actionLoading === item.id;

    return (
      <View style={[styles.card, isOpen ? styles.cardOpen : styles.cardClosed]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardName}>{item.name || '—'}</Text>
          <View style={styles.brassPlate}>
            <Text style={styles.brassPlateText}>{item.code}</Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, isOpen ? styles.statusDotOpen : styles.statusDotClosed]} />
          <Text style={styles.statusText}>{isOpen ? 'Aperta' : 'Chiusa'}</Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>◈</Text>
            <Text style={styles.infoText}>{item.stories?.title || '—'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>◷</Text>
            <Text style={styles.infoText}>Aiuto auto: {item.auto_hint_minutes} min</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>◌</Text>
            <Text style={styles.infoText}>{formatDate(item.created_at)}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {isOpen ? (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.enterButton, isActing && styles.buttonDisabled]}
                onPress={() => handleEnterRoom(item)}
                disabled={isActing}
                activeOpacity={0.85}
              >
                <Text style={styles.enterButtonText}>Entra →</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.ghostButton, isActing && styles.buttonDisabled]}
                onPress={() => handleCloseRoom(item)}
                disabled={isActing}
                activeOpacity={0.7}
              >
                <Text style={styles.ghostButtonText}>Chiudi</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.ghostButton, isActing && styles.buttonDisabled]}
              onPress={() => handleReopenRoom(item)}
              disabled={isActing}
              activeOpacity={0.7}
            >
              <Text style={styles.ghostButtonText}>
                {isActing ? 'Attendere…' : 'Riapri'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerGhost, isActing && styles.buttonDisabled]}
            onPress={() => handleDeleteRoom(item)}
            disabled={isActing}
            activeOpacity={0.7}
          >
            <Text style={styles.dangerGhostText}>Elimina</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <VelvetBackdrop />
        <ActivityIndicator size="large" color={colors.velvet.gold} />
        <Text style={styles.loadingText}>Apertura del foyer…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <VelvetBackdrop />
      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        renderItem={renderRoom}
        style={styles.listFrame}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.eyebrow}>Quartier Generale</Text>
            <Text style={styles.title}>Le mie stanze</Text>
            <View style={styles.titleRule} />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyOrnament}>✦</Text>
            <Text style={styles.emptyText}>Il sipario non si è ancora alzato</Text>
            <Text style={styles.emptySubtext}>Crea la tua prima stanza per dare inizio allo spettacolo</Text>
          </View>
        }
        ListFooterComponent={
          <View style={{ marginTop: 24, alignItems: 'center' }}>
            <View style={{ position: 'relative' }}>
              <FabGlow />
              <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateRoom')}
                activeOpacity={0.85}
              >
                <Text style={styles.fabText}>+ Nuova stanza</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </View>
  );
}
