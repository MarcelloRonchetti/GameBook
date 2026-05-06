// SceneScreen.js
// Schermata della scena — mostra il testo narrativo dell'NPC visitato.
// Include un placeholder grafico (riquadro colorato con emoji + nome NPC)
// che funge da segnaposto per la grafica finale di ogni circo-stanza.
//
// Quando il giocatore entra nella scena, viene registrato il progresso
// su Supabase. Se rientra in una scena già visitata, aggiorna entered_at
// per ri-avviare il timer dell'aiuto automatico.

import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { useRoomClosedListener, useDisableAndroidBack } from '../../lib/useRoomClosedListener';
import { sceneStyles as styles } from '../../styles/player';
import { getNpcTheme } from '../../styles/theme';

import scenes from '../../story/storia_1/scenes.json';

export default function SceneScreen({ route, navigation }) {
  const { room, sceneId } = route.params;
  const scene = scenes[sceneId];

  // Tema NPC: colore + emoji per il placeholder
  const npc = getNpcTheme(sceneId);

  useRoomClosedListener(room, navigation);
  useDisableAndroidBack();

  const [progressSaved, setProgressSaved] = useState(false);

  useEffect(() => {
    if (!progressSaved) {
      saveProgress();
    }
  }, []);

  const saveProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: existing } = await supabase
      .from('progress')
      .select('id, solved')
      .eq('room_id', room.id)
      .eq('player_id', user.id)
      .eq('scene_id', sceneId)
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase.from('progress').insert({
        room_id: room.id,
        player_id: user.id,
        scene_id: sceneId,
        solved: false,
        entered_at: new Date().toISOString(),
      });
      if (error) console.log('Errore salvataggio progresso scena:', JSON.stringify(error));
    } else {
      // Aggiorna entered_at per ri-avviare il timer aiuto automatico
      const { error } = await supabase
        .from('progress')
        .update({ entered_at: new Date().toISOString() })
        .eq('id', existing.id);
      if (error) console.log('Errore aggiornamento entered_at:', JSON.stringify(error));
    }

    setProgressSaved(true);
  };

  const handleProceed = () => {
    navigation.navigate('Anagram', { room, sceneId });
  };

  useEffect(() => {
    navigation.setOptions({ title: scene.title || 'Circo-stanza' });
  }, [sceneId]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      {/* PLACEHOLDER GRAFICO NPC
          Riquadro colorato in cima alla scena con il colore tematico,
          l'emoji e il nome dell'NPC. È un segnaposto per la grafica finale:
          quando avremo le immagini basterà sostituire il <Text emoji>
          con un <Image source={...} />. */}
      <View style={[styles.npcPlaceholder, { backgroundColor: npc.color }]}>
        <View style={styles.npcPlaceholderInner}>
          <Text style={styles.npcEmoji}>{npc.emoji}</Text>
          <Text style={styles.npcLabel}>{npc.label}</Text>
        </View>
        <Text style={styles.npcPlaceholderHint}>placeholder grafico</Text>
      </View>

      <Text style={styles.title}>{scene.title}</Text>

      <Text style={styles.storyText}>{scene.text}</Text>

      <View style={styles.divider} />

      <Text style={styles.hintText}>
        Per proseguire, dovrai risolvere l'anagramma di questa circo-stanza.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleProceed}>
        <Text style={styles.buttonText}>Affronta l'anagramma →</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}
