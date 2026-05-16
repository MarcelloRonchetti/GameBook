// CreateRoomScreen.js
// Schermata del GM per creare una nuova stanza di gioco.
// Il GM sceglie il nome, la storia e imposta il timer Aiuto Automatico.

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Animated, Easing,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { supabase } from '../../lib/supabase';
import { generateRoomCode } from '../../lib/helpers';
import VelvetBackdrop from '../../components/VelvetBackdrop';
import { createRoomStyles as styles } from '../../styles/gm';
import { colors } from '../../styles/theme';

function CtaGlow() {
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
  return <Animated.View pointerEvents="none" style={[styles.ctaGlow, { opacity }]} />;
}

export default function CreateRoomScreen({ navigation }) {

  const [name, setName] = useState('');
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [autoHintMinutes, setAutoHintMinutes] = useState(3);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const hintOptions = [1, 2, 3, 5, 10];

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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <VelvetBackdrop />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stage}>
          <View style={styles.ornamentTop}>
            <View style={styles.ornamentLine} />
            <View style={styles.ornamentDot} />
            <View style={styles.ornamentLine} />
          </View>
          <Text style={styles.eyebrow}>Inaugurazione</Text>

          <View style={styles.card}>
            <Text style={styles.title}>Apri una nuova stanza</Text>
            <Text style={styles.subtitle}>Prepara la scena per il tuo pubblico</Text>

            <Text style={styles.label}>Nome stanza</Text>
            <TextInput
              style={styles.input}
              placeholder="Es. Classe 3A, Gruppo Sera…"
              placeholderTextColor="rgba(184,162,133,0.45)"
              value={name}
              onChangeText={(t) => { setName(t); setErrorMsg(''); }}
              autoCapitalize="words"
              maxLength={40}
            />

            <Text style={styles.label}>Storia</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.picker}
                dropdownIconColor={colors.velvet.gold}
                itemStyle={{ color: colors.velvet.champagne }}
                selectedValue={selectedStory}
                onValueChange={(value) => setSelectedStory(value)}
              >
                {stories.map((story) => (
                  <Picker.Item
                    key={story.id}
                    label={story.description || story.title}
                    value={story.id}
                    color={Platform.OS === 'android' ? '#1a0c0f' : colors.velvet.champagne}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Aiuto automatico</Text>
            <View style={styles.segmentRow}>
              {hintOptions.map((minutes) => {
                const active = minutes === autoHintMinutes;
                return (
                  <TouchableOpacity
                    key={minutes}
                    style={[styles.segment, active && styles.segmentActive]}
                    onPress={() => setAutoHintMinutes(minutes)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                      {minutes} min
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {errorMsg ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errorMsg}</Text>
              </View>
            ) : null}

            <View style={styles.ctaWrapper}>
              <CtaGlow />
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleCreateRoom}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'In corso…' : 'Crea stanza'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
