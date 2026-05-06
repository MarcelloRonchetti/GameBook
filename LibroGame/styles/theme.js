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

export const fonts = {
  mono: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
  intro:          { x: 5,  y: 50, size: 44, isEntry: true },
  acrobata:       { x: 16, y: 50, size: 52 },
  funambolo:      { x: 29, y: 30, size: 48 },
  giocoliere:     { x: 29, y: 70, size: 48 },
  pagliaccio:     { x: 42, y: 18, size: 48 },
  trapezista:     { x: 42, y: 44, size: 48 },
  cavallerizza:   { x: 42, y: 68, size: 48 },
  contorsionista: { x: 55, y: 33, size: 48 },
  controfigura:   { x: 55, y: 58, size: 48 },
  domatore:       { x: 55, y: 78, size: 48 },
  equilibrista:   { x: 68, y: 20, size: 48 },
  sputafuoco:     { x: 68, y: 65, size: 48 },
  illusionista:   { x: 80, y: 43, size: 56 },
  direttrice:     { x: 93, y: 43, size: 60, isFinal: true },
};

// ---------------------------------------------------------------------------
// ASSET CENTRALIZZATI
// ---------------------------------------------------------------------------
export const ASSETS = {
  map: {
    background: require('../assets/map/circus_map.png'),
  },
  characters: {
    acrobata: require('../assets/characters/acrobata.png'),
    // Aggiungi qui man mano:
    // funambolo: require('../assets/characters/funambolo.png'),
  },
  backgrounds: {
    acrobata: require('../assets/backgrounds/acrobata_bg.png'),
    // funambolo: require('../assets/backgrounds/funambolo_bg.png'),
  },
};

// Helper — sprite personaggio o null se non ancora disponibile
export function getCharacterAsset(sceneId) {
  return ASSETS.characters[sceneId] || null;
}

// Helper — sfondo stanza o null se non ancora disponibile
export function getBackgroundAsset(sceneId) {
  return ASSETS.backgrounds[sceneId] || null;
}
