# LibroGame — Checklist

## ✅ Completato
- [x] Setup progetto Expo SDK 54
- [x] Configurazione Supabase + chiavi API
- [x] Persistenza sessione con AsyncStorage
- [x] Struttura cartelle progetto
- [x] Tabelle Supabase (stories, rooms, users, room_players, progress, hints)
- [x] Colonna `name` aggiunta a `rooms` (per nome personalizzato stanza)
- [x] RLS configurato su tutte le tabelle (incluse policy DELETE su rooms)
- [x] Account GM creato manualmente su Supabase
- [x] Conferma email disabilitata su Supabase
- [x] `LoginScreen` — autenticazione + redirect per ruolo con `navigation.reset` + banner errore inline
- [x] `RegisterScreen` — registrazione giocatori con validazione completa + banner errore inline
- [x] `CreateRoomScreen` — crea stanza con nome personalizzato + picker storia + aiuto automatico
- [x] `DashboardScreen` — lista giocatori in realtime + chiudi stanza + bottone torna a RoomList
- [x] `JoinRoomScreen` — **BUG FIX**: banner errore inline (no più `Alert.alert` su web) + logout + resume scena
- [x] `RoomListScreen` — elenco stanze GM (con nome) + riapri + **elimina** + logout in header
- [x] `PlayerDetailScreen` — timeline + invio hints testuali + usa `notify()` per errori
- [x] `IntroScreen` — messaggio cifrato + chiave 1–14 + check progress esistente
- [x] `SceneScreen` — testo NPC + **placeholder NPC** (riquadro colorato + emoji) + gestione duplicati progress
- [x] `AnagramScreen` — anagramma + cifrario Illusionista + timer aiuto + init solved da DB
- [x] `DirectriceScreen` — 12 anagrammi finali + check completamento esistente
- [x] Tutti i componenti (`AnagramInput`, `AutoHintEffect`, `GmHint`, `PlayerCard`, `SceneCard`) — refactored con stili da `styles/components.js`
- [x] `story/storia_1/scenes.json` (13 scene)
- [x] `story/storia_1/anagrams.json` (12 anagrammi)
- [x] `lib/helpers.js` — normalizeText, checkAnagram, generateRoomCode, formatTime + **`notify()` cross-platform**
- [x] `lib/session.js` — logout, confirmLogout, **confirm cross-platform**, resolvePlayerResumeRoute
- [x] `lib/useRoomClosedListener.js` — hook realtime chiusura stanza + hook disable back Android
- [x] `AuthLoadingScreen` — splash con verifica sessione + redirect automatico per ruolo
- [x] `AppNavigator` — `AuthLoading` come initialRoute, `gestureEnabled:false` su schermate critiche
- [x] Redirect automatico se sessione già attiva (GM → RoomList, Player → JoinRoom)
- [x] Ripresa dalla scena corretta dopo chiusura app
- [x] Listener realtime per chiusura stanza (Alert + redirect a JoinRoom)
- [x] Disabilitazione back button hardware Android nelle schermate critiche
- [x] Logout GM (header RoomList) + Logout Player (JoinRoom)
- [x] **Fix `Alert.alert` su web** — `notify()` in `lib/helpers.js` + banner inline nelle schermate critiche
- [x] **Refactoring CSS** — sistema di stili centralizzato in `styles/`:
  - [x] `styles/theme.js` — palette colori, spacing, radius, fontSize, fonts, shadows, **temi NPC** (`npcThemes` + `getNpcTheme()`)
  - [x] `styles/components.js` — stili AnagramInput, AutoHintEffect, GmHint, PlayerCard, SceneCard
  - [x] `styles/auth.js` — stili AuthLoadingScreen, LoginScreen, RegisterScreen
  - [x] `styles/gm.js` — stili CreateRoomScreen, RoomListScreen, DashboardScreen, PlayerDetailScreen
  - [x] `styles/player.js` — stili JoinRoomScreen, IntroScreen, SceneScreen (+ NPC placeholder), AnagramScreen, DirectriceScreen
- [x] **Placeholder NPC** — riquadro colorato con emoji e nome per ogni circo-stanza (`SceneScreen` + `AnagramScreen` con mini-placeholder)

---

