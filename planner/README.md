# Becoming — The Content Planner

A real, multi-device Instagram content planner for **Rooted With Ally**: month/week/day calendar
views, an idea backlog, drag-to-reschedule, an AI idea + caption generator with an approval flow,
and per-user accounts with cloud sync — built from the design handoff in
`design_handoff_ig_content_planner/`.

Stack: **Next.js 16 (App Router) + Supabase (Postgres, Auth, Storage) + Anthropic API**.

## 1. Create a Supabase project

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
   This creates the `posts` and `planner_settings` tables (with row-level security scoped to
   `auth.uid()`) and a public `planner-photos` storage bucket for banner/sidebar/post photos.
3. Under **Authentication → Providers**, email/password sign-up is on by default. If you don't
   want to configure an email sender yet, turn off "Confirm email" under **Authentication →
   Sign In / Providers → Email** so new accounts can sign in immediately.
4. Copy your **Project URL** and **anon public key** from **Project Settings → API**.

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from step 1.
- `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com/settings/keys).
  Used only server-side (in `src/app/api/ai/*`) to power "Generate ideas with AI" and
  "Write with AI" — it is never sent to the browser. The app still works without it; the AI
  features will just show a gentle error until it's set.

## 3. Run it

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`, create an account, and start planning. Every post, and the banner
/ sidebar photos, are stored in your Supabase project and sync across any device you sign into.

## Project structure

- `src/app/` — routes: `/` (the planner, auth-gated), `/login`, `/signup`, `/api/ai/*`.
- `src/components/` — `PlannerContext` holds all app state (view, cursor, filters, drag state,
  the editor draft, AI studio state) and the Supabase-backed mutations; everything else is a
  presentational piece that reads from it via `usePlanner()`.
- `src/hooks/` — `usePosts` (CRUD + realtime sync on the `posts` table) and `usePlannerSettings`
  (banner/sidebar photos).
- `src/lib/` — design constants (pillars, statuses, formats, brand voice prompt), date utilities,
  and Supabase client helpers (browser/server/middleware).
- `proxy.ts` — redirects signed-out visitors to `/login` (Next.js 16 renamed `middleware.ts` to
  `proxy.ts`).
- `supabase/schema.sql` — the database schema to run once per Supabase project.
- `design-handoff/` — the original design handoff (behavioral-spec prototype, screenshots, and
  design-system notes) this app was built from, kept for reference.

## Notes on fidelity to the design handoff

This recreates `design-handoff/Content Calendar.dc.html` (the behavioral spec) as idiomatic
React/Next components against a real database instead of `localStorage`:

- Colors, type, radii, shadows, and motion tokens from the handoff's README live in
  `src/app/globals.css`.
- Photos (banner strip, sidebar portrait, post thumbnails) upload to Supabase Storage instead of
  being kept as base64 data URLs.
- The AI idea generator and caption writer call the Anthropic API from a server route with the
  same brand-voice system prompt and JSON contract as the prototype, instead of an in-browser
  `window.claude.complete`.

## Deploying

Any Next.js host works (e.g. Vercel). Set the same three environment variables there, and make
sure the Supabase project's **Authentication → URL Configuration** allows your deployed origin.
