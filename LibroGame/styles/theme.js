// styles/theme.js
// Tema condiviso del progetto LibroGame.
// Centralizza colori, font, spaziature, temi NPC,
// grafo della storia e coordinate nodi della mappa.

import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// PALETTE COLORI
// ---------------------------------------------------------------------------
export const colors = {
  bgDark: '#1a1a1a',
  surfaceDark: '#2a2a2a',
  borderDark: '#444',
  bgLight: '#f5f5f5',
  surfaceLight: '#ffffff',
  primary: '#c8a45a',
  primaryDark: '#a08240',
  textPrimary: '#ffffff',
  textSecondary: '#dddddd',
  textMuted: '#999999',
  textFaint: '#666666',
  textDarkPrimary: '#111111',
  textDarkSecondary: '#444444',
  success: '#4caf50',
  successBg: '#1e2d1e',
  error: '#e74c3c',
  errorBg: '#3a1a1a',
  warning: '#ff9800',
  warningBg: '#3a2a1a',
  info: '#2196f3',
  greenStrong: '#22c55e',
  greenLight: '#dcfce7',
  redStrong: '#ef4444',
  redLight: '#fee2e2',
  orangeStrong: '#f97316',
  black: '#000000',
  white: '#ffffff',
  transparent: 'transparent',
  // Mappa
  mapFog: 'rgba(0,0,0,0.75)',
  mapNodeBorder: '#c8a45a',
  mapNodeSolved: '#4caf50',
  mapPathColor: '#c8a45a',
  mapPathInactive: 'rgba(200,164,90,0.2)',
  // ---------------------------------------------------------------------------
  // VELVET — palette "Velluto teatrale" usata da Auth e GM screens
  // ---------------------------------------------------------------------------
  velvet: {
    bgDeep: '#2a1418',
    bgDeeper: '#1a0c0f',
    bgPanel: '#3d1e25',
    bgRaised: '#4a2530',
    gold: '#c8a45a',
    goldSoft: '#e0c485',
    goldFaint: 'rgba(200,164,90,0.25)',
    goldFaintStrong: 'rgba(200,164,90,0.5)',
    goldGlow: 'rgba(224,196,133,0.35)',
    champagne: '#f5ead1',
    champagneMuted: '#b8a285',
    taupe: '#8a6d4b',
    success: '#7aa37a',
    successBg: 'rgba(122,163,122,0.15)',
    danger: '#a85959',
    dangerBg: 'rgba(168,89,89,0.15)',
    ink: '#1a0c0f',
  },
};

// ---------------------------------------------------------------------------
// FONT FAMILIES — typography "Velluto teatrale" via Google Fonts
// ---------------------------------------------------------------------------
// I family name corrispondono alle chiavi esportate da @expo-google-fonts/*
// e devono essere caricati al boot tramite `useFonts` in App.js.
// Fallback ai font di sistema mentre il loading non e' completo.
export const fontFamilies = {
  // Display: Cormorant Garamond — usato per titoli, nomi NPC, prompt enigma.
  // Convenzione del prompt velluto: SEMPRE italic. `serif` punta direttamente
  // alla variante italic per ottenere il comportamento by-default su tutta
  // l'app senza dover scrivere ovunque `fontStyle: 'italic'`. Mantengo anche
  // `serifUpright` per i casi rari che richiedessero il romano.
  serif: Platform.select({
    ios: 'CormorantGaramond_500Medium_Italic',
    android: 'CormorantGaramond_500Medium_Italic',
    default: '"Cormorant Garamond", Georgia, serif',
  }),
  serifUpright: Platform.select({
    ios: 'CormorantGaramond_500Medium',
    android: 'CormorantGaramond_500Medium',
    default: '"Cormorant Garamond", Georgia, "Times New Roman", serif',
  }),
  // Body: Manrope — corpo, UI, pulsanti, label, eyebrow.
  body: Platform.select({
    ios: 'Manrope_400Regular',
    android: 'Manrope_400Regular',
    default: 'Manrope, system-ui, -apple-system, "Helvetica Neue", sans-serif',
  }),
  bodyMedium: Platform.select({
    ios: 'Manrope_600SemiBold',
    android: 'Manrope_600SemiBold',
    default: 'Manrope, system-ui, sans-serif',
  }),
  bodyBold: Platform.select({
    ios: 'Manrope_700Bold',
    android: 'Manrope_700Bold',
    default: 'Manrope, system-ui, sans-serif',
  }),
  // Typewriter: Special Elite — esclusivamente per numeri (codici, timer,
  // contatori, date, orari, "batt. N/M", "(1 parola)").
  typewriter: Platform.select({
    ios: 'SpecialElite_400Regular',
    android: 'SpecialElite_400Regular',
    default: '"Special Elite", Courier, monospace',
  }),
};

