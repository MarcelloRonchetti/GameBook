// PlayerDetailScreen.js
// Schermata dettaglio giocatore — visibile solo al GM.
// Mostra la cronologia completa del percorso del giocatore
// (tutte le scene visitate in ordine cronologico con stato risolto/in corso).
// Permette al GM di inviare suggerimenti testuali personalizzati.

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { notify } from '../../lib/helpers';
import { playerDetailStyles as styles } from '../../styles/gm';

export default function PlayerDetailScreen({ route }) {
  const { player, roomId } = route.params;

  const [progress, setProgress] = useState([]);
  const [hintText, setHintText] = useState('');
  const [sentHints, setSentHints] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchProgress();
    fetchHints();

    // Realtime su progress
    const subscription = supabase
      .channel('player_progress')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'progress',
        filter: `player_id=eq.${player.id}`
      }, () => fetchProgress())
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const fetchProgress = async () => {
    const { data, error } = await supabase
      .from('progress')
      .select('scene_id, solved, entered_at, timestamp')
      .eq('room_id', roomId)
      .eq('player_id', player.id)
      .order('entered_at', { ascending: true });

    if (error) {
      console.log('Errore caricamento progressi:', JSON.stringify(error));
      return;
    }
    setProgress(data || []);
  };

  const fetchHints = async () => {
    const { data, error } = await supabase
      .from('hints')
      .select('message, created_at')
      .eq('room_id', roomId)
      .eq('player_id', player.id)
      .order('created_at', { ascending: true });

    if (!error && data) setSentHints(data);
  };

  const handleSendHint = async () => {
    const sanitizedHint = hintText.trim();

    if (!sanitizedHint) {
      notify('Errore', 'Scrivi un suggerimento prima di inviare');
      return;
    }

    setSending(true);

    const { error } = await supabase
      .from('hints')
      .insert({
        room_id: roomId,
        player_id: player.id,
        message: sanitizedHint,
      });

    setSending(false);

    if (error) {
      notify('Errore', 'Impossibile inviare il suggerimento');
      return;
    }

    setHintText('');
    fetchHints();
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderProgressItem = ({ item, index }) => (
    <View style={styles.progressItem}>
      <View style={styles.timelineColumn}>
        <View style={[
          styles.timelineDot,
          item.solved ? styles.dotSolved : styles.dotPending
        ]} />
        {index < progress.length - 1 && <View style={styles.timelineLine} />}
      </View>

      <View style={styles.progressContent}>
        <Text style={styles.progressScene}>
          {item.scene_id.charAt(0).toUpperCase() + item.scene_id.slice(1)}
        </Text>
        <Text style={styles.progressTime}>
          ⏰ {formatTimestamp(item.entered_at)}
        </Text>
        <Text style={[
          styles.progressStatus,
          item.solved ? styles.statusSolved : styles.statusPending
        ]}>
          {item.solved ? '✅ Risolto' : '🔄 In corso'}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.playerName}>{player.username}</Text>
          <Text style={styles.playerScene}>
            📍 Scena attuale: {player.currentScene}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          📋 Cronologia ({progress.length} scene)
        </Text>

        <FlatList
          data={progress}
          keyExtractor={(item, index) => `${item.scene_id}-${index}`}
          renderItem={renderProgressItem}
          style={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Il giocatore non ha ancora iniziato
            </Text>
          }
        />

        {sentHints.length > 0 && (
          <View style={styles.sentHintsContainer}>
            <Text style={styles.sentHintsTitle}>
              💡 Suggerimenti inviati ({sentHints.length})
            </Text>
            {sentHints.map((hint, i) => (
              <Text key={i} style={styles.sentHintText}>
                {formatTimestamp(hint.created_at)}: {hint.message}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.hintSection}>
          <Text style={styles.hintLabel}>✏️ Invia suggerimento</Text>
          <TextInput
            style={styles.hintInput}
            value={hintText}
            onChangeText={setHintText}
            placeholder="Scrivi un suggerimento per il giocatore..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={2}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!hintText.trim() || sending) && styles.buttonDisabled]}
            onPress={handleSendHint}
            disabled={!hintText.trim() || sending}
          >
            <Text style={styles.sendButtonText}>
              {sending ? 'Invio...' : 'Invia suggerimento'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
