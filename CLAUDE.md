# CLAUDE

# ALWAYS REMEMBER IMPORTANT!!!!!
Ignore node_modules folder when scanning the project files

## Overview

- Purpose: technical operating notes for the `LibroGame` Expo app.
- Scope: the React Native app in `LibroGame/`, Supabase auth/database/realtime, local story JSON, current player flow, GM flow, assets, styling, and project docs.
- Audience: developers and AI coding agents working in this repository.

## Current Snapshot

- The active app lives in `LibroGame/`.
- Main branch: `main`.
- Remote: `git@github.com:MarcelloRonchetti/GameBook.git`.
- Expo stack from `LibroGame/package.json`: Expo `~54.0.34`, React `19.1.0`, React Native `0.81.5`, `react-native-svg ^15.15.4` (used by `MapScreen`).
- Supabase client is configured in `LibroGame/lib/supabase.js` with `AsyncStorage` persistence.
- The active player route is `JoinRoom` -> `Intro` -> `Map` -> `CircoStanza` -> `Map` until `Illusionista` -> `Direttrice`.
- `SceneScreen` and `AnagramScreen` are legacy compatibility routes. They remain registered, but the main flow uses `CircoStanzaScreen` and `MapScreen`.

## Stack

- React Native + Expo SDK 54
- `@supabase/supabase-js`
- `@react-navigation/native` + `@react-navigation/stack`
- `react-native-screens@~4.16.0`
- `react-native-safe-area-context@~5.6.0`
- `react-native-gesture-handler@~2.28.0`
- `react-dom` + `react-native-web` (web development)
- `@react-native-picker/picker`
- `@react-native-async-storage/async-storage`

### Stack notes

- `package.json` pins `expo: "~54.0.34"` — do NOT bump to ^55.0.0.
- Node 20+ required (Node 18 raises `EBADENGINE`).
- Expo Go is not compatible (it requires SDK 55) — use `npx expo start --web` or an EAS build.
- `Alert.alert` does not work on the web target. Use `notify()` from `lib/helpers.js`, `confirm()` from `lib/session.js`, or inline error banners for form errors.

## Architecture

- Root:
  - `LibroGame/App.js` renders `AppNavigator`.
  - `LibroGame/index.js` registers the Expo root component.
  - `LibroGame/navigation/AppNavigator.js` defines auth, GM, current player, and legacy player stack routes. Initial route is `AuthLoading`. Critical screens use `headerLeft: () => null` and `gestureEnabled: false`. The `NavigationContainer` has a `linking` config so the URL `/reset-password` resolves to `ResetPasswordScreen` on web; deep-link prefix `librogame://` is registered as placeholder for future mobile builds.

- Auth screens:
  - `AuthLoadingScreen` restores Supabase sessions and redirects by role. Also subscribes to `onAuthStateChange` and handles the `PASSWORD_RECOVERY` event by routing to `ResetPassword` instead of the role home (a `recoveryFired` guard prevents the async `getSession()` branch from racing back to the home).
  - `LoginScreen` authenticates GM/player accounts and uses inline error banners. Includes a "Password dimenticata?" link to `ForgotPassword`.
  - `RegisterScreen` creates player accounts only (validations: username min 3, email regex, password min 6, confirm). GM accounts are created manually in Supabase.
  - `ForgotPasswordScreen` requests a Supabase password-recovery email via Brevo SMTP. Inline error banner; success state replaces the form with "Controlla la tua email." + "Torna al login".
  - `ResetPasswordScreen` is reached by clicking the recovery link. Direct-visit guard ("Link non valido o scaduto") fires when no recovery session is present (also subscribes to `onAuthStateChange` so it handles the async URL-fragment parse robustly with a 2 s safety timeout). On success, calls `supabase.auth.updateUser({ password })`, signs out, and resets to `Login`.

- GM screens:
  - `RoomListScreen` lists rooms, supports enter/close/reopen/delete (with `confirm()` for destructive actions), and exposes logout in the header. The `FlatList` is the screen root (no wrapper `<View>`) so it scrolls correctly on web; "Entra" uses `navigation.push('Dashboard', …)` to force a fresh Dashboard instance every time (avoids the white-screen on re-enter bug).
  - `CreateRoomScreen` creates named rooms with story selection and auto-hint timing. Inline error banner.
  - `DashboardScreen` shows room code, status, connected players in realtime, current scene, close-room action, and player removal. Header back button uses `navigation.goBack()` (RoomList is always below in the stack) so Dashboard unmounts cleanly. The `FlatList` is the screen root (no wrapper `<View>`) so it scrolls correctly on web.
  - `PlayerDetailScreen` shows player progress (vertical timeline with colored dots: green=solved, orange=pending) and sends manual text hints; `notify()` for validation/send errors. The `FlatList` is the direct child of `KeyboardAvoidingView` (no wrapper `<View>`) so it scrolls correctly on web.

