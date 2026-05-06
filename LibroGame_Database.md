# LibroGame — Database Supabase

## Connessione
- **Project URL:** `https://rrleoynnbjesnpquqlmx.supabase.co`
- **Anon Key:** salvata in `lib/supabase.js`
- ⚠️ Non condividere mai la **service_role key**

---

## Configurazione Autenticazione

### Conferma Email
- **Confirm email: DISABILITATO** ✅
- Percorso: Supabase → Authentication → Providers → Email → Confirm email → OFF
- Motivo: l'app è controllata dal GM, non serve verifica email. Senza questa impostazione la sessione non viene attivata subito dopo la registrazione e l'insert nella tabella `users` fallisce per via di RLS.

### SMTP (opzionale, per il futuro)
- Di default Supabase usa il suo server email con limite di **3-4 email/ora** (solo per test)
- Se in futuro serve inviare email (reset password ecc.) configurare uno SMTP personalizzato
- Percorso: Supabase → Authentication → Providers → Email → SMTP Settings
- Servizi consigliati: **SendGrid**, **Mailgun**, **Resend** (tutti con piano gratuito)

### Eliminazione utenti da Supabase Auth
- ⚠️ Non è possibile eliminare utenti che hanno già dati collegati nella tabella `users`
- Per i test usare sempre la stessa email o crearne di nuove

---

## Tabelle

### `stories`
```sql
CREATE TABLE stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```
**Dati inseriti:** `storia_1` — "Il circo delle circostanze"

---

### `rooms`
```sql
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT,
  gm_id UUID REFERENCES auth.users(id),
  story_id UUID REFERENCES stories(id),
  auto_hint_minutes INTEGER NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

> ℹ️ Il campo `name` è stato aggiunto per consentire al GM di assegnare un nome
> personalizzato alla stanza (es. "Classe 3B venerdì"). È nullable per compatibilità
> con stanze create prima dell'aggiunta della colonna.
>
> Migration applicata:
> ```sql
> ALTER TABLE rooms ADD COLUMN name TEXT;
> ```

---

### `users`
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  role TEXT DEFAULT 'player' CHECK (role IN ('gm', 'player'))
);
```
**Account GM:** creato manualmente su Supabase Auth + record inserito in `users` con `role = 'gm'`

---

### `room_players`
```sql
CREATE TABLE room_players (
  room_id UUID REFERENCES rooms(id),
  player_id UUID REFERENCES users(id),
  PRIMARY KEY (room_id, player_id)
);
```

---

### `progress`
```sql
CREATE TABLE progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id),
  player_id UUID REFERENCES users(id),
  scene_id TEXT NOT NULL,
  solved BOOLEAN DEFAULT FALSE,
  entered_at TIMESTAMP DEFAULT NOW(),
  timestamp TIMESTAMP DEFAULT NOW()
);
```
- `entered_at` — usato per calcolare il timer dell'Aiuto Automatico. Viene aggiornato anche al rientro nella scena (vedi `SceneScreen.js`) per ri-avviare il ciclo del timer.
- `solved` — true quando il giocatore risolve l'anagramma della scena
- Le schermate del player usano `maybeSingle()` per evitare di creare record duplicati alla ripresa dopo chiusura dell'app

---

### `hints`
```sql
CREATE TABLE hints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id),
  player_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Realtime — abilitazioni necessarie

Per il funzionamento corretto delle schermate del player serve che le seguenti tabelle siano abilitate per la replicazione Realtime:

| Tabella | Perché |
|---|---|
| `rooms` | `useRoomClosedListener` ascolta `UPDATE` per intercettare la chiusura della stanza dal GM |
| `room_players` | Dashboard GM aggiorna in realtime la lista giocatori |
| `progress` | Dashboard GM e PlayerDetail aggiornano in realtime la posizione dei giocatori |
| `hints` | AnagramScreen riceve i suggerimenti del GM in tempo reale |

Percorso: Supabase Dashboard → Database → Replication → abilitare per ogni tabella.

---

## RLS (Row Level Security)

RLS abilitato su tutte le tabelle.

| Tabella | Chi legge | Chi scrive |
|---|---|---|
| `users` | Solo se stessi | Solo se stessi |
| `stories` | Solo GM | Nessuno (dati statici) |
| `rooms` | GM tutto, Player solo aperte | Solo GM |
| `room_players` | GM tutto, Player solo se stessi | Solo Player |
| `progress` | GM tutto, Player solo se stessi | Solo Player |
| `hints` | GM tutto, Player solo i propri | Solo GM |

### Policy complete

#### users
```sql
CREATE POLICY "utente legge solo se stesso" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "utente crea solo se stesso" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "utente modifica solo se stesso" ON users FOR UPDATE USING (auth.uid() = id);
```

#### stories
```sql
CREATE POLICY "solo gm legge le storie" ON stories FOR SELECT
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));
```

#### rooms
```sql
CREATE POLICY "gm crea stanza" ON rooms FOR INSERT
WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));

CREATE POLICY "gm legge tutte le stanze" ON rooms FOR SELECT
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));

CREATE POLICY "gm aggiorna stanza" ON rooms FOR UPDATE
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));

CREATE POLICY "gm elimina stanza" ON rooms FOR DELETE
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));

CREATE POLICY "giocatore legge stanze aperte" ON rooms FOR SELECT
USING (status = 'open' AND auth.uid() IN (SELECT id FROM users WHERE role = 'player'));
```

> ℹ️ La policy `gm elimina stanza` è necessaria perché `RoomListScreen.js` permette
> al GM di eliminare le proprie stanze. Verificare che sia attiva, altrimenti
> l'eliminazione fallirà silenziosamente (RLS blocca senza errore esplicito).

#### room_players
```sql
CREATE POLICY "gm legge giocatori stanza" ON room_players FOR SELECT
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));

CREATE POLICY "giocatore si unisce a stanza aperta" ON room_players FOR INSERT
WITH CHECK (
  auth.uid() = player_id
  AND auth.uid() IN (SELECT id FROM users WHERE role = 'player')
  AND room_id IN (SELECT id FROM rooms WHERE status = 'open')
);

CREATE POLICY "giocatore legge solo se stesso" ON room_players FOR SELECT
USING (auth.uid() = player_id);
```

#### progress
```sql
CREATE POLICY "gm legge tutti i progressi" ON progress FOR SELECT
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));

CREATE POLICY "giocatore legge solo i propri progressi" ON progress FOR SELECT
USING (auth.uid() = player_id);

CREATE POLICY "giocatore inserisce solo i propri progressi" ON progress FOR INSERT
WITH CHECK (auth.uid() = player_id);

CREATE POLICY "giocatore aggiorna solo i propri progressi" ON progress FOR UPDATE
USING (auth.uid() = player_id);
```

#### hints
```sql
CREATE POLICY "gm inserisce suggerimenti" ON hints FOR INSERT
WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));

CREATE POLICY "gm legge tutti i suggerimenti" ON hints FOR SELECT
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'gm'));

CREATE POLICY "giocatore legge solo i propri suggerimenti" ON hints FOR SELECT
USING (auth.uid() = player_id);
```
