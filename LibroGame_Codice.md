# LibroGame — Codice: Stato Attuale

## Stack
- React Native + Expo SDK 54
- `@supabase/supabase-js`
- `@react-navigation/native` + `@react-navigation/stack`
- `react-native-screens@~4.16.0`
- `react-native-safe-area-context@~5.6.0`
- `react-native-gesture-handler@~2.28.0`
- `react-dom` + `react-native-web` (per sviluppo web)
- `@react-native-picker/picker` (menu a tendina)
- `@react-native-async-storage/async-storage` (persistenza sessione)

### Note importanti
- `package.json` ha `expo: "~54.0.33"` — NON aggiornare a ^55.0.0
- Per avviare in sviluppo: `npx expo start --web`
- Branch principale: **`main`** (su GitHub)
- `Alert.alert` non funziona sul web — usare `notify()` da `lib/helpers.js` per messaggi semplici, `confirm()` da `lib/session.js` per conferme distruttive

---

## File Completati ✅

### `lib/supabase.js` ✅
Client Supabase configurato con `AsyncStorage` per la persistenza sessione.

### `lib/helpers.js` ✅
- `normalizeText(text)` — rimuove accenti, apostrofi, punteggiatura, maiuscole → per confronto anagrammi
- `checkAnagram(userAnswer, solution)` — wrapper che confronta due stringhe normalizzate
- `generateRoomCode()` — 6 cifre numeriche
- `formatTime(seconds)` — mm:ss per il timer
- **`notify(title, message)`** — wrapper cross-platform per avvisi informativi: usa `window.alert` sul web, `Alert.alert` su mobile. Da preferire ad `Alert.alert` diretto.

### `lib/session.js` ✅
Utility centralizzate per la sessione:
- `logout(navigation)` — `supabase.auth.signOut()` + reset stack al Login
- `confirmLogout(navigation)` — alert/confirm di conferma + logout
- `confirm(title, message, onConfirm, destructive)` — wrapper cross-platform per conferme distruttive (usa `window.confirm` sul web, `Alert.alert` su mobile)
- `resolvePlayerResumeRoute(room, playerId)` — calcola la scena corretta alla ripresa del gioco leggendo `progress`. Ritorna `{ screen, params }` da passare a `navigation.reset`.

### `lib/useRoomClosedListener.js` ✅
Due hook React condivisi:
- `useRoomClosedListener(room, navigation)` — sottoscrive `UPDATE` su `rooms` in realtime. Se `status` diventa `'closed'` → Alert + redirect a `JoinRoom`.
- `useDisableAndroidBack()` — disabilita il tasto back hardware di Android mentre la schermata è montata.

---

## `styles/` — Sistema di stili centralizzato ✅

### `styles/theme.js` ✅
Token di design condivisi da tutti i file di stile:
- `colors` — palette completa: sfondi dark/light, accent oro (`primary`), testo, stati semantici (success/error/warning), colori badge GM
- `spacing` — sistema modulare (xs=4 … huge=40)
- `radius` — border radius (sm=6 … pill=20 … round=999)
- `fontSize` — scala tipografica (xs=12 … display=40)
- `fonts` — `mono`: Courier su iOS, monospace su Android/web (per messaggi cifrati)
- `shadows` — sm/md/lg con elevation per Android
- **`npcThemes`** — mappa `sceneId → { color, emoji, label }` con colore tematico e icona per ogni circo-stanza (intro, acrobata, funambolo, giocoliere, pagliaccio, trapezista, cavallerizza, contorsionista, controfigura, domatore, equilibrista, sputafuoco, illusionista, direttrice)
- **`getNpcTheme(sceneId)`** — helper che ritorna il tema NPC con fallback a `{ color: primary, emoji: '🎪', label: 'Circo-stanza' }`

### `styles/components.js` ✅
Stili per i componenti riutilizzabili:
- `anagramInputStyles` — campo testo anagramma con bordo errore
- `autoHintEffectStyles` — overlay lampeggiante oro (bordo 4px, zIndex 1000)
- `gmHintStyles` — banner suggerimento GM (giallo, bordo sinistro)
- `playerCardStyles` — card giocatore in Dashboard (sfondo chiaro, shadow)
- `sceneCardStyles` — card scena/NPC per navigazione

### `styles/auth.js` ✅
- `authLoadingStyles` — splash: sfondo dark, titolo oro, spinner
- `loginStyles` — form centrato su dark + `errorBanner` inline
- `registerStyles` — form scrollabile su dark + `errorBanner` inline

