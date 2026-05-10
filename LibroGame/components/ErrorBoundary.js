// components/ErrorBoundary.js
// Cattura crash React e li mostra a schermo invece di chiudere l'app.
// Utile su Android dove non c'e' accesso facile a logcat.

import React from 'react';
import { Text, ScrollView } from 'react-native';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
  }
  render() {
    if (this.state.error) {
      return (
        <ScrollView style={{ flex: 1, backgroundColor: '#000', padding: 20 }}>
          <Text style={{ color: '#ff5555', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            CRASH:
          </Text>
          <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>
            {String(this.state.error?.message || this.state.error)}
          </Text>
          <Text style={{ color: '#aaa', fontSize: 12, marginBottom: 20 }}>
            {String(this.state.error?.stack || '')}
          </Text>
          <Text style={{ color: '#888', fontSize: 11 }}>
            {String(this.state.info?.componentStack || '')}
          </Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}
