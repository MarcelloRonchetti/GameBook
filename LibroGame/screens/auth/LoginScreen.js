// LoginScreen.js
// Schermata di login per tutti gli utenti (GM e giocatori).
// Usa Supabase Auth per autenticare l'utente tramite email e password.
// Dopo il login, in base al ruolo (gm o player), l'utente viene
// reindirizzato alla schermata corretta.

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { notify } from '../../lib/helpers';
import { loginStyles as styles } from '../../styles/auth';

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // errorMsg — banner di errore inline (cross-platform, sempre visibile)
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg(''); // reset banner

    // Sanitizzazione input
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPassword = password.trim();

    // Validazione base
    if (!sanitizedEmail || !sanitizedPassword) {
      setErrorMsg('Inserisci email e password');
      return;
    }

    // Validazione formato email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      setErrorMsg('Inserisci un indirizzo email valido');
      return;
    }

    setLoading(true);

    // Chiamata a Supabase per autenticare l'utente
    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password: sanitizedPassword,
    });

    if (error) {
      setLoading(false);
      setErrorMsg(`Errore login: ${error.message}`);
      return;
    }

    // Recupera il ruolo dell'utente dalla tabella users
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

    // Reindirizza in base al ruolo — reset dello stack
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
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>LibroGame</Text>

        {/* Banner errore inline — visibile sia su web che su mobile */}
        {errorMsg ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>⚠️ {errorMsg}</Text>
          </View>
        ) : null}

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
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={(t) => { setPassword(t); setErrorMsg(''); }}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={{ marginBottom: 12 }}
        >
          <Text style={styles.link}>Password dimenticata?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Non hai un account? Registrati</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