### `styles/gm.js` ✅
- `createRoomStyles` — form su sfondo chiaro con label/input/picker
- `roomListStyles` — lista card con badge open/closed, azioni (Entra/Chiudi/Riapri/Elimina), FAB "Crea Stanza" in basso
- `dashboardStyles` — box codice stanza grande, lista giocatori, bottone chiudi
- `playerDetailStyles` — timeline verticale con dot colorati (verde=solved, arancio=pending), sezione invio hint

### `styles/player.js` ✅
- `joinRoomStyles` — input codice centrato e grande, `errorBanner` inline, link logout
- `introStyles` — cifrario, griglia chiave, campo risposta su dark
- `sceneStyles` — include stili del **placeholder NPC** (`npcPlaceholder`, `npcPlaceholderInner`, `npcEmoji`, `npcLabel`, `npcThemeTag`, `npcPlaceholderHint`)
- `anagramScreenStyles` — include `npcMini` (mini-placeholder NPC in cima alla schermata anagramma), box anagramma, choice buttons con emoji integrata
- `directriceStyles` — placeholder Direttrice dorato, barra progresso, griglia navDot, completionBox

---

## Schermate ✅

### `screens/auth/AuthLoadingScreen.js` ✅
Splash iniziale. Verifica sessione e reindirizza per ruolo. Importa stili da `styles/auth`.

### `screens/auth/LoginScreen.js` ✅
- Sanitizzazione + validazione email + `supabase.auth.signInWithPassword`
- **Errori mostrati tramite banner inline** `errorMsg` (no `Alert.alert`)
- Importa stili da `styles/auth`, usa `notify()` da `lib/helpers`
- Redirect per ruolo con `navigation.reset`

### `screens/auth/RegisterScreen.js` ✅
- Validazioni complete (username min 3, email regex, password min 6, conferma)
- **Errori mostrati tramite banner inline**
- Usa `notify()` per conferma registrazione completata
- Importa stili da `styles/auth`

### `screens/gm/CreateRoomScreen.js` ✅
- Picker storia + picker Aiuto Automatico + generazione codice univoco + campo nome stanza
- **Errori mostrati tramite banner inline**
- Importa stili da `styles/gm`

### `screens/gm/DashboardScreen.js` ✅
- Codice stanza, lista giocatori in realtime, chiudi stanza
- Bottone ← Stanze nell'header. Importa stili da `styles/gm`.

### `screens/gm/PlayerDetailScreen.js` ✅
- Timeline verticale con dot colorati + invio hint testuali
- Usa `notify()` per errori di validazione/invio
- Realtime su `progress`. Importa stili da `styles/gm`.

### `screens/gm/RoomListScreen.js` ✅
- Lista stanze con nome/codice/storia/stato
- Azioni: Entra, Chiudi, Riapri, Elimina (con `confirm()` cross-platform)
- Importa stili da `styles/gm`

### `screens/player/JoinRoomScreen.js` ✅
**🔧 BUG FIX — "premo Entra ma non succede nulla":**
Il vecchio codice usava `Alert.alert` che non funziona sul web di Expo. Tutti gli errori (codice invalido, stanza non trovata, stanza chiusa ecc.) erano invisibili. Soluzione: tutti gli errori ora mostrati tramite banner `errorMsg` inline. Il banner si azzera quando l'utente modifica il campo codice.
- Input codice 6 cifre, validazione, verifica stanza aperta
- Usa `maybeSingle()` per evitare errori su stanza non trovata
- Chiama `resolvePlayerResumeRoute` e fa `navigation.reset` alla scena giusta
- Link "Esci dall'account" in basso con `confirmLogout`
- Importa stili da `styles/player`

### `screens/player/IntroScreen.js` ✅
- Cifrario + chiave 1–14 + decodifica + check progress esistente
- `useRoomClosedListener` + `useDisableAndroidBack`
- Importa stili da `styles/player`

### `screens/player/SceneScreen.js` ✅
- Testo NPC + bottone "Affronta l'anagramma"
- **Placeholder NPC**: riquadro colorato in cima (colore da `getNpcTheme`), emoji grande, nome NPC, tag tema. Etichetta "placeholder grafico" discreta in basso a destra — da rimuovere quando arriveranno le immagini reali.
- Salva/aggiorna `progress` (anti-duplicati, `entered_at` aggiornato al rientro)
- `useRoomClosedListener` + `useDisableAndroidBack`
- Importa stili da `styles/player`, `getNpcTheme` da `styles/theme`

