# Password Reset (Brevo SMTP) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a self-service password reset flow to LibroGame for both GM and player accounts, using Supabase Auth + Brevo SMTP.

**Architecture:** Two new auth screens (`ForgotPasswordScreen`, `ResetPasswordScreen`), one URL-routing change in the navigator, one PASSWORD_RECOVERY handler in `AuthLoadingScreen`, and a one-time Brevo + Supabase dashboard config. Web-first; deep-link prefix already wired so mobile can be added later without restructuring.

**Tech Stack:** Expo SDK 54, React Native, `@supabase/supabase-js`, `@react-navigation/native` (linking config), Brevo SMTP (free tier, 300 emails/day).

**Note on tests:** This project has no automated test suite (no Jest/Vitest in `package.json`). Verification is manual via `npm run web`. Each task ends with a manual verification step + commit.

**Reference spec:** [docs/superpowers/specs/2026-05-07-password-reset-brevo-design.md](../specs/2026-05-07-password-reset-brevo-design.md)

---

## File Map

**Create:**
- `LibroGame/lib/resetRedirect.js` — helper returning the URL Brevo embeds in emails
- `LibroGame/screens/auth/ForgotPasswordScreen.js` — email input → triggers reset email
- `LibroGame/screens/auth/ResetPasswordScreen.js` — new-password form, called from email link

**Modify:**
- `LibroGame/styles/auth.js` — add `forgotPasswordStyles`, `resetPasswordStyles`
- `LibroGame/screens/auth/LoginScreen.js` — add "Password dimenticata?" link
- `LibroGame/screens/auth/AuthLoadingScreen.js` — handle `PASSWORD_RECOVERY` event
- `LibroGame/navigation/AppNavigator.js` — register routes + `linking` config

**Doc updates (last task):**
- `CLAUDE.md` — add "Email (Brevo SMTP)" section, register new screens in architecture, remove "Known gap"
- `LibroGame_Checklist.md` — move new items to Completato, add Decisioni, add Da Testare

---

## Task 1: Configure Brevo + Supabase (dashboard, no code)

This is a manual one-time step. Do it first — without SMTP configured, the flow can't be tested end-to-end. This task produces no commit.

**Files:** none (dashboard work)

- [ ] **Step 1: Create a Brevo account**

Open https://www.brevo.com/ → "Sign up free". Fill in name, email, password. Confirm via email link. Free tier = 300 emails/day forever.

- [ ] **Step 2: Verify a sender address**

In Brevo dashboard → Senders, Domains & Dedicated IPs → Senders → "Add a sender". Use a personal email (e.g. your Gmail). Brevo sends a verification email to that address — click the link inside.

- [ ] **Step 3: Generate SMTP credentials**

In Brevo dashboard → SMTP & API → SMTP tab → "Generate a new SMTP key". Give it a name like `LibroGame`. Capture:
- Host: `smtp-relay.brevo.com`
- Port: `587`
- Login: your Brevo account email
- Password: the generated SMTP key (shown once — copy now)

- [ ] **Step 4: Configure Supabase SMTP**

In Supabase dashboard for the LibroGame project → Authentication → Emails → SMTP Settings:
- Toggle "Enable Custom SMTP" ON
- Sender email: the verified Brevo sender from Step 2
- Sender name: `LibroGame`
- Host: `smtp-relay.brevo.com`
- Port: `587`
- Username: Brevo account email
- Password: SMTP key from Step 3
- Save

- [ ] **Step 5: Add redirect URL allowlist**

In Supabase dashboard → Authentication → URL Configuration → Redirect URLs → add:
- `http://localhost:8081/reset-password`
- `http://localhost:8081/*` (covers the dev port for Expo web; useful for future flows)

(Production URL gets added later, after deployment.)

- [ ] **Step 6: Translate the reset email template**

In Supabase dashboard → Authentication → Emails → Templates → "Reset Password":
- Subject: `Reimposta la tua password — LibroGame`
- Body: replace English copy with Italian. Keep `{{ .ConfirmationURL }}` placeholder unchanged. Suggested body:

```
<h2>Reimposta la password</h2>
<p>Hai richiesto di reimpostare la password del tuo account LibroGame.</p>
<p>Clicca sul link qui sotto per scegliere una nuova password. Il link è valido per 1 ora.</p>
<p><a href="{{ .ConfirmationURL }}">Reimposta password</a></p>
<p>Se non hai richiesto tu il reset, ignora questa email.</p>
```

