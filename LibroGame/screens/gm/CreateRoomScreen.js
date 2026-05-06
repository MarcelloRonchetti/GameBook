// CreateRoomScreen.js
// Schermata del GM per creare una nuova stanza di gioco.
// Il GM sceglie il nome, la storia e imposta il timer Aiuto Automatico.

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { supabase } from '../../lib/supabase';
import { generateRoomCode } from '../../lib/helpers';
import { createRoomStyles as styles } from '../../styles/gm';

export default function CreateRoomScreen({ navigation }) {

  const [name, setName] = useState('');
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [autoHintMinutes, setAutoHintMinutes] = useState(3);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const hintOptions = [1, 2, 3, 5, 10];

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from('stories')
      .select('id, title, description');

    if (error) {
      setErrorMsg('Impossibile caricare le storie');
      return;
    }

    setStories(data);
    if (data.length > 0) setSelectedStory(data[0].id);
  };

  const handleCreateRoom = async () => {
    setErrorMsg('');

    const sanitizedName = name.trim();

    if (!sanitizedName) {
      setErrorMsg('Inserisci un nome per la stanza');
      return;
    }
    if (!selectedStory) {
      setErrorMsg('Seleziona una storia');
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    // Genera codice univoco — riprova se esiste già
    let code;
    let codeExists = true;
    while (codeExists) {
      code = generateRoomCode();
      const { data: existingRoom } = await supabase
        .from('rooms')
        .select('id')
        .eq('code', code)
        .maybeSingle();
      codeExists = !!existingRoom;
    }

    const { data, error } = await supabase
      .from('rooms')
      .insert({
        name: sanitizedName,
        code,
        gm_id: user.id,
        story_id: selectedStory,
        auto_hint_minutes: autoHintMinutes,
        status: 'open',
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      setErrorMsg(`Impossibile creare la stanza: ${error.message}`);
      return;
    }

    navigation.replace('Dashboard', { room: data });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crea Stanza</Text>

      <Text style={styles.label}>Nome stanza</Text>
      <TextInput
        style={styles.input}
        placeholder="Es. Classe 3A, Gruppo Sera..."
        value={name}
        onChangeText={(t) => { setName(t); setErrorMsg(''); }}
        autoCapitalize="words"
        maxLength={40}
      />

      <Text style={styles.label}>Storia</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedStory}
          onValueChange={(value) => setSelectedStory(value)}
        >
          {stories.map((story) => (
            <Picker.Item
              key={story.id}
              label={story.description || story.title}
              value={story.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Aiuto Automatico (minuti)</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={autoHintMinutes}
          onValueChange={(value) => setAutoHintMinutes(value)}
        >
          {hintOptions.map((minutes) => (
            <Picker.Item
              key={minutes}
              label={`${minutes} minut${minutes === 1 ? 'o' : 'i'}`}
              value={minutes}
            />
          ))}
        </Picker>
      </View>

      {errorMsg ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>⚠️ {errorMsg}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleCreateRoom}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creazione in corso...' : 'Crea Stanza'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
