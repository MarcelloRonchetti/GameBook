// styles/auth.js
// Stili "Velluto teatrale" per Login / Register (e legacy AuthLoading,
// ForgotPassword, ResetPassword lasciati invariati per non rompere altre schermate).

import { StyleSheet, Platform } from 'react-native';
import { colors, spacing, radius, fontSize, shadows, fontFamilies } from './theme';

const v = colors.velvet;

// Ombra "brass" dorata usata sui CTA principali.
const brassShadow = Platform.select({
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
// AuthLoadingScreen — invariato (player flow non incluso nello scope visivo)
// ---------------------------------------------------------------------------
export const authLoadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: fontSize.display,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginBottom: 60,
  },
  spinner: { marginBottom: spacing.lg },
  loadingText: { fontSize: fontSize.md, color: colors.textFaint },
});

// ---------------------------------------------------------------------------
// LoginScreen — "Velluto teatrale"
// ---------------------------------------------------------------------------
export const loginStyles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: v.bgDeep },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.huge,
  },
  // Strato cliccabile sopra al backdrop (zIndex 1) per ospitare la card.
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
  ornamentLine: {
    width: 64,
    height: 1,
    backgroundColor: v.goldFaintStrong,
  },
  ornamentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
    maxWidth: 440,
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
    marginBottom: 6,
    fontFamily: fontFamilies.body,
  },
  inputWrapper: {
    marginBottom: spacing.lg,
  },
  input: {
    width: '100%',
    backgroundColor: v.bgRaised,
    borderWidth: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: v.goldFaint,
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: fontSize.lg,
    color: v.champagne,
    fontFamily: fontFamilies.body,
  },
  inputFocused: {
    borderBottomColor: v.goldSoft,
    backgroundColor: '#552a37',
  },
  // CTA primario "brass"
  ctaWrapper: {
    width: '100%',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  ctaGlow: {
    position: 'absolute',
    top: -3, left: -3, right: -3, bottom: -3,
    borderRadius: radius.md + 3,
    borderWidth: 1,
    borderColor: v.gold,
    ...brassShadow,
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
  // Link sottili
  linkRow: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  link: {
    color: v.goldSoft,
    fontSize: fontSize.md,
    fontFamily: fontFamilies.body,
    letterSpacing: 0.5,
  },
  linkMuted: {
    color: v.champagneMuted,
    fontSize: fontSize.sm,
    fontFamily: fontFamilies.body,
  },
  // Banner errore
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
// RegisterScreen — variante più alta della card
// ---------------------------------------------------------------------------
export const registerStyles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: v.bgDeep },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.huge,
  },
  stage: {
    flex: 1,
    minHeight: 720,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    zIndex: 1,
  },
  ornamentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
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
    fontSize: 28,
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
  },
  fieldLabel: {
    color: v.champagneMuted,
    fontSize: fontSize.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
    fontFamily: fontFamilies.body,
  },
  inputWrapper: {
    marginBottom: spacing.md + 2,
  },
  input: {
    width: '100%',
    backgroundColor: v.bgRaised,
    borderWidth: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: v.goldFaint,
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: fontSize.lg,
    color: v.champagne,
    fontFamily: fontFamilies.body,
  },
  inputFocused: {
    borderBottomColor: v.goldSoft,
    backgroundColor: '#552a37',
  },
  ctaWrapper: {
    width: '100%',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  ctaGlow: {
    position: 'absolute',
    top: -3, left: -3, right: -3, bottom: -3,
    borderRadius: radius.md + 3,
    borderWidth: 1,
    borderColor: v.gold,
    ...brassShadow,
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
  secondaryButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: v.goldFaintStrong,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  secondaryButtonText: {
    color: v.goldSoft,
    fontSize: fontSize.md,
    fontFamily: fontFamilies.body,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  link: {
    color: v.goldSoft,
    fontSize: fontSize.md,
    fontFamily: fontFamilies.body,
    textAlign: 'center',
  },
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
// ForgotPasswordScreen — invariato (fuori scope)
// ---------------------------------------------------------------------------
export const forgotPasswordStyles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bgDark },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.bgDark,
  },
  title: {
    fontSize: fontSize.huge,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    color: colors.primary,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.huge,
  },
  input: {
    width: '100%',
    backgroundColor: colors.surfaceDark,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  buttonDisabled: { backgroundColor: colors.textFaint },
  buttonText: { color: colors.bgDark, fontSize: fontSize.lg, fontWeight: 'bold' },
  link: { color: colors.textMuted, fontSize: fontSize.md },
  errorBanner: {
    width: '100%',
    backgroundColor: colors.errorBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
  },
  errorBannerText: { color: colors.error, fontSize: fontSize.md },
  successBanner: {
    width: '100%',
    backgroundColor: colors.successBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
  },
  successBannerText: { color: colors.success, fontSize: fontSize.md },
});

// ---------------------------------------------------------------------------
// ResetPasswordScreen — invariato (fuori scope)
// ---------------------------------------------------------------------------
export const resetPasswordStyles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bgDark },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.bgDark,
  },
  title: {
    fontSize: fontSize.huge,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    color: colors.primary,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.huge,
  },
  input: {
    width: '100%',
    backgroundColor: colors.surfaceDark,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  buttonDisabled: { backgroundColor: colors.textFaint },
  buttonText: { color: colors.bgDark, fontSize: fontSize.lg, fontWeight: 'bold' },
  link: { color: colors.textMuted, fontSize: fontSize.md },
  errorBanner: {
    width: '100%',
    backgroundColor: colors.errorBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
  },
  errorBannerText: { color: colors.error, fontSize: fontSize.md },
});
