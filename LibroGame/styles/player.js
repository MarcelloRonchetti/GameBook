// styles/player.js
// Stili condivisi delle schermate del giocatore:
// JoinRoomScreen, IntroScreen, SceneScreen, AnagramScreen, DirectriceScreen.
// Include anche gli stili del placeholder grafico NPC.

import { StyleSheet } from 'react-native';
import { colors, spacing, radius, fontSize, fonts } from './theme';

// ---------------------------------------------------------------------------
// JoinRoomScreen
// ---------------------------------------------------------------------------
export const joinRoomStyles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bgDark },
  container: {
    flexGrow: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgDark,
  },
  title: {
    fontSize: fontSize.huge,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.primary,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    marginBottom: spacing.huge,
    textAlign: 'center',
  },
  input: {
    width: '60%',
    minWidth: 240,
    backgroundColor: colors.surfaceDark,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: fontSize.huge,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xxl,
    letterSpacing: 8,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.textFaint,
  },
  buttonText: {
    color: colors.bgDark,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: spacing.xxxl,
    padding: spacing.sm + 2,
  },
  logoutText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textDecorationLine: 'underline',
  },
  // Banner errore inline (cross-platform)
  errorBanner: {
    width: '100%',
    backgroundColor: colors.errorBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
  },
  errorBannerText: {
    color: colors.error,
    fontSize: fontSize.md,
  },
});

