// styles/components.js
// Stili condivisi dai componenti riutilizzabili in components/.
// Importa da theme.js per coerenza visiva.

import { StyleSheet } from 'react-native';
import { colors, spacing, radius, fontSize, fontFamilies } from './theme';

// ---------------------------------------------------------------------------
// VelvetBackdrop — sfondo teatrale condiviso
// ---------------------------------------------------------------------------
export const velvetBackdropStyles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 0,
    overflow: 'hidden',
  },
  layerFill: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  curtain: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  particleLayer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  particle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(224,196,133,0.5)',
    shadowColor: '#e0c485',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});

// ---------------------------------------------------------------------------
// AnagramInput — input velluto teatrale, Manrope, focus oro
// ---------------------------------------------------------------------------
export const anagramInputStyles = StyleSheet.create({
  input: {
    fontFamily: fontFamilies.body,
    backgroundColor: 'rgba(26,12,15,0.55)',
    color: colors.velvet.champagne,
    fontSize: fontSize.lg,
    borderRadius: radius.md,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.velvet.goldFaint,
    minHeight: 50,
    textAlignVertical: 'center',
    letterSpacing: 0.5,
  },
  inputError: {
    borderColor: colors.velvet.danger,
    borderWidth: 2,
  },
});

// ---------------------------------------------------------------------------
// AutoHintEffect
// ---------------------------------------------------------------------------
export const autoHintEffectStyles = StyleSheet.create({
  // Fallback: bordo oro su tutta la viewport (usato se non c'è hintImage)
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 4,
    borderColor: colors.primary,
    pointerEvents: 'none',
    zIndex: 1000,
  },
  // Contenitore immagine hint — zIndex 1 per stare sotto il dialog box (zIndex 2)
  hintImage: {
    position: 'absolute',
    zIndex: 1,
  },
  // Bordo lampeggiante oro sulla zona specifica della scena (es. finestra sfondo)
  hintBorder: {
    position: 'absolute',
    zIndex: 1000,
    borderWidth: 4,
    borderColor: colors.primary,
    borderRadius: 16,
  },
});

// ---------------------------------------------------------------------------
// GmHint — banner suggerimenti del GM (velvet teatrale)
// ---------------------------------------------------------------------------
export const gmHintStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(58,22,30,0.78)',
    borderLeftWidth: 3,
    borderLeftColor: colors.velvet.gold,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.velvet.goldFaint,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  icon: {
    fontSize: fontSize.lg,
    marginRight: spacing.sm,
  },
  title: {
    fontFamily: fontFamilies.bodyMedium,
    color: colors.velvet.gold,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2.5,
  },
  message: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    color: colors.velvet.champagne,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  // Orario suggerimento → Special Elite (numerico)
  timestamp: {
    fontFamily: fontFamilies.typewriter,
    color: colors.velvet.champagneMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
});

// ---------------------------------------------------------------------------
// PlayerCard — card giocatore in dashboard GM
// ---------------------------------------------------------------------------
export const playerCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md - 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textDarkPrimary,
    marginBottom: spacing.xs,
  },
  scene: {
    fontSize: fontSize.sm,
    color: colors.textFaint,
  },
  arrow: {
    fontSize: fontSize.xxl + 2,
    color: colors.textMuted,
  },
});

// ---------------------------------------------------------------------------
// SceneCard
// ---------------------------------------------------------------------------
export const sceneCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  theme: {
    color: colors.primary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
});
