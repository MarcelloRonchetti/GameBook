# LibroGame — Checklist

## ✅ Completato

- [x] Setup progetto Expo SDK 54
- [x] Dipendenze principali installate: Supabase, React Navigation, AsyncStorage, Picker, React Native Web
- [x] Configurazione Supabase + anon key in `lib/supabase.js`
- [x] Persistenza sessione Supabase con AsyncStorage
- [x] Struttura cartelle progetto in `LibroGame/`
- [x] Tabelle Supabase documentate: `stories`, `rooms`, `users`, `room_players`, `progress`, `hints`
- [x] Colonna `name` su `rooms` per il nome personalizzato della stanza
- [x] Account GM creato manualmente su Supabase
- [x] Conferma email disabilitata su Supabase
- [x] `AuthLoadingScreen` — verifica sessione + redirect automatico per ruolo
- [x] `LoginScreen` — autenticazione + redirect GM/player + banner errore inline
- [x] `RegisterScreen` — registrazione player con validazione completa + banner errore inline
- [x] `CreateRoomScreen` — crea stanza con nome, storia e timer aiuto automatico
- [x] `RoomListScreen` — elenco stanze GM con entra/chiudi/riapri/elimina + logout header
- [x] `DashboardScreen` — codice stanza, stato stanza, player in realtime, rimozione player, chiusura stanza
- [x] `PlayerDetailScreen` — timeline player + invio hints testuali
- [x] `JoinRoomScreen` — validazione codice, join stanza aperta, resume automatico, logout player
- [x] `IntroScreen` — messaggio cifrato iniziale + chiave 1-14 + sblocco Acrobata sulla mappa
- [x] `MapScreen` — mappa interattiva con nodi, percorsi, fog of war e stati scena
- [x] `CircoStanzaScreen` — schermata attiva unificata con narrazione + anagramma
- [x] `NarratorView` — testo tipo dialogo con typewriter e fallback placeholder
- [x] `AnagramOverlay` — pannello anagramma, hints GM, cifrario Illusionista, scelte successive
- [x] `DirectriceScreen` — 12 anagrammi finali + completamento salvato in `progress`
- [x] Route legacy `SceneScreen` e `AnagramScreen` mantenute in navigation per compatibilità
- [x] `story/storia_1/scenes.json` con intro, scene NPC, Illusionista e Direttrice
- [x] `story/storia_1/anagrams.json` con 12 anagrammi di scena
- [x] `styles/theme.js` — token grafici, `npcThemes`, `STORY_GRAPH`, `MAP_NODES`, registro `ASSETS`
- [x] Asset reali iniziali: mappa, sprite Acrobata, background Acrobata
- [x] Fallback grafico con colori/emoji per NPC senza asset
- [x] `lib/helpers.js` — normalizeText, checkAnagram, generateRoomCode, formatTime, `notify()`
- [x] `lib/session.js` — logout, confirmLogout, confirm cross-platform, resolvePlayerResumeRoute
- [x] `lib/useRoomClosedListener.js` — listener realtime chiusura stanza + disable back Android
- [x] Logout GM e Player
- [x] Errori form critici tramite banner inline invece di `Alert.alert`

---

## 🔄 Da Testare / Verificare

- [ ] Installazione pulita da zero con `npm install`
- [ ] Avvio web con `npm run web`
- [ ] Avvio Android con `npm run android`
- [ ] Verificare/aggiungere `react-native-svg`: `MapScreen` lo importa ma non è dichiarato in `package.json`
- [ ] Persistenza sessione dopo refresh pagina e riapertura app
- [ ] Resume player: nessun progress, intro solved, scena solved, scena non solved, Illusionista solved, Direttrice
- [ ] Flusso end-to-end attivo: `Intro` -> `Map` -> `CircoStanza` -> `Map` -> `Illusionista` -> `Direttrice`
- [ ] Timer Aiuto Automatico: rispetto dei minuti impostati, effetto 10 secondi, loop e stop dopo soluzione
- [ ] Hints GM in realtime dentro `AnagramOverlay`
- [ ] Listener chiusura stanza mentre il player è in `Intro`, `Map`, `CircoStanza` e `Direttrice`
- [ ] Back button Android nelle schermate critiche
- [ ] Logout: reset completo stack e ritorno al Login
- [ ] RoomList: chiudi/riapri/elimina stanza con feedback visibile
- [ ] Dashboard: rimozione player dalla stanza
- [ ] RLS delete: eliminazione stanza e rimozione player non devono fallire per policy mancanti
- [ ] Rendering asset: `circus_map.png`, `acrobata.png`, `acrobata_bg.png`
- [ ] Map layout su mobile landscape/portrait e web
- [ ] Direttrice: comportamento al refresh durante i 12 anagrammi finali

