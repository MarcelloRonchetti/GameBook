# CLAUDE

## Overview

- Purpose: Document the structure, runtime flow, and key implementation details of the `LibroGame` Expo app.
- Scope: Includes the React Native app inside `LibroGame/`, with authentication, GM and player screens, Supabase integration, local story JSON assets, and theme/styling support.
- Audience: Developers and maintainers needing a quick technical overview of the app architecture and behavior.

## Architecture

- Components:
  - `App.js` renders the root `AppNavigator`.
  - `navigation/AppNavigator.js` defines a stack navigator for auth, GM, and player routes.
  - `screens/auth/*` includes `AuthLoadingScreen`, `LoginScreen`, `RegisterScreen`.
  - `screens/gm/*` includes `RoomListScreen`, `CreateRoomScreen`, `DashboardScreen`, `PlayerDetailScreen`.
  - `screens/player/*` includes the current flow screens `JoinRoomScreen`, `IntroScreen`, `CircoStanzaScreen`, `MapScreen`, `DirectriceScreen`, plus legacy compatibility screens `SceneScreen` and `AnagramScreen`.
  - `components/*` includes reusable UI widgets such as `AnagramInput`, `AnagramOverlay`, `AutoHintEffect`, `GmHint`, `NarratorView`, `PlayerCard`, and `SceneCard`.
  - `lib/supabase.js` configures Supabase with `AsyncStorage`-based session persistence.
  - `lib/session.js` contains logout/confirm helpers and resume routing logic.
  - `lib/helpers.js` contains text normalization, anagram checking, room code generation, timer formatting, and cross-platform notification helpers.
  - `styles/*` contains theme settings, UI palettes, and screen-specific style definitions.
  - `story/storia_1/*` contains narrative content and puzzle data in `scenes.json` and `anagrams.json`.

- Data flow:
  - Players register/login via Supabase Auth.
  - The GM creates rooms and configures auto-hint timing.
  - Player progress is stored in Supabase `progress` rows keyed by `room_id`, `player_id`, and `scene_id`.
  - Real-time hint delivery and room-closure events use Supabase realtime channels.
  - Local JSON story data drives scene text, choice structure, anagrams, and final puzzles.
  - The current player flow uses `CircoStanzaScreen` for narration and puzzle presentation, and `MapScreen` for branching scene selection.

- Integration points:
  - Supabase for authentication, database persistence, and realtime subscriptions.
  - Expo / React Native for UI rendering and cross-platform compatibility.
  - `@react-navigation/native` and `@react-navigation/stack` for navigation.
  - `@react-native-async-storage/async-storage` for mobile session persistence.
  - Local assets and story files under `LibroGame/assets/` and `LibroGame/story/`.

## Features

- Auth and session persistence
  - `AuthLoadingScreen` checks the current Supabase session and routes users to either login or the correct app flow.
  - `LoginScreen` and `RegisterScreen` provide player authentication.
  - `lib/session.js` includes `confirmLogout()` and `confirm()` helpers for both mobile and web.

- GM room management
  - `CreateRoomScreen` generates rooms with a custom name, a 6-digit room code, and an auto-hint timer.
  - `RoomListScreen` lists existing rooms and supports room deletion.
  - `DashboardScreen` shows joined players and their current scene in realtime.
  - `PlayerDetailScreen` allows the GM to send manual hints to a specific player.

- Player narrative and puzzle progression
  - `JoinRoomScreen` validates the 6-digit room code and ensures the room is open.
  - `IntroScreen` presents the opening circus narrative and routes the player to the first scene.
  - `CircoStanzaScreen` is the unified current scene screen that handles both narration (`NarratorView`) and the anagram puzzle UI (`AnagramOverlay`).
  - `MapScreen` reveals the next available branches and displays scene states with fog-of-war style nodes.
  - `DirectriceScreen` is the final stage with a set of twelve final anagrams.

- Story logic and branching
  - The story graph is defined in `styles/theme.js` as `STORY_GRAPH`.
  - Players always start from `intro`, then move to `acrobata`.
  - Branching follows scene-specific choices until reaching `illusionista`, which leads to `direttrice`.
  - The final `direttrice` stage contains a collection of anagram puzzles for all previous NPCs.

- Cross-platform UX improvements
  - `helpers.notify()` shows alerts using `window.alert` on web and `Alert.alert` on mobile.
  - `session.confirm()` falls back to browser `confirm()` on web.
  - `useDisableAndroidBack()` and `useRoomClosedListener()` ensure players cannot accidentally back out of critical screens and are notified when the GM closes the room.

## Usage

- Setup:
  - Open the workspace and navigate into `LibroGame/`.
  - Install dependencies with `npm install`.
  - Ensure the Supabase project URL and anon key are configured in `lib/supabase.js`.

- Commands:
  - `npm run start` — launch Expo.
  - `npm run web` — run the app in a browser.
  - `npm run android` — open the app on an Android device/emulator.

- Examples:
  - Use the GM flow to create a room and share the generated 6-digit code.
  - Players open the app, join the room, complete `Intro`, solve anagrams in `CircoStanzaScreen`, choose branches on `MapScreen`, and finally reach `Direttrice`.

## Notes

- Considerations:
  - The current active player flow is centered on `CircoStanzaScreen` + `MapScreen`; legacy `SceneScreen` and `AnagramScreen` remain in navigation for compatibility but are not part of the main route.
  - Story content is authored in `story/storia_1/scenes.json` and `story/storia_1/anagrams.json`.
  - `styles/theme.js` defines NPC colors, emojis, the story navigation graph, and map node coordinates.
  - `lib/session.js` resolves player resume state and correctly returns players to `Intro`, `Map`, `CircoStanza`, or `Direttrice` depending on progress.

- To-do items:
  - Validate complete device behavior on Android and iOS.
  - Add the missing character/background assets referenced in `styles/theme.js`.
  - Remove legacy routes when the new player flow is stable.
  - Document Supabase schema and required realtime channels.

## References

- Related documents:
  - `LibroGame_Progetto.md`
  - `LibroGame_Checklist.md`
  - `LibroGame_Codice.md`
  - `LibroGame_Database.md`

- Key source files:
  - `LibroGame/App.js`
  - `LibroGame/navigation/AppNavigator.js`
  - `LibroGame/lib/supabase.js`
  - `LibroGame/lib/session.js`
  - `LibroGame/lib/helpers.js`
  - `LibroGame/screens/player/CircoStanzaScreen.js`
  - `LibroGame/screens/player/MapScreen.js`
  - `LibroGame/styles/theme.js`

## Remember

- The active app lives inside the `LibroGame/` folder.
- `CircoStanzaScreen` manages both narration and the anagram puzzle mode.
- The story is a branching circus journey from `intro` through `illusionista` to `direttrice`.
- Supabase session persistence and realtime listeners are central to the app's multiplayer behavior.
 