- Player screens:
  - `JoinRoomScreen` validates a 6-digit code, joins open rooms, and resumes progress. The code input is trimmed and then `.padStart(6, '0')` is applied so that codes with leading zeros (e.g. `001234`) are preserved before the Supabase lookup. Uses `maybeSingle()` to avoid errors on missing rooms. Calls `resolvePlayerResumeRoute` and `navigation.reset` to the right scene. Logout link via `confirmLogout`.
  - `IntroScreen` handles the initial cipher and unlocks `acrobata` on the map.
  - `MapScreen` renders the circus map with illustrated arch-frame nodes. Two node types: `TentNode` (intro/direttrice, PNG tents + banner scroll) and `ArchNode` (12 NPCs, arch frame PNG + sprite inside). Fog state: arch shows `?` without dark circle; tent darkens via `tintColor`. Available arch nodes scale up on hover/press (`Animated.timing`, 140ms ease-out quad — sostituisce spring per performance su web). `HINT_POSITIONS` usa valori decimali 0-1 relativi all'immagine di sfondo; `NarratorView.computeHintStyle` converte in coordinate assolute compensando `resizeMode="cover"` in base alle dimensioni schermo correnti (`useWindowDimensions`). `BG_ASPECT_RATIO = 16/9` in `theme.js`. Personaggio a `zIndex: 2`, hint a `zIndex: 1`. SVG bezier paths connect nodes; `pathAnchorX/Y` in `MAP_NODES` offset path endpoints for intro/direttrice. All visual tuning constants at top of file (`ARCH_SCALE`, `TENT_SCALE`, `INTERIOR_*`, `SPRITE_SCALE`, `BANNER_BOTTOM`, `LABEL_FONT_SCALE`). Banner config for tents in `BANNER_CONFIG` in `theme.js`.
  - `CircoStanzaScreen` combines narration and anagram play for the current active flow.
  - `DirectriceScreen` handles the final twelve anagrams (with skip and free navigation) and stores final completion in `progress`.
  - `SceneScreen` and `AnagramScreen` are legacy route fallbacks.

- Components:
  - Current flow: `NarratorView` (typewriter dialog with placeholder fallback; the narration body is wrapped in a `ScrollView` and the character + dialog use a flow layout — not absolute positioning — so they remain reachable via scroll on short windows), `AnagramOverlay` (anagram panel, GM hints, Illusionista cipher, next-scene choices), `AutoHintEffect`, `GmHint` (shows only the latest hint), `AnagramInput`.
  - Reusable/legacy support: `PlayerCard`, `SceneCard`.
  - `ErrorBoundary` (class component, file dedicato): cattura crash React e li mostra a schermo invece di chiudere l'app. Wrappa `AppNavigator` in `App.js`. Tenere in file separato per non rompere Fast Refresh.

- Libraries:
  - `lib/supabase.js`: Supabase client + session persistence via `AsyncStorage`. `detectSessionInUrl` is set to `Platform.OS === 'web'` so the client parses the `#access_token=…&type=recovery` fragment on web (required for password reset); mobile leaves it off.
  - `lib/resetRedirect.js`: `getResetRedirect()` — returns the URL Brevo embeds in recovery emails (`window.location.origin + '/reset-password'` on web; `librogame://reset-password` placeholder on native).
  - `lib/helpers.js`: `normalizeText` (strips accents/punctuation/case), `checkAnagram`, `generateRoomCode` (6 digits), `formatTime` (mm:ss), `notify(title, message)` (cross-platform: `window.alert` on web, `Alert.alert` on mobile).
  - `lib/session.js`: `logout`, `confirmLogout`, `confirm(title, message, onConfirm, destructive)` (cross-platform), `resolvePlayerResumeRoute(room, playerId)`.
  - `lib/useRoomClosedListener.js`: `useRoomClosedListener` (subscribes to `UPDATE` on `rooms`; on `status='closed'` shows alert + redirects to `JoinRoom`) and `useDisableAndroidBack` (disables hardware back while a screen is mounted).

