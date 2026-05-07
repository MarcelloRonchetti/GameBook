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
- [x] RLS configurato su tutte le tabelle (vedi `CLAUDE.md` → Database → RLS)
- [x] `AuthLoadingScreen` — verifica sessione + redirect automatico per ruolo
- [x] `LoginScreen` — autenticazione + redirect GM/player + banner errore inline
- [x] `RegisterScreen` — registrazione player con validazione completa + banner errore inline
- [x] `CreateRoomScreen` — crea stanza con nome, storia e timer aiuto automatico
- [x] `RoomListScreen` — elenco stanze GM con entra/chiudi/riapri/elimina + logout header
- [x] `DashboardScreen` — codice stanza, stato stanza, player in realtime, rimozione player, chiusura stanza
- [x] `PlayerDetailScreen` — timeline player + invio hints testuali
- [x] `JoinRoomScreen` — validazione codice, join stanza aperta, resume automatico, logout player
- [x] Fix `JoinRoomScreen`: codici stanza con zeri iniziali preservati tramite `.padStart(6, '0')` dopo il `trim()`
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
- [x] Aggiunto `react-native-svg` a `LibroGame/package.json` per evitare il crash di `MapScreen` su installazione pulita
- [x] Fix scroll web globale in `App.js`: iniezione CSS al boot (`html, body, #root { height: 100% }` + flex chain sul wrapper) — root cause: senza un'altezza ancorata sulla catena document → root, `ScrollView`/`FlatList` con `flex: 1` non riescono a stabilire un'area scrollabile e il contenuto viene tagliato senza scorrimento. Tutti i fix per-schermata dipendono da questo.
- [x] Fix scroll web in `RoomListScreen`, `DashboardScreen`, `PlayerDetailScreen`: rimosso wrapper `<View flex:1+padding>` e portato padding/bg in `style`/`contentContainerStyle` della `FlatList`
- [x] Fix scroll web in `CreateRoomScreen`: aggiunto `paddingBottom` extra al container per non lasciare il bottone "Crea Stanza" a filo del fondo
- [x] Fix scroll web in `CircoStanzaScreen` (modalità narrazione): `NarratorView` ora avvolge il contenuto in una `ScrollView`; sprite e dialog usano flow layout invece di posizionamento assoluto
- [x] Fix bug schermo bianco rientrando in una stanza dal `RoomList`: `RoomListScreen.handleEnterRoom` ora usa `navigation.push('Dashboard', …)` invece di `navigate`, e l'header back di `DashboardScreen` usa `navigation.goBack()` invece di `navigate('RoomList')`
- [x] `AutoHintEffect` refactored: supporta PNG trasparenti con `tintColor` oro + animazione pulsante (gold silhouette). Modalità immagine (`hintImage` + `hintImageStyle`) e fallback bordo oro schermo intero
- [x] `getHintAsset` + `HINT_POSITIONS` aggiunti a `theme.js` per hint image e posizionamento per-scena. Asset hint Acrobata registrato (`assets/hints/acrobata_hint.png`)
- [x] `NarratorView` — refactor completo: sfondo reso con `renderBackground()` (funzione inline, non componente) per evitare unmount/remount e flash nero; placeholder colore NPC prima del backgroundAsset per evitare schermo nero al caricamento
- [x] `NarratorView` — modalità "quick view" al ritorno dall'anagramma: typewriter saltato, mostrati direttamente due pulsanti ("Rileggi il testo" / "Affronta l'anagramma"). Prop `skipNarration` da `CircoStanzaScreen`
- [x] `NarratorView` — `AutoHintEffect` spostato dentro (era in `CircoStanzaScreen`): hint visibile solo in modalità narrazione e posizionato sotto al dialog (zIndex 1, dialog zIndex 2)
- [x] `CircoStanzaScreen` — modalità anagramma mostra sfondo reale + overlay scuro + personaggio (zIndex: 0 per stare dietro al pannello `AnagramOverlay`)
- [x] `CircoStanzaScreen` — guard `if (!progressLoaded || !scene)` semplificato a `if (!scene)` per render immediato senza attendere Supabase
- [x] `CircoStanzaScreen` — `returnedFromAnagram` inizializzato a `false` (non da `initialMode`) per evitare quick view alla prima entrata
- [x] `CircoStanzaScreen` — `handleGoToMap` aggiunto: porta alla mappa con tutti i next choices come `nextAvailable`
- [x] `AnagramOverlay` — sezione "risolto" (non-Illusionista): rimossi pulsanti di scelta NPC, aggiunto tasto unico "🗺️ Vai alla mappa →" che chiama `onGoToMap`; mantenuta la domanda `scene.question` + sottotitolo "Sia fatta la vostra volontà."
- [x] `ImagePreloader` persistente in `App.js`: renderizza `<Image>` nascosti (1×1 px) per mappa, backgrounds e characters dopo 100 ms dal boot — previene ri-decodifica su web ad ogni navigazione
- [x] `MapScreen` — `Asset.loadAsync` per precaricamento backgrounds e characters su native mentre il player vede la mappa
- [x] `ForgotPasswordScreen` — input email + invio link recupero via Supabase + Brevo SMTP, banner errore inline, pannello successo "Controlla la tua email"
- [x] `ResetPasswordScreen` — due input password (nuova + conferma), validazione (min 6, match), `supabase.auth.updateUser({ password })`, signOut + reset a Login al successo, direct-visit guard "Link non valido o scaduto" + listener `onAuthStateChange` con timeout di sicurezza 2s
- [x] `lib/resetRedirect.js` — helper `getResetRedirect()` cross-platform per la URL del link di recupero
- [x] `LoginScreen` — link "Password dimenticata?" tra "Accedi" e "Registrati"
- [x] `AuthLoadingScreen` — handler evento `PASSWORD_RECOVERY` di Supabase: redirige a `ResetPassword` invece che alla home in base al ruolo (con `recoveryFired` guard contro la race con `getSession()`)
- [x] `AppNavigator` — route `ForgotPassword` e `ResetPassword` registrate + `linking` config sul `NavigationContainer` per mappare `/reset-password` su web (deep link `librogame://` registrato come placeholder per il futuro build EAS)
- [x] `lib/supabase.js` — `detectSessionInUrl: Platform.OS === 'web'` per permettere al client di processare il fragment `#access_token=...&type=recovery` dell'URL al boot (richiesto per il flusso di recupero password)
- [x] Supabase SMTP via Brevo (free tier 300 email/giorno) configurato; template "Reset Password" tradotto in italiano; redirect URL allowlist aggiornata con `http://localhost:8081/reset-password`

