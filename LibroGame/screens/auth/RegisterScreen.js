// RegisterScreen.js
// Schermata di registrazione per i giocatori.
// Il GM non può registrarsi da qui — il suo account
// viene creato manualmente su Supabase.
// Campi richiesti: username, email, password, conferma password.

import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';

import { supabase } from '../../lib/supabase';
import { notify } from '../../lib/helpers';
import { registerStyles as styles } from '../../styles/auth';

export default function RegisterScreen({ navigation }) {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    setErrorMsg('');

    // Sanitizzazione input
    const sanitizedUsername = username.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPassword = password.trim();
    const sanitizedConfirmPassword = confirmPassword.trim();

    // Validazioni
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

    // Step 1 — Crea account su Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password: sanitizedPassword,
    });

    if (error) {
      setLoading(false);
      setErrorMsg(`Errore registrazione: ${error.message}`);
      return;
    }

    // Step 2 — Salva il profilo nella tabella users con role = player
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crea il tuo account</Text>

      {errorMsg ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>⚠️ {errorMsg}</Text>
        </View>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#666"
        value={username}
        onChangeText={(t) => { setUsername(t); setErrorMsg(''); }}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={(t) => { setEmail(t); setErrorMsg(''); }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password (min 6 caratteri)"
        placeholderTextColor="#666"
        value={password}
        onChangeText={(t) => { setPassword(t); setErrorMsg(''); }}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Conferma password"
        placeholderTextColor="#666"
        value={confirmPassword}
        onChangeText={(t) => { setConfirmPassword(t); setErrorMsg(''); }}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Registrazione...' : 'Registrati'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Hai già un account? Accedi</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