## Folder structure

```
LibroGame/
├── lib/
│   ├── supabase.js
│   ├── helpers.js
│   ├── session.js
│   └── useRoomClosedListener.js
├── styles/
│   ├── theme.js              (palette + NPC themes + STORY_GRAPH + MAP_NODES + ASSETS)
│   ├── components.js
│   ├── auth.js
│   ├── gm.js
│   └── player.js             (+ NPC placeholder styles)
├── components/
│   ├── AnagramInput.js
│   ├── SceneCard.js
│   ├── AutoHintEffect.js
│   ├── GmHint.js
│   ├── PlayerCard.js
│   ├── NarratorView.js
│   └── AnagramOverlay.js
├── screens/
│   ├── auth/                 (AuthLoading, Login, Register, ForgotPassword, ResetPassword)
│   ├── gm/                   (CreateRoom, RoomList, Dashboard, PlayerDetail)
│   └── player/               (JoinRoom, Intro, Map, CircoStanza, Directrice, SceneScreen [legacy], AnagramScreen [legacy])
├── navigation/AppNavigator.js
├── story/storia_1/           (scenes.json, anagrams.json)
├── App.js
├── package.json
└── index.js
```

## Styling system

`styles/theme.js`:
- `colors` (dark/light backgrounds, gold accent `primary`, semantic states, GM badge colors)
- `spacing` (xs=4 … huge=40)
- `radius` (sm=6 … pill=20 … round=999)
- `fontSize` (xs=12 … display=40)
- `fonts.mono` (Courier on iOS, monospace elsewhere)
- `shadows` (sm/md/lg + Android elevation)
- `npcThemes` and `getNpcTheme(sceneId)` (fallback `{ color: primary, emoji: '🎪', label: 'Circo-stanza' }`)
- `STORY_GRAPH` and `MAP_NODES`
- `ASSETS` (map: `background`, `nodeFrame`, `nodeTentEntry`, `nodeTentFinal`, `nodeBanner`), `getCharacterAsset`, `getBackgroundAsset`
- `BANNER_CONFIG` — parametri banner tende (intro/direttrice): `bannerScale`, `bannerTop`, `bannerOffsetX`, `fontScale`, `textOffsetX`, `textOffsetY`
- `MAP_NODES` supporta `pathAnchorX/Y` per offset endpoint percorsi SVG
- `CHARACTER_POSITIONS` + `DEFAULT_CHARACTER_POSITION` — override posizione/dimensione sprite NPC per-scena. Helper `getCharacterPosition(sceneId)`. Usato in `CircoStanzaScreen` e `NarratorView` come prop `characterPosition` per applicare style override sul `characterContainer`

`styles/components.js`: `anagramInputStyles`, `autoHintEffectStyles` (gold border 4px overlay, zIndex 1000), `gmHintStyles` (yellow banner with left border), `playerCardStyles`, `sceneCardStyles`.

`styles/auth.js`: `authLoadingStyles`, `loginStyles` (+ `errorBanner`), `registerStyles` (+ `errorBanner`).

`styles/gm.js`: `createRoomStyles`, `roomListStyles` (open/closed badges, FAB), `dashboardStyles`, `playerDetailStyles`.

`styles/player.js`: `joinRoomStyles` (+ `errorBanner`), `introStyles` (cipher grid), `sceneStyles` (NPC placeholder styles), `anagramScreenStyles` (`npcMini` + choice buttons), `directriceStyles` (gold placeholder, progress bar, navDot grid, completionBox).

Existing bitmap assets:
- `assets/app-icons/icon.png`, `adaptive-icon.png`, `splash-icon.png`, `favicon.png` — icone APK/web (placeholder 1024×1024 colore `#1a1a1a`, da sostituire con grafica definitiva)
- `assets/map/circus_map.png`
- `assets/characters/acrobata.png`, `giocoliere.png`, `funambolo.png`, `pagliaccio.png`, `trapezista.png`, `cavallerizza.png`, `contorsionista.png`, `controfigura.png`, `domatore.png`, `equilibrista.png`, `sputafuoco.png`, `illusionista.png`
- `assets/backgrounds/acrobata_bg.png`, `giocoliere_bg.png`, `funambolo_bg.png`, `pagliaccio_bg.png`, `trapezista_bg.png`, `cavallerizza_bg.png`, `contorsionista_bg.png`, `controfigura_bg.png`, `domatore_bg.png`, `equilibrista_bg.png`, `sputafuoco_bg.png`, `illusionista_bg.png`
- `assets/hints/acrobata_hint.png`, `funambolo_hint.png`, `giocoliere_hint.png`, `pagliaccio_hint.png`, `trapezista_hint.png`, `cavallerizza_hint.png`, `contorsionista_hint.png`, `controfigura_hint.png`, `domatore_hint.png`, `equilibrista_hint.png`, `sputafuoco_hint.png`, `illusionista_hint.png`
- `story/storia_1/CIRCO-STANZE.pdf` — testo sorgente completo del gioco (riferimento narrativo per personaggi e stanze)

