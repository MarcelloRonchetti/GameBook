// styles/auth.js
// Stili condivisi delle schermate di autenticazione:
// AuthLoadingScreen, LoginScreen, RegisterScreen.

import { StyleSheet } from 'react-native';
import { colors, spacing, radius, fontSize } from './theme';

// ---------------------------------------------------------------------------
// AuthLoadingScreen — splash iniziale
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
  spinner: {
    marginBottom: spacing.lg,
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textFaint,
  },
});

// ---------------------------------------------------------------------------
// LoginScreen
// ---------------------------------------------------------------------------
export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.bgDark,
  },
  title: {
    fontSize: fontSize.huge,
    fontWeight: 'bold',
    marginBottom: spacing.huge,
    color: colors.primary,
    letterSpacing: 1,
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
  buttonDisabled: {
    backgroundColor: colors.textFaint,
  },
  buttonText: {
    color: colors.bgDark,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  link: {
    color: colors.textMuted,
    fontSize: fontSize.md,
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
// RegisterScreen
// ---------------------------------------------------------------------------
export const registerStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    backgroundColor: colors.bgDark,
  },
  title: {
    fontSize: fontSize.huge - 4,
    fontWeight: 'bold',
    marginBottom: spacing.xxxl,
    color: colors.primary,
    textAlign: 'center',
  },
  input: {
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
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  buttonDisabled: {
    backgroundColor: colors.textFaint,
  },
  buttonText: {
    color: colors.bgDark,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  link: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: 'center',
  },
  errorBanner: {
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