---

## 🔄 Da Testare / Verificare

- [ ] Installazione pulita da zero con `npm install`
- [ ] Avvio web con `npm run web`
- [ ] Avvio Android con `npm run android`
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
- [ ] Verifica scroll su web a finestra ridotta in: `CreateRoom`, `RoomList`, `Dashboard`, `PlayerDetail`, `CircoStanza` modalità narrazione (start scene Acrobata)
- [ ] Verifica che entrando in una stanza, tornando a `RoomList` e rientrando nella stessa stanza, il `Dashboard` si rimonti correttamente (niente schermo bianco) sia su web sia su mobile
- [ ] Verifica che la `MapScreen` e la `DirectriceScreen` non abbiano lo stesso problema di scroll su web a finestra ridotta
- [ ] Recupero password end-to-end con vari client email (Gmail, Outlook): link cliccato apre `ResetPasswordScreen` correttamente e la nuova password funziona al login successivo
- [ ] Recupero password con email non registrata: comportamento atteso = pannello di successo (Supabase non rivela se l'utente esiste)
- [ ] Apertura diretta di `/reset-password` senza link → banner "Link non valido o scaduto"
- [ ] Recupero password mentre un altro utente è loggato: dopo update + signOut lo stack riparte da Login pulito

---

## ⬜ Da Correggere / Allineare

### Dipendenze

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
- [x] Verificare che `CircoStanzaScreen` in modalità anagramma mostri correttamente background/sprite quando gli asset esistono — risolto
- [ ] Decidere se rimuovere definitivamente `SceneScreen` e `AnagramScreen` quando il nuovo flusso è stabile

### Tooling

- [ ] Verificare intenzionalità di `.claude/settings.local.json`: disabilita `github@claude-plugins-official` anche se `.claude/settings.json` lo abilita

---

## 🎨 Design e Grafica

- [ ] Aggiungere immagini reali per tutti gli NPC mancanti
- [ ] Aggiungere background stanza per tutti gli NPC mancanti
- [ ] Raffinare mappa e coordinate dei nodi dopo test su dispositivi reali
- [x] Sistema `AutoHintEffect` per-scena implementato (componente, `getHintAsset`, `HINT_POSITIONS`) — asset Acrobata (`acrobata_hint.png`) da posizionare in `assets/hints/`; coordinate calibrate: `top: 8.9%, left: 38.1%, width: 30%, height: 49.2%`
- [ ] Aggiungere asset hint per gli altri NPC (Funambolo, Giocoliere, ecc.)
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
- [ ] Gestione errori di rete più robusta

---

## 📝 Decisioni di Design Prese

1. **Initial route**: `AuthLoading` è la fonte di verità all'avvio.
2. **GM account**: creato manualmente, registrazione app solo per player.
3. **Resume scena**: `resolvePlayerResumeRoute` calcola la scena corretta leggendo `progress` (vedi `CLAUDE.md` → Resume logic).
4. **Flusso player attivo**: `Intro` sblocca `Map`; la scena viene giocata in `CircoStanza`; le scelte passano dalla mappa.
5. **Scene legacy**: `SceneScreen` e `AnagramScreen` restano per compatibilità ma non sono la strada principale.
6. **Chiusura stanza**: listener realtime su `rooms`; il player deve essere riportato a `JoinRoom` (resta loggato).
7. **Back Android**: disabilitato nelle schermate critiche tramite `useDisableAndroidBack`.
8. **Cross-platform UI**: banner inline per errori form, `notify()` per messaggi, `confirm()` per conferme distruttive — niente `Alert.alert` diretto.
9. **Nome stanza**: campo `name` opzionale su `rooms` per gestire più sessioni GM in parallelo.
10. **Grafica NPC**: asset reali se presenti; fallback con tema colore + emoji da `npcThemes`. La struttura UI è già pronta per sostituire `<Text emoji>` con `<Image>`.
11. **Storia**: testi e anagrammi vivono in JSON locale (`story/storia_1/`); il grafo navigazione è in `styles/theme.js` (`STORY_GRAPH`).
12. **Anti-duplicati progress**: tutte le scene usano `maybeSingle()` prima dell'insert. `SceneScreen` aggiorna `entered_at` al rientro per ri-avviare il timer aiuto.
13. **Bug fix `JoinRoomScreen`**: root cause era `Alert.alert` silente sul web — risolto con banner inline per tutti gli errori (codice vuoto/errato, stanza non trovata/chiusa, errore DB, sessione invalida, errore upsert).
14. **Stack Expo SDK 54**: `expo` pinnato a `~54.0.34` — non aggiornare a 55. Expo Go non è compatibile (richiede SDK 55).
15. **Bug fix `JoinRoomScreen` — zeri iniziali**: la validazione applicava `.trim()` al codice stanza ma perdeva gli zeri iniziali (es. `001234` → `1234`), facendo fallire il match a 6 cifre. Risolto aggiungendo `.padStart(6, '0')` dopo il `trim()` in modo che il codice torni sempre a 6 caratteri prima della query Supabase.
16. **Layout web — `FlatList` come root di schermata**: le schermate `RoomListScreen`, `DashboardScreen`, `PlayerDetailScreen` avvolgevano la `FlatList` in un `<View style={{ flex: 1, padding: 20 }}>`. Su `react-native-web` questo wrapper bloccava lo scroll interno della lista quando il contenuto eccedeva la viewport. Risolto rendendo la `FlatList` la radice della schermata (o figlio diretto del `KeyboardAvoidingView` per `PlayerDetail`) e spostando padding/bg in `style` + `contentContainerStyle`.
17. **Layout web — `NarratorView` scrollabile**: la modalità narrazione di `CircoStanzaScreen` posizionava sprite e dialog box in `position: absolute`. Su finestre piccole il dialog usciva dalla viewport e non era raggiungibile (niente scroll). Risolto convertendo sprite e dialog in flow layout dentro una `ScrollView`; lo sfondo e l'overlay restano assoluti dietro al contenuto scrollabile per preservare il look cinematografico su finestre alte.
18. **Bug fix — schermo bianco al rientro in `Dashboard`**: con `navigation.navigate('Dashboard', { room })` da `RoomList` e `navigation.navigate('RoomList')` da `Dashboard`, il rientro in una stanza dopo essere tornati alla lista produceva uno schermo bianco su web (race tra unmount precedente e remount). Risolto: `RoomListScreen.handleEnterRoom` usa ora `navigation.push('Dashboard', …)` per forzare una nuova istanza, e l'header back di `Dashboard` usa `navigation.goBack()` per smontarla in modo pulito (RoomList è sempre sotto nello stack — sia che si arrivi via `push` da RoomList sia via `replace` da CreateRoom).
19. **Root cause scroll su web — catena di altezze**: tutti gli `ScrollView`/`FlatList` con `flex: 1` su web fallivano nello stabilire un'area scrollabile perché `html`, `body` e `#root` non avevano un'altezza ancorata: il default Expo lascia la pagina a "natural height", per cui ogni `flex: 1` si limita a fittare il proprio contenuto. Risultato: contenuto tagliato senza barra di scroll. Risolto in `App.js` iniettando un blocco `<style>` al boot (solo su `Platform.OS === 'web'`) che imposta `html, body, #root { height: 100% }` e dà al primo `<div>` figlio di `#root` `display: flex; height: 100%`. Da quel momento la catena di flex ha un'altezza concreta a cui ancorarsi e ogni `ScrollView`/`FlatList` con `flex: 1` scrolla correttamente. Senza questa iniezione, le rifiniture per-schermata (rimozione wrapper, `flexGrow: 1` su contentContainer, ecc.) non bastano.
20. **Password reset — Brevo SMTP, niente Edge Function**: scelto Brevo (free tier 300 email/giorno permanente) come provider SMTP custom in Supabase. Nessun Edge Function necessario: il flusso usa direttamente `supabase.auth.resetPasswordForEmail` + `supabase.auth.updateUser`, supportato out-of-the-box dal client JS. Considerato come alternativa un GM admin reset via Edge Function (`auth.admin.updateUserById`) ma scartato dallo scope iniziale: il flusso email è sufficiente per l'uso classroom (~120 studenti/giorno → realistici 5–15 reset/giorno, ben sotto i 300/giorno). L'Edge Function resta opzione futura come fallback.
21. **Password reset — Web-first con hook deep link**: implementato solo per web (`window.location.origin + '/reset-password'`). Il prefisso `librogame://` è già registrato nel `linking` config del navigator e in `lib/resetRedirect.js` come placeholder, ma il deep link mobile non è ancora attivo: dipende dal primo build EAS che registrerà lo scheme nell'AndroidManifest / Info.plist. Decisione presa perché il use case classroom è browser-based (Chromebook/laptop scolastici) e Expo Go non è compatibile con SDK 54.
22. **Password reset — `AuthLoadingScreen` come gateway PASSWORD_RECOVERY**: il listener `onAuthStateChange` è registrato in `AuthLoadingScreen` (entry point dell'app) invece che nel root `App.js` perché in questo modo gestisce sia il caso "app aperta su /reset-password da link" sia il caso "app navigated da Login → ForgotPassword → email" senza duplicare logica. Un `recoveryFired` guard impedisce che `checkSession()` (asincrono) ridiriga alla home dopo che PASSWORD_RECOVERY è già stato gestito.
23. **Bug fix — link recupero password "Link non valido"**: cliccando il link nell'email atterravamo su `/reset-password#access_token=…&type=recovery` ma `getSession()` restituiva sempre `null`, facendo scattare il direct-visit guard. Root cause: `lib/supabase.js` aveva `detectSessionInUrl: false` (opzione pensata per evitare parsing su mobile), che impediva al client di processare il fragment dell'URL su web. Risolto impostando `detectSessionInUrl: Platform.OS === 'web'`. Aggiunta anche robustezza in `ResetPasswordScreen`: oltre a `getSession()` al mount, sottoscrive `onAuthStateChange` per gli eventi `PASSWORD_RECOVERY` / `SIGNED_IN` / `INITIAL_SESSION`, con timeout di sicurezza 2s per attivare il guard se davvero non c'è sessione. Senza questo doppio meccanismo c'era una race tra il mount della schermata (via `linking` config) e il parsing asincrono dell'URL fragment da parte del client Supabase.


## Bugs

### Risolti
- **Flash nero durante re-read narrazione**: `Background` era un componente React definito dentro il render → unmount/remount ad ogni stato. Risolto con `renderBackground()` come funzione inline in `NarratorView`.
- **Quick view alla prima entrata scena**: `returnedFromAnagram` inizializzato con `initialMode === 'anagram'`. Risolto inizializzando sempre a `false`.
- **Hint visibile in modalità anagramma**: `AutoHintEffect` era fuori dal controllo di modalità in `CircoStanzaScreen`. Risolto spostandolo dentro `NarratorView`.
- **Hint sopra il dialog**: zIndex 1000. Risolto portandolo a zIndex 1 (dialog a zIndex 2).
- **Personaggio sopra il pannello anagramma**: `characterContainer` con zIndex 1 era sopra `AnagramOverlay` (senza zIndex). Risolto con `zIndex: 0` in modalità anagramma.
- **Sfondo nero in modalità anagramma**: nessuna immagine di sfondo renderizzata. Risolto aggiungendo `backgroundAsset` + `overlayAnagram` + `characterContainer` nella branch anagramma di `CircoStanzaScreen`.
- **Animazione hint lagga su web**: `Animated.createAnimatedComponent(Image)` meno ottimizzato su web. Risolto con `Animated.View` che wrappa `Image` normale.

### Aperti
- **Lentezza caricamento sfondo su web (~1 sec)**: `ImagePreloader` con delay 100 ms non è sufficiente per scene con immagini pesanti. Possibili strade: ridurre dimensione PNG, `new window.Image()` per pre-fetch puro su web, o aumentare delay preloader.
