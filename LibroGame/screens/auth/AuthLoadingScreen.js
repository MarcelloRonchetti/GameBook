// AuthLoadingScreen.js
// Schermata di caricamento mostrata all'avvio dell'app.
// Verifica se c'è una sessione Supabase salvata e in base al ruolo
// reindirizza automaticamente.
//
// Caso speciale: se l'utente è atterrato qui via link di recupero password,
// Supabase emette l'evento PASSWORD_RECOVERY → ridirige a ResetPassword
// invece che alla home in base al ruolo.

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { supabase } from '../../lib/supabase';
import { authLoadingStyles as styles } from '../../styles/auth';
import { colors } from '../../styles/theme';

export default function AuthLoadingScreen({ navigation }) {

  useEffect(() => {
    // recoveryFired — guard per evitare che checkSession() concluda dopo
    // l'evento PASSWORD_RECOVERY e ci porti alla home rovinando il flusso.
    let recoveryFired = false;

    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        recoveryFired = true;
        navigation.replace('ResetPassword');
      }
    });

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // Se nel frattempo è scattato PASSWORD_RECOVERY, non ridirigiamo a casa.
      if (recoveryFired) return;

      if (!session) {
        navigation.replace('Login');
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (recoveryFired) return;

      if (userError || !userData) {
        console.log('Errore lettura profilo:', userError?.message);
        await supabase.auth.signOut();
        navigation.replace('Login');
        return;
      }

      if (userData.role === 'gm') {
        navigation.reset({ index: 0, routes: [{ name: 'RoomList' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'JoinRoom' }] });
      }
    };

    checkSession();

    return () => {
      subscription?.subscription?.unsubscribe?.();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LibroGame</Text>
      <Text style={styles.subtitle}>Il circo delle circostanze</Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      <Text style={styles.loadingText}>Caricamento in corso...</Text>
    </View>
  );
}
