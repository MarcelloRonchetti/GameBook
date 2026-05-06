// components/GmHint.js
// Banner che mostra i suggerimenti testuali inviati dal GM al giocatore
// durante la risoluzione di un anagramma.

import React from 'react';
import { View, Text } from 'react-native';
import { gmHintStyles as styles } from '../styles/components';

export default function GmHint({ hints }) {
  // Se non ci sono suggerimenti non mostriamo nulla
  if (!hints || hints.length === 0) return null;

  // Mostra solo l'ultimo suggerimento (il più recente)
  const lastHint = hints[hints.length - 1];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>💡</Text>
        <Text style={styles.title}>Suggerimento dal GM</Text>
      </View>
      <Text style={styles.message}>{lastHint.message}</Text>
      {lastHint.created_at && (
        <Text style={styles.timestamp}>
          {new Date(lastHint.created_at).toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      )}
    </View>
  );
}
