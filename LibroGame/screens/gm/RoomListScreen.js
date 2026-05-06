// RoomListScreen.js
// Schermata principale del GM dopo il login.
// Mostra tutte le stanze con nome, codice, stato.
// Permette di entrare, riaprire, chiudere ed eliminare le stanze.

import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { confirmLogout, confirm } from '../../lib/session';


export default function RoomListScreen({ navigation }) {

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  // actionLoading — id della stanza su cui si sta eseguendo un'azione

  useLayoutEffect(() => {
    navigation.setOptions({
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
      Alert.alert('Errore', 'Impossibile caricare le stanze');
      return;
    }

    setRooms(data);
  };

  const handleEnterRoom = (room) => {
    navigation.navigate('Dashboard', { room });
  };

  const handleReopenRoom = (room) => {
  confirm(
    'Riapri stanza',
    `Vuoi riaprire "${room.name || room.code}"?`,
    async () => {
      setActionLoading(room.id);
      const { error } = await supabase.from('rooms').update({ status: 'open' }).eq('id', room.id);
      setActionLoading(null);
      if (error) { Alert.alert('Errore', 'Impossibile riaprire la stanza'); return; }
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
      if (error) { Alert.alert('Errore', 'Impossibile chiudere la stanza'); return; }
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
      if (error) { Alert.alert('Errore', 'Impossibile eliminare la stanza'); return; }
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

        {/* Intestazione: nome + badge stato */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardName}>{item.name || '—'}</Text>
          <View style={[styles.badge, isOpen ? styles.badgeOpen : styles.badgeClosed]}>
            <Text style={styles.badgeText}>{isOpen ? '🟢 Aperta' : '🔴 Chiusa'}</Text>
          </View>
        </View>

        {/* Info */}
        <Text style={styles.cardCode}>Codice: {item.code}</Text>
        <Text style={styles.cardInfo}>📖 {item.stories?.title || '—'}</Text>
        <Text style={styles.cardInfo}>⏱ Aiuto automatico: {item.auto_hint_minutes} min</Text>
        <Text style={styles.cardInfo}>🕐 {formatDate(item.created_at)}</Text>

        {/* Azioni principali */}
        <View style={styles.actionsRow}>
          {isOpen ? (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.enterButton, isActing && styles.buttonDisabled]}
                onPress={() => handleEnterRoom(item)}
                disabled={isActing}
              >
                <Text style={styles.actionButtonText}>Entra →</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.closeButton, isActing && styles.buttonDisabled]}
                onPress={() => handleCloseRoom(item)}
                disabled={isActing}
              >
                <Text style={styles.actionButtonText}>Chiudi</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.reopenButton, isActing && styles.buttonDisabled]}
              onPress={() => handleReopenRoom(item)}
              disabled={isActing}
            >
              <Text style={styles.actionButtonText}>
                {isActing ? 'Attendere...' : 'Riapri'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Elimina — sempre visibile */}
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton, isActing && styles.buttonDisabled]}
            onPress={() => handleDeleteRoom(item)}
            disabled={isActing}
          >
            <Text style={styles.actionButtonText}>🗑 Elimina</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Caricamento stanze...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Le mie stanze</Text>

      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        renderItem={renderRoom}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nessuna stanza ancora creata</Text>
            <Text style={styles.emptySubtext}>Crea la tua prima stanza per iniziare!</Text>
          </View>
        }
      />

      {/* Bottone crea nuova stanza — ben visibile */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateRoom')}
      >
        <Text style={styles.createButtonText}>+ Crea nuova stanza</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingBottom: 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: { color: '#666', fontSize: 15 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111',
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardOpen: { borderLeftColor: '#22c55e' },
  cardClosed: { borderLeftColor: '#ef4444' },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    flex: 1,
    marginRight: 8,
  },
  cardCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
    letterSpacing: 2,
  },
  cardInfo: { fontSize: 13, color: '#888', marginBottom: 3 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeOpen: { backgroundColor: '#dcfce7' },
  badgeClosed: { backgroundColor: '#fee2e2' },
  badgeText: { fontSize: 12, fontWeight: '600' },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  enterButton: { backgroundColor: '#111' },
  closeButton: { backgroundColor: '#f97316' },
  reopenButton: { backgroundColor: '#3b82f6' },
  deleteButton: { backgroundColor: '#ef4444' },
  buttonDisabled: { backgroundColor: '#ccc' },
  actionButtonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 8,
  },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#555' },
  emptySubtext: { fontSize: 14, color: '#999' },
  createButton: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#111',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  headerButton: { paddingHorizontal: 14, paddingVertical: 6 },
  headerButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});