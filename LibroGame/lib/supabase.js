// supabase.js
// Inizializza e esporta il client Supabase.
// AsyncStorage permette di mantenere la sessione attiva
// anche dopo un refresh della pagina.

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
// AsyncStorage — salva la sessione localmente sul dispositivo

const supabaseUrl = 'https://rrleoynnbjesnpquqlmx.supabase.co';
const supabaseAnonKey = 'sb_publishable_Wt4mMJ3shcgEv6eLD7n-HA_NN7MqaRD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Usa AsyncStorage per salvare la sessione
    storage: AsyncStorage,
    // Rinnova automaticamente il token di sessione
    autoRefreshToken: true,
    // Mantieni la sessione attiva tra i refresh
    persistSession: true,
    // Non rileva la sessione dall'URL (non necessario per mobile)
    detectSessionInUrl: false,
  },
});