// App.js
// Punto di ingresso principale dell'app.
// Importa e renderizza AppNavigator che gestisce
// tutta la navigazione tra le schermate.

import React, { useEffect } from 'react';
import { Platform, View, Image, Text, ScrollView } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { ASSETS } from './styles/theme';

// Error boundary che mostra eventuali crash a schermo invece di chiudere l'app
class ErrorBoundary extends React.Component {
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

function useWebScrollFix() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const STYLE_ID = 'librogame-web-scroll-fix';
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
        html, body {
          height: 100% !important;
          overflow: hidden !important;
          margin: 0 !important;
        }
        #root {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
        }
        #root > div {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
}

function ImagePreloader() {
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(id);
  }, []);

  if (!ready) return null;

  const allAssets = [
    ASSETS.map.background,
    ...Object.values(ASSETS.backgrounds),
    ...Object.values(ASSETS.characters),
  ];
  return (
    <View style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      {allAssets.map((source, i) => (
        <Image key={i} source={source} style={{ width: 1, height: 1 }} />
      ))}
    </View>
  );
}

function AppWithScrollFix() {
  useWebScrollFix();
  return (
    <ErrorBoundary>
      <ImagePreloader />
      <AppNavigator />
    </ErrorBoundary>
  );
}

export default AppWithScrollFix;
