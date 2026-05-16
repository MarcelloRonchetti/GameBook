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
- [x] Sprite e background Giocoliere aggiunti (`assets/characters/giocoliere.png`, `assets/backgrounds/giocoliere_bg.png`) — registrati in `ASSETS` e `HINT_POSITIONS` di `theme.js`
- [x] Sprite e background Funambolo aggiunti (`assets/characters/funambolo.png`, `assets/backgrounds/funambolo_bg.png`) — registrati in `ASSETS` e `HINT_POSITIONS` di `theme.js`
- [x] Hint image Funambolo e Giocoliere aggiunti (`assets/hints/funambolo_hint.png`, `assets/hints/giocoliere_hint.png`) — registrati in `ASSETS.hints` di `theme.js`
- [x] Sprite, background e hint Pagliaccio aggiunti (`assets/characters/pagliaccio.png`, `assets/backgrounds/pagliaccio_bg.png`, `assets/hints/pagliaccio_hint.png`) — registrati in `ASSETS` e `HINT_POSITIONS` di `theme.js`. Personaggio "fuori scena" (senza trucco né parrucca) per coerenza con il testo del gioco — la maschera abbandonata è nello sfondo
- [x] Sprite, background e hint Trapezista aggiunti (`assets/characters/trapezista.png`, `assets/backgrounds/trapezista_bg.png`, `assets/hints/trapezista_hint.png`). Personaggio con elementi multiculturali per richiamare il tema immigrazione. Stanza piccola con varie sedute (no tappeto centrale, coerente con il testo) + mappa del mondo come hint. Aggiunto trapezio al soffitto in seconda iterazione per legare lo sfondo al ruolo professionale
- [x] Sprite, background e hint Cavallerizza aggiunti (`assets/characters/cavallerizza.png`, `assets/backgrounds/cavallerizza_bg.png`, `assets/hints/cavallerizza_hint.png`). Costume equestre dignitoso (giacca, pantaloni, stivali — non cabaret). Sfondo: vanity glamour con abito flapper anni '20 + boa di piume come hint per il tema prostituzione (tema gestito con la stessa maturità del testo, niente esplicito). Aggirati i filtri di sicurezza Gemini rimuovendo le parole sensibili ("prostitution", "stiletto", "banknotes spilling out") e descrivendo solo gli oggetti visivi neutri
- [x] Sprite, background e hint Contorsionista aggiunti (`assets/characters/contorsionista.png`, `assets/backgrounds/contorsionista_bg.png`, `assets/hints/contorsionista_hint.png`). Personaggio con differenza di arto superiore (handicap rappresentato con dignità) — le protesi sul tavolo come hint visivo per il tema disabilità. Prompt include direttive esplicite contro la generazione di testo leggibile sui poster/diplomi (l'AI sbagliava le parole)
- [x] Sprite, background e hint Controfigura aggiunti (`assets/characters/controfigura.png`, `assets/backgrounds/controfigura_bg.png`, `assets/hints/controfigura_hint.png`). Ambiente molto semplice/spartano (coerente al testo) con scarpe consumate + zaino + cibo modesto come hint per povertà estrema
- [x] Sprite, background e hint Domatore aggiunti (`assets/characters/domatore.png`, `assets/backgrounds/domatore_bg.png`, `assets/hints/domatore_hint.png`). Personaggio specchiato orizzontalmente per migliore composizione visiva. Stanza saturated con amuleti/talismani (scarabeo, occhio di Horus, hamsa, ferri di cavallo, dreamcatcher, cristalli) — l'altare centrale come hint per superstizione
- [x] Sprite, background e hint Equilibrista aggiunti (`assets/characters/equilibrista.png`, `assets/backgrounds/equilibrista_bg.png`, `assets/hints/equilibrista_hint.png`). Studio intellettuale con libri ovunque + corkboard con pubblicità + bilancia di ottone — l'insieme bilancia + pubblicità come hint per "etica e pubblicità". Rimossi i fili rossi di collegamento sul corkboard in seconda iterazione per pulizia visiva
- [x] Sprite, background e hint Sputafuoco aggiunti (`assets/characters/sputafuoco.png`, `assets/backgrounds/sputafuoco_bg.png`, `assets/hints/sputafuoco_hint.png`). Personaggio ritrasformato in artista del circo (vest crimson + sash + flaming torch) dopo prima versione troppo militare. Stanza con vetrina di armi storiche da collezione + poster commemorativi come hint per "guerra e disarmo". Armi trattate come pezzi da museo (vetrina, staffe in ottone) per gestire il tema con sensibilità
- [x] Sprite, background e hint Illusionista aggiunti (`assets/characters/illusionista.png`, `assets/backgrounds/illusionista_bg.png`, `assets/hints/illusionista_hint.png`). Personaggio illusionista con elementi tech (techno-monocle, wand luminosa, ologramma in mano). Stanza che fonde magia classica (cilindro, carte, scatola del mago, tendaggi rossi e oro, palla di cristallo, gabbie per colombe) con elementi tech (3-4 monitor, wand digitale, LED). Hint: muro di schermi monitor per il tema "tecnologia". Tentato di girare il personaggio in posa frontale ma Gemini non riusciva a interpretare l'istruzione — lasciato in posa 3/4 originale
- [x] Sprite e background Direttrice aggiunti (`assets/characters/direttrice.png`, `assets/backgrounds/direttrice_bg.png`). Personaggio finalmente in **posa frontale** (cilindro + frac rosso/oro + frusta + bastone, simmetrico, sguardo verso il giocatore). Stanza: ufficio del Direttore con scrivania mahogany, lampadario di cristallo, poster CIRCUS, ritratti dei performer, vetrina con 12 mini-costumi che richiamano gli artisti (sfondo iterato in 2 passi con Gemini multi-reference per il limite di 10 immagini per prompt). Niente hint perché la Direttrice ha la sua schermata dedicata con 12 anagrammi finali
- [x] Background Circo-stanza di Partenza aggiunto (`assets/backgrounds/intro_bg.png`). Scena esterna "quinte del tendone": tendone a strisce rosse e bianche + caravan colorati + atmosfera ora dorata di preparazione spettacolo. Niente personaggio (intro narrato senza NPC parlante)
- [x] **DirectriceScreen rifattorizzato a due modalità**: 'narration' (NarratorView con sfondo + sprite Direttrice + testo dal PDF + bottone "🎩 Risolvi gli anagrammi finali") e 'anagrams' (lista 12 anagrammi finali — comportamento storico). Bottone "← Torna alla Direttrice" in modalità anagrams per riguardare l'immagine. Auto-skip della narrazione se il giocatore aveva già completato in precedenza
- [x] **IntroScreen rifattorizzato a due modalità**: 'narration' (NarratorView con sfondo intro + testo dal PDF + bottone "📜 Decifra il messaggio", senza sprite tramite nuovo prop `hideCharacter`) e 'cipher' (chiave + messaggio cifrato + input — comportamento storico). Bottone "← Torna all'immagine" in modalità cipher. Auto-skip della narrazione se il giocatore aveva già risolto
- [x] **`NarratorView` esteso con due nuovi prop**:
  - `anagramButtonLabel` (string, default `"🔤 Affronta l'anagramma"`) per personalizzare il testo del bottone della modalità narrazione. Usato da Direttrice ("🎩 Risolvi gli anagrammi finali") e Intro ("📜 Decifra il messaggio")
  - `hideCharacter` (boolean, default `false`) per non renderizzare nessuno sprite/emoji nella posizione del personaggio. Usato dall'Intro che non ha NPC
- [x] **Fix anagramma cavallerizza**: `UNITE ZERO POSTI` (14 lettere, errore nel PDF) corretto in `UNTI ZERO POSTI` (13 lettere, anagramma matematicamente valido di PROSTITUZIONE). Aggiornati `anagrams.json`, `scenes.json` e `CLAUDE.md`
- [x] **`scenes.json` riscritto integralmente col testo COMPLETO del PDF** diviso per speaker: nuovo campo `dialogue` (array di oggetti `{speaker, text}`) sostituisce il vecchio `text` riassunto. Ogni blocco etichettato come `narrator` (descrizione ambiente/azione) o `character` (dialoghi diretti tra virgolette). Tutte le 12 stanze + intro + direttrice riportate fedelmente al PDF originale, niente più riassunti
- [x] **`NarratorView` estesa con supporto al nuovo formato `dialogue`**: normalizzazione con priorità `scene.dialogue` > `scene.narratorBlocks` (legacy) > `scene.text`. Il dialog box mostra dinamicamente "NARRATORE" o il nome del personaggio (es. "ACROBATA") in base allo speaker del blocco corrente
- [x] **Dialog box altezza massima 22% schermo** con `useWindowDimensions` (calcolo pixel da percentuale): testi corti restano compatti, testi lunghi crescono fino al limite poi appare scroll verticale interno. Risolve il problema dei monologhi lunghi (cavallerizza, domatore) che coprivano tutto lo schermo
- [x] **Dialog box trasparenza aumentata**: alpha background da 0.92 a 0.7, si vede di più lo sfondo dietro
- [x] **Bottone "Rileggi testo" allineato a "Affronta l'anagramma"**: stessa dimensione (paddingHorizontal 28, fontSize 16, fontWeight bold), stesso `marginTop: 14` per allineamento alla baseline nella row del quick view
- [x] **Animazione hover/click sui nodi della mappa rimossa**: eliminata `Animated.Value`, `Easing` scale animation, listener `onMouseEnter/Leave/PressIn/Out`. I 12 nodi della mappa ora sono `View` statiche con solo `activeOpacity: 0.85` sul TouchableOpacity disponibile. Rimozione delle import `useRef`, `Animated`, `Easing`. Risultato: rendering più leggero, meno listener event = caricamento mappa più veloce
- [x] **Cifrari: spaziatura aumentata fra le parole** (da 1 a 5 spazi nei JSON `cipher`) per leggibilità + **non-breaking hyphen** (`‑` U+2011) al render in `IntroScreen` e `AnagramOverlay` per impedire che gruppi numerici come `7-4-3-8-6-8` si spezzino su due righe — solo gli spazi fra gruppi diventano punti di wrap
- [x] **Layout box cifrato/decodifica/chiave**: larghezza 95% schermo, max 950px, allineamento centrato. Titoletti ("📜 Messaggio cifrato", "🔑 Chiave di decodifica", "✏️ La tua decodifica") allineati a sinistra
- [x] **Bottone Verifica compatto**: `paddingHorizontal: spacing.xxxl` + `alignSelf: 'center'`, larghezza solo testo+padding (non più full width)
- [x] **`DirectriceScreen` modalità anagrammi con stesso pattern visivo delle altre stanze**: background `direttrice_bg.png` + overlay scuro + sprite Direttrice (zIndex 0) + ScrollView trasparente in un pannello con bordo dorato (`anagramPanel` style) come in `AnagramOverlay`
- [x] **`IntroScreen` modalità cifrario**: stesso pattern grafico ma SENZA il pannello bordo dorato (mantiene il layout originale dei box ma centrati e dimensionati come richiesto dall'utente)
- [x] **Rimossa barra nera header sopra le immagini in `Intro`, `Direttrice` e schermata di vittoria**: le route `Intro` e `Direttrice` ora hanno `headerShown: false` in `AppNavigator.js` (come `CircoStanza` e `Map`). Tutte le stanze del flusso player sono ora fullscreen senza header di navigation
- [x] **Schermata vittoria come pop-up temporizzato**: rimosso overlay scuro (sfondo del circo pienamente visibile), pannello "Complimenti!" schiarito (background `rgba(50,35,20,0.78)` + bordo oro chiaro `#e8c46a` + ombra) senza emoji 🎪. Sequenza temporizzata: 5s pannello visibile sopra lo sfondo → 5s solo sfondo del circo → `navigation.reset` automatico a `JoinRoom` (player resta loggato)
- [x] **Luminosità Circo-stanza di partenza aumentata**: in `IntroScreen` overlay scuro ridotto sia in modalità narrazione (`0.35` → `0.1` via nuovo prop `overlayOpacity` di `NarratorView`) sia in modalità cifrario (`0.55` → `0.25`). Aggiunto prop `overlayOpacity` a `NarratorView` per override per-scena senza toccare lo stile globale `circoStanzaStyles.overlay` (le altre stanze restano invariate)
- [x] **Immagine finale di vittoria (in lavorazione)**: scena del tendone con tutti i 13 personaggi in posa di bow finale. Generata con ChatGPT/DALL-E (approccio testuale dettagliato + 5 reference dei personaggi più particolari). Iterazione successiva su personaggi singoli (funambolo, acrobata, giocoliere, mano equilibrista, swap arto contorsionista). Sostituzione finale dei personaggi sbagliati con Photopea quando Gemini blocca con errore 1099 sui filtri di sicurezza
- [x] **Anagrammi cross-check completo eseguito**: verifica conteggio lettere fra ogni anagramma di scena e la sua soluzione. Trovato errore in cavallerizza nel PDF sorgente (`UNITE ZERO POSTI` aveva una E in più rispetto a `PROSTITUZIONE`). Corretto in `UNTI ZERO POSTI` (13 lettere, perfetto anagramma di PROSTITUZIONE). Aggiornati `anagrams.json`, `scenes.json` e `CLAUDE.md`. Tutti gli altri anagrammi (12), gli anagrammi della Direttrice (12) e i messaggi cifrati (intro + illusionista) verificati correttamente
- [x] **Bug fix anagramma sputafuoco**: la soluzione era erroneamente impostata a "GUERRA DI DISARMO" (15 lettere) invece di "GUERRA E DISARMO" (14 lettere, anagramma valido di "ARREDI SEGA MURO"). Corretto in `anagrams.json` e `CLAUDE.md`
- [x] **Iterazione "più circo, meno scena di vita"** per gli sfondi di trapezista, equilibrista, sputafuoco: aggiunti elementi del mestiere circense (silk aerei + costume sequinato per trapezista; unicycle + balance ball + giocoleria per equilibrista; torce da fire-dance + poi balls + braciere per sputafuoco) mantenendo invariate le posizioni hint. Controfigura mantenuta nello stato attuale per coerenza con il tema povertà
- [x] **Sistema `CHARACTER_POSITIONS` in `theme.js`** — override posizione/dimensione sprite NPC per-scena. Default `DEFAULT_CHARACTER_POSITION` mantiene i valori storici (`left: -5%`, `bottom: -55%`, `width: 70%`, `height: 145%`). Per spostare un personaggio in una stanza specifica basta aggiungere una riga in `CHARACTER_POSITIONS`. Helper `getCharacterPosition(sceneId)`. Integrato in `CircoStanzaScreen` e `NarratorView` come prop `characterPosition` applicata come style overlay sul `characterContainer`
- [x] Sistema hint positions reso responsivo: `HINT_POSITIONS` ora usa valori decimali 0-1 relativi all'immagine di sfondo; `NarratorView` calcola dinamicamente le coordinate assolute tramite `computeHintStyle` compensando `resizeMode="cover"` — l'hint segue la posizione corretta a qualsiasi dimensione schermo/finestra intera
- [x] Fix zIndex hint: personaggio portato a `zIndex: 2`, hint a `zIndex: 1` — il lampeggio appare sotto il personaggio
- [x] `story/storia_1/CIRCO-STANZE.pdf` aggiunto come riferimento narrativo completo
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
- [x] `ImagePreloader` persistente in `App.js`: renderizza `<Image>` nascosti (1×1 px) per mappa (tutti i 5 PNG di `ASSETS.map`, non solo il background), backgrounds e characters dopo 100 ms dal boot — previene ri-decodifica su web ad ogni navigazione
- [x] `MapScreen` — `Asset.loadAsync` per precaricamento backgrounds e characters su native mentre il player vede la mappa
- [x] `ForgotPasswordScreen` — input email + invio link recupero via Supabase + Brevo SMTP, banner errore inline, pannello successo "Controlla la tua email"
- [x] `ResetPasswordScreen` — due input password (nuova + conferma), validazione (min 6, match), `supabase.auth.updateUser({ password })`, signOut + reset a Login al successo, direct-visit guard "Link non valido o scaduto" + listener `onAuthStateChange` con timeout di sicurezza 2s
- [x] `lib/resetRedirect.js` — helper `getResetRedirect()` cross-platform per la URL del link di recupero
- [x] `LoginScreen` — link "Password dimenticata?" tra "Accedi" e "Registrati"
- [x] `AuthLoadingScreen` — handler evento `PASSWORD_RECOVERY` di Supabase: redirige a `ResetPassword` invece che alla home in base al ruolo (con `recoveryFired` guard contro la race con `getSession()`)
- [x] `AppNavigator` — route `ForgotPassword` e `ResetPassword` registrate + `linking` config sul `NavigationContainer` per mappare `/reset-password` su web (deep link `librogame://` registrato come placeholder per il futuro build EAS)
- [x] `lib/supabase.js` — `detectSessionInUrl: Platform.OS === 'web'` per permettere al client di processare il fragment `#access_token=...&type=recovery` dell'URL al boot (richiesto per il flusso di recupero password)
- [x] Supabase SMTP via Brevo (free tier 300 email/giorno) configurato; template "Reset Password" tradotto in italiano; redirect URL allowlist aggiornata con `http://localhost:8581/reset-password`
- [x] **EAS Build APK Android funzionante** — primo build per test su telefono fisico riuscito. Pipeline: `eas build:configure` per generare `projectId` UUID, `eas.json` con profilo `preview` (`buildType: apk`), `app.json` con `newArchEnabled: false` (richiesto per stabilità SDK 54+RN 0.81.5 con build cloud Expo)
- [x] **`gradle-memory-plugin.js` Expo config plugin custom** — modifica `gradle.properties` al prebuild aggiungendo `org.gradle.jvmargs=-Xmx3072m` e `org.gradle.daemon=false`. Risolveva i crash Gradle "unknown error" durante la compilazione native dei moduli C++
- [x] **`.easignore`** creato per escludere `node_modules/`, `.git/`, `*.log` dall'archivio EAS (prima upload era 295 MB)
- [x] **Asset icone app** creati come placeholder quadrati 1024×1024 (#1a1a1a) in `assets/`: `icon.png`, `adaptive-icon.png`, `splash-icon.png`, `favicon.png`. Necessari per superare il check `expo doctor` che richiede icone quadrate
- [x] **Pulizia PNG `circus_map.png`** — ri-salvato senza metadata/profili colore problematici per superare AAPT (Android Asset Packaging Tool). Il PNG originale falliva in `app:mergeReleaseResources` con errore generico "file failed to compile"
- [x] **`assets_backup/`** copia di sicurezza di tutta la cartella assets prima della pulizia PNG
- [x] **Fix crash all'avvio APK Android — `window.location.origin` undefined**: in `navigation/AppNavigator.js` il `linking.prefixes` valutava `typeof window !== 'undefined' ? window.location.origin : ''` al modulo load. Su React Native `window` esiste ma `window.location` no, causando `TypeError: Cannot read property 'origin' of undefined` e crash immediato. Risolto con check più robusto: `Platform.OS === 'web' && typeof window !== 'undefined' && window.location ? window.location.origin : ''` + `.filter(Boolean)` per rimuovere stringhe vuote dall'array prefixes
- [x] **`App.js` — ErrorBoundary** che cattura crash React e li mostra a schermo invece di chiudere l'app. Utile per debug futuro su dispositivi senza accesso facile a logcat
- [x] **`app.json` orientation: "default"** — l'app supporta sia portrait sia landscape (rotazione libera in base al telefono). Originariamente era bloccato a portrait
- [x] **Riorganizzazione `assets/`**: icone APK spostate in sottocartella dedicata `assets/app-icons/` (icon, adaptive-icon, splash-icon, favicon) — separate dal contenuto del gioco. Path aggiornati in `app.json`
- [x] **Script `scripts/clean-pngs.ps1`** + comando `npm run clean-pngs`: ripulisce automaticamente i metadata di tutti i PNG in `assets/`. Idempotente, da lanciare prima di ogni build APK quando si aggiungono nuove immagini al progetto. Risolve preventivamente i fallimenti AAPT
- [x] **Cartella `assets_backup/` rimossa** — non più necessaria dopo che la build APK è andata a buon fine
- [x] **`components/ErrorBoundary.js`** estratto da `App.js` in file dedicato. Mescolare class component (ErrorBoundary) e functional components nello stesso file rompeva Fast Refresh di Metro (forzava full reload ad ogni save invece di hot reload, perdendo lo stato di navigazione). Separazione = Fast Refresh funziona di nuovo
- [x] **Asset hint Pagliaccio ritagliato dallo sfondo dall'utente** invece di generarlo con Gemini — coerenza visiva al 100% con il background della stanza
- [x] **Ridimensionamento massivo asset PNG** (`scripts/resize-assets.py` + `npm run resize-assets`): tutti i PNG di `assets/{map,characters,backgrounds,hints}` portati a dimensioni reali di rendering (1024 px lato lungo per map/characters/hints, 2048 per backgrounds). Risparmio totale 358 MB → 51 MB (−86%). Caso peggiore: `node_tent_final.png` da 6921×9369 (45 MB) a 756×1024 (810 KB). Idempotente: salta i file gia' sotto soglia
- [x] **`ImagePreloader` esteso a tutti gli asset mappa**: `App.js` ora preload anche `node_frame`, `node_tent_entry`, `node_tent_final`, `node_banner` (prima solo `map.background`). I 5 asset della mappa sono pronti al primo ingresso in `MapScreen`
- [x] **`MapScreen` render non-bloccante**: rimosso `if (loading) return <View />` che mostrava uno schermo nero finche' Supabase non rispondeva. Ora `nodeStates` si inizializza sincronicamente via `useMemo(computeNodeStates([], allChoices))` da `route.params`: i nodi disponibili appaiono subito come `available`, e la risposta Supabase aggiorna le scene gia' risolte a `visited`

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

- [x] Aggiungere immagini reali per tutti gli NPC — completati tutti (12 NPC + Direttrice)
- [x] Aggiungere background stanza per tutti gli NPC — completati tutti
- [x] **Circo-stanza di partenza (intro)**: sfondo `intro_bg.png` aggiunto, integrato in `IntroScreen` con modalità narrazione + cifrario
- [x] **Splitting testi narratore vs personaggio**: implementato. `scenes.json` ora ha campo `dialogue` con array di `{speaker, text}`. `NarratorView` legge speaker e cambia etichetta header dinamicamente ("NARRATORE" / nome personaggio)
- [ ] **Grafica testi narrazione**: rifinire tipografia del `NarratorView` (font, dimensioni, spaziature, animazioni typewriter)
- [ ] **Restyle schermate auth**: `LoginScreen`, `RegisterScreen`, `ForgotPasswordScreen`, `ResetPasswordScreen` — adeguarle al tema visivo del gioco (attualmente molto basiche)
- [ ] **Restyle schermate GM**: `RoomListScreen`, `CreateRoomScreen`, `DashboardScreen`, `PlayerDetailScreen`
- [ ] **Restyle schermata `JoinRoomScreen`** (lato player): primo touchpoint, deve essere accogliente
- [ ] **Restyle schermata `DirectriceScreen`**: il finale del gioco merita una grafica più curata
- [ ] Raffinare mappa e coordinate dei nodi dopo test su dispositivi reali
- [x] Sistema `AutoHintEffect` per-scena implementato (componente, `getHintAsset`, `HINT_POSITIONS`) — asset Acrobata (`acrobata_hint.png`) da posizionare in `assets/hints/`; coordinate calibrate: `top: 8.9%, left: 38.1%, width: 30%, height: 49.2%`
- [ ] Aggiungere asset hint per gli altri NPC (Funambolo, Giocoliere, ecc.)
- [ ] Splash/icona app personalizzata
- [ ] Rifinitura visuale di Dashboard GM e PlayerDetail
- [x] **MapScreen — redesign visuale completo**: nodi arco sostituiti con frame PNG (`node_frame.png`); nodi tenda (intro/direttrice) con PNG dedicati (`node_tent_entry.png`, `node_tent_final.png`); banner nome (`node_banner.png`) sovrapposto alla base delle tende
- [x] **MapScreen — sistema tuning costanti**: `FRAME_RATIO`, `INTERIOR_TOP`, `INTERIOR_SIZE`, `INTERIOR_OFFSET_X/Y`, `SPRITE_SCALE`, `BANNER_BOTTOM`, `LABEL_FONT_SCALE`, `ARCH_SCALE`, `TENT_SCALE` in cima a `MapScreen.js` per allineamento visivo senza toccare la logica
- [x] **MapScreen — BANNER_CONFIG in theme.js**: sezione dedicata con `bannerScale`, `bannerTop`, `bannerOffsetX`, `fontScale`, `textOffsetX`, `textOffsetY` per intro e direttrice — separata da MAP_NODES
- [x] **MapScreen — fog state**: archi in fog mostrano `?` senza cerchio scuro; tende in fog usano `tintColor: '#222'` sull'immagine (forma preservata, nessun rettangolo); badge verde rimosso dai nodi risolti
- [x] **MapScreen — hover/scale animation**: nodi `available` si ingrandiscono (`scale 1→1.18`) al hover (web) e al press (mobile) tramite `Animated.spring`; nessun lampeggio
- [x] **MapScreen — pathAnchorX/Y in MAP_NODES**: offset percentuali per spostare l'endpoint dei percorsi SVG su intro e direttrice, indipendentemente dal centro del nodo
- [x] **MapScreen — label archi scalabile**: `fontSize: frameW * LABEL_FONT_SCALE` — dimensione testo proporzionale all'arco
- [x] **Asset mappa**: `node_frame.png`, `node_tent_entry.png`, `node_tent_final.png`, `node_banner.png` registrati in `ASSETS.map` di `theme.js`

---

## 🚀 Distribuzione

- [ ] Emulatore Android per test più accurati
- [x] Build APK tramite EAS Build — primo APK funzionante installato su telefono fisico
- [ ] Sostituire icone placeholder (`assets/icon.png`, `adaptive-icon.png`, `splash-icon.png`, `favicon.png`) con grafica definitiva del gioco
- [x] Pulizia automatica PNG prima della build — `scripts/clean-pngs.ps1` + `npm run clean-pngs`
- [ ] Configurare `expo-updates` per OTA updates senza ricompilare APK ad ogni modifica JS
- [ ] Build iOS tramite EAS Build, opzionale

---

## 🔧 Miglioramenti Futuri

- [ ] **Performance caricamento immagini** — fase 1 completata (ridimensionamento PNG + preloader esteso). Strategie ancora aperte:
  - Conversione asset a WebP (ulteriore ~50% di peso vs PNG ottimizzato)
  - Generazione mipmap/versioni a risoluzione multipla per mobile vs web
  - Lazy loading per le scene non ancora visitate
  - Preload smart in background dopo che la mappa è visibile
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
24. **EAS Build memoria Gradle via Expo config plugin**: `GRADLE_OPTS` nelle env vars di `eas.json` non veniva propagato correttamente al processo Gradle, causando crash silenziosi durante la compilazione native dei moduli C++ (expo-modules-core per 4 architetture). Risolto creando `gradle-memory-plugin.js` che usa `withGradleProperties` di `@expo/config-plugins` per scrivere direttamente in `gradle.properties` durante il prebuild. Il plugin imposta `org.gradle.jvmargs=-Xmx3072m` e disattiva il daemon. Registrato in `app.json → plugins`.
25. **EAS Build PNG cleaning per AAPT**: AAPT (Android Asset Packaging Tool) fallisce silenziosamente in `app:mergeReleaseResources` se trova PNG con metadata/profili colore non standard (errore generico "file failed to compile"). Il file `circus_map.png` originale aveva questo problema. Soluzione provvisoria: re-saving via `System.Drawing.Bitmap` in PowerShell strippa tutti i metadata e produce un PNG "AAPT-safe". Trade-off: file passa da 0.32 MB a 3.5 MB (formato 32bpp ARGB senza compressione indicizzata) ma è compatibile. Da automatizzare in script pre-build per i nuovi asset.
26. **Crash all'avvio APK — controlli `window.*` al modulo load**: codice come `typeof window !== 'undefined' ? window.location.origin : ''` valutato a top-level del modulo (non dentro componenti React) crasha su React Native perché `window` esiste come oggetto globale ma `window.location` è undefined. Pattern sicuro: `Platform.OS === 'web' && typeof window !== 'undefined' && window.location ? window.location.origin : ''`. Vale per qualsiasi codice che accede a oggetti DOM (`document`, `localStorage`, `navigator`, ecc.) al boot.
27. **Orientamento app**: scelto `"default"` in `app.json` invece di `"portrait"` o `"landscape"` per lasciare l'utente libero di ruotare il telefono. La UI è progettata in landscape (mappa, scene di gioco) ma supporta entrambi.
28. **Class components in file separati per Fast Refresh**: Metro Fast Refresh fa fatica a preservare lo stato quando un file contiene sia class component che functional component. Si manifesta come full reload ad ogni save (stato React Navigation perso → l'utente torna a `JoinRoom` ogni volta). Pattern adottato: ogni class component (es. ErrorBoundary) in un file dedicato. Vale come regola anche per HOC e provider con state interno complesso.
29. **Hint image ritagliata dal background invece di generata separatamente**: per le stanze dove la grafica già contiene l'elemento-hint (es. bottiglie del pagliaccio), conviene ritagliare la zona direttamente dal `<scene>_bg.png` invece di generare un hint a sé con AI. Risultato: coerenza visiva al 100% (stessa illuminazione, stesso stile, stessi colori), zero rischio di mismatch durante il lampeggio.
30. **Filtri di sicurezza AI per temi delicati**: per stanze con temi sensibili (prostituzione, droghe, ecc.) Gemini blocca i prompt che usano parole esplicite. Strategia: descrivere solo gli **oggetti visivi neutri** (es. "vintage cabaret dress with fringes and feather boa" invece di "outfit suggesting prostitution"), lasciando che il significato emerga dalla composizione. Allo stesso modo, per le scarpe usate il termine "evening shoes with delicate straps" invece di "stilettos". L'AI interpreta correttamente la scena senza che il prompt usi parole censurate.
31. **Direttive anti-testo nei prompt scenografici**: Gemini sbaglia regolarmente parole inglesi su poster/diplomi/libri (es. "Anatomicl Flexes" invece di "Anatomy"). Per evitare: aggiungere esplicitamente nel prompt "DO NOT write any readable English words ... use abstract shapes, blurred horizontal lines, ornamental flourishes". Risultato: poster e certificati con bordi decorativi ma senza testo storpiato.
32. **Sistema `CHARACTER_POSITIONS` per-scena**: alcune stanze hanno composizioni dove la posizione sprite default copre elementi importanti dello sfondo (es. l'hint). Soluzione scalabile: oggetto `CHARACTER_POSITIONS` in `theme.js` con override per-scena + `DEFAULT_CHARACTER_POSITION` come fallback. Helper `getCharacterPosition(sceneId)` integrato in `CircoStanzaScreen` e `NarratorView` come prop. Aggiungere una sola riga per riposizionare il personaggio in una stanza specifica senza toccare il CSS globale.
33. **Root cause lentezza `MapScreen`**: due fattori concorrenti, entrambi risolti.
    - **PNG sorgente sproporzionati**: `node_frame.png` era 6768×12528 (84 MP) renderizzato a ~150×300 px; `node_tent_final.png` 6921×9369 (45 MB) renderizzato a ~420×420 px. Decodificare un 84 MP PNG alloca ~340 MB di bitmap raw in RAM solo per scalarlo. Risolto con `scripts/resize-assets.py` (Pillow `Image.resize(LANCZOS) + optimize=True`) che porta i PNG a 1024 px lato lungo (2x abbondante per retina). Comando `npm run resize-assets`. Da rilanciare ogni volta che si aggiungono nuovi asset, prima di build APK e commit. Idempotente — salta i PNG gia' sotto soglia.
    - **Render bloccante**: `MapScreen` mostrava uno schermo nero (`if (loading) return <View ... />`) per tutta la durata della query Supabase `progress`. Risolto inizializzando `nodeStates` sincronicamente da `allChoices` (passato via `route.params`) con `useMemo(computeNodeStates([], allChoices))`. La query Supabase aggiorna solo le scene gia' risolte a `visited` quando arriva.
    - Target dimensioni `npm run resize-assets`: 1024 px per `map/`, `characters/`, `hints/`; 2048 px per `backgrounds/` (mostrati a tutto schermo). Risparmio misurato 358 MB → 51 MB (−86%).


## Bugs

### Risolti
- **Flash nero durante re-read narrazione**: `Background` era un componente React definito dentro il render → unmount/remount ad ogni stato. Risolto con `renderBackground()` come funzione inline in `NarratorView`.
- **Quick view alla prima entrata scena**: `returnedFromAnagram` inizializzato con `initialMode === 'anagram'`. Risolto inizializzando sempre a `false`.
- **Hint visibile in modalità anagramma**: `AutoHintEffect` era fuori dal controllo di modalità in `CircoStanzaScreen`. Risolto spostandolo dentro `NarratorView`.
- **Hint sopra il dialog**: zIndex 1000. Risolto portandolo a zIndex 1 (dialog a zIndex 2).
- **Personaggio sopra il pannello anagramma**: `characterContainer` con zIndex 1 era sopra `AnagramOverlay` (senza zIndex). Risolto con `zIndex: 0` in modalità anagramma.
- **Sfondo nero in modalità anagramma**: nessuna immagine di sfondo renderizzata. Risolto aggiungendo `backgroundAsset` + `overlayAnagram` + `characterContainer` nella branch anagramma di `CircoStanzaScreen`.
- **Animazione hint lagga su web**: `Animated.createAnimatedComponent(Image)` meno ottimizzato su web. Risolto con `Animated.View` che wrappa `Image` normale.
- **APK Android crash immediato all'apertura**: `TypeError: Cannot read property 'origin' of undefined` al modulo load di `AppNavigator.js` (uso non protetto di `window.location.origin` nel `linking.prefixes`). Risolto con check `Platform.OS === 'web'` + verifica `window.location`. Diagnosticato via `adb logcat *:E ReactNative:V ReactNativeJS:V AndroidRuntime:E`.
- **EAS Build "Gradle build failed with unknown error"**: causato da impostazioni JVM non sufficienti per la compilazione native multi-architettura. Risolto via `gradle-memory-plugin.js` che imposta `-Xmx3072m` in `gradle.properties`.
- **EAS Build "AAPT: file failed to compile" su `circus_map.png`**: PNG con metadata problematici. Risolto re-salvando il file in formato pulito via PowerShell + System.Drawing.
- **EAS Build "expo doctor failed - icons not square"**: `acrobata.png` (5905×6655) usato come placeholder per `icon.png`/`adaptive-icon.png` ma Expo richiede icone quadrate. Risolto creando placeholder quadrati 1024×1024 via PowerShell.
- **EAS Build "Invalid UUID appId"**: `app.json` aveva `extra.eas.projectId: "librogame"` (stringa, non UUID). Risolto rimuovendo il campo e lasciando che `eas build:configure` generasse un UUID valido.

### Aperti
- **Lentezza caricamento sfondo su web (~1 sec)**: `ImagePreloader` con delay 100 ms non è sufficiente per scene con immagini pesanti. Mitigato in parte dal ridimensionamento PNG (background scesi da 30 MB a 2-3 MB), ma `<Image>` 1×1 nascosto non garantisce il decode pre-render su web. Possibili strade: `new window.Image()` per pre-fetch puro su web, conversione a WebP, o aumentare delay preloader.
