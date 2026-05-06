# LibroGame — Documento di Progetto

## Panoramica
App mobile gamebook multiplayer con un Game Master (GM) che gestisce una stanza e giocatori che navigano una storia in autonomia risolvendo enigmi.

---

## Stack Tecnologico
| Cosa | Strumento |
|---|---|
| App mobile | React Native + Expo (SDK 54) |
| Backend / Database | Supabase (open source) |
| Auth | Supabase Auth |
| Tempo reale | Supabase Realtime |
| Storia | File JSON nella repo |
| Editor | VS Code |
| Repo | Git — branch principale: `main` |

---

## Stato Setup Attuale
- [x] Node.js 20+ + npm installati
- [x] Expo CLI installato
- [x] Progetto Expo creato (SDK 54, blank template)
- [x] Supabase installato (`@supabase/supabase-js`)
- [x] `@react-navigation/native` + `@react-navigation/stack` installati
- [x] `react-native-screens@~4.16.0` + `react-native-safe-area-context@~5.6.0`
- [x] `react-native-gesture-handler@~2.28.0` (compatibile SDK 54)
- [x] `react-dom` + `react-native-web` installati
- [x] `@react-native-picker/picker` installato
- [x] `@react-native-async-storage/async-storage` installato (persistenza sessione)
- [x] `lib/supabase.js` creato con Project URL e anon key + persistenza sessione
- [x] `lib/helpers.js` creato (normalizeText, checkAnagram, generateRoomCode, formatTime, **notify**)
- [x] `lib/session.js` creato (logout, confirmLogout, confirm cross-platform, resolvePlayerResumeRoute)
- [x] `lib/useRoomClosedListener.js` creato (hook condivisi: chiusura stanza, back disable)
- [x] **`styles/theme.js`** — palette, spacing, radius, fontSize, fonts, shadows, **temi NPC** (npcThemes + getNpcTheme)
- [x] **`styles/components.js`** — stili AnagramInput, AutoHintEffect, GmHint, PlayerCard, SceneCard
- [x] **`styles/auth.js`** — stili AuthLoadingScreen, LoginScreen, RegisterScreen
- [x] **`styles/gm.js`** — stili CreateRoomScreen, RoomListScreen, DashboardScreen, PlayerDetailScreen
- [x] **`styles/player.js`** — stili JoinRoomScreen, IntroScreen, SceneScreen (+ NPC placeholder), AnagramScreen, DirectriceScreen
- [x] App funzionante in modalità web (`npx expo start --web`)
- [x] Struttura cartelle creata
- [x] Tabelle Supabase create + RLS configurato
- [x] Colonna `name` aggiunta a `rooms`
- [x] Account GM creato manualmente su Supabase
- [x] Login/Register funzionanti (banner errore inline)
- [x] CreateRoom (con nome stanza) / Dashboard / RoomList (con eliminazione) / PlayerDetail funzionanti
- [x] **JoinRoom** funzionante — **BUG FIX**: errori ora visibili su web tramite banner inline
- [x] Intro / Scene / Anagram / Direttrice funzionanti
- [x] **SceneScreen + AnagramScreen**: placeholder NPC (riquadro colorato + emoji) per ogni circo-stanza
- [x] Splash `AuthLoadingScreen` creato
- [x] Ripresa della scena corretta dopo riapertura app
- [x] Listener chiusura stanza (realtime) per tutte le schermate player
- [x] Back button Android disabilitato nelle schermate critiche
- [x] Logout disponibile in RoomList (GM) e JoinRoom (Player)
- [x] Fix cross-platform: `notify()` in helpers, `confirm()` in session, banner inline nelle form
- [ ] Test end-to-end su Android (build APK)
- [ ] Design e grafica (sostituzione placeholder con immagini reali)

### Note Setup
- `package.json` ha `expo: "~54.0.33"` — NON aggiornare a ^55.0.0
- `react-native-gesture-handler` deve essere `~2.28.0` per SDK 54
- Node 20+ richiesto (Node 18 dà `EBADENGINE`)
- Expo Go non compatibile (richiede SDK 55) — usare `--web` o build APK
- `Alert.alert` non funziona sul web → usare `notify()` (helpers) o banner inline; `confirm()` (session) per conferme

---

