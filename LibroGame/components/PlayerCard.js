// components/PlayerCard.js
// Card di un giocatore nella DashboardScreen del GM.
// Mostra il nome del giocatore e la sua scena attuale.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { playerCardStyles as styles } from '../styles/components';

export default function PlayerCard({ username, currentScene, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View>
        <Text style={styles.name}>{username}</Text>
        <Text style={styles.scene}>📍 {currentScene}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}
