// lib/resetRedirect.js
// Calcola l'URL di redirect per il flusso "password dimenticata" di Supabase.
// Su web: usa l'origin corrente (es. http://localhost:8081/reset-password).
// Su mobile: ritorna un deep link 'librogame://reset-password' come placeholder
// (verrà attivato realmente quando si farà il primo build EAS con scheme registrato).

import { Platform } from 'react-native';

export function getResetRedirect() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.origin}/reset-password`;
  }
  return 'librogame://reset-password';
}