---

## ⬜ Da Correggere / Allineare

### Dipendenze

- [ ] Aggiungere `react-native-svg` a `package.json` oppure rimuovere l'uso di `Svg`/`Line` da `MapScreen`
- [ ] Verificare compatibilità Expo SDK 54 prima di aggiornare dipendenze principali

### Cross-platform

- [ ] Convertire `useRoomClosedListener` da `Alert.alert` diretto a pattern cross-platform (`notify()` o gestione web dedicata)
- [ ] Sostituire gli `Alert.alert` residui in `RoomListScreen` con `notify()`

### Stili

- [ ] Centralizzare gli stili ancora locali in `DashboardScreen`
- [ ] Centralizzare gli stili ancora locali in `RoomListScreen`
- [ ] Centralizzare o rimuovere gli stili locali della route legacy `AnagramScreen`
- [ ] Collegare `DirectriceScreen` a `directriceStyles` in `styles/player.js`
- [ ] Rivedere `styles/player.js`: `directriceStyles` e `anagramScreenStyles` esistono ma non sono pienamente usati

### Supabase / RLS

- [ ] Aggiungere/verificare policy `DELETE` GM su `room_players` per rimozione player da Dashboard
- [ ] Aggiungere/verificare policy `DELETE` GM su `progress`, `hints`, `room_players` o configurare cascade delete per eliminazione stanza
- [ ] Gestire gli errori delle delete intermedie in `RoomListScreen` invece di ignorarli
- [ ] Valutare edge case: player in stanza chiusa e poi riaperta con stesso codice

### Gameplay

- [ ] Persistenza parziale degli anagrammi risolti in `DirectriceScreen`
- [ ] Verificare che `CircoStanzaScreen` in modalità anagramma mostri correttamente background/sprite quando gli asset esistono
- [ ] Decidere se rimuovere definitivamente `SceneScreen` e `AnagramScreen` quando il nuovo flusso è stabile

### Tooling

- [ ] Verificare intenzionalità di `.claude/settings.local.json`: disabilita `github@claude-plugins-official` anche se `.claude/settings.json` lo abilita

---

## 🎨 Design e Grafica

- [ ] Aggiungere immagini reali per tutti gli NPC mancanti
- [ ] Aggiungere background stanza per tutti gli NPC mancanti
- [ ] Raffinare mappa e coordinate dei nodi dopo test su dispositivi reali
- [ ] Varianti di `AutoHintEffect` per scena
- [ ] Splash/icona app personalizzata
- [ ] Rifinitura visuale di Dashboard GM e PlayerDetail

---

## 🚀 Distribuzione

- [ ] Emulatore Android per test più accurati
- [ ] Build APK tramite EAS Build
- [ ] Build iOS tramite EAS Build, opzionale

---

## 🔧 Miglioramenti Futuri

- [ ] Aggiungere altre storie tramite struttura `story_id`
- [ ] Multi-GM per stanza
- [ ] Statistiche partita: tempo totale, errori, hints ricevuti
- [ ] Export cronologia stanza per il GM
- [ ] Traduzioni multilingue
- [ ] Pannello admin per gestire storie e asset senza modificare JSON

---

## 📝 Decisioni di Design Prese

1. **Initial route**: `AuthLoading` è la fonte di verità all'avvio.
2. **GM account**: creato manualmente, registrazione app solo per player.
3. **Resume scena**: ultima riga `progress` per `entered_at`, con casi speciali in `resolvePlayerResumeRoute`.
4. **Flusso player attivo**: `Intro` sblocca `Map`; la scena viene giocata in `CircoStanza`; le scelte passano dalla mappa.
5. **Scene legacy**: `SceneScreen` e `AnagramScreen` restano per compatibilità ma non sono la strada principale.
6. **Chiusura stanza**: listener realtime su `rooms`; il player deve essere riportato a `JoinRoom`.
7. **Back Android**: disabilitato nelle schermate critiche.
8. **Cross-platform UI**: banner inline per errori form, `notify()` per messaggi, `confirm()` per conferme.
9. **Nome stanza**: campo `name` opzionale per gestire più sessioni GM.
10. **Grafica NPC**: asset reali se presenti; fallback con tema colore + emoji da `npcThemes`.
11. **Storia**: testi e anagrammi vivono in JSON locale; il grafo navigazione è in `styles/theme.js`.
