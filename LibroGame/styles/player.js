// styles/player.js
// Stili condivisi delle schermate del giocatore:
// JoinRoomScreen, IntroScreen, SceneScreen, AnagramScreen, DirectriceScreen.
// Include anche gli stili del placeholder grafico NPC.

import { StyleSheet, Platform } from 'react-native';
import { colors, spacing, radius, fontSize, fonts, shadows, fontFamilies, typography } from './theme';

const v = colors.velvet;

const brassShadowJoin = Platform.select({
  web: {
    shadowColor: v.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
  },
  default: {
    shadowColor: v.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});

// ---------------------------------------------------------------------------
// JoinRoomScreen — "Velluto teatrale" (allineata a Login/Register)
// ---------------------------------------------------------------------------
export const joinRoomStyles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: v.bgDeep },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.huge,
  },
  stage: {
    flex: 1,
    minHeight: 600,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    zIndex: 1,
  },
  ornamentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    opacity: 0.85,
  },
  ornamentLine: { width: 64, height: 1, backgroundColor: v.goldFaintStrong },
  ornamentDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: v.gold,
    transform: [{ rotate: '45deg' }],
  },
  eyebrow: {
    color: v.gold,
    fontSize: fontSize.xs,
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: spacing.md,
    fontFamily: fontFamilies.body,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: 'rgba(61,30,37,0.92)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: v.goldFaint,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 28,
    ...shadows.lg,
  },
  title: {
    fontFamily: fontFamilies.serif,
    fontSize: 30,
    fontWeight: '700',
    color: v.champagne,
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    color: v.champagneMuted,
    fontSize: fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    letterSpacing: 0.3,
  },
  fieldLabel: {
    color: v.champagneMuted,
    fontSize: fontSize.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: fontFamilies.body,
  },
  // Input codice come "brass plate" — letter-spacing forte, bordo oro
  input: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 320,
    backgroundColor: v.bgRaised,
    borderWidth: 1.5,
    borderColor: v.goldFaint,
    borderRadius: radius.md,
    paddingVertical: 18,
    paddingHorizontal: spacing.md,
    fontSize: 32,
    fontWeight: '700',
    color: v.gold,
    letterSpacing: 14,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    fontFamily: fonts.mono,
  },
  inputFocused: {
    borderColor: v.goldSoft,
    backgroundColor: '#552a37',
  },
  // CTA primario "brass"
  ctaWrapper: {
    width: '100%',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  ctaGlow: {
    position: 'absolute',
    top: -3, left: -3, right: -3, bottom: -3,
    borderRadius: radius.md + 3,
    borderWidth: 1,
    borderColor: v.gold,
    ...brassShadowJoin,
  },
  button: {
    width: '100%',
    backgroundColor: v.gold,
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: v.goldSoft,
  },
  buttonDisabled: {
    backgroundColor: v.taupe,
    borderColor: v.taupe,
  },
  buttonText: {
    color: v.ink,
    fontSize: fontSize.lg,
    fontFamily: fontFamilies.serif,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  // Logout link discreto
  logoutButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  logoutText: {
    color: v.champagneMuted,
    fontSize: fontSize.sm,
    fontFamily: fontFamilies.body,
    letterSpacing: 0.5,
  },
  // Banner errore (stesso pattern di Login)
  errorBanner: {
    width: '100%',
    backgroundColor: 'rgba(168,89,89,0.18)',
    borderLeftWidth: 3,
    borderLeftColor: v.gold,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
  },
  errorBannerText: {
    color: '#f1c8c8',
    fontSize: fontSize.sm,
    fontFamily: fontFamilies.body,
    letterSpacing: 0.3,
  },
});