// ---------------------------------------------------------------------------
// IntroScreen
// ---------------------------------------------------------------------------
export const introStyles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.bgDark },
  content: { padding: spacing.xl, paddingBottom: spacing.huge },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  storyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    lineHeight: 26,
    textAlign: 'justify',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderDark,
    marginVertical: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: 'left',
    maxWidth: 950,
    width: '95%',
    alignSelf: 'center',
  },
  cipherText: {
    fontSize: fontSize.xl,
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    lineHeight: 30,
    backgroundColor: colors.surfaceDark,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: spacing.xl,
    textAlign: 'center',
    maxWidth: 950,
    width: '95%',
    alignSelf: 'center',
  },
  keyContainer: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.borderDark,
    maxWidth: 950,
    width: '95%',
    alignSelf: 'center',
  },
  keyTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  keyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  keyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgDark,
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm + 2,
    minWidth: 70,
    justifyContent: 'center',
  },
  keyNumber: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary,
    minWidth: 20,
    textAlign: 'right',
  },
  keyEquals: { fontSize: fontSize.md, color: colors.textFaint, marginHorizontal: spacing.xs },
  keyLetter: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    minWidth: 14,
  },
  answerSection: { marginTop: spacing.xs },
  input: {
    backgroundColor: colors.surfaceDark,
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    borderRadius: radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
    maxWidth: 950,
    width: '95%',
    alignSelf: 'center',
  },
  inputError: { borderColor: colors.error, borderWidth: 2 },
  errorText: {
    color: colors.error,
    fontSize: fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxxl,
    borderRadius: radius.md,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonDisabled: { backgroundColor: colors.textFaint },
  buttonText: {
    color: colors.bgDark,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  proceedButton: {
    backgroundColor: colors.success,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  successBox: {
    backgroundColor: colors.successBg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
    marginBottom: spacing.sm,
  },
  successText: {
    color: colors.success,
    fontSize: fontSize.base,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  solutionText: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontStyle: 'italic',
    lineHeight: 24,
  },
});

// ---------------------------------------------------------------------------
// SceneScreen + NPC PLACEHOLDER GRAFICO
// ---------------------------------------------------------------------------
export const sceneStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDark },
  content: { padding: spacing.xl, paddingBottom: spacing.huge },
  // Placeholder grafico — riquadro colorato in cima alla scena
  npcPlaceholder: {
    height: 200,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  npcPlaceholderInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  npcEmoji: {
    fontSize: 72,
    marginBottom: spacing.sm,
  },
  npcLabel: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  npcThemeTag: {
    fontSize: fontSize.sm,
    color: colors.white,
    opacity: 0.85,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  npcPlaceholderHint: {
    position: 'absolute',
    bottom: 6,
    right: 10,
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontStyle: 'italic',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  themeBadge: {
    alignSelf: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  themeText: { color: colors.primary, fontSize: fontSize.md, fontWeight: '600' },
  storyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    lineHeight: 26,
    textAlign: 'justify',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderDark,
    marginVertical: spacing.xxl,
  },
  hintText: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.bgDark,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
});

// ---------------------------------------------------------------------------
// AnagramScreen
// ---------------------------------------------------------------------------
export const anagramScreenStyles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.bgDark },
  content: { padding: spacing.xl, paddingBottom: spacing.huge },
  // Mini-placeholder NPC in alto (più piccolo del SceneScreen)
  npcMini: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderLeftWidth: 4,
  },
  npcMiniEmoji: {
    fontSize: fontSize.huge,
    marginRight: spacing.md,
  },
  npcMiniText: {
    flex: 1,
  },
  npcMiniLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  npcMiniTheme: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderDark,
    marginVertical: spacing.xxl,
  },
  anagramBox: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  anagramText: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  anagramHint: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.sm },
  cipherSection: { marginBottom: 0 },
  cipherText: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    lineHeight: 28,
    backgroundColor: colors.surfaceDark,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  keyContainer: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  keyTitle: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm + 2,
    textAlign: 'center',
  },
  keyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  keyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgDark,
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    minWidth: 60,
    justifyContent: 'center',
  },
  keyNumber: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.primary,
    minWidth: 18,
    textAlign: 'right',
  },
  keyEquals: { fontSize: fontSize.xs, color: colors.textFaint, marginHorizontal: 3 },
  keyLetter: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.textPrimary,
    minWidth: 12,
  },
  keyHint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: spacing.sm + 2,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSize.md,
    textAlign: 'center',
    marginVertical: spacing.sm + 2,
  },
  warningText: {
    color: colors.warning,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.sm + 2,
    fontStyle: 'italic',
  },
  successBox: {
    backgroundColor: colors.successBg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
    marginVertical: spacing.md,
  },
  successText: {
    color: colors.success,
    fontSize: fontSize.base,
    fontWeight: '600',
    marginBottom: 6,
  },
  solutionText: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: { backgroundColor: colors.textFaint },
  buttonText: {
    color: colors.bgDark,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  proceedButton: {
    backgroundColor: colors.success,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  choiceTitle: {
    fontSize: fontSize.xl - 1,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  choiceSubtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  choicesContainer: { gap: spacing.md },
  // Choice button con placeholder NPC integrato
  choiceButton: {
    backgroundColor: colors.surfaceDark,
    padding: spacing.lg,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  choiceEmoji: {
    fontSize: fontSize.huge,
    marginRight: spacing.md,
  },
  choiceText: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    flex: 1,
  },
});

// ---------------------------------------------------------------------------
// DirectriceScreen
// ---------------------------------------------------------------------------
export const directriceStyles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.bgDark },
  content: { padding: spacing.xl, paddingBottom: spacing.huge },
  // Placeholder Direttrice (più sobrio, dorato)
  directricePlaceholder: {
    height: 160,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  directriceEmoji: {
    fontSize: 64,
    marginBottom: spacing.xs,
  },
  directriceLabel: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.bgDark,
    letterSpacing: 1,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  storyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    lineHeight: 26,
    textAlign: 'justify',
    marginBottom: spacing.xl,
  },
  progressBar: { marginBottom: spacing.xl },
  progressText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.surfaceDark,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  navDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.borderDark,
  },
  navDotActive: { borderColor: colors.primary },
  navDotSolved: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
  },
  navDotText: { color: colors.textMuted, fontSize: fontSize.md, fontWeight: 'bold' },
  navDotTextSolved: { color: colors.success },
  anagramBox: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  anagramLabel: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.sm },
  anagramText: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: fontSize.md,
    textAlign: 'center',
    marginVertical: spacing.sm + 2,
  },
  successBox: {
    backgroundColor: colors.successBg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
    marginVertical: spacing.md,
  },
  successText: {
    color: colors.success,
    fontSize: fontSize.base,
    fontWeight: '600',
    marginBottom: 6,
  },
  solutionText: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  checkButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: colors.textFaint },
  buttonText: {
    color: colors.bgDark,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: colors.surfaceDark,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  completionBox: {
    backgroundColor: colors.surfaceDark,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginTop: spacing.xl,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  completionEmoji: { fontSize: 48, marginBottom: spacing.lg },
  completionTitle: {
    fontSize: fontSize.huge - 4,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  completionText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  completionSubtext: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

// ---------------------------------------------------------------------------
// CircoStanzaScreen — schermata unificata narrazione + anagramma
// ---------------------------------------------------------------------------
import { Dimensions } from 'react-native';
const { width: SW, height: SH } = Dimensions.get('window');

export const circoStanzaStyles = StyleSheet.create({
  // --- Contenitore base ---
  container: { flex: 1, backgroundColor: '#000' },

  // --- SFONDO ---
  background: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  backgroundImage: {
    width: '100%', height: '100%',
  },

  // --- OVERLAY scuro sopra lo sfondo (più intenso in modalità anagramma) ---
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  overlayAnagram: {
    backgroundColor: 'rgba(0,0,0,0.60)',
  },

  // --- SCROLL WRAPPER (modalità narrazione) ---
  // Permette di scrollare verticalmente il contenuto della narrazione
  // quando la finestra è troppo piccola (es. browser ridotto su web).
  narrationScroll: {
    flex: 1,
  },
  narrationScrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    // Su finestre alte, il dialog "scivola" naturalmente in basso;
    // su finestre piccole, il contenuto eccede e diventa scrollabile.
  },
  narrationInner: {
    width: '100%',
  },

  // --- SPRITE PERSONAGGIO ---
  // Grande, a sinistra, ancorato in basso: il busto sporge sopra il dialog box,
  // le gambe restano dietro (il dialog box ha zIndex superiore).
  characterContainer: {
    position: 'absolute',
    left: '-5%',
    bottom: '-55%',
    width: '70%',
    height: '145%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1,
  },
  characterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  // Versione mini durante l'anagramma — angolo in basso a sinistra
  characterMini: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    width: 70,
    height: 110,
    opacity: 0.7,
  },
  characterMiniImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  // --- DIALOG BOX (narrazione) ---
  // zIndex: 2 → copre le gambe del personaggio (che ha zIndex: 1)
  // maxHeight: limita l'altezza a ~45% dello schermo; lo scroll interno
  // gestisce i testi lunghi (es. monologhi del domatore/cavallerizza)
  dialogBox: {
    backgroundColor: 'rgba(15,10,5,0.7)',
    borderTopWidth: 2,
    borderTopColor: '#c8a45a',
    padding: 16,
    paddingBottom: 28,
    minHeight: 150,
    maxHeight: '45%',
    zIndex: 2,
  },
  dialogScrollContent: {
    flexGrow: 1,
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dialogName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c8a45a',
    letterSpacing: 1,
    flex: 1,
  },
  dialogTapHint: {
    fontSize: 11,
    color: 'rgba(200,164,90,0.6)',
    fontStyle: 'italic',
  },
  dialogText: {
    fontSize: 15,
    color: '#f0ead6',
    lineHeight: 23,
  },
  // Cursore typewriter lampeggiante
  dialogCursor: {
    fontSize: 15,
    color: '#c8a45a',
    fontWeight: 'bold',
  },
  // Bottone "Anagramma" che appare alla fine del testo
  anagramButton: {
    marginTop: 14,
    backgroundColor: '#c8a45a',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignSelf: 'center',
  },
  anagramButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Pannello quick view (ritorno dall'anagramma)
  quickViewPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: 'rgba(15,10,5,0.92)',
    borderTopWidth: 2,
    borderTopColor: '#c8a45a',
    padding: 16,
    paddingBottom: 28,
  },
  quickViewButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 14,
  },
  rereadButton: {
    marginTop: 14,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#c8a45a',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignSelf: 'center',
  },
  rereadButtonText: {
    color: '#c8a45a',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // --- ANAGRAM PANEL ---
  // Pannello centrale che appare in modalità anagramma
  anagramPanel: {
    position: 'absolute',
    top: '8%',
    left: '4%',
    right: '4%',
    bottom: '6%',
    backgroundColor: 'rgba(15,10,5,0.93)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#c8a45a',
    padding: 18,
  },
  anagramPanelScroll: {
    flex: 1,
  },
  anagramPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  anagramPanelTitle: {
    color: '#c8a45a',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  // Bottone "Torna al testo" in alto a destra nel pannello anagramma
  backToTextButton: {
    backgroundColor: 'rgba(200,164,90,0.15)',
    borderWidth: 1,
    borderColor: '#c8a45a',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  backToTextText: {
    color: '#c8a45a',
    fontSize: 12,
    fontWeight: '600',
  },
  anagramBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(200,164,90,0.4)',
  },
  anagramText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
    textAlign: 'center',
  },
  anagramHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 6,
  },
  warningText: {
    color: '#ff9800',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
  },
  successBox: {
    backgroundColor: '#1e2d1e',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#4caf50',
    marginBottom: 12,
  },
  successText: {
    color: '#4caf50',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  solutionText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  button: {
    backgroundColor: '#c8a45a',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: '#555' },
  buttonText: { color: '#1a1a1a', fontSize: 16, fontWeight: 'bold' },
  proceedButton: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  // Choice buttons dopo risoluzione
  choicesContainer: { gap: 10, marginTop: 8 },
  choiceButton: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c8a45a',
  },
  choiceEmoji: { fontSize: 28, marginRight: 12 },
  choiceText: { color: '#c8a45a', fontSize: 17, fontWeight: 'bold', flex: 1 },
  choiceTitle: {
    color: '#ddd',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  // Sezione cifrario (solo Illusionista)
  cipherSection: { marginBottom: 14 },
  cipherText: {
    fontSize: 16,
    color: '#f0ead6',
    fontFamily: 'monospace',
    lineHeight: 26,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(200,164,90,0.3)',
    marginBottom: 12,
    textAlign: 'center',
  },
  keyContainer: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(200,164,90,0.2)',
  },
  keyTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#c8a45a',
    marginBottom: 8,
    textAlign: 'center',
  },
  keyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  keyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    minWidth: 56,
    justifyContent: 'center',
  },
  keyNumber: { fontSize: 13, fontWeight: 'bold', color: '#c8a45a', minWidth: 16, textAlign: 'right' },
  keyEquals: { fontSize: 11, color: '#666', marginHorizontal: 3 },
  keyLetter: { fontSize: 13, fontWeight: 'bold', color: '#fff', minWidth: 12 },
  keyHint: { fontSize: 11, color: '#777', textAlign: 'center', fontStyle: 'italic', marginTop: 8 },
  divider: { height: 1, backgroundColor: 'rgba(200,164,90,0.25)', marginVertical: 14 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#c8a45a', marginBottom: 10 },
});