Missing NPC/background assets fall back to themed colors and emoji placeholders.

## Data flow

- Supabase Auth owns login state.
- User roles are read from the `users` table.
- GM-created rooms live in `rooms`; joined players are stored in `room_players`.
- Player progress is stored in `progress`, keyed by `room_id`, `player_id`, and `scene_id`.
- Manual GM hints are stored in `hints` and delivered through Supabase realtime subscriptions.
- Local story data comes from `story/storia_1/scenes.json` and `story/storia_1/anagrams.json`.
- Story navigation is driven by `STORY_GRAPH` in `styles/theme.js`.

## GM flow

1. Launch -> `AuthLoading` -> (if session) -> `RoomList`.
2. See own rooms (with custom name); can **Enter**, **Reopen**, **Delete**.
3. Create new room: name + story + auto-hint -> 6-digit code.
4. Share code with players.
5. Dashboard: realtime player positions.
6. Click on a player -> full timeline + send manual text hints.
7. Can close the room (-> players auto-disconnected).
8. Back to `RoomList` (header) or logout.

## Player flow

1. Launch -> `AuthLoading` -> (if session) -> `JoinRoom`.
2. Enter 6-digit code; errors shown in inline banner.
3. Closed room -> error in banner.
4. Existing progress -> automatic resume to last scene.
5. Otherwise: Intro -> initial ciphered message with key 1–14.
6. Acrobata scene (fixed start) -> green NPC placeholder with 🤸.
7. Solve anagram -> pick next NPC (with emoji on the button), no going back.
8. Continue until Illusionista -> cipher + anagram -> Direttrice.
9. Direttrice: gold placeholder 🎩 + 12 anagrams with skip and free navigation.
10. Completion -> final message.

If GM closes the room mid-game: alert "Il GM ha chiuso la stanza" -> reset to `JoinRoom` (player stays logged in).

## Resume logic

`resolvePlayerResumeRoute(room, playerId)` in `lib/session.js` is the source of truth:

- No progress -> `Intro`.
- `intro` unsolved -> `Intro`.
- `intro` solved -> `Map` with `allChoices: ['acrobata']`.
- `illusionista` solved -> `Direttrice`.
- `direttrice` progress -> `Direttrice`.
- Other solved scene -> `Map` with next nodes from `STORY_GRAPH`.
- Other unsolved scene -> `CircoStanza` with `initialMode: 'anagram'`.

## Auto-hint mechanic

- GM picks the timer at room creation (1, 2, 3, 5, 10 minutes).
- When the player enters a scene, `entered_at` is set on `progress`.
- On timeout -> `AutoHintEffect` overlay for **10 seconds**.
- After the 10 seconds the timer restarts (until the anagram is solved).
- The cycle stops when the player solves or changes scene.
- `SceneScreen` updates `entered_at` on re-entry to restart the timer at resume.

### Manual GM hint

- Text hint typed by the GM in `PlayerDetailScreen`.
- Visible to the player in `AnagramScreen` / `CircoStanzaScreen` via `GmHint`.
- Realtime delivery via Supabase channel `hints_changes_<room>_<user>`.

## Story: storia_1 — Il circo delle circostanze

### Path map

```
Acrobata → Funambolo | Giocoliere
Funambolo → Giocoliere | Pagliaccio
Giocoliere → Trapezista | Cavallerizza
Pagliaccio → Cavallerizza | Contorsionista
Trapezista → Contorsionista | Controfigura
Cavallerizza → Contorsionista | Domatore
Contorsionista → Equilibrista | Illusionista
Controfigura → Contorsionista | Illusionista
Domatore → Sputafuoco | Illusionista
Equilibrista → Domatore | Illusionista
Sputafuoco → Controfigura | Illusionista
Illusionista → Direttrice (finale)
```

### Scene anagrams