// ---------------------------------------------------------------------------
// IntroScreen
// ---------------------------------------------------------------------------
export const introStyles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.velvet.bgDeep },
  content: { padding: spacing.xl, paddingBottom: spacing.huge },
  // Titolo pagina → Cormorant italic crema
  title: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    fontSize: 32,
    color: colors.velvet.champagne,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    letterSpacing: 0.5,
  },
  storyText: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontSize: 17,
    color: colors.velvet.champagne,
    lineHeight: 28,
    textAlign: 'justify',
  },
  divider: {
    height: 1,
    backgroundColor: colors.velvet.goldFaint,
    marginVertical: spacing.xxl,
  },
  // Eyebrow di sezione — uppercase oro tracked
  sectionTitle: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.velvet.gold,
    marginBottom: spacing.md,
    textAlign: 'left',
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    maxWidth: 950,
    width: '95%',
    alignSelf: 'center',
  },
  // Cifrario: Special Elite, lettere ariose
  cipherText: {
    fontFamily: fontFamilies.typewriter,
    fontSize: 22,
    color: colors.velvet.champagne,
    lineHeight: 34,
    backgroundColor: 'rgba(26,12,15,0.55)',
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.velvet.goldFaint,
    marginBottom: spacing.xl,
    textAlign: 'center',
    letterSpacing: 2,
    maxWidth: 950,
    width: '95%',
    alignSelf: 'center',
  },
  keyContainer: {
    backgroundColor: 'rgba(26,12,15,0.45)',
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.velvet.goldFaint,
    maxWidth: 950,
    width: '95%',
    alignSelf: 'center',
  },
  keyTitle: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.velvet.gold,
    marginBottom: spacing.md,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2.5,
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
    backgroundColor: 'rgba(26,12,15,0.7)',
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm + 2,
    minWidth: 70,
    justifyContent: 'center',
  },
  // Numero della chiave → Special Elite
  keyNumber: {
    fontFamily: fontFamilies.typewriter,
    fontSize: fontSize.lg,
    color: colors.velvet.gold,
    minWidth: 20,
    textAlign: 'right',
  },
  keyEquals: { fontSize: fontSize.md, color: colors.velvet.champagneMuted, marginHorizontal: spacing.xs },
  // Lettera della chiave → Manrope bold (lettera, non numero)
  keyLetter: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.velvet.champagne,
    minWidth: 14,
  },
  answerSection: { marginTop: spacing.xs },
  input: {
    fontFamily: fontFamilies.body,
    backgroundColor: 'rgba(26,12,15,0.55)',
    color: colors.velvet.champagne,
    fontSize: fontSize.lg,
    borderRadius: radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.velvet.goldFaint,
    marginBottom: spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
    maxWidth: 950,
    width: '95%',
    alignSelf: 'center',
  },
  inputError: { borderColor: colors.velvet.danger, borderWidth: 2 },
  errorText: {
    fontFamily: fontFamilies.body,
    color: colors.velvet.danger,
    fontSize: fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.velvet.gold,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxxl,
    borderRadius: radius.md,
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.velvet.goldSoft,
  },
  buttonDisabled: { backgroundColor: colors.velvet.taupe, borderColor: colors.velvet.taupe },
  buttonText: {
    fontFamily: fontFamilies.bodyBold,
    color: colors.velvet.ink,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  proceedButton: {
    backgroundColor: colors.velvet.gold,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxxl,
    borderRadius: radius.md,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.velvet.goldSoft,
  },
  successBox: {
    backgroundColor: 'rgba(122,163,122,0.15)',
    borderRadius: radius.md,
    padding: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.velvet.success,
    marginBottom: spacing.sm,
  },
  successText: {
    fontFamily: fontFamilies.bodyMedium,
    color: colors.velvet.success,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  // Soluzione cifrata svelata — Cormorant italic crema
  solutionText: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    color: colors.velvet.champagne,
    fontSize: 20,
    lineHeight: 28,
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
    backgroundColor: 'rgba(26,12,15,0.78)', // velvet ink + alpha 0.78
    borderTopWidth: 1,
    borderTopColor: 'rgba(200,164,90,0.45)', // linea oro
    padding: 18,
    paddingBottom: 28,
    minHeight: 150,
    maxHeight: '45%',
    zIndex: 2,
  },
  dialogScrollContent: {
    flexGrow: 1,
  },
  // Header dialogo: nome NPC (Cormorant italic oro soft) + filetto + batt. N/M
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  dialogName: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: 20,
    color: colors.velvet.goldSoft,
    letterSpacing: 0.5,
  },
  dialogRule: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(200,164,90,0.45)',
  },
  dialogCounter: {
    fontFamily: fontFamilies.typewriter,
    fontSize: 12,
    color: colors.velvet.champagneMuted,
    letterSpacing: 0.5,
  },
  dialogTapHint: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: 'rgba(200,164,90,0.6)',
    fontStyle: 'italic',
  },
  // Testo battuta: Cormorant italic crema, righe ariose
  dialogText: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: 18,
    color: colors.velvet.champagne,
    lineHeight: 28,
  },
  // Cursore typewriter: barra oro 2px (sostituisce il pipe testuale)
  dialogCursor: {
    fontFamily: fontFamilies.body,
    fontSize: 18,
    color: colors.velvet.gold,
    fontWeight: '700',
  },
  // Bottone primario "Affronta l'anagramma"
  anagramButton: {
    marginTop: 14,
    backgroundColor: colors.velvet.gold,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.velvet.goldSoft,
  },
  anagramButtonText: {
    fontFamily: fontFamilies.bodyBold,
    color: colors.velvet.ink,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 4,
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
    borderColor: 'rgba(200,164,90,0.45)',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignSelf: 'center',
  },
  rereadButtonText: {
    fontFamily: fontFamilies.bodyBold,
    color: colors.velvet.goldSoft,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 4,
  },

  // --- ANAGRAM PANEL ---
  // Pannello centrale che appare in modalità anagramma
  anagramPanel: {
    position: 'absolute',
    top: '8%',
    left: '4%',
    right: '4%',
    bottom: '6%',
    backgroundColor: 'rgba(58,22,30,0.92)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.velvet.goldFaint,
    padding: 22,
  },
  anagramPanelScroll: {
    flex: 1,
  },
  anagramPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 10,
  },
  // Nome NPC nel pannello — Cormorant italic 500, oro soft
  anagramPanelTitle: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    color: colors.velvet.goldSoft,
    fontSize: 26,
    flex: 1,
    letterSpacing: 0.5,
  },
  anagramBox: {
    backgroundColor: 'rgba(26,12,15,0.45)',
    borderRadius: radius.md,
    padding: 18,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.velvet.goldFaint,
  },
  // Anagramma in mostra — Cormorant italic crema, NON typewriter (è una "frase")
  anagramText: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    fontSize: 26,
    color: colors.velvet.champagne,
    letterSpacing: 1,
    textAlign: 'center',
  },
  // "(1 parola)" — numero in Special Elite
  anagramHint: {
    fontFamily: fontFamilies.typewriter,
    fontSize: 12,
    color: colors.velvet.champagneMuted,
    marginTop: 8,
  },
  errorText: {
    fontFamily: fontFamilies.body,
    color: colors.velvet.danger,
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 6,
  },
  warningText: {
    fontFamily: fontFamilies.body,
    fontStyle: 'italic',
    color: colors.velvet.goldSoft,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
  successBox: {
    backgroundColor: 'rgba(122,163,122,0.15)',
    borderRadius: radius.md,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: colors.velvet.success,
    marginBottom: 12,
  },
  successText: {
    fontFamily: fontFamilies.bodyMedium,
    color: colors.velvet.success,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 6,
  },
  // Soluzione anagramma rivelata — Cormorant italic crema
  solutionText: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    color: colors.velvet.champagne,
    fontSize: 22,
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: colors.velvet.gold,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.velvet.goldSoft,
  },
  // Variante compatta del bottone primario — non full-width, dimensione a contenuto
  buttonCompact: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: 12,
    marginTop: 0,
  },
  // Row "torna al testo + verifica" sotto l'input dell'anagramma — coppia centrata, stessa identita visiva
  verifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },
  buttonDisabled: { backgroundColor: colors.velvet.taupe, borderColor: colors.velvet.taupe },
  buttonText: {
    fontFamily: fontFamilies.bodyBold,
    color: colors.velvet.ink,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  proceedButton: {
    backgroundColor: colors.velvet.gold,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.velvet.goldSoft,
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
  choiceText: {
    fontFamily: fontFamilies.bodyBold,
    color: colors.velvet.goldSoft,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 3,
    flex: 1,
  },
  // Prompt enigma / domanda "Sia fatta..." — Cormorant italic crema muta
  choiceTitle: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    color: colors.velvet.champagneMuted,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  // Sezione cifrario (solo Illusionista)
  cipherSection: { marginBottom: 14 },
  cipherText: {
    fontFamily: fontFamilies.typewriter,
    fontSize: 18,
    color: colors.velvet.champagne,
    lineHeight: 30,
    backgroundColor: 'rgba(26,12,15,0.45)',
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.velvet.goldFaint,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 2,
  },
  keyContainer: {
    backgroundColor: 'rgba(26,12,15,0.3)',
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.velvet.goldFaint,
  },
  keyTitle: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 11,
    fontWeight: '600',
    color: colors.velvet.gold,
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2.5,
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
    backgroundColor: 'rgba(26,12,15,0.6)',
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: 6,
    minWidth: 56,
    justifyContent: 'center',
  },
  // Numeri della chiave → Special Elite
  keyNumber: {
    fontFamily: fontFamilies.typewriter,
    fontSize: 14,
    color: colors.velvet.gold,
    minWidth: 16,
    textAlign: 'right',
  },
  keyEquals: { fontSize: 11, color: colors.velvet.champagneMuted, marginHorizontal: 3 },
  // Lettere della chiave → Manrope bold (alfabetiche, non numeriche)
  keyLetter: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 14,
    fontWeight: '700',
    color: colors.velvet.champagne,
    minWidth: 12,
  },
  keyHint: {
    fontFamily: fontFamilies.body,
    fontStyle: 'italic',
    fontSize: 11,
    color: colors.velvet.champagneMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  divider: { height: 1, backgroundColor: colors.velvet.goldFaint, marginVertical: 14 },
  // Eyebrow di sezione: uppercase + tracked oro
  sectionTitle: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 11,
    fontWeight: '600',
    color: colors.velvet.gold,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
  },
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
  // Label sovrapposta al banner in basso nel frame — Manrope bold uppercase
  nodeLabel: {
    position: 'absolute',
    fontFamily: fontFamilies.bodyBold,
    fontSize: 7,
    fontWeight: '700',
    color: '#3a2000',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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

  // Header mappa: top bar nero-violaceo + filetto oro, titolo Cormorant italic
  header: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    backgroundColor: 'rgba(26,12,15,0.78)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200,164,90,0.45)',
    paddingVertical: 12,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    color: colors.velvet.goldSoft,
    fontSize: 18,
    letterSpacing: 0.5,
    flex: 1,
  },
  headerHint: {
    fontFamily: fontFamilies.body,
    fontStyle: 'italic',
    color: colors.velvet.champagneMuted,
    fontSize: 12,
  },
  // Animazione reveal nebbia — usato con Animated.Value opacity
  revealAnimation: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 999,
  },
});
