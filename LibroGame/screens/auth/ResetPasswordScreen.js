// ResetPasswordScreen.js
// Schermata raggiunta cliccando il link nell'email di recupero password.
// Supabase JS rileva automaticamente il token nell'hash della URL e crea
// una sessione PASSWORD_RECOVERY: in quel momento updateUser({ password })
// è abilitato per impostare la nuova password.
//
// Se l'utente arriva qui senza sessione (es. apertura diretta della URL),
// mostriamo un banner di errore + link al login.

import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { notify } from '../../lib/helpers';
import { resetPasswordStyles as styles } from '../../styles/auth';

export default function ResetPasswordScreen({ navigation }) {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // hasRecoverySession — true se Supabase ha una sessione attiva al mount.
  // Se false, l'utente è arrivato qui senza link valido (o link scaduto).
  const [hasRecoverySession, setHasRecoverySession] = useState(null);

  useEffect(() => {
    // Il client Supabase parserà l'hash della URL (#access_token=...&type=recovery)
    // in modo asincrono al boot. Per evitare la race tra il mount di questa
    // schermata e il completamento del parsing, ci iscriviamo a onAuthStateChange:
    // - se al mount c'è già una sessione (caso navigato da AuthLoading), getSession() la trova
    // - altrimenti l'evento PASSWORD_RECOVERY/SIGNED_IN aggiornerà lo stato quando arriva
    // Dopo un timeout di sicurezza, se ancora nessuna sessione, mostriamo il guard.
    let resolved = false;

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session) {
          resolved = true;
          setHasRecoverySession(true);
        }
      }
    });

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        resolved = true;
        setHasRecoverySession(true);
      }
    };
    checkSession();

    // Timeout di sicurezza: se dopo 2s non c'è ancora una sessione, mostra il guard.
    const timeout = setTimeout(() => {
      if (!resolved) setHasRecoverySession(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
      subscription?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleSubmit = async () => {
    setErrorMsg('');

    // Validazione: lunghezza minima e match
    if (password.length < 6) {
      setErrorMsg('La password deve avere almeno 6 caratteri');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Le password non coincidono');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setErrorMsg(`Errore aggiornamento password: ${error.message}`);
      return;
    }

    // Sign out per evitare ambiguità di stato (la sessione era di tipo
    // "recovery") e mandare l'utente al login pulito.
    await supabase.auth.signOut();
    notify('Password aggiornata', 'Ora puoi accedere con la nuova password.');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  // Stato di caricamento mentre verifichiamo la sessione
  if (hasRecoverySession === null) {
    return (
      <View style={[styles.flex, styles.container]}>
        <Text style={styles.subtitle}>Caricamento...</Text>
      </View>
    );
  }

  // Direct-visit guard: nessuna sessione → link non valido o scaduto
  if (hasRecoverySession === false) {
    return (
      <View style={[styles.flex, styles.container]}>
        <Text style={styles.title}>Link non valido</Text>
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>
            ⚠️ Il link di recupero non è valido o è scaduto.
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}>
          <Text style={styles.link}>Torna al login</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        <Text style={styles.title}>Nuova password</Text>
        <Text style={styles.subtitle}>
          Scegli una nuova password (minimo 6 caratteri).
        </Text>

        {errorMsg ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>⚠️ {errorMsg}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Nuova password"
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
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Aggiornamento...' : 'Aggiorna password'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
