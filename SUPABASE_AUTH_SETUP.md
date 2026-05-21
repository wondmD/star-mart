# Supabase Auth Setup for StarMart

StarMart uses **Supabase authentication only** (do not set `USE_LOCAL_AUTH=true`).

## Auth flow

1. **Sign up** → `/auth/signup`
2. **Verify email** → `/auth/verify-email` (check inbox, click link)
3. **Email link** → `/auth/callback` (confirms email, does **not** log you in)
4. **Sign in** → `/auth/login` (only works after email is verified)

---

## Why signup “succeeds” in Supabase but login fails

By default, Supabase enables **Confirm email**. When you sign up:

1. The user is created in **Authentication → Users**
2. No session is returned until the email is confirmed
3. Login returns **Invalid login credentials** until confirmation completes

StarMart now treats this as a **successful signup** and asks you to confirm your email before signing in.

---

## Recommended for local development

### Option A — Disable email confirmation (easiest)

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **Authentication** → **Providers** → **Email**
3. Turn **OFF** “Confirm email”
4. Save

New signups can log in immediately.

### Option B — Manually confirm a user

1. **Authentication** → **Users**
2. Open the user → set **Email confirmed** to confirmed (or use “Confirm user”)

Then sign in with the same email/password.

---

## API keys in `.env.local`

Use keys from **Project Settings → API**:

| Variable | Where to copy |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **anon** / **public** key (JWT starting with `eyJ...`) |

If you use a key labeled `sb_publishable_...`, confirm in the dashboard that it is the **anon** key for Auth. The classic **anon public** JWT is the most compatible with `@supabase/supabase-js`.

Restart the dev server after changing `.env.local`:

```bash
npm run dev
```

---

## Optional: `users` profile table

StarMart works without this table (profile is built from auth metadata). For full profile storage, run in **SQL Editor**:

```sql
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);
```

---

## Rate limits (429) and “email is invalid”

If Supabase logs show:

| Log | Meaning |
|-----|---------|
| `429: email rate limit exceeded` | Too many confirmation emails from repeated signups |
| `429: ... only request this after N seconds` | Cooldown between auth requests |
| `400: Email address "..." is invalid` | Often **already registered** or blocked; stop re-signing up |
| `400: Invalid login credentials` on `/token` | Wrong password **or** email not confirmed yet |

**What to do now (your account likely already exists):**

1. **Stop clicking Sign up** — each attempt sends another email and triggers 429.
2. Open **Authentication → Users** and find `wondmenehderej@gmail.com`.
3. Open the user → **Confirm email** (toggle confirmed).
4. **Authentication → Providers → Email** → turn **OFF** “Confirm email” for dev.
5. Wait **60 seconds** (or the seconds shown in the 429 message).
6. Use **Sign in** only (not sign up) with the same password you chose earlier.

Optional: **Authentication → Rate limits** — relax email limits for development if your plan allows it.

---

## Email verification flow (StarMart)

1. User signs up → redirected to `/auth/verify-email?email=...`
2. User clicks link in email → `/auth/callback` → verified → home
3. If email already exists → same verification page with `reason=exists`
4. Resend button calls `/api/auth/resend-verification`

**Supabase dashboard (required):**

1. **Authentication → URL Configuration**
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** add `http://localhost:3000/auth/callback`
2. **Authentication → Providers → Email** — keep **Confirm email** ON for production; OFF for fastest local testing

---

## Quick checklist

- [ ] Email confirmation disabled **or** user email confirmed in dashboard
- [ ] Not hitting signup repeatedly (avoids 429)
- [ ] Correct `NEXT_PUBLIC_SUPABASE_URL` and anon key in `.env.local`
- [ ] Dev server restarted after env changes
- [ ] **Sign in** (not sign up) after user exists in dashboard
