// components/AnagramInput.js
// Campo testo per l'inserimento della soluzione di un anagramma.
// Mostra un bordo rosso quando hasError è true (feedback errore).

import React from 'react';
import { TextInput } from 'react-native';
import { anagramInputStyles as styles } from '../styles/components';

export default function AnagramInput({ value, onChangeText, hasError, placeholder }) {
  return (
    <TextInput
      style={[styles.input, hasError && styles.inputError]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder || 'Scrivi qui la tua risposta...'}
      placeholderTextColor="#666"
      autoCapitalize="characters"
      autoCorrect={false}
    />
  );
}