### `screens/player/AnagramScreen.js` ✅
- Input anagramma + cifrario (solo Illusionista) + timer aiuto automatico + hints GM
- **Mini-placeholder NPC** nella parte superiore: riga orizzontale con emoji + nome NPC + tema
- Colore del bordo sinistro del mini-placeholder preso da `getNpcTheme`
- Choice buttons scena successiva con emoji NPC integrata
- `useRoomClosedListener` + `useDisableAndroidBack`
- Importa stili da `styles/player`

### `screens/player/DirectriceScreen.js` ✅
- 12 anagrammi + navigazione libera + skip + barra progresso
- **Placeholder Direttrice**: riquadro dorato con emoji 🎩
- Check progress esistente, anti-duplicati
- `useRoomClosedListener` + `useDisableAndroidBack`
- Importa stili da `styles/player`

---

## Componenti ✅

### `components/AnagramInput.js` ✅
Importa `anagramInputStyles` da `styles/components`.

### `components/AutoHintEffect.js` ✅
Importa `autoHintEffectStyles` da `styles/components`.

### `components/GmHint.js` ✅
Importa `gmHintStyles` da `styles/components`. Mostra solo l'ultimo hint ricevuto.

### `components/PlayerCard.js` ✅
Importa `playerCardStyles` da `styles/components`.

### `components/SceneCard.js` ✅
Importa `sceneCardStyles` da `styles/components`.

---

## Dati di storia ✅

### `story/storia_1/scenes.json` + `anagrams.json` ✅
13 scene complete + 12 anagrammi di scena + 12 anagrammi finali.

---

## Navigazione ✅

### `navigation/AppNavigator.js` ✅
- Initial route: **AuthLoading**
- Schermate critiche con `headerLeft: () => null` e `gestureEnabled: false`

### `App.js` ✅
Punto di ingresso. Renderizza solo `AppNavigator`.

---

## Regole di Sviluppo
- **Sanitizzare sempre gli input utente** — trim, lowercase dove appropriato
- **Commenti su tutto il codice** — ogni import, funzione e blocco logico
- **Un file alla volta** — si testa ogni schermata prima di passare alla successiva
- **Fedeltà alla storia originale** — i testi delle scene non vanno modificati
- **Chiedere sempre prima di procedere** — se qualcosa non è chiaro, chiedere
- **Nessun StyleSheet nelle schermate** — tutti gli stili in `styles/`; i token in `theme.js`
- **No `Alert.alert` diretto** — usare `notify()` per messaggi semplici, `confirm()` per conferme, banner inline per errori di form

---

## Decisioni di design importanti

1. **Ripresa scena**: il player rientrato in una stanza viene riportato all'ultima scena con `entered_at` più recente. Casi speciali in `resolvePlayerResumeRoute`: `intro` + solved → `Scene 'acrobata'`; `illusionista` + solved → `Direttrice`; `direttrice` → `Direttrice`; altri → `Anagram` di quella scena.

2. **Chiusura stanza mentre il player gioca**: `useRoomClosedListener` mostra un Alert e fa `reset` a `JoinRoom`. Il player resta loggato.

3. **Back button Android**: `useDisableAndroidBack` impedisce il back hardware nelle schermate critiche.

4. **Anti-duplicati progress**: tutte le scene usano `maybeSingle()` prima dell'insert. `SceneScreen` aggiorna `entered_at` al rientro per ri-avviare il timer aiuto.

5. **Cross-platform notifiche**: `notify()` (lib/helpers) per messaggi informativi one-shot; `confirm()` (lib/session) per conferme distruttive; banner inline `errorMsg` per errori di form — tutti e tre i pattern funzionano su web e mobile.

6. **Placeholder NPC**: `npcThemes` in `theme.js` assegna a ogni `sceneId` un colore tematico, emoji e label. `getNpcTheme(sceneId)` ritorna il tema. La struttura in `SceneScreen` è già pronta per sostituire il `<Text emoji>` con un `<Image>` senza toccare il layout.

7. **Bug JoinRoomScreen**: la root cause era `Alert.alert` silente sul web. Fix: banner inline per tutti gli errori (codice vuoto, formato errato, stanza non trovata, stanza chiusa, errore DB, sessione invalida, errore upsert).

---

## Prossimo Step
1. Test end-to-end su Android (build APK via EAS)
2. Sostituzione placeholder NPC con immagini/grafica reale
3. Gestione errori di rete più robusta