// ---------------------------------------------------------------------------
// TYPOGRAPHY — mixin riusabili per applicare i pattern del prompt velluto.
// Convenzioni: usare questi helper invece di scrivere a mano fontFamily/
// fontStyle/letterSpacing/textTransform.
// ---------------------------------------------------------------------------
export const typography = {
  // Titoli di pagina e nomi NPC — Cormorant italic 500 (fontFamilies.serif
  // gia' punta alla variante italic).
  display: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  // Corpo del testo (descrizioni, etichette informative) — Manrope 400
  body: {
    fontFamily: fontFamilies.body,
    fontWeight: '400',
  },
  // Eyebrow: piccola etichetta sopra un titolo importante.
  // 10-12px, uppercase, oro, tracked.
  eyebrow: {
    fontFamily: fontFamilies.bodyMedium,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2.5, // ~0.24em a 10-12px
    color: '#c8a45a',
  },
  // Pulsante: uppercase, peso 700, letter-spacing 0.28em (~ 4px a 14px)
  button: {
    fontFamily: fontFamilies.bodyBold,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  // Numeri (Special Elite). Da applicare a TUTTI i numeri visibili:
  // codici stanza, timer, contatori, date, orari, "batt. N/M".
  numeric: {
    fontFamily: fontFamilies.typewriter,
  },
  // Battuta dialogo NPC — Cormorant italic crema, dimensione gestita inline
  dialog: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
  },
};

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40,
};

export const radius = {
  sm: 6, md: 8, lg: 10, xl: 12, pill: 20, round: 999,
};

export const fontSize = {
  xs: 12, sm: 13, md: 14, base: 15, lg: 16, xl: 18,
  xxl: 22, xxxl: 26, huge: 32, display: 40,
};

// `fonts.mono` legacy: ora alias a typewriter (Special Elite) per coerenza
// con la convenzione "numeri = Special Elite". Mantenuto per compatibilità
// con codice esistente che fa riferimento a `fonts.mono`.
export const fonts = {
  mono: fontFamilies.typewriter,
};

export const shadows = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 6 },
};

// ---------------------------------------------------------------------------
// TEMI NPC
// ---------------------------------------------------------------------------
export const npcThemes = {
  intro:          { color: '#c8a45a', emoji: '🎪', label: 'Circo-stanza di Partenza' },
  acrobata:       { color: '#2e8b57', emoji: '🤸', label: 'Acrobata' },
  funambolo:      { color: '#7e57c2', emoji: '🪢', label: 'Funambolo' },
  giocoliere:     { color: '#d81b60', emoji: '🤹', label: 'Giocoliere' },
  pagliaccio:     { color: '#c2913c', emoji: '🤡', label: 'Pagliaccio' },
  trapezista:     { color: '#e65100', emoji: '🎪', label: 'Trapezista' },
  cavallerizza:   { color: '#8e2c2c', emoji: '🐎', label: 'Cavallerizza' },
  contorsionista: { color: '#1976d2', emoji: '🌀', label: 'Contorsionista' },
  controfigura:   { color: '#546e7a', emoji: '🎭', label: 'Controfigura' },
  domatore:       { color: '#4527a0', emoji: '🦁', label: 'Domatore' },
  equilibrista:   { color: '#00838f', emoji: '⚖️', label: 'Equilibrista' },
  sputafuoco:     { color: '#bf360c', emoji: '🔥', label: 'Sputafuoco' },
  illusionista:   { color: '#6a1b9a', emoji: '✨', label: 'Illusionista' },
  direttrice:     { color: '#c8a45a', emoji: '🎩', label: 'Direttrice' },
};

