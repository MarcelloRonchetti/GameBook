# Password Reset via Brevo SMTP — Design

**Date:** 2026-05-07
**Status:** Approved (pending implementation)
**Scope:** LibroGame (Expo SDK 54) — `LibroGame/` app

## Problem

`LoginScreen` has no password recovery option. Supabase stores only password hashes, so a forgotten password cannot be recovered manually. The classroom use case (6 sessions/day × ~20 students) requires a self-service reset flow, but Supabase's default SMTP is rate-limited (~3–4 emails/hour) — unusable in production.

## Goals

- Self-service password reset for both GM and player accounts.
- Permanent free email infrastructure (no monthly cap that the project will realistically hit).
- Web-first now; clean hooks for adding mobile (Expo deep link) when EAS build is in place.
- Consistent with existing patterns: inline error banners, `notify()` for messages, no `Alert.alert`, styles in `styles/auth.js`.

## Non-Goals

- GM-driven admin reset (separate feature; can be added later via Edge Function).
- Mobile deep-link plumbing right now (deferred until first EAS build).
- Magic-link / passwordless login.
- Custom email templates beyond Italian translation of the default Supabase reset template.
- Per-anagram persistence in Direttrice (unrelated; pre-existing gap).

## High-Level Flow

```
LoginScreen
  └─ "Password dimenticata?" link
       └─ ForgotPasswordScreen (enter email)
            └─ supabase.auth.resetPasswordForEmail(email, { redirectTo })
                 └─ Brevo sends email with link
                      └─ User clicks → /reset-password#access_token=...
                           └─ Supabase JS auto-detects URL hash → fires PASSWORD_RECOVERY event
                                └─ AuthLoadingScreen routes to ResetPasswordScreen
                                     └─ User enters new password ×2
                                          └─ supabase.auth.updateUser({ password })
                                               └─ navigation.reset → LoginScreen
```

## Components

### New screen — `screens/auth/ForgotPasswordScreen.js`

- Single email input + "Invia link di recupero" button + inline error banner (mirrors `LoginScreen` skeleton).
- Sanitization: `email.trim().toLowerCase()`, regex validation (same as `LoginScreen`).
- On submit: `supabase.auth.resetPasswordForEmail(email, { redirectTo: getResetRedirect() })`.
- Success state: replace form with confirmation panel — *"Controlla la tua email. Il link è valido per 1 ora."* + "Torna al login" button.
- Reuses `KeyboardAvoidingView` + `ScrollView` (`flexGrow: 1`) pattern from `LoginScreen`.

### New screen — `screens/auth/ResetPasswordScreen.js`

- Two password inputs (new + confirm) + inline error banner.
- Validation: min 6 chars (matches `RegisterScreen`), passwords must match.
- On submit: `supabase.auth.updateUser({ password })`.
- On success: `notify('Password aggiornata')` + `navigation.reset({ index: 0, routes: [{ name: 'Login' }] })`.
- Direct-visit guard: if no recovery session is present (e.g. someone bookmarks `/reset-password`), show *"Link non valido o scaduto"* banner + "Torna al login" button.

### New helper — `lib/resetRedirect.js`

- `getResetRedirect()` returns the URL Brevo embeds in the email.
- Web (`Platform.OS === 'web'`): `${window.location.origin}/reset-password`.
- Native: `librogame://reset-password` (placeholder; finalized when EAS build lands).

### Modified — `screens/auth/LoginScreen.js`

- One new `<TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>` between the "Accedi" button and the existing "Registrati" link.
- Text: "Password dimenticata?".
- Reuses existing `styles.link`.

### Modified — `screens/auth/AuthLoadingScreen.js`

- Subscribe to `supabase.auth.onAuthStateChange`. When event is `PASSWORD_RECOVERY`, call `navigation.replace('ResetPassword')` instead of the normal role-based redirect.
- This handles the case where the user lands on the app via the email link: the URL fragment auto-creates a recovery session, and we need to send them to the reset screen rather than `RoomList`/`JoinRoom`.

### Modified — `navigation/AppNavigator.js`

- Register two new routes in the auth stack: `ForgotPassword` and `ResetPassword`.
- Both use the standard auth header (back button enabled).
- Add a `linking` config on `NavigationContainer`:

```js
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
```

Without this, the URL `/reset-password` opens the app but React Navigation stays on `AuthLoading`.

### Modified — `styles/auth.js`

- Add `forgotPasswordStyles` and `resetPasswordStyles` (with `errorBanner` + `successBanner`), following the existing token system in `theme.js`.

