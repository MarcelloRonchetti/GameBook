// components/SceneCard.js
// Card per mostrare un NPC/scena nella navigazione del giocatore.

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { sceneCardStyles as styles } from '../styles/components';

export default function SceneCard({ title, theme, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      {theme && <Text style={styles.theme}>{theme}</Text>}
    </TouchableOpacity>
  );
}
