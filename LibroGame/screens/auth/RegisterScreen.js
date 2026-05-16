// RegisterScreen.js
// Schermata di registrazione per i giocatori.
// Il GM non può registrarsi da qui — il suo account
// viene creato manualmente su Supabase.
// Campi richiesti: username, email, password, conferma password.

import React, { useState, useRef, useEffect } from 'react';
import {
  Text, TextInput, TouchableOpacity, View, ScrollView,
  KeyboardAvoidingView, Platform, Animated, Easing,
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { notify } from '../../lib/helpers';
import VelvetBackdrop from '../../components/VelvetBackdrop';
import { registerStyles as styles } from '../../styles/auth';

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

export default function RegisterScreen({ navigation }) {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [focused, setFocused] = useState(null);

  const handleRegister = async () => {
    setErrorMsg('');

    const sanitizedUsername = username.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPassword = password.trim();
    const sanitizedConfirmPassword = confirmPassword.trim();

    if (!sanitizedUsername || !sanitizedEmail || !sanitizedPassword || !sanitizedConfirmPassword) {
      setErrorMsg('Compila tutti i campi');
      return;
    }
    if (sanitizedUsername.length < 3) {
      setErrorMsg('Lo username deve avere almeno 3 caratteri');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      setErrorMsg('Inserisci un indirizzo email valido');
      return;
    }
    if (sanitizedPassword.length < 6) {
      setErrorMsg('La password deve avere almeno 6 caratteri');
      return;
    }
    if (sanitizedPassword !== sanitizedConfirmPassword) {
      setErrorMsg('Le password non coincidono');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password: sanitizedPassword,
    });

    if (error) {
      setLoading(false);
      setErrorMsg(`Errore registrazione: ${error.message}`);
      return;
    }

    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: sanitizedEmail,
        username: sanitizedUsername,
        role: 'player',
      });

    setLoading(false);

    if (profileError) {
      setErrorMsg(`Errore creazione profilo: ${profileError.message}`);
      return;
    }

    notify('Registrazione completata', 'Ora puoi accedere con la tua email e password.');
    navigation.navigate('Login');
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
          <Text style={styles.eyebrow}>Nuovo Spettatore</Text>

          <View style={styles.card}>
            <Text style={styles.title}>Unisciti al pubblico</Text>
            <Text style={styles.subtitle}>Il sipario si alzerà solo per chi ha un biglietto</Text>

            {errorMsg ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errorMsg}</Text>
              </View>
            ) : null}

            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Username</Text>
              <TextInput
                style={[styles.input, focused === 'username' && styles.inputFocused]}
                placeholder="il tuo nome d'arte"
                placeholderTextColor="rgba(184,162,133,0.45)"
                value={username}
                onChangeText={(t) => { setUsername(t); setErrorMsg(''); }}
                onFocus={() => setFocused('username')}
                onBlur={() => setFocused(null)}
                autoCapitalize="none"
              />
            </View>

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
                placeholder="minimo 6 caratteri"
                placeholderTextColor="rgba(184,162,133,0.45)"
                value={password}
                onChangeText={(t) => { setPassword(t); setErrorMsg(''); }}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                secureTextEntry
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Conferma Password</Text>
              <TextInput
                style={[styles.input, focused === 'confirm' && styles.inputFocused]}
                placeholder="ripeti la password"
                placeholderTextColor="rgba(184,162,133,0.45)"
                value={confirmPassword}
                onChangeText={(t) => { setConfirmPassword(t); setErrorMsg(''); }}
                onFocus={() => setFocused('confirm')}
                onBlur={() => setFocused(null)}
                secureTextEntry
              />
            </View>

            <View style={styles.ctaWrapper}>
              <CtaGlow />
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'In corso…' : 'Registrati'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Torna al login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
