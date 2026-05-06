// JoinRoomScreen.js
// Schermata del giocatore per unirsi a una stanza tramite codice.
//
// 🔧 FIX BUG (premuto Entra ma non succede nulla):
//    Il vecchio codice usava `Alert.alert` che NON funziona sul web di Expo,
//    quindi tutti gli errori (codice invalido, stanza non trovata, ecc.)
//    erano invisibili e il tasto sembrava "morto".
//    Soluzione: banner di errore inline + notify() cross-platform per i
//    casi in cui serve un popup (es. registrazione completata).

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { resolvePlayerResumeRoute, confirmLogout } from '../../lib/session';
import { joinRoomStyles as styles } from '../../styles/player';

export default function JoinRoomScreen({ navigation }) {

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  // errorMsg — banner errore inline (cross-platform: visibile sia su web che mobile)
  const [errorMsg, setErrorMsg] = useState('');

  const handleJoinRoom = async () => {
    // Reset banner
    setErrorMsg('');

    // Sanitizzazione
    const sanitizedCode = code.trim();

    // Validazioni
    if (!sanitizedCode) {
      setErrorMsg('Inserisci il codice stanza');
      return;
    }
    if (!/^\d{6}$/.test(sanitizedCode)) {
      setErrorMsg('Il codice deve essere di 6 cifre numeriche');
      return;
    }

    setLoading(true);

    // Cerca la stanza con quel codice
    // ⚠️ Non usiamo .single() perché se non trova nulla genera errore;
    //    .maybeSingle() ritorna null senza esplodere e ci permette di
    //    mostrare un messaggio user-friendly.
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

    // Verifica che la stanza sia aperta
    if (room.status !== 'open') {
      setLoading(false);
      setErrorMsg('Questa stanza è stata chiusa dal GM.');
      return;
    }

    // Recupera l'utente loggato
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setErrorMsg('Sessione non valida. Effettua di nuovo l\'accesso.');
      return;
    }

    // Controlla se il giocatore è già nella stanza (es. riapre il browser)
    // ⚠️ Il vecchio codice usava upsert, che fallisce con RLS perché la policy
    //    copre solo INSERT ma non l'UPDATE/SELECT implicito dell'upsert.
    //    Soluzione: verifichiamo prima se la riga esiste già, e se sì saltiamo
    //    l'insert. Il giocatore viene semplicemente riportato alla scena giusta.
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

    // Se il giocatore NON è ancora nella stanza, lo aggiungiamo
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

    // RIPRESA: decidi dove mandare il giocatore
    // - Se ha già progressi -> ultima scena visitata
    // - Altrimenti -> Intro
    const resume = await resolvePlayerResumeRoute(room, user.id);

    setLoading(false);

    // navigation.reset così JoinRoom non resta nello stack
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
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Entra nella Stanza</Text>
        <Text style={styles.subtitle}>
          Inserisci il codice a 6 cifre fornito dal GM
        </Text>

        {/* Banner errore inline — funziona ovunque, niente Alert silenti */}
        {errorMsg ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>⚠️ {errorMsg}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="000000"
          placeholderTextColor="#555"
          value={code}
          onChangeText={(text) => {
            setCode(text);
            if (errorMsg) setErrorMsg('');
          }}
          keyboardType="numeric"
          maxLength={6}
          textAlign="center"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleJoinRoom}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Connessione...' : 'Entra'}
          </Text>
        </TouchableOpacity>

        {/* Bottone logout discreto in basso */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => confirmLogout(navigation)}
        >
          <Text style={styles.logoutText}>Esci dall'account</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