export function getNpcTheme(sceneId) {
  return npcThemes[sceneId] || { color: colors.primary, emoji: '🎪', label: 'Circo-stanza' };
}

// ---------------------------------------------------------------------------
// GRAFO DELLA STORIA
// ---------------------------------------------------------------------------
export const STORY_GRAPH = {
  intro:          { next: ['acrobata'] },
  acrobata:       { next: ['funambolo', 'giocoliere'] },
  funambolo:      { next: ['giocoliere', 'pagliaccio'] },
  giocoliere:     { next: ['trapezista', 'cavallerizza'] },
  pagliaccio:     { next: ['cavallerizza', 'contorsionista'] },
  trapezista:     { next: ['contorsionista', 'controfigura'] },
  cavallerizza:   { next: ['contorsionista', 'domatore'] },
  contorsionista: { next: ['equilibrista', 'illusionista'] },
  controfigura:   { next: ['contorsionista', 'illusionista'] },
  domatore:       { next: ['sputafuoco', 'illusionista'] },
  equilibrista:   { next: ['domatore', 'illusionista'] },
  sputafuoco:     { next: ['controfigura', 'illusionista'] },
  illusionista:   { next: ['direttrice'] },
  direttrice:     { next: [] },
};

// ---------------------------------------------------------------------------
// COORDINATE NODI MAPPA (percentuali 0-100)
// ---------------------------------------------------------------------------
// La mappa landscape va da sinistra (Entrata/Acrobata) a destra (Direttrice).
// x e y sono percentuali della larghezza/altezza dello schermo.
// La zona utile è circa x:8%–94%, y:15%–85% (i bordi sono decorativi).
export const MAP_NODES = {
  intro:          { x: 7.99, y: 49,   size: 91,  isEntry: true,  pathAnchorX: 8,  pathAnchorY: 10 },
  acrobata:       { x: 20,   y: 50,   size: 52 },
  funambolo:      { x: 29,   y: 30,   size: 56 },
  giocoliere:     { x: 29,   y: 70,   size: 48 },
  pagliaccio:     { x: 42,   y: 18,   size: 48 },
  trapezista:     { x: 42,   y: 44,   size: 48 },
  cavallerizza:   { x: 42,   y: 68,   size: 56 },
  contorsionista: { x: 55,   y: 33,   size: 59 },
  controfigura:   { x: 55,   y: 58,   size: 56 },
  domatore:       { x: 55,   y: 78,   size: 48 },
  equilibrista:   { x: 68,   y: 20,   size: 56 },
  sputafuoco:     { x: 68,   y: 65,   size: 56 },
  illusionista:   { x: 75,   y: 43,   size: 56 },
  direttrice:     { x: 90,   y: 46.4, size: 110, isFinal: true,  pathAnchorX: -3, pathAnchorY: 10 },
};

// ---------------------------------------------------------------------------
// CONFIGURAZIONE BANNER TENDE (intro e direttrice)
// ---------------------------------------------------------------------------
// bannerScale     → larghezza banner (% della tenda, es. 0.5 = 50%)
// bannerTop       → posizione verticale banner sulla tenda (0 = cima, 1 = fondo)
// bannerOffsetX   → scostamento orizzontale banner (% tenda, + = destra, - = sinistra)
// bannerFontScale → dimensione testo (% larghezza banner)
// textOffsetX     → scostamento orizzontale testo nel banner (% bannerW)
// textOffsetY     → scostamento verticale testo nel banner   (% bannerH)
export const BANNER_CONFIG = {
  intro: {
    bannerScale:   0.45,
    bannerTop:     0.335,
    bannerOffsetX: -0.08,
    fontScale:     0.08,
    textOffsetX:   0,
    textOffsetY:   -0.12,
  },
  direttrice: {
    bannerScale:   0.5,
    bannerTop:     0.35,
    bannerOffsetX: 0.1,
    fontScale:     0.09,
    textOffsetX:   0,
    textOffsetY:   0,
  },
};