## 🔄 Da Testare / Verificare (in esecuzione reale)
- [ ] Persistenza sessione dopo refresh pagina (web) e riapertura app (mobile)
- [ ] Resume automatico: player che chiude l'app e rientra con il codice stanza
- [ ] Listener chiusura stanza: player in gioco deve ricevere l'Alert
- [ ] Timer Aiuto Automatico: rispetto dei tempi impostati e loop corretto
- [ ] Hints GM in realtime: compaiono nell'AnagramScreen senza refresh manuale
- [ ] Back button Android: non deve permettere di uscire dalle schermate critiche
- [ ] Logout: reset completo dello stack e ritorno al Login
- [ ] Eliminazione stanza: deve davvero rimuovere la riga (verificare policy DELETE)
- [ ] Flusso end-to-end: dall'Intro fino al completamento della Direttrice
- [ ] **JoinRoomScreen fix**: verificare che il banner errore sia visibile su web e mobile per tutti i casi (codice errato, stanza chiusa, stanza non trovata)
- [ ] **Placeholder NPC**: verificare che i colori e le emoji siano corretti per ogni circo-stanza

---

## ⬜ Da Implementare

### Design e Grafica
- [ ] Sostituzione placeholder NPC con immagini reali (struttura già pronta: basta sostituire `<Text emoji>` con `<Image source={...} />`)
- [ ] Identità visiva raffinata per ogni schermata NPC (animazioni, oggetti interattivi)
- [ ] Varianti di `AutoHintEffect` per scena (non solo bordo oro)
- [ ] Splash/icona app personalizzata
- [ ] Design rifinito Dashboard GM e PlayerDetail

### Distribuzione
- [ ] Emulatore Android per test più accurati
- [ ] Build APK tramite EAS Build
- [ ] Build iOS tramite EAS Build (opzionale)

### Robustezza
- [ ] Gestione errori di rete (timeout Supabase, retry automatici)
- [ ] Messaggi di errore più user-friendly
- [ ] Indicatori di caricamento in più punti (es. fetch iniziali delle scene)
- [ ] Gestire il caso edge in cui il player si collega a una stanza in cui era già entrato ma è stata chiusa e poi riaperta con lo stesso codice

---

## 🔧 Miglioramenti Futuri
- [ ] Aggiungere altre storie (struttura già scalabile con `story_id`)
- [ ] Multi-GM (permettere più GM per stanza)
- [ ] Statistiche partita (tempo totale, numero errori, hints ricevuti)
- [ ] Export cronologia stanza per il GM
- [ ] Traduzioni multilingue

---

## 📝 Decisioni di design prese

1. **Resume scena**: ultima scena con `entered_at` più recente; casi speciali per `intro`, `illusionista`, `direttrice`.
2. **Chiusura stanza durante gioco**: Alert + reset a `JoinRoom`, la sessione login resta attiva.
3. **Back Android**: disabilitato in tutte le schermate critiche via `BackHandler`.
4. **Logout**: bottone in header (RoomList GM) e link discreto (JoinRoom Player).
5. **Initial route**: `AuthLoading` — unica fonte di verità per dove va l'utente all'avvio.
6. **Cross-platform Alert**: `notify()` in `lib/helpers.js` usa `window.alert` su web e `Alert.alert` su mobile. Da preferire ad `Alert.alert` diretto per messaggi informativi. `confirm()` in `lib/session.js` resta per le conferme distruttive (logout, elimina stanza).
7. **Nome stanza**: campo `name` opzionale su `rooms` per permettere al GM di distinguere più sessioni in parallelo.
8. **Eliminazione stanza**: il GM può eliminare definitivamente le sue stanze (richiede policy `gm elimina stanza` su Supabase).
9. **Banner errore inline**: le schermate con form (Login, Register, JoinRoom, CreateRoom, PlayerDetail) mostrano gli errori tramite un banner `<View>` inline invece di `Alert.alert` — funziona sia su web che su mobile.
10. **Stili centralizzati**: tutti gli stili sono in `styles/`. Nessun `StyleSheet.create` diretto nelle schermate. I token (colori, spacing, radius, fontSize) sono definiti una sola volta in `theme.js`.
11. **Placeholder NPC**: ogni circo-stanza ha un colore tematico + emoji definiti in `npcThemes` (`theme.js`). La funzione `getNpcTheme(sceneId)` ritorna il tema con fallback. Quando arriveranno le grafiche reali, basterà sostituire l'emoji con un `<Image>`.
