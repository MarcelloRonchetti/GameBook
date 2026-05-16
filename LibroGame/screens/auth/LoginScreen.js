// LoginScreen.js
// Schermata di login per tutti gli utenti (GM e giocatori).
// Usa Supabase Auth per autenticare l'utente tramite email e password.
// Dopo il login, in base al ruolo (gm o player), l'utente viene
// reindirizzato alla schermata corretta.

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Animated, Easing,
} from 'react-native';

import { supabase } from '../../lib/supabase';
import VelvetBackdrop from '../../components/VelvetBackdrop';
import { loginStyles as styles } from '../../styles/auth';

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

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [focused, setFocused] = useState(null);

  const handleLogin = async () => {
    setErrorMsg('');

    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPassword = password.trim();

    if (!sanitizedEmail || !sanitizedPassword) {
      setErrorMsg('Inserisci email e password');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      setErrorMsg('Inserisci un indirizzo email valido');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password: sanitizedPassword,
    });

    if (error) {
      setLoading(false);
      setErrorMsg(`Errore login: ${error.message}`);
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    setLoading(false);

    if (userError) {
      setErrorMsg('Impossibile recuperare il profilo utente');
      return;
    }

    if (userData.role === 'gm') {
      navigation.reset({ index: 0, routes: [{ name: 'RoomList' }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'JoinRoom' }] });
    }
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
          <Text style={styles.eyebrow}>Gran Soirée</Text>

          <View style={styles.card}>
            <Text style={styles.title}>Il Circo delle Circostanze</Text>
            <Text style={styles.subtitle}>Accedi al tuo posto in platea</Text>

            {errorMsg ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errorMsg}</Text>
              </View>
            ) : null}

            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={[styles.input, focused === 'email' && styles.inputFocused]}
                placeholder="nome@dominio.it"
                placeholderTextColor="rgba(184,162,133,0.45)"
                value={email}
                onChangeText={(t) => { setEmail(t); setErrorMsg(''); }}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Password</Text>
              <TextInput
                style={[styles.input, focused === 'password' && styles.inputFocused]}
                placeholder="••••••••"
                placeholderTextColor="rgba(184,162,133,0.45)"
                value={password}
                onChangeText={(t) => { setPassword(t); setErrorMsg(''); }}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                secureTextEntry
              />
            </View>

            <View style={styles.ctaWrapper}>
              <CtaGlow />
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'In corso…' : 'Accedi'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.linkRow}>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.link}>Password dimenticata?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkMuted}>
                  Non hai un biglietto? <Text style={styles.link}>Registrati</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