Save.

- [ ] **Step 7: Smoke-test that emails actually arrive**

In Supabase dashboard → Authentication → Users → pick any test user → "..." → "Send password recovery". Confirm an email arrives in the user's inbox within ~30 seconds. If it doesn't arrive: check Brevo dashboard → Statistics → Email logs for delivery failures, and verify SMTP credentials in Supabase.

---

## Task 2: Add `lib/resetRedirect.js` helper

Small helper that returns the URL Brevo should embed in the recovery email. Web returns the current origin + `/reset-password`. Native returns a deep-link placeholder for now.

**Files:**
- Create: `LibroGame/lib/resetRedirect.js`

- [ ] **Step 1: Create the file**

```javascript
// lib/resetRedirect.js
// Calcola l'URL di redirect per il flusso "password dimenticata" di Supabase.
// Su web: usa l'origin corrente (es. http://localhost:8081/reset-password).
// Su mobile: ritorna un deep link 'librogame://reset-password' come placeholder
// (verrà attivato realmente quando si farà il primo build EAS con scheme registrato).

import { Platform } from 'react-native';

export function getResetRedirect() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.origin}/reset-password`;
  }
  return 'librogame://reset-password';
}
```

- [ ] **Step 2: Manual verification**

Open `LibroGame/lib/resetRedirect.js` and confirm the file is saved with the exact content above.

- [ ] **Step 3: Commit**

```bash
git add LibroGame/lib/resetRedirect.js
git commit -m "feat(auth): add resetRedirect helper for password reset URL"
```

---

## Task 3: Add `forgotPasswordStyles` and `resetPasswordStyles` to `styles/auth.js`

Both new screens reuse the existing token system in `theme.js`. Pattern matches `loginStyles` (`KeyboardAvoidingView` + centered `ScrollView`).

**Files:**
- Modify: `LibroGame/styles/auth.js` (append at end of file)

- [ ] **Step 1: Append the new style blocks**

Open `LibroGame/styles/auth.js` and append at the end of the file (after `registerStyles`):

```javascript
// ---------------------------------------------------------------------------
// ForgotPasswordScreen
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
  successBanner: {
    width: '100%',
    backgroundColor: colors.successBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
  },
  successBannerText: {
    color: colors.success,
    fontSize: fontSize.md,
  },
});

// ---------------------------------------------------------------------------
// ResetPasswordScreen
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
```

- [ ] **Step 2: Manual verification**

Run `npm run web` from `LibroGame/`. Confirm the app boots without a syntax error in the styles file (any error would show as a red Metro bundler message in the terminal). Then stop the server.

- [ ] **Step 3: Commit**

```bash
git add LibroGame/styles/auth.js
git commit -m "feat(styles): add forgot/reset password screen styles"
```

---

## Task 4: Create `ForgotPasswordScreen.js`

Email input → "Invia link di recupero" → success state. Mirrors `LoginScreen` skeleton (KeyboardAvoidingView + ScrollView, inline error banner).

**Files:**
- Create: `LibroGame/screens/auth/ForgotPasswordScreen.js`

- [ ] **Step 1: Create the file**

```javascript
// ForgotPasswordScreen.js
// Schermata "Password dimenticata?" — l'utente inserisce la propria email
// e Supabase (via Brevo SMTP) invia un link di recupero.
// In caso di successo mostra un pannello di conferma invece del form.

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { getResetRedirect } from '../../lib/resetRedirect';
import { forgotPasswordStyles as styles } from '../../styles/auth';