| NPC | Anagram | Solution |
|---|---|---|
| Acrobata | MENA QUINTINO | INQUINAMENTO |
| Funambolo | SPUNTATE FECI | STUPEFACENTI |
| Giocoliere | ISPETTORI IDEE GREEN | STEREOTIPI DI GENERE |
| Pagliaccio | SUB ODIA COLLA | ABUSO DI ALCOL |
| Trapezista | IMMAGINI ZERO | IMMIGRAZIONE |
| Cavallerizza | UNITE ZERO POSTI | PROSTITUZIONE |
| Contorsionista | ABITI SALDI | DISABILITÀ |
| Controfigura | MAESTRE PROVATE | POVERTÀ ESTREMA |
| Domatore | INTERPOSI ZEUS | SUPERSTIZIONE |
| Equilibrista | ACETI E PUBBLICATI | ETICA E PUBBLICITÀ |
| Sputafuoco | ARREDI SEGA MURO | GUERRA E DISARMO |
| Illusionista | ALCE IGNOTO | TECNOLOGIA |

### NPC themes (placeholder colors)

| NPC | Color | Emoji | Social theme |
|---|---|---|---|
| Acrobata | #2e8b57 verde | 🤸 | Inquinamento |
| Funambolo | #7e57c2 viola | 🪢 | Stupefacenti |
| Giocoliere | #d81b60 magenta | 🤹 | Stereotipi di genere |
| Pagliaccio | #c2913c ambra | 🤡 | Abuso di alcol |
| Trapezista | #e65100 arancio | 🎪 | Immigrazione |
| Cavallerizza | #8e2c2c rosso scuro | 🐎 | Prostituzione |
| Contorsionista | #1976d2 blu | 🌀 | Disabilità |
| Controfigura | #546e7a grigio-blu | 🎭 | Povertà estrema |
| Domatore | #4527a0 indaco | 🦁 | Superstizione |
| Equilibrista | #00838f ciano | ⚖️ | Etica e pubblicità |
| Sputafuoco | #bf360c rosso fuoco | 🔥 | Guerra e disarmo |
| Illusionista | #6a1b9a viola tech | ✨ | Tecnologia |
| Direttrice | #c8a45a oro | 🎩 | Finale |

### Ciphered messages

Key (la volontà delle circostanze):

```
1=L, 2=A, 3=V, 4=O, 5=N, 6=T, 7=D, 8=E, 9=C, 10=I, 11=R, 12=S, 13=Z, 14=B
+ new letters to deduce from context (Illusionista)
```

- Initial: "Dovete trovare la direttrice delle circostanze iniziando dall'acrobata".
- Final (Illusionista): "La volontà vi conduce alla direttrice. Chiedete di lei senza farvi sentire".

### Direttrice anagrams (final)

| Anagram | Solution |
|---|---|
| ACCOGLI API | PAGLIACCIO |
| ALBUM FONO | FUNAMBOLO |
| ALZARVI CALZE | CAVALLERIZZA |
| CARTA BOA | ACROBATA |
| FAUSTO CUPO | SPUTAFUOCO |
| FRUGO CARTONI | CONTROFIGURA |
| LEGO EROICI | GIOCOLIERE |
| MORDE TAO | DOMATORE |
| NASCONO RISOTTI | CONTORSIONISTA |
| QUESTI BARILI | EQUILIBRISTA |
| SUINI SATOLLI | ILLUSIONISTA |
| TASTARE ZIP | TRAPEZISTA |

## Database (Supabase)

- Project URL: `https://rrleoynnbjesnpquqlmx.supabase.co`.
- Anon key in `lib/supabase.js`. Never share the service_role key.

### Auth configuration

- Confirm email: **DISABLED** (Authentication → Providers → Email → Confirm email → OFF). Reason: the app is GM-controlled; without disabling, the session is not active right after registration and the insert into `users` fails under RLS.
- Custom SMTP via **Brevo** (free tier, 300 emails/day). Configure in Supabase → Authentication → Emails → SMTP Settings: host `smtp-relay.brevo.com`, port `587`, login = Brevo account email, password = generated SMTP key. Sender email must be a verified Brevo sender. Reset password template is translated to Italian (subject "Reimposta la tua password — LibroGame", `{{ .ConfirmationURL }}` placeholder kept). Redirect URLs allowlist must include `http://localhost:8081/reset-password` (dev) and the production URL once deployed.
- Supabase Auth users with linked rows in `users` cannot be deleted; for tests reuse the same email or generate new ones.