// ---------------------------------------------------------------------------
// MapScreen
// ---------------------------------------------------------------------------
export const mapStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  // Sfondo mappa fullscreen landscape
  mapBackground: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  mapImage: {
    width: '100%', height: '100%',
    resizeMode: 'cover',
  },

  // SVG overlay per le linee percorso (sovrapposto alla mappa)
  svgOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },

  // Ogni nodo è un TouchableOpacity posizionato in assoluto
  nodeContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  // Frame immagine arco + banner (occupa l'intera area del nodo)
  nodeFrameImage: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
  },
  // Area interna all'arco dove va lo sprite o l'emoji
  nodeInterior: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 999,
  },
  // Sprite mini del personaggio dentro l'arco
  nodeSprite: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  // Emoji fallback se non c'è lo sprite
  nodeEmoji: {
    fontSize: 20,
  },
  // Label sovrapposta al banner in basso nel frame
  nodeLabel: {
    position: 'absolute',
    fontSize: 7,
    fontWeight: 'bold',
    color: '#3a2000',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  nodeLabelFog: { color: 'rgba(80,60,20,0.4)' },

  // Overlay nebbia sopra l'arco (nodo bloccato)
  nodeFogOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeFogIcon: { color: 'rgba(255,255,255,0.75)', fontWeight: 'bold' },

  // Badge verde "risolto" nell'angolo
  nodeSolvedBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(76,175,80,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Header mappa (nome stanza + istruzioni)
  header: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#c8a45a',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  headerHint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontStyle: 'italic',
  },
  // Animazione reveal nebbia — usato con Animated.Value opacity
  revealAnimation: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 999,
  },
});