## Struttura Cartelle
```
LibroGame/
├── lib/
│   ├── supabase.js              ✅
│   ├── helpers.js               ✅  (+ notify)
│   ├── session.js               ✅
│   └── useRoomClosedListener.js ✅
├── styles/                      ✅  (NUOVO)
│   ├── theme.js                 ✅  (palette + temi NPC)
│   ├── components.js            ✅
│   ├── auth.js                  ✅
│   ├── gm.js                    ✅
│   └── player.js                ✅  (+ NPC placeholder styles)
├── components/
│   ├── AnagramInput.js          ✅
│   ├── SceneCard.js             ✅
│   ├── AutoHintEffect.js        ✅
│   ├── GmHint.js                ✅
│   └── PlayerCard.js            ✅
├── screens/
│   ├── auth/
│   │   ├── AuthLoadingScreen.js ✅
│   │   ├── LoginScreen.js       ✅
│   │   └── RegisterScreen.js    ✅
│   ├── gm/
│   │   ├── CreateRoomScreen.js  ✅
│   │   ├── RoomListScreen.js    ✅
│   │   ├── DashboardScreen.js   ✅
│   │   └── PlayerDetailScreen.js✅
│   └── player/
│       ├── JoinRoomScreen.js    ✅  (BUG FIX)
│       ├── IntroScreen.js       ✅
│       ├── SceneScreen.js       ✅  (+ NPC placeholder)
│       ├── AnagramScreen.js     ✅  (+ mini NPC placeholder)
│       └── DirectriceScreen.js  ✅  (+ placeholder Direttrice)
├── navigation/
│   └── AppNavigator.js          ✅
├── story/
│   └── storia_1/
│       ├── scenes.json          ✅
│       └── anagrams.json        ✅
├── App.js                       ✅
├── package.json
└── index.js
```

---

## Ruoli Utente

### Game Master (GM)
- Account creato manualmente su Supabase (non c'è registrazione GM nell'app)
- Unico ad accedere alla storia completa (RLS su `stories`)
- Per questa versione: un solo GM

### Giocatore (Player)
- Si registra da app
- Nessun accesso diretto alla storia lato codice
- Entra in una stanza solo se aperta dal GM

---

## Flusso GM
1. Avvio app → **AuthLoading** → (se sessione) → `RoomList`
2. Vede le sue stanze (con nome personalizzato), può **Entrare**, **Riaprire** o **Eliminare**
3. Crea nuova stanza → nome personalizzato + storia + Aiuto Automatico → codice 6 cifre
4. Condivide codice con i giocatori
5. Dashboard: giocatori in realtime con posizione attuale
6. Click su giocatore → timeline completa + invio hints testuali
7. Può chiudere la stanza (→ player disconnessi automaticamente)
8. Può tornare a RoomList (bottone header) o fare logout

## Flusso Giocatore
1. Avvio app → **AuthLoading** → (se sessione) → `JoinRoom`
2. Inserisce codice 6 cifre → eventuali errori mostrati nel banner inline
3. Se stanza chiusa → messaggio errore nel banner
4. Se ha già progressi in quella stanza → **ripresa automatica** sull'ultima scena
5. Altrimenti: Intro → messaggio cifrato iniziale con chiave 1–14
6. Scena dell'Acrobata (fissa) → placeholder NPC verde con emoji 🤸
7. Risolve anagramma → sceglie prossimo NPC (con emoji nel tasto) → senza tornare indietro
8. Continua fino all'Illusionista → cifrario + anagramma → Direttrice
9. Direttrice: placeholder dorato 🎩 + 12 anagrammi con skip e navigazione libera
10. Completamento → messaggio finale

### Se il GM chiude la stanza mentre il player gioca
Alert "Il GM ha chiuso la stanza" → reset a `JoinRoom` (player resta loggato).

### Se il player chiude e riapre l'app
Il resume avviene tramite `resolvePlayerResumeRoute`:
- nessun progresso → `Intro`
- intro solved → `Scene 'acrobata'`
- illusionista solved → `Direttrice`
- altre scene → `Anagram` di quella scena (lo stato `solved` è ricaricato dal DB)

---