### Tables

`stories`:
```sql
CREATE TABLE stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```
Seeded with `storia_1` — "Il circo delle circostanze".

`rooms`:
```sql
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT,
  gm_id UUID REFERENCES auth.users(id),
  story_id UUID REFERENCES stories(id),
  auto_hint_minutes INTEGER NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMP DEFAULT NOW()
);
```
`name` is nullable for compatibility with rooms created before the column was added (`ALTER TABLE rooms ADD COLUMN name TEXT;`).

`users`:
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  role TEXT DEFAULT 'player' CHECK (role IN ('gm', 'player'))
);
```
GM accounts are created manually in Supabase Auth, then a row is inserted in `users` with `role='gm'`.

`room_players`:
```sql
CREATE TABLE room_players (
  room_id UUID REFERENCES rooms(id),
  player_id UUID REFERENCES users(id),
  PRIMARY KEY (room_id, player_id)
);
```

`progress`:
```sql
CREATE TABLE progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id),
  player_id UUID REFERENCES users(id),
  scene_id TEXT NOT NULL,
  solved BOOLEAN DEFAULT FALSE,
  entered_at TIMESTAMP DEFAULT NOW(),
  timestamp TIMESTAMP DEFAULT NOW()
);
```
- `entered_at` drives the auto-hint timer; refreshed on scene re-entry.
- `solved` flips true when the player solves the scene's anagram.
- Player screens use `maybeSingle()` to avoid duplicate rows on resume.

`hints`:
```sql
CREATE TABLE hints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id),
  player_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Realtime replication

| Table | Why |
|---|---|
| `rooms` | `useRoomClosedListener` listens for `UPDATE` to detect room close from GM |
| `room_players` | GM Dashboard updates player list in realtime |
| `progress` | GM Dashboard + PlayerDetail update player position in realtime |
| `hints` | `AnagramScreen` / `CircoStanzaScreen` receive GM hints in realtime |

Path: Supabase Dashboard → Database → Replication → enable per table.

### RLS

RLS enabled on every table.

| Table | Read | Write |
|---|---|---|
| `users` | self only | self only |
| `stories` | GM only | none (static) |
| `rooms` | GM all, Player only open | GM only |
| `room_players` | GM all, Player only self | Player only |
| `progress` | GM all, Player only self | Player only |
| `hints` | GM all, Player only own | GM only |

Policies (full):

```sql
-- users
CREATE POLICY "utente legge solo se stesso" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "utente crea solo se stesso" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "utente modifica solo se stesso" ON users FOR UPDATE USING (auth.uid() = id);

-- stories
CREATE POLICY "solo gm legge le storie" ON stories FOR SELECT
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));

-- rooms
CREATE POLICY "gm crea stanza" ON rooms FOR INSERT
WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));
CREATE POLICY "gm legge tutte le stanze" ON rooms FOR SELECT
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));
CREATE POLICY "gm aggiorna stanza" ON rooms FOR UPDATE
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));
CREATE POLICY "gm elimina stanza" ON rooms FOR DELETE
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));
CREATE POLICY "giocatore legge stanze aperte" ON rooms FOR SELECT
USING (status = 'open' AND auth.uid() IN (SELECT id FROM users WHERE role = 'player'));

-- room_players
CREATE POLICY "gm legge giocatori stanza" ON room_players FOR SELECT
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));
CREATE POLICY "giocatore si unisce a stanza aperta" ON room_players FOR INSERT
WITH CHECK (
  auth.uid() = player_id
  AND auth.uid() IN (SELECT id FROM users WHERE role = 'player')
  AND room_id IN (SELECT id FROM rooms WHERE status = 'open')
);
CREATE POLICY "giocatore legge solo se stesso" ON room_players FOR SELECT
USING (auth.uid() = player_id);

-- progress
CREATE POLICY "gm legge tutti i progressi" ON progress FOR SELECT
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));
CREATE POLICY "giocatore legge solo i propri progressi" ON progress FOR SELECT
USING (auth.uid() = player_id);
CREATE POLICY "giocatore inserisce solo i propri progressi" ON progress FOR INSERT
WITH CHECK (auth.uid() = player_id);
CREATE POLICY "giocatore aggiorna solo i propri progressi" ON progress FOR UPDATE
USING (auth.uid() = player_id);

-- hints
CREATE POLICY "gm inserisce suggerimenti" ON hints FOR INSERT
WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));
CREATE POLICY "gm legge tutti i suggerimenti" ON hints FOR SELECT
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));
CREATE POLICY "giocatore legge solo i propri suggerimenti" ON hints FOR SELECT
USING (auth.uid() = player_id);
```

