// AuthLoadingScreen.js
// Schermata di caricamento mostrata all'avvio dell'app.
// Verifica se c'è una sessione Supabase salvata e in base al ruolo
// reindirizza automaticamente.

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { supabase } from '../../lib/supabase';
import { authLoadingStyles as styles } from '../../styles/auth';
import { colors } from '../../styles/theme';

export default function AuthLoadingScreen({ navigation }) {

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    // getSession() — legge la sessione salvata in AsyncStorage
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      navigation.replace('Login');
      return;
    }

    // Sessione presente — recupera il ruolo per decidere dove andare
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userError || !userData) {
      console.log('Errore lettura profilo:', userError?.message);
      await supabase.auth.signOut();
      navigation.replace('Login');
      return;
    }

    // Reset dello stack — niente "back" possibile verso AuthLoading
    if (userData.role === 'gm') {
      navigation.reset({ index: 0, routes: [{ name: 'RoomList' }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'JoinRoom' }] });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LibroGame</Text>
      <Text style={styles.subtitle}>Il circo delle circostanze</Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      <Text style={styles.loadingText}>Caricamento in corso...</Text>
    </View>
  );
}
