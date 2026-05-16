// PlayerDetailScreen.js
// Schermata dettaglio giocatore — visibile solo al GM.
// Mostra la cronologia completa del percorso del giocatore
// (tutte le scene visitate in ordine cronologico con stato risolto/in corso).
// Permette al GM di inviare suggerimenti testuali personalizzati.

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, Animated, Easing,
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { notify } from '../../lib/helpers';
import VelvetBackdrop from '../../components/VelvetBackdrop';
import { playerDetailStyles as styles } from '../../styles/gm';
import { colors } from '../../styles/theme';

function SendGlow() {
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
  return <Animated.View pointerEvents="none" style={[styles.sendButtonGlow, { opacity }]} />;
}

export default function PlayerDetailScreen({ route, navigation }) {
  const { player, roomId } = route.params;

  const [progress, setProgress] = useState([]);
  const [hintText, setHintText] = useState('');
  const [sentHints, setSentHints] = useState([]);
  const [sending, setSending] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.velvet.bgDeeper, shadowOpacity: 0, elevation: 0, borderBottomWidth: 1, borderBottomColor: colors.velvet.goldFaint },
      headerTintColor: colors.velvet.goldSoft,
      headerTitleStyle: {
        color: colors.velvet.champagne,
        letterSpacing: 2,
        fontWeight: '700',
      },
    });
  }, [navigation]);

  useEffect(() => {
    fetchProgress();
    fetchHints();

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
          {formatTimestamp(item.entered_at)}
        </Text>
        <Text style={[
          styles.progressStatus,
          item.solved ? styles.statusSolved : styles.statusPending
        ]}>
          {item.solved ? '◆ Risolto' : '◇ In corso'}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <VelvetBackdrop />
      <FlatList
        data={progress}
        keyExtractor={(item, index) => `${item.scene_id}-${index}`}
        renderItem={renderProgressItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.headerEyebrow}>Dossier dello Spettatore</Text>
              <Text style={styles.playerName}>{player.username}</Text>
              <View style={styles.playerSceneRow}>
                <View style={styles.sceneBadge}>
                  <Text style={styles.sceneBadgeText}>Scena attuale</Text>
                </View>
                <Text style={styles.playerScene}>{player.currentScene}</Text>
              </View>
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Cronologia</Text>
              <Text style={styles.sectionCount}>{progress.length.toString().padStart(2, '0')} scene</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Il giocatore non ha ancora iniziato
          </Text>
        }
        ListFooterComponent={
          <>
            {sentHints.length > 0 && (
              <View style={styles.sentHintsContainer}>
                <Text style={styles.sentHintsTitle}>
                  Suggerimenti inviati ({sentHints.length})
                </Text>
                {sentHints.map((hint, i) => (
                  <Text key={i} style={styles.sentHintText}>
                    {formatTimestamp(hint.created_at)} — {hint.message}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.hintSection}>
              <Text style={styles.hintLabel}>Invia suggerimento</Text>
              <TextInput
                style={styles.hintInput}
                value={hintText}
                onChangeText={setHintText}
                placeholder="Scrivi un suggerimento per il giocatore…"
                placeholderTextColor="rgba(184,162,133,0.45)"
                multiline
                numberOfLines={2}
              />
              <View style={styles.sendButtonWrapper}>
                <SendGlow />
                <TouchableOpacity
                  style={[styles.sendButton, (!hintText.trim() || sending) && styles.buttonDisabled]}
                  onPress={handleSendHint}
                  disabled={!hintText.trim() || sending}
                  activeOpacity={0.85}
                >
                  <Text style={styles.sendButtonText}>
                    {sending ? 'Invio…' : 'Invia suggerimento'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
      />
    </KeyboardAvoidingView>
  );
}