// ---------------------------------------------------------------------------
// ASPECT RATIO SFONDI
// ---------------------------------------------------------------------------
// Tutti i background sono landscape 16:9.
// Usato da NarratorView per calcolare la posizione reale degli hint
// indipendentemente dalle dimensioni dello schermo.
export const BG_ASPECT_RATIO = 16 / 9;

// ---------------------------------------------------------------------------
// ASSET CENTRALIZZATI
// ---------------------------------------------------------------------------
export const ASSETS = {
  map: {
    background:    require('../assets/map/circus_map.png'),
    nodeFrame:     require('../assets/map/node_frame.png'),
    nodeTentEntry: require('../assets/map/node_tent_entry.png'),
    nodeTentFinal: require('../assets/map/node_tent_final.png'),
    nodeBanner:    require('../assets/map/node_banner.png'),
  },
  characters: {
    acrobata:   require('../assets/characters/acrobata.png'),
    giocoliere: require('../assets/characters/giocoliere.png'),
    funambolo:  require('../assets/characters/funambolo.png'),
    pagliaccio: require('../assets/characters/pagliaccio.png'),
    trapezista: require('../assets/characters/trapezista.png'),
    cavallerizza: require('../assets/characters/cavallerizza.png'),
    contorsionista: require('../assets/characters/contorsionista.png'),
    controfigura: require('../assets/characters/controfigura.png'),
    domatore: require('../assets/characters/domatore.png'),
    equilibrista: require('../assets/characters/equilibrista.png'),
    sputafuoco: require('../assets/characters/sputafuoco.png'),
    illusionista: require('../assets/characters/illusionista.png'),
    direttrice: require('../assets/characters/direttrice.png'),
  },
  backgrounds: {
    intro:      require('../assets/backgrounds/intro_bg.png'),
    acrobata:   require('../assets/backgrounds/acrobata_bg.png'),
    giocoliere: require('../assets/backgrounds/giocoliere_bg.png'),
    funambolo:  require('../assets/backgrounds/funambolo_bg.png'),
    pagliaccio: require('../assets/backgrounds/pagliaccio_bg.png'),
    trapezista: require('../assets/backgrounds/trapezista_bg.png'),
    cavallerizza: require('../assets/backgrounds/cavallerizza_bg.png'),
    contorsionista: require('../assets/backgrounds/contorsionista_bg.png'),
    controfigura: require('../assets/backgrounds/controfigura_bg.png'),
    domatore: require('../assets/backgrounds/domatore_bg.png'),
    equilibrista: require('../assets/backgrounds/equilibrista_bg.png'),
    sputafuoco: require('../assets/backgrounds/sputafuoco_bg.png'),
    illusionista: require('../assets/backgrounds/illusionista_bg.png'),
    direttrice: require('../assets/backgrounds/direttrice_bg.png'),
    victory:    require('../assets/backgrounds/victory_bg.png'),
  },
  hints: {
    acrobata:   require('../assets/hints/acrobata_hint.png'),
    funambolo:  require('../assets/hints/funambolo_hint.png'),
    giocoliere: require('../assets/hints/giocoliere_hint.png'),
    pagliaccio: require('../assets/hints/pagliaccio_hint.png'),
    trapezista: require('../assets/hints/trapezista_hint.png'),
    cavallerizza: require('../assets/hints/cavallerizza_hint.png'),
    contorsionista: require('../assets/hints/contorsionista_hint.png'),
    controfigura: require('../assets/hints/controfigura_hint.png'),
    domatore: require('../assets/hints/domatore_hint.png'),
    equilibrista: require('../assets/hints/equilibrista_hint.png'),
    sputafuoco: require('../assets/hints/sputafuoco_hint.png'),
    illusionista: require('../assets/hints/illusionista_hint.png'),
  },
};