## Brevo + Supabase configuration (one-time, dashboard)

These are operational steps, not code. Documented in `CLAUDE.md` under a new "Email (Brevo SMTP)" section so it survives across sessions.

**Brevo (brevo.com):**
1. Create account (free, 300 emails/day forever).
2. Verify a sender — easiest path: single-sender verification with a personal email address.
3. SMTP & API → SMTP → generate SMTP key. Capture: host `smtp-relay.brevo.com`, port `587`, login = Brevo account email, password = generated key.

**Supabase (dashboard → project settings):**
1. Authentication → Emails → SMTP Settings → enable custom SMTP. Paste host/port/login/password. Sender email = verified Brevo sender. Sender name = `LibroGame`.
2. Authentication → URL Configuration → Redirect URLs allowlist: add `http://localhost:8081/reset-password` for dev, plus the production URL once deployed (e.g. `https://librogame.vercel.app/reset-password`).
3. Authentication → Emails → Templates → "Reset Password" → translate subject and body to Italian. Keep `{{ .ConfirmationURL }}` placeholder unchanged.
4. Token lifetime: leave default (1 hour).

## Error handling

| Scenario | Behavior |
|---|---|
| Invalid email format on `ForgotPasswordScreen` | Inline banner: "Inserisci un indirizzo email valido". |
| Email not registered | Supabase returns success regardless (no user enumeration). Show success state anyway. |
| Brevo SMTP fails / Supabase rejects | Inline banner with error message; allow retry. |
| Recovery link expired or already used | `ResetPasswordScreen` direct-visit guard fires: "Link non valido o scaduto". |
| Passwords mismatch | Inline banner: "Le password non coincidono". |
| Password too short | Inline banner: "La password deve avere almeno 6 caratteri". |
| `updateUser` fails | Inline banner with error; allow retry. |

## Testing plan

- [ ] Unit-ish: `getResetRedirect()` returns expected URL on web (`window.location.origin + '/reset-password'`) and the native placeholder.
- [ ] Manual web: full happy path — request reset → receive email → click link → land on `ResetPasswordScreen` → set new password → log in with new password.
- [ ] Manual web: open `http://localhost:8081/reset-password` directly without a recovery token — verify "Link non valido o scaduto" banner + back-to-login.
- [ ] Manual web: request reset for unregistered email — verify success state shown anyway (no enumeration leak).
- [ ] Manual web: enter mismatched passwords — verify validation banner.
- [ ] Manual web: reset password while a different user is logged in — verify post-success redirect goes through `LoginScreen` cleanly (no stale session).
- [ ] Manual web: scroll on small viewport (`ForgotPasswordScreen`, `ResetPasswordScreen`) — verify no content cut off.
- [ ] GM account reset: verify GM can reset and log back in with role correctly resolved.

## Deployment notes (suggestions, recorded for later)

Not part of this spec, but flagged here so they end up in `CLAUDE.md` after implementation:

- **Web hosting:** Vercel or Netlify free tier. `npx expo export -p web` produces static output. Free `.vercel.app` / `.netlify.app` subdomain works as production redirect URL for Brevo.
- **Mobile:** EAS Build (Expo cloud) — 30 free builds/month. Required to test deep links and ship APK/IPA.
- Once deployed, add the production URL to Supabase Redirect URLs allowlist.

## Risks

| Risk | Mitigation |
|---|---|
| Brevo's free tier (300/day) is exceeded by an attack flooding `resetPasswordForEmail`. | Supabase already rate-limits the endpoint per IP. Monitor; if needed, add hCaptcha (Supabase Auth built-in support). |
| `librogame://` deep link not registered yet, mobile users can't complete reset on phone. | Acceptable: web-first is intentional. Documented in spec. Mobile users redirected to web URL until EAS build lands. |
| User changes email in Brevo verification but Supabase still references old sender. | Re-verify in Brevo, update sender in Supabase SMTP settings. |
| Sender domain blacklisted (using a free email as Brevo sender). | Use a verified domain in production; for dev a free email is fine. |

## Out of scope (future work)

- GM admin reset (Edge Function with `auth.admin.updateUserById`) — keep as a fallback option if email-based reset proves friction-heavy with classroom devices.
- Mobile deep link wiring (`librogame://`) — done together with first EAS build.
- Custom-domain Brevo sender (e.g. `noreply@librogame.app`) — done after a domain is acquired.
- Production-grade email templates (HTML, branded) — current scope: plain Italian translation of default template.