## Meccanica Aiuto Automatico
- Il GM imposta il timer alla creazione della stanza (1, 2, 3, 5, 10 minuti)
- Quando il giocatore entra in una scena parte `entered_at` su `progress`
- Allo scadere del timer → effetto visivo `AutoHintEffect` per **10 secondi**
- Dopo i 10 secondi il timer riparte (finché l'anagramma non è risolto)
- Il ciclo si interrompe quando il player risolve o cambia scena
- **Nota**: `SceneScreen` aggiorna `entered_at` anche al rientro, per ri-avviare il timer al resume

### Aiuto Manuale GM
- Suggerimento testuale scritto dal GM in `PlayerDetailScreen`
- Visibile al giocatore in `AnagramScreen` via componente `GmHint`
- Delivery realtime via canale Supabase `hints_changes_<room>_<user>`

---

## Storia: storia_1 — Il circo delle circostanze

### Mappa percorsi
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

### Anagrammi di scena
| NPC | Anagramma | Soluzione |
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
| Sputafuoco | ARREDI SEGA MURO | GUERRA DI DISARMO |
| Illusionista | ALCE IGNOTO | TECNOLOGIA |

### Temi NPC (colori placeholder)
| NPC | Colore | Emoji | Tema sociale |
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

### Messaggi cifrati (chiave: la volontà delle circostanze)
```
1=L, 2=A, 3=V, 4=O, 5=N, 6=T, 7=D, 8=E, 9=C, 10=I, 11=R, 12=S, 13=Z, 14=B
+ lettere nuove da dedurre dal contesto nell'Illusionista
```
- Messaggio iniziale: "Dovete trovare la direttrice delle circostanze iniziando dall'acrobata"
- Messaggio finale (Illusionista): "La volontà vi conduce alla direttrice. Chiedete di lei senza farvi sentire"

### Anagrammi Direttrice (finale)
| Anagramma | Soluzione |
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

---

## Design

### Stato attuale
- **Sistema di stili centralizzato** in `styles/` completato (tema, components, auth, gm, player)
- **Placeholder NPC** attivi su tutte le schermate player: riquadro colorato con emoji e nome circo-stanza. Su `SceneScreen` è un riquadro grande (200px) in cima alla pagina. Su `AnagramScreen` è una riga orizzontale compatta (mini-placeholder) con bordo sinistro colorato. Su `DirectriceScreen` è un riquadro dorato con emoji 🎩.
- L'etichetta "placeholder grafico" in basso a destra su `SceneScreen` ricorda che va sostituito con grafica reale.

### Prossima fase
- Sostituzione placeholder con immagini/grafica reale: basterà sostituire `<Text style={styles.npcEmoji}>{npc.emoji}</Text>` con `<Image source={...} />` mantenendo il layout invariato
- Varianti di `AutoHintEffect` per scena (non solo bordo oro)
- Splash/icona app personalizzata

---

## Scalabilità
- `story_id` in `rooms` supporta già più storie
- Cartella `story/` organizzata per sottocartelle (`storia_1/`, `storia_2/`...)
- Il campo `name` su `rooms` permette al GM di gestire facilmente più sessioni in parallelo
- `npcThemes` in `theme.js` è estendibile con le scene di nuove storie

---

## Regole di Sviluppo
- Sanitizzare sempre gli input utente
- Commenti su tutto il codice
- Un file alla volta — testare prima di passare al successivo
- Fedeltà alla storia originale
- Nessun `StyleSheet` nelle schermate — stili sempre in `styles/`
- No `Alert.alert` diretto — `notify()` per messaggi, `confirm()` per conferme, banner inline per form errors
- Chiedere prima di procedere se qualcosa non è chiaro

---

## Prossimi Step
1. ✅ Struttura cartelle
2. ✅ Tabelle Supabase + RLS + colonna `name`
3. ✅ Account GM
4. ✅ Login / Register
5. ✅ CreateRoomScreen (con nome stanza) + RoomListScreen (con elimina)
6. ✅ DashboardScreen + PlayerDetailScreen
7. ✅ JoinRoomScreen + IntroScreen
8. ✅ SceneScreen + AnagramScreen
9. ✅ DirectriceScreen
10. ✅ AuthLoadingScreen (splash + auto-redirect)
11. ✅ Ripresa scena dopo chiusura app
12. ✅ Listener chiusura stanza in realtime
13. ✅ Back button Android disabilitato
14. ✅ Logout GM + Player
15. ✅ Fix Alert.alert cross-platform (`notify` + banner inline)
16. ✅ **Refactoring CSS** — `styles/theme.js` + `components.js` + `auth.js` + `gm.js` + `player.js`
17. ✅ **Placeholder NPC** — colore + emoji per ogni circo-stanza
18. ✅ **Bug fix JoinRoomScreen** — banner errore inline (no più Alert silenti sul web)
19. ⬜ Test end-to-end su Android
20. ⬜ Sostituzione placeholder NPC con grafica reale
21. ⬜ EAS Build APK
