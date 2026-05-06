// navigation/AppNavigator.js
// Gestisce la navigazione tra tutte le schermate dell'app.
// Initial route: AuthLoading (splash che verifica sessione e reindirizza).
//
// NOVITÀ rispetto alla versione precedente:
//   - Aggiunta route 'CircoStanza' → CircoStanzaScreen (nuova schermata unificata)
//   - Aggiunta route 'Map'         → MapScreen (mappa interattiva)
//   - Le vecchie route 'Scene' e 'Anagram' sono mantenute per compatibilità
//     ma non più usate nel flusso principale. Verranno rimosse in futuro.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Auth
import AuthLoadingScreen from '../screens/auth/AuthLoadingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// GM
import RoomListScreen from '../screens/gm/RoomListScreen';
import CreateRoomScreen from '../screens/gm/CreateRoomScreen';
import DashboardScreen from '../screens/gm/DashboardScreen';
import PlayerDetailScreen from '../screens/gm/PlayerDetailScreen';

// Player — nuovo flusso
import JoinRoomScreen from '../screens/player/JoinRoomScreen';
import IntroScreen from '../screens/player/IntroScreen';
import CircoStanzaScreen from '../screens/player/CircoStanzaScreen';
import MapScreen from '../screens/player/MapScreen';
import DirectriceScreen from '../screens/player/DirectriceScreen';

// Player — vecchio flusso (mantenuto per compatibilità, non più nel flusso principale)
import SceneScreen from '../screens/player/SceneScreen';
import AnagramScreen from '../screens/player/AnagramScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AuthLoading"
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a1a' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          cardStyle: { backgroundColor: '#000000', flex: 1 },
          animationEnabled: true,
        }}
      >
        {/* Auth */}
        <Stack.Screen
          name="AuthLoading"
          component={AuthLoadingScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        {/* GM */}
        <Stack.Screen
          name="RoomList"
          component={RoomListScreen}
          options={{ title: 'Le mie stanze', headerLeft: () => null, gestureEnabled: false }}
        />
        <Stack.Screen
          name="CreateRoom"
          component={CreateRoomScreen}
          options={{ title: 'Crea Stanza' }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Dashboard GM', headerLeft: () => null, gestureEnabled: false }}
        />
        <Stack.Screen
          name="PlayerDetail"
          component={PlayerDetailScreen}
          options={{ title: 'Dettaglio Giocatore' }}
        />

        {/* Player — nuovo flusso */}
        <Stack.Screen
          name="JoinRoom"
          component={JoinRoomScreen}
          options={{ title: 'Entra nella Stanza', headerLeft: () => null, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Intro"
          component={IntroScreen}
          options={{ title: 'Il Circo', headerLeft: () => null, gestureEnabled: false }}
        />
        <Stack.Screen
          name="CircoStanza"
          component={CircoStanzaScreen}
          options={{ headerShown: false, gestureEnabled: false }}
          // headerShown: false perché la schermata gestisce la sua UI personalizzata
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Direttrice"
          component={DirectriceScreen}
          options={{ title: 'La Direttrice', headerLeft: () => null, gestureEnabled: false }}
        />

        {/* Player — vecchio flusso (compatibilità) */}
        <Stack.Screen
          name="Scene"
          component={SceneScreen}
          options={{ title: 'Circo-stanza', headerLeft: () => null, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Anagram"
          component={AnagramScreen}
          options={{ title: 'Anagramma', headerLeft: () => null, gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
