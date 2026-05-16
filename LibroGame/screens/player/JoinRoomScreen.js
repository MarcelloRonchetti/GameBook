// JoinRoomScreen.js
// Schermata del giocatore per unirsi a una stanza tramite codice.
// Stile "Velluto teatrale" allineato a Login/Register.
//
// Gli errori sono mostrati via banner inline (Alert.alert non funziona su web).

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Animated, Easing,
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { resolvePlayerResumeRoute, confirmLogout } from '../../lib/session';
import VelvetBackdrop from '../../components/VelvetBackdrop';
import { joinRoomStyles as styles } from '../../styles/player';

function CtaGlow() {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.85, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4,  duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View pointerEvents="none" style={[styles.ctaGlow, { opacity }]} />;
}

export default function JoinRoomScreen({ navigation }) {

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [focused, setFocused] = useState(false);

  const handleJoinRoom = async () => {
    setErrorMsg('');

    const sanitizedCode = code.trim();

    if (!sanitizedCode) {
      setErrorMsg('Inserisci il codice stanza');
      return;
    }
    if (!/^\d{6}$/.test(sanitizedCode)) {
      setErrorMsg('Il codice deve essere di 6 cifre numeriche');
      return;
    }

    setLoading(true);

    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('id, code, name, status, story_id, auto_hint_minutes')
      .eq('code', sanitizedCode)
      .maybeSingle();

    if (roomError) {
      setLoading(false);
      setErrorMsg(`Errore: ${roomError.message}`);
      return;
    }

    if (!room) {
      setLoading(false);
      setErrorMsg('Stanza non trovata. Controlla il codice.');
      return;
    }

    if (room.status !== 'open') {
      setLoading(false);
      setErrorMsg('Questa stanza è stata chiusa dal GM.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setErrorMsg('Sessione non valida. Effettua di nuovo l\'accesso.');
      return;
    }

    const { data: existing, error: existingError } = await supabase
      .from('room_players')
      .select('player_id')
      .eq('room_id', room.id)
      .eq('player_id', user.id)
      .maybeSingle();

    if (existingError) {
      setLoading(false);
      setErrorMsg(`Errore verifica stanza: ${existingError.message}`);
      return;
    }

    if (!existing) {
      const { error: joinError } = await supabase
        .from('room_players')
        .insert({
          room_id: room.id,
          player_id: user.id,
        });

      if (joinError) {
        setLoading(false);
        setErrorMsg(`Errore ingresso stanza: ${joinError.message}`);
        return;
      }
    }

    const resume = await resolvePlayerResumeRoute(room, user.id);

    setLoading(false);

    navigation.reset({
      index: 0,
      routes: [{ name: resume.screen, params: resume.params }],
    });
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
          <Text style={styles.eyebrow}>Spettacolo in corso</Text>

          <View style={styles.card}>
            <Text style={styles.title}>Entra nella Stanza</Text>
            <Text style={styles.subtitle}>
              Il direttore vi attende — annunciate il codice a 6 cifre
            </Text>

            {errorMsg ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errorMsg}</Text>
              </View>
            ) : null}

            <Text style={styles.fieldLabel}>Codice stanza</Text>
            <TextInput
              style={[styles.input, focused && styles.inputFocused]}
              placeholder="000000"
              placeholderTextColor="rgba(184,162,133,0.35)"
              value={code}
              onChangeText={(text) => {
                setCode(text);
                if (errorMsg) setErrorMsg('');
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              keyboardType="numeric"
              maxLength={6}
              textAlign="center"
            />

            <View style={styles.ctaWrapper}>
              <CtaGlow />
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleJoinRoom}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'In corso…' : 'Entra in scena'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => confirmLogout(navigation)}
            >
              <Text style={styles.logoutText}>Esci dall'account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
