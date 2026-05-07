// ForgotPasswordScreen.js
// Schermata "Password dimenticata?" — l'utente inserisce la propria email
// e Supabase (via Brevo SMTP) invia un link di recupero.
// In caso di successo mostra un pannello di conferma invece del form.

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { getResetRedirect } from '../../lib/resetRedirect';
import { forgotPasswordStyles as styles } from '../../styles/auth';

export default function ForgotPasswordScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // sent — quando true, mostra il pannello di conferma invece del form
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    setErrorMsg('');

    // Sanitizzazione + validazione formato
    const sanitizedEmail = email.trim().toLowerCase();
    if (!sanitizedEmail) {
      setErrorMsg('Inserisci la tua email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      setErrorMsg('Inserisci un indirizzo email valido');
      return;
    }

    setLoading(true);

    // Supabase invia il link di recupero. Per evitare user-enumeration
    // mostriamo successo anche se l'email non è registrata: Supabase
    // restituisce comunque success in quel caso, quindi nessun ramo speciale.
    const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
      redirectTo: getResetRedirect(),
    });

    setLoading(false);

    if (error) {
      setErrorMsg(`Errore invio email: ${error.message}`);
      return;
    }

    setSent(true);
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
        <Text style={styles.title}>Password dimenticata</Text>

        {sent ? (
          // Pannello di conferma — sostituisce il form dopo l'invio
          <>
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>
                ✉️ Controlla la tua email. Il link di recupero è valido per 1 ora.
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Torna al login</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>
              Inserisci la tua email: ti invieremo un link per impostare una nuova password.
            </Text>

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

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Invio in corso...' : 'Invia link di recupero'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Torna al login</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