export default function ForgotPasswordScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // sent — quando true, mostra il pannello di conferma invece del form
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    setErrorMsg('');

    // Sanitizzazione + validazione formato
    const sanitizedEmail = email.trim().toLowerCase();
    if (!sanitizedEmail) {
      setErrorMsg('Inserisci la tua email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      setErrorMsg('Inserisci un indirizzo email valido');
      return;
    }

    setLoading(true);

    // Supabase invia il link di recupero. Per evitare user-enumeration
    // mostriamo successo anche se l'email non è registrata: Supabase
    // restituisce comunque success in quel caso, quindi nessun ramo speciale.
    const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
      redirectTo: getResetRedirect(),
    });

    setLoading(false);

    if (error) {
      setErrorMsg(`Errore invio email: ${error.message}`);
      return;
    }

    setSent(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Password dimenticata</Text>

        {sent ? (
          // Pannello di conferma — sostituisce il form dopo l'invio
          <>
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>
                ✉️ Controlla la tua email. Il link di recupero è valido per 1 ora.
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Torna al login</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>
              Inserisci la tua email: ti invieremo un link per impostare una nuova password.
            </Text>

            {errorMsg ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠️ {errorMsg}</Text>
              </View>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={(t) => { setEmail(t); setErrorMsg(''); }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Invio in corso...' : 'Invia link di recupero'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Torna al login</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
```

- [ ] **Step 2: Manual verification**

The screen isn't routable yet (Task 6 wires it). For now just confirm `npm run web` doesn't throw a syntax error. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add LibroGame/screens/auth/ForgotPasswordScreen.js
git commit -m "feat(auth): add ForgotPasswordScreen"
```

---

## Task 5: Create `ResetPasswordScreen.js`

Two password inputs (new + confirm), validates and calls `supabase.auth.updateUser({ password })`. Has a direct-visit guard for users who arrive without a recovery session.

**Files:**
- Create: `LibroGame/screens/auth/ResetPasswordScreen.js`

- [ ] **Step 1: Create the file**

```javascript
// ResetPasswordScreen.js
// Schermata raggiunta cliccando il link nell'email di recupero password.
// Supabase JS rileva automaticamente il token nell'hash della URL e crea
// una sessione PASSWORD_RECOVERY: in quel momento updateUser({ password })
// è abilitato per impostare la nuova password.
//
// Se l'utente arriva qui senza sessione (es. apertura diretta della URL),
// mostriamo un banner di errore + link al login.

import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { notify } from '../../lib/helpers';
import { resetPasswordStyles as styles } from '../../styles/auth';

export default function ResetPasswordScreen({ navigation }) {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // hasRecoverySession — true se Supabase ha una sessione attiva al mount.
  // Se false, l'utente è arrivato qui senza link valido (o link scaduto).
  const [hasRecoverySession, setHasRecoverySession] = useState(null);

  useEffect(() => {
    // Controlla la sessione corrente: il client Supabase ha già processato
    // l'hash della URL al boot, quindi se siamo qui dopo un click sul link
    // di recupero la getSession() restituisce una sessione valida.
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setHasRecoverySession(!!session);
    };
    checkSession();
  }, []);

  const handleSubmit = async () => {
    setErrorMsg('');

    // Validazione: lunghezza minima e match
    if (password.length < 6) {
      setErrorMsg('La password deve avere almeno 6 caratteri');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Le password non coincidono');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setErrorMsg(`Errore aggiornamento password: ${error.message}`);
      return;
    }

    // Sign out per evitare ambiguità di stato (la sessione era di tipo
    // "recovery") e mandare l'utente al login pulito.
    await supabase.auth.signOut();
    notify('Password aggiornata', 'Ora puoi accedere con la nuova password.');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  // Stato di caricamento mentre verifichiamo la sessione
  if (hasRecoverySession === null) {
    return (
      <View style={[styles.flex, styles.container]}>
        <Text style={styles.subtitle}>Caricamento...</Text>
      </View>
    );
  }

  // Direct-visit guard: nessuna sessione → link non valido o scaduto
  if (hasRecoverySession === false) {
    return (
      <View style={[styles.flex, styles.container]}>
        <Text style={styles.title}>Link non valido</Text>
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>
            ⚠️ Il link di recupero non è valido o è scaduto.
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}>
          <Text style={styles.link}>Torna al login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Nuova password</Text>
        <Text style={styles.subtitle}>
          Scegli una nuova password (minimo 6 caratteri).
        </Text>

        {errorMsg ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>⚠️ {errorMsg}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Nuova password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={(t) => { setPassword(t); setErrorMsg(''); }}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Conferma password"
          placeholderTextColor="#666"
          value={confirmPassword}
          onChangeText={(t) => { setConfirmPassword(t); setErrorMsg(''); }}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Aggiornamento...' : 'Aggiorna password'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
```

- [ ] **Step 2: Manual verification**

Run `npm run web`. Confirm no syntax errors. Stop server.

- [ ] **Step 3: Commit**

```bash
git add LibroGame/screens/auth/ResetPasswordScreen.js
git commit -m "feat(auth): add ResetPasswordScreen with direct-visit guard"
```

---

## Task 6: Wire routes + linking config in `AppNavigator.js`

Register the two new screens in the auth section of the stack and add a `linking` config so `/reset-password` resolves to `ResetPasswordScreen` on web.

**Files:**
- Modify: `LibroGame/navigation/AppNavigator.js`

- [ ] **Step 1: Add the new imports**

In `LibroGame/navigation/AppNavigator.js`, find this block:

```javascript
import RegisterScreen from '../screens/auth/RegisterScreen';
```

Replace with:

```javascript
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
```

- [ ] **Step 2: Add the `linking` config**

Find:

```javascript
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
```

Replace with:

```javascript
const Stack = createStackNavigator();

// linking — mappa le URL del browser alle route di React Navigation.
// Senza questa configurazione il click sul link di recupero password atterra
// su /reset-password ma React Navigation rimane su AuthLoading.
// I prefissi includono sia l'origin web sia il deep link mobile (placeholder).
const linking = {
  prefixes: [
    typeof window !== 'undefined' ? window.location.origin : '',
    'librogame://',
  ],
  config: {
    screens: {
      ResetPassword: 'reset-password',
    },
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
```

- [ ] **Step 3: Register the new Stack.Screen entries**

Find:

```javascript
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        {/* GM */}
```

Replace with:

```javascript
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />

        {/* GM */}
```

- [ ] **Step 4: Manual verification**

Run `npm run web`. App should boot. Open browser dev tools → console — no React Navigation warnings about missing routes. In the address bar, manually navigate to `http://localhost:8081/reset-password`. The "Link non valido o scaduto" guard should fire (no recovery session). Stop server.

- [ ] **Step 5: Commit**

```bash
git add LibroGame/navigation/AppNavigator.js
git commit -m "feat(nav): register ForgotPassword/ResetPassword routes + linking config"
```

---

## Task 7: Add "Password dimenticata?" link on `LoginScreen`

One-line UI addition between the "Accedi" button and the "Registrati" link.

**Files:**
- Modify: `LibroGame/screens/auth/LoginScreen.js`

- [ ] **Step 1: Add the link**

In `LibroGame/screens/auth/LoginScreen.js`, find:

```javascript
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Non hai un account? Registrati</Text>
        </TouchableOpacity>
```

Replace with:

```javascript
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={{ marginBottom: 12 }}
        >
          <Text style={styles.link}>Password dimenticata?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Non hai un account? Registrati</Text>
        </TouchableOpacity>
```

- [ ] **Step 2: Manual verification**

Run `npm run web`. On the Login screen, confirm the new "Password dimenticata?" link appears between "Accedi" and "Registrati". Click it — `ForgotPasswordScreen` should open. Stop server.

- [ ] **Step 3: Commit**

```bash
git add LibroGame/screens/auth/LoginScreen.js
git commit -m "feat(auth): add 'Password dimenticata?' link on LoginScreen"
```

---

## Task 8: Handle PASSWORD_RECOVERY in `AuthLoadingScreen`

When the user clicks the email link, the URL fragment auto-creates a recovery session. `AuthLoadingScreen` is the splash screen, and currently it sees the session and routes to `RoomList` or `JoinRoom` based on role — wrong destination. We need to detect the recovery state and route to `ResetPassword` instead.

**Files:**
- Modify: `LibroGame/screens/auth/AuthLoadingScreen.js`

- [ ] **Step 1: Add the PASSWORD_RECOVERY listener**

Replace the entire body of `LibroGame/screens/auth/AuthLoadingScreen.js` with:

```javascript
// AuthLoadingScreen.js
// Schermata di caricamento mostrata all'avvio dell'app.
// Verifica se c'è una sessione Supabase salvata e in base al ruolo
// reindirizza automaticamente.
//
// Caso speciale: se l'utente è atterrato qui via link di recupero password,
// Supabase emette l'evento PASSWORD_RECOVERY → ridirige a ResetPassword
// invece che alla home in base al ruolo.

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { supabase } from '../../lib/supabase';
import { authLoadingStyles as styles } from '../../styles/auth';
import { colors } from '../../styles/theme';

export default function AuthLoadingScreen({ navigation }) {

  useEffect(() => {
    // recoveryFired — guard per evitare che checkSession() concluda dopo
    // l'evento PASSWORD_RECOVERY e ci porti alla home rovinando il flusso.
    let recoveryFired = false;

    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        recoveryFired = true;
        navigation.replace('ResetPassword');
      }
    });

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // Se nel frattempo è scattato PASSWORD_RECOVERY, non ridiridiamo a casa.
      if (recoveryFired) return;

      if (!session) {
        navigation.replace('Login');
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (recoveryFired) return;

      if (userError || !userData) {
        console.log('Errore lettura profilo:', userError?.message);
        await supabase.auth.signOut();
        navigation.replace('Login');
        return;
      }

      if (userData.role === 'gm') {
        navigation.reset({ index: 0, routes: [{ name: 'RoomList' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'JoinRoom' }] });
      }
    };

    checkSession();

    return () => {
      subscription?.subscription?.unsubscribe?.();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LibroGame</Text>
      <Text style={styles.subtitle}>Il circo delle circostanze</Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      <Text style={styles.loadingText}>Caricamento in corso...</Text>
    </View>
  );
}
```

- [ ] **Step 2: Manual verification (preliminary)**

Run `npm run web`. Confirm normal flows still work:
- Logged out → reaches `Login`
- Already logged in as player → reaches `JoinRoom`
- Already logged in as GM → reaches `RoomList`

Stop server.

- [ ] **Step 3: Commit**

```bash
git add LibroGame/screens/auth/AuthLoadingScreen.js
git commit -m "feat(auth): handle PASSWORD_RECOVERY event in AuthLoadingScreen"
```

---

## Task 9: End-to-end manual test

Now that all code is in place and Brevo is configured (Task 1), test the full flow.

**Files:** none (testing)

- [ ] **Step 1: Start the web app**

```bash
cd LibroGame && npm run web
```

Wait until the browser opens at `http://localhost:8081`.

- [ ] **Step 2: Test happy path — request reset**

- Click "Password dimenticata?" on Login screen.
- Enter the email of a known test account (player or GM).
- Click "Invia link di recupero".
- Confirm the success banner appears: "✉️ Controlla la tua email...".

- [ ] **Step 3: Receive email and click link**

- Open the inbox of that test account within ~30 seconds.
- Confirm the email arrives with the Italian subject.
- Click the recovery link in the email.
- A new browser tab opens at `http://localhost:8081/reset-password#access_token=...`.
- After ~1 second, `ResetPasswordScreen` appears with the two password inputs.

- [ ] **Step 4: Test happy path — set new password**

- Enter a new password (≥6 chars) in both fields.
- Click "Aggiorna password".
- The notify alert appears: "Password aggiornata".
- Stack resets to `Login`.

- [ ] **Step 5: Verify the new password works**

- On `Login`, enter the test account email + the new password.
- Confirm login succeeds and reaches the correct home (RoomList for GM, JoinRoom for player).

- [ ] **Step 6: Test direct visit guard**

- Navigate directly to `http://localhost:8081/reset-password` with NO recovery token.
- Confirm "Link non valido o scaduto" banner appears + back-to-login link works.

- [ ] **Step 7: Test validation errors**

- Go to `/forgot-password` (via "Password dimenticata?" link).
- Submit empty → "Inserisci la tua email".
- Submit malformed email → "Inserisci un indirizzo email valido".
- Trigger reset, click link, then on `ResetPasswordScreen`:
  - Submit password < 6 chars → "La password deve avere almeno 6 caratteri".
  - Submit mismatched passwords → "Le password non coincidono".

- [ ] **Step 8: Stop the server**

If any step fails, debug before proceeding to docs sync. If all steps pass, continue to Task 10.

---

## Task 10: Doc sync

Update `CLAUDE.md` and `LibroGame_Checklist.md` per the `gamebook-doc-sync` skill (this is required by repo CLAUDE.md after any feature is added). Edit existing sections — don't pile new content at the end.

**Files:**
- Modify: `CLAUDE.md`
- Modify: `LibroGame_Checklist.md`

- [ ] **Step 1: Update `CLAUDE.md` — Architecture / Auth screens section**

Find the "Auth screens:" subsection (under "Architecture") and add two new bullets after the `RegisterScreen` line:

```markdown
  - `ForgotPasswordScreen` requests a Supabase password-recovery email via Brevo SMTP. Inline error banner; success state replaces the form with "Controlla la tua email." + "Torna al login".
  - `ResetPasswordScreen` is reached by clicking the recovery link. Direct-visit guard ("Link non valido o scaduto") fires when no recovery session is present. On success, calls `supabase.auth.updateUser({ password })`, signs out, and resets to `Login`.
```

- [ ] **Step 2: Update `CLAUDE.md` — Folder structure**

Find the `screens/auth/` line and update the inline list:

```
│   ├── auth/                 (AuthLoading, Login, Register, ForgotPassword, ResetPassword)
```

- [ ] **Step 3: Update `CLAUDE.md` — Libraries**

Find the "Libraries:" subsection. Add a new bullet after `lib/useRoomClosedListener.js`:

```markdown
  - `lib/resetRedirect.js`: `getResetRedirect()` — returns the URL Brevo embeds in recovery emails (`window.location.origin + '/reset-password'` on web; `librogame://reset-password` placeholder on native).
```

- [ ] **Step 4: Update `CLAUDE.md` — Auth configuration section**

Find the "### Auth configuration" subsection (under Database / Supabase). Replace the existing "Default Supabase SMTP has a 3–4 emails/hour limit..." note with:

```markdown
- Custom SMTP via **Brevo** (free tier, 300 emails/day). Configure in Supabase → Authentication → Emails → SMTP Settings: host `smtp-relay.brevo.com`, port `587`, login = Brevo account email, password = generated SMTP key. Sender email must be a verified Brevo sender. Reset password template is translated to Italian (subject "Reimposta la tua password — LibroGame", `{{ .ConfirmationURL }}` placeholder kept). Redirect URLs allowlist must include `http://localhost:8081/reset-password` (dev) and the production URL once deployed.
```

- [ ] **Step 5: Update `CLAUDE.md` — Navigation / linking note**

Find the section that begins with "- `LibroGame/navigation/AppNavigator.js` defines auth, GM, current player, and legacy player stack routes." and append at the end of the same bullet:

```markdown
 The `NavigationContainer` has a `linking` config so the URL `/reset-password` resolves to `ResetPasswordScreen` on web; deep-link prefix `librogame://` is registered as placeholder for future mobile builds.
```

- [ ] **Step 6: Update `CLAUDE.md` — add Deployment section**

Add a new section right before "## Known gaps":

```markdown
## Deployment (suggested, not yet executed)

- **Web hosting:** Vercel or Netlify free tier. `npx expo export -p web` outputs static files; both providers give a free `*.vercel.app` / `*.netlify.app` subdomain with HTTPS, suitable as the production redirect URL for Brevo password-reset emails. Add the deployed URL to Supabase → Authentication → URL Configuration → Redirect URLs allowlist.
- **Mobile:** EAS Build for APK/IPA. Free tier = 30 builds/month. Required to test the `librogame://` deep link on a real device. Distribute the APK directly to teachers, or publish to Play Store.
- **Custom domain (later):** when a domain is acquired, verify it as a Brevo sender (DKIM/SPF setup) and switch the Supabase sender from a personal email to `noreply@<domain>`.
```

- [ ] **Step 7: Update `CLAUDE.md` — Known gaps**

In the "## Known gaps" section, no item to remove (password-reset wasn't listed as a gap, just implicit). No change needed here.

- [ ] **Step 8: Update `LibroGame_Checklist.md` — Completato**

Add these lines to the "## ✅ Completato" section, right before the "---" separator:

```markdown
- [x] `ForgotPasswordScreen` — input email + invio link recupero via Supabase + Brevo SMTP, banner errore inline, pannello successo "Controlla la tua email"
- [x] `ResetPasswordScreen` — due input password (nuova + conferma), validazione (min 6, match), `supabase.auth.updateUser({ password })`, signOut + reset a Login al successo, direct-visit guard "Link non valido o scaduto"
- [x] `lib/resetRedirect.js` — helper `getResetRedirect()` cross-platform per la URL del link di recupero
- [x] `LoginScreen` — link "Password dimenticata?" tra "Accedi" e "Registrati"
- [x] `AuthLoadingScreen` — handler evento `PASSWORD_RECOVERY` di Supabase: redirige a `ResetPassword` invece che alla home in base al ruolo
- [x] `AppNavigator` — route `ForgotPassword` e `ResetPassword` registrate + `linking` config sul `NavigationContainer` per mappare `/reset-password` su web (deep link `librogame://` registrato come placeholder per il futuro build EAS)
- [x] Supabase SMTP via Brevo (free tier 300 email/giorno) configurato; template "Reset Password" tradotto in italiano; redirect URL allowlist aggiornata con `http://localhost:8081/reset-password`
```

- [ ] **Step 9: Update `LibroGame_Checklist.md` — Da Testare / Verificare**

Add to the "## 🔄 Da Testare / Verificare" section, before the "---":

```markdown
- [ ] Recupero password end-to-end con vari client email (Gmail, Outlook): link cliccato apre `ResetPasswordScreen` correttamente e la nuova password funziona al login successivo
- [ ] Recupero password con email non registrata: comportamento atteso = pannello di successo (Supabase non rivela se l'utente esiste)
- [ ] Apertura diretta di `/reset-password` senza link → banner "Link non valido o scaduto"
- [ ] Recupero password mentre un altro utente è loggato: dopo update + signOut lo stack riparte da Login pulito
```

- [ ] **Step 10: Update `LibroGame_Checklist.md` — Decisioni di Design Prese**

Add at the end of the "## 📝 Decisioni di Design Prese" numbered list:

```markdown
20. **Password reset — Brevo SMTP, niente Edge Function**: scelto Brevo (free tier 300 email/giorno permanente) come provider SMTP custom in Supabase. Nessun Edge Function necessario: il flusso usa direttamente `supabase.auth.resetPasswordForEmail` + `supabase.auth.updateUser`, supportato out-of-the-box dal client JS. Considerato come alternativa un GM admin reset via Edge Function (`auth.admin.updateUserById`) ma scartato dallo scope iniziale: il flusso email è sufficiente per l'uso classroom (~120 studenti/giorno → realistici 5–15 reset/giorno, ben sotto i 300/giorno). L'Edge Function resta opzione futura come fallback.
21. **Password reset — Web-first con hook deep link**: implementato solo per web (`window.location.origin + '/reset-password'`). Il prefisso `librogame://` è già registrato nel `linking` config del navigator e in `lib/resetRedirect.js` come placeholder, ma il deep link mobile non è ancora attivo: dipende dal primo build EAS che registrerà lo scheme nell'AndroidManifest / Info.plist. Decisione presa perché il use case classroom è browser-based (Chromebook/laptop scolastici) e Expo Go non è compatibile con SDK 54.
22. **Password reset — `AuthLoadingScreen` come gateway PASSWORD_RECOVERY**: il listener `onAuthStateChange` è registrato in `AuthLoadingScreen` (entry point dell'app) invece che nel root `App.js` perché in questo modo gestisce sia il caso "app aperta su /reset-password da link" sia il caso "app navigated da Login → ForgotPassword → email" senza duplicare logica. Un `recoveryFired` guard impedisce che `checkSession()` (asincrono) ridiriga alla home dopo che PASSWORD_RECOVERY è già stato gestito.
```

- [ ] **Step 11: Manual verification**

Skim both md files to confirm the additions read well in context (no broken markdown, no orphan headers).

- [ ] **Step 12: Commit**

```bash
git add CLAUDE.md LibroGame_Checklist.md
git commit -m "docs: sync CLAUDE.md and checklist with password reset feature"
```

---

## Self-Review Checklist (already done — recorded for future reference)

- [x] **Spec coverage:** Every requirement in the spec maps to a task. Brevo setup → Task 1; resetRedirect helper → Task 2; styles → Task 3; ForgotPasswordScreen → Task 4; ResetPasswordScreen → Task 5; navigator routes + linking → Task 6; Login link → Task 7; PASSWORD_RECOVERY handler → Task 8; testing plan items → Task 9; doc sync → Task 10.
- [x] **Placeholder scan:** No "TBD" / "TODO" / vague references.
- [x] **Type consistency:** `getResetRedirect()` defined in Task 2, used in Task 4. `forgotPasswordStyles` / `resetPasswordStyles` defined in Task 3, imported in Tasks 4 / 5. `ForgotPassword` / `ResetPassword` route names consistent across Tasks 6, 7, 8. `successBanner` / `successBannerText` defined in Task 3 styles, used in Task 4 ForgotPasswordScreen.
- [x] **No automated tests:** Project has no Jest/Vitest setup; tasks use manual verification on `npm run web` and end-to-end smoke test in Task 9.
