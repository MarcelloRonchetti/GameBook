# CLAUDE

## Overview

- Purpose: technical operating notes for the `LibroGame` Expo app.
- Scope: the React Native app in `LibroGame/`, Supabase auth/database/realtime, local story JSON, current player flow, GM flow, assets, styling, and project docs.
- Audience: developers and AI coding agents working in this repository.

## Current Snapshot

- The active app lives in `LibroGame/`.
- Main branch: `main`.
- Remote: `git@github.com:MarcelloRonchetti/GameBook.git`.
- Expo stack from `LibroGame/package.json`: Expo `~54.0.34`, React `19.1.0`, React Native `0.81.5`.
- Supabase client is configured in `LibroGame/lib/supabase.js` with `AsyncStorage` persistence.
- The active player route is `JoinRoom` -> `Intro` -> `Map` -> `CircoStanza` -> `Map` until `Illusionista` -> `Direttrice`.
- `SceneScreen` and `AnagramScreen` are legacy compatibility routes. They remain registered, but the main flow uses `CircoStanzaScreen` and `MapScreen`.

## Architecture

- Root:
  - `LibroGame/App.js` renders `AppNavigator`.
  - `LibroGame/index.js` registers the Expo root component.
  - `LibroGame/navigation/AppNavigator.js` defines auth, GM, current player, and legacy player stack routes.

- Auth screens:
  - `AuthLoadingScreen` restores Supabase sessions and redirects by role.
  - `LoginScreen` authenticates GM/player accounts and uses inline error banners.
  - `RegisterScreen` creates player accounts only; GM accounts are created manually in Supabase.

- GM screens:
  - `RoomListScreen` lists rooms, supports enter/close/reopen/delete, and exposes logout in the header.
  - `CreateRoomScreen` creates named rooms with story selection and auto-hint timing.
  - `DashboardScreen` shows room code, status, connected players, current scene, close-room action, and player removal.
  - `PlayerDetailScreen` shows player progress and sends manual text hints.

- Player screens:
  - `JoinRoomScreen` validates a 6-digit code, joins open rooms, and resumes progress.
  - `IntroScreen` handles the initial cipher and unlocks `acrobata` on the map.
  - `MapScreen` renders the circus map, node state, fog of war, and available next scenes.
  - `CircoStanzaScreen` combines narration and anagram play for the current active flow.
  - `DirectriceScreen` handles the final twelve anagrams and stores final completion.
  - `SceneScreen` and `AnagramScreen` are legacy route fallbacks.

- Components:
  - Current flow: `NarratorView`, `AnagramOverlay`, `AutoHintEffect`, `GmHint`, `AnagramInput`.
  - Reusable/legacy support: `PlayerCard`, `SceneCard`.

- Libraries:
  - `lib/helpers.js`: `normalizeText`, `checkAnagram`, `generateRoomCode`, `formatTime`, `notify`.
  - `lib/session.js`: logout, cross-platform confirm helpers, player resume routing.
  - `lib/useRoomClosedListener.js`: room-close realtime listener and Android back-button blocking.
  - `lib/supabase.js`: Supabase client and session persistence.

## Data Flow

- Supabase Auth owns login state.
- User roles are read from the `users` table.
- GM-created rooms live in `rooms`; joined players are stored in `room_players`.
- Player progress is stored in `progress`, keyed by `room_id`, `player_id`, and `scene_id`.
- Manual GM hints are stored in `hints` and delivered through Supabase realtime subscriptions.
- Local story data comes from `story/storia_1/scenes.json` and `story/storia_1/anagrams.json`.
- Story navigation is driven by `STORY_GRAPH` in `styles/theme.js`.

## Resume Logic

`resolvePlayerResumeRoute(room, playerId)` in `lib/session.js` is the source of truth:

- No progress -> `Intro`.
- `intro` unsolved -> `Intro`.
- `intro` solved -> `Map` with `allChoices: ['acrobata']`.
- `illusionista` solved -> `Direttrice`.
- `direttrice` progress -> `Direttrice`.
- Other solved scene -> `Map` with next nodes from `STORY_GRAPH`.
- Other unsolved scene -> `CircoStanza` with `initialMode: 'anagram'`.

## Story And Assets

- `scenes.json` contains `intro`, twelve NPC scenes, `illusionista`, and `direttrice`.
- `anagrams.json` contains the twelve scene anagrams.
- `styles/theme.js` contains:
  - Design tokens: colors, spacing, radius, font sizes, fonts, shadows.
  - `npcThemes` and `getNpcTheme(sceneId)`.
  - `STORY_GRAPH` and `MAP_NODES`.
  - `ASSETS`, `getCharacterAsset`, and `getBackgroundAsset`.
- Existing bitmap assets:
  - `assets/map/circus_map.png`
  - `assets/characters/acrobata.png`
  - `assets/backgrounds/acrobata_bg.png`
- Missing NPC/background assets fall back to themed colors and emoji placeholders.

## Commands

- From `LibroGame/`, install dependencies with `npm install`.
- `npm run start` launches Expo.
- `npm run web` launches the web target.
- `npm run android` launches Android.
- `npm run ios` launches iOS.

## Known Gaps

- `MapScreen` imports `react-native-svg`, but `LibroGame/package.json` does not currently declare `react-native-svg`. Add/verify the dependency before relying on the map in a fresh install.
- Styling is only partially centralized. `DashboardScreen`, `RoomListScreen`, legacy `AnagramScreen`, and `DirectriceScreen` still define local `StyleSheet.create` blocks.
- `useRoomClosedListener` still calls `Alert.alert` directly. If web behavior matters for room-close notifications, convert it to the same cross-platform pattern used by `notify()` / `confirm()`.
- `RoomListScreen` deletes child rows from `progress`, `hints`, and `room_players` before deleting `rooms`; make sure RLS policies allow these deletes or use database cascades.
- `DashboardScreen` player removal requires a GM `DELETE` policy on `room_players`.
- `DirectriceScreen` only persists final completion, not the per-anagram solved state during the final puzzle.

## Project Notes

- Prefer `notify()` for informational messages and inline banners for form errors.
- Prefer `confirm()` from `lib/session.js` for destructive confirmations.
- Keep the active player flow on `CircoStanzaScreen` + `MapScreen`.
- Keep story text faithful to the source JSON.
- When adding new NPC artwork, register it in `ASSETS` in `styles/theme.js`.
- While scanning files, always ignore `node_modules/`.
- `.claude/settings.json` enables Claude-side plugin entries; `.claude/settings.local.json` currently disables `github@claude-plugins-official` locally.

## References

- `LibroGame_Checklist.md`
- `LibroGame_Progetto.md`
- `LibroGame_Codice.md`
- `LibroGame_Database.md`
