# Rooted in Bloom — Community

A private, invite-only community app: a weekly devotional and scripture with
context, a private journal, community discussion threads (with optional
anonymous posting), and a monthly live prayer/check-in announcement.

Built with Next.js (App Router), Prisma + SQLite, and Tailwind. No external
services required to run it locally — everything, including auth, lives in
one SQLite file.

## How it works

- **Access is invite-only.** There's no public sign-up. An admin generates
  invite codes from `/admin`; each code works once. A new member enters a
  code, an email, a password, and whatever name they want to go by.
- **Anonymous posting.** When starting a community thread or replying,
  members can check "post anonymously." Other members see "Anonymous."
  The admin can still see the real name behind an anonymous post (for
  safety/moderation) — no one else can.
- **The journal is private.** Entries are visible only to the person who
  wrote them — not even the admin can read them.
- **The live session is just a link.** The admin sets a date/time and a
  Zoom/Google Meet link; it shows as a banner on the dashboard until the
  session passes. No video is built into the app.

## Running it locally

Requirements: Node 20+.

```bash
npm install
cp .env.example .env        # then edit SESSION_SECRET (see below)
npx prisma migrate deploy   # creates dev.db and applies the schema
npx prisma db seed          # creates an admin account + a starter invite code
npm run dev
```

The seed command prints the admin's email and a generated password, plus a
starter invite code — save those, they're your way in. Visit
`http://localhost:3000`, sign in as the admin at `/login`, or use the invite
code to create a member account at `/signup`.

Generate a real `SESSION_SECRET` before running anywhere but your own
machine:

```bash
openssl rand -base64 32
```

### Admin workflow

From `/admin` (visible only to the admin account) you can:

- Generate invite codes (optionally with a note like a name)
- Publish the week's devotional, scripture reference/text, and context
- Schedule the next live prayer/check-in session (date, time, join link)

### Resetting the database

Delete `dev.db` (and the `-wal`/`-shm` files if present), then re-run
`npx prisma migrate deploy && npx prisma db seed`.

## Project structure

- `prisma/schema.prisma` — data model (users, invites, devotionals, journal
  entries, threads/replies, live sessions)
- `src/lib/auth.ts` — password hashing + cookie-based sessions
- `src/lib/actions/` — server actions (signup/login, journal CRUD, threads/
  replies, admin tools)
- `src/app/(app)/` — the authenticated app shell and pages (dashboard,
  journal, community, admin)
- `src/app/login`, `src/app/signup` — public auth pages
- `proxy.ts` — redirects signed-out visitors to `/login` and signed-in
  visitors away from `/login`/`/signup`

## Deploying it for real

This runs entirely on SQLite, which is great for one small community but
doesn't suit serverless hosting well (no shared writable disk). The
straightforward path: deploy to a small persistent VM or a host with a
persistent volume (e.g. Fly.io, Railway), or swap the Prisma SQLite adapter
for a hosted Postgres (Neon, Supabase) if you outgrow SQLite — the schema
would need only the `datasource` provider changed.