// Posizione dell'overlay hint sullo schermo (percentuali).
// Valori calibrati per web desktop ~1280×800 con cover sul bg landscape.
// Regola top/left/width/height se l'allineamento non combacia sul tuo schermo.
// Posizioni hint relative all'immagine di sfondo (valori 0-1).
// top/left: distanza dal bordo superiore/sinistro dell'immagine.
// width/height: dimensione relativa all'immagine.
// NarratorView converte questi valori in coordinate assolute schermo
// tenendo conto di resizeMode="cover" e delle dimensioni correnti.
export const HINT_POSITIONS = {
  acrobata:   { top: 0.147, left: 0.381, width: 0.30,  height: 0.422 },
  funambolo:  { top: 0.649,  left: 0.552,  width: 0.518,  height: 0.348  },
  giocoliere: { top: 0.181,  left: 0.278,  width: 0.45,  height: 0.53  },
  pagliaccio: { top: 0.446,   left: 0.5586,   width: 0.4,   height: 0.215   },
  trapezista: { top: 0.192,   left: 0.304,   width: 0.405,   height: 0.6   },
  cavallerizza: { top: 0.178,   left: 0.813,   width: 0.24,   height: 0.5   },
  contorsionista: { top: 0.47,   left: 0.31,   width: 0.383,   height: 0.4   },
  controfigura: { top: 0.032,   left: 0.153,   width: 0.148,   height: 0.4   },
  domatore: { top: 0.216,   left: 0.508,   width: 0.4,   height: 0.257   },
  equilibrista: { top: 0.01,   left: 0.497,   width: 0.48,   height: 0.792   },
  sputafuoco: { top: 0.477,   left: 0.363,   width: 0.298,   height: 0.4   },
  illusionista: { top: 0.064,   left: 0.215,   width: 0.559,   height: 0.7   },
};

// ---------------------------------------------------------------------------
// POSIZIONE PERSONAGGIO (sprite) PER-SCENA
// ---------------------------------------------------------------------------
// Override della posizione/dimensione dello sprite NPC in CircoStanza.
// Se una scena non e' in CHARACTER_POSITIONS usa DEFAULT_CHARACTER_POSITION.
// Valori = percentuali stringa CSS (es. '-5%', '70%').
export const DEFAULT_CHARACTER_POSITION = {
  left:   '-5%',
  bottom: '-55%',
  width:  '70%',
  height: '145%',
};

export const CHARACTER_POSITIONS = {
  // Aggiungi qui override per-scena, es.:
  contorsionista: {left:   '-17%',bottom: '-55%',width:  '70%',height: '145%',},
  controfigura:   {left:   '8%',bottom: '-55%',width:  '70%',height: '145%',},
  domatore:         {left:   '-12%',bottom: '-55%',width:  '70%',height: '145%',},
  illusionista:     {left:   '15%',bottom: '-55%',width:  '70%',height: '145%',},
  sputafuoco:     {left:   '-13%',bottom: '-55%',width:  '70%',height: '145%',},
  trapezista:     {left:   '-18%',bottom: '-55%',width:  '70%',height: '145%',},
  direttrice:     {left:   '10%',bottom: '-55%',width:  '70%',height: '145%',},
};

export function getCharacterPosition(sceneId) {
  return CHARACTER_POSITIONS[sceneId] || DEFAULT_CHARACTER_POSITION;
}

export function getCharacterAsset(sceneId) {
  return ASSETS.characters[sceneId] || null;
}

export function getBackgroundAsset(sceneId) {
  return ASSETS.backgrounds[sceneId] || null;
}

export function getHintAsset(sceneId) {
  return ASSETS.hints[sceneId] || null;
}