The `gm elimina stanza` policy is required by `RoomListScreen` deletion. Without it the delete fails silently (RLS blocks without raising).

## Commands

- From `LibroGame/`, install dependencies with `npm install`.
- `npm run start` launches Expo.
- `npm run web` launches the web target.
- `npm run android` launches Android.
- `npm run ios` launches iOS.
- `npm run clean-pngs` ripulisce metadata PNG (lanciare prima di ogni build APK).

## Development rules

- Sanitize every user input (trim, lowercase where appropriate).
- Comment every file: imports, functions, logic blocks.
- One file at a time: test before moving on.
- Faithful to the source story (do not modify scene texts).
- No `StyleSheet.create` inside screens — keep styles in `styles/`, tokens in `theme.js`.
- No direct `Alert.alert` — use `notify()` for messages, `confirm()` for destructive prompts, inline banners for form errors.
- Ask before proceeding when something is unclear.

## Deployment

### EAS Build APK Android — funzionante

Configurazione attuale che produce APK installabile su telefono fisico:

- **`eas.json`** profilo `preview`: `distribution: "internal"`, `android.buildType: "apk"`. Resource class default (medium, free tier).
- **`app.json`** essenziale per build cloud:
  - `newArchEnabled: false` — la new architecture causa crash silenziosi durante prebuild con SDK 54 + RN 0.81.5
  - `orientation: "default"` — supporta portrait + landscape
  - `android.package: "com.librogame.app"`
  - `extra.eas.projectId: "<UUID>"` — generato da `eas build:configure`, NON una stringa libera
  - `plugins: ["./gradle-memory-plugin"]`
- **`gradle-memory-plugin.js`** — Expo config plugin custom che modifica `gradle.properties` al prebuild aggiungendo `org.gradle.jvmargs=-Xmx3072m -XX:MaxMetaspaceSize=512m` e `org.gradle.daemon=false`. Senza questo le build crashano con "Gradle build failed with unknown error" durante la compilazione native multi-architettura.
- **`.easignore`** esclude `node_modules`, `.git`, `*.log` per ridurre size archivio upload (da 295 MB a pochi MB).
- **App icons** (`assets/icon.png`, `adaptive-icon.png`, `splash-icon.png`, `favicon.png`) DEVONO essere quadrate, altrimenti `expo doctor` blocca la build. Attualmente sono placeholder 1024×1024 colore `#1a1a1a` da sostituire con grafica definitiva.
- **PNG cleanliness** — AAPT (Android Asset Packaging Tool) fallisce su PNG con metadata/profili colore non standard. Soluzione automatizzata: `npm run clean-pngs` (script `scripts/clean-pngs.ps1`) ri-salva tutti i PNG di `assets/` con `System.Drawing.Bitmap` PowerShell, strippando i metadata. Idempotente — lanciare prima di ogni build APK quando si aggiungono nuove immagini.

### Comandi build

```
cd LibroGame
npm run clean-pngs                                  # IMPORTANTE prima della build
eas build --platform android --profile preview
```

La build dura ~15 min sul cloud Expo. Limite free tier: 30 build/mese.

### Sviluppo vs Build

- **Web** (`npm run web`): istantaneo, usare per sviluppo quotidiano e test su mobile via browser (`http://<IP-PC>:8081`).
- **APK**: solo per milestone, test di compatibilità nativa, demo offline. Ogni rebuild consuma 1 build dei 30/mese.
- **Future**: configurare `expo-updates` per OTA updates senza ricompilare APK ad ogni modifica JS.

### Crash all'avvio APK — pattern da evitare

Codice che accede a oggetti DOM (`window`, `document`, `localStorage`, `navigator`) al **modulo load time** (top-level del file, non dentro componenti React/funzioni async) crasha l'APK Android perché su React Native:
- `window` esiste come oggetto globale
- `window.location`, `document`, `localStorage` NON esistono

Pattern sicuro:
```js
import { Platform } from 'react-native';
const safeOrigin = Platform.OS === 'web' && typeof window !== 'undefined' && window.location
  ? window.location.origin
  : '';
```

`AppNavigator.js → linking.prefixes` usa questo pattern.

### Debug crash su telefono

ADB via USB è il modo più affidabile:
1. Scaricare Platform Tools da https://developer.android.com/tools/releases/platform-tools
2. Telefono: Opzioni Sviluppatore → Debug USB ON
3. Verificare connessione: `adb devices`
4. Filtrare crash JS: `adb logcat *:E ReactNative:V ReactNativeJS:V AndroidRuntime:E`

`App.js` ha un `ErrorBoundary` che cattura errori React e li mostra a schermo (non chiude l'app). Utile come fallback se ADB non è disponibile.

### Web hosting (futuro)

- **Web hosting:** Vercel or Netlify free tier. `npx expo export -p web` outputs static files; both providers give a free `*.vercel.app` / `*.netlify.app` subdomain with HTTPS, suitable as the production redirect URL for Brevo password-reset emails. Add the deployed URL to Supabase → Authentication → URL Configuration → Redirect URLs allowlist.
- **Custom domain (later):** when a domain is acquired, verify it as a Brevo sender (DKIM/SPF setup) and switch the Supabase sender from a personal email to `noreply@<domain>`.

## Known gaps

- Styling is only partially centralized. `DashboardScreen`, `RoomListScreen`, legacy `AnagramScreen`, and `DirectriceScreen` still define local `StyleSheet.create` blocks.
- `useRoomClosedListener` still calls `Alert.alert` directly. If web behavior matters for room-close notifications, convert it to the same cross-platform pattern used by `notify()` / `confirm()`.
- `RoomListScreen` deletes child rows from `progress`, `hints`, and `room_players` before deleting `rooms`; make sure RLS policies allow these deletes or use database cascades.
- `DashboardScreen` player removal requires a GM `DELETE` policy on `room_players`.
- `DirectriceScreen` only persists final completion, not the per-anagram solved state during the final puzzle.

## Web layout rules (scroll & re-mount)

The app runs on `react-native-web`; a few patterns are required to keep web behavior sane:

- **Global height chain (root-cause fix)**: in [App.js](LibroGame/App.js) we inject CSS at boot for `Platform.OS === 'web'` so that `html`, `body`, `#root`, and `#root > div` all have `height: 100%` (with `display: flex` on the wrapper div). Without this, `ScrollView`/`FlatList` with `flex: 1` never establish a scrollable region — the parent flex chain has no anchored height, content overflows silently, and the user sees cut content with no scrollbar. **Do not remove this injection**: every per-screen scroll fix below depends on it.
- **Screens with a `FlatList`**: use the `FlatList` as the screen root (or as the direct child of a `KeyboardAvoidingView`) and put padding/background in `style` and `contentContainerStyle`. Wrapping the `FlatList` in a `<View style={{ flex: 1, padding: ... }}>` breaks vertical scroll on short windows. This applies to `RoomListScreen`, `DashboardScreen`, `PlayerDetailScreen`.
- **Screens with form-like content**: wrap content in a `ScrollView` whose `contentContainerStyle` uses `flexGrow: 1` (NOT `flex: 1`). Avoid `justifyContent: 'center'` on the content container if the content can grow taller than the viewport — it pushes the top off-screen on short windows.
- **Cinematic / full-bleed screens** (`NarratorView` inside `CircoStanzaScreen`): keep the background as an absolutely-positioned layer behind a `ScrollView`. Move the foreground (character, dialog) into a flow layout inside the `ScrollView`. This keeps the cinematic feel on tall windows and degrades to a scrollable page on short ones.
- **Stack re-entry**: when a route is reachable from multiple paths and you may re-enter it with the same params, prefer `navigation.push(name, params)` for the forward step and `navigation.goBack()` for the backward step. `navigation.navigate(name, sameParams)` can race with the previous instance's unmount on web and present a white card. The `RoomList → Dashboard` pair uses this convention.

## Project notes

- Prefer `notify()` for informational messages and inline banners for form errors.
- Prefer `confirm()` from `lib/session.js` for destructive confirmations.
- Keep the active player flow on `CircoStanzaScreen` + `MapScreen`.
- Keep story text faithful to the source JSON.
- When adding new NPC artwork, register it in `ASSETS` in `styles/theme.js`.
- While scanning files, always ignore `node_modules/`.
- `.claude/settings.json` enables Claude-side plugin entries; `.claude/settings.local.json` currently disables `github@claude-plugins-official` locally.

## References

- `LibroGame_Checklist.md` — current task list, decisions, and roadmap.
