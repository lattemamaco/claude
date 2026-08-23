# Rooted in Bloom — Community

A private, invite-only community app: a weekly devotional and scripture with
context, a private journal, community discussion threads (with optional
anonymous posting), and a monthly live prayer/check-in announcement.

Built with Next.js (App Router), Prisma + Postgres, and Tailwind.

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

Requirements: Node 20+, and a Postgres database (a free
[Neon](https://neon.tech) project works well, or a local Postgres install).

```bash
npm install
cp .env.example .env        # then fill in DATABASE_URL and SESSION_SECRET (see below)
npx prisma migrate deploy   # applies the schema
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

`npx prisma migrate reset` drops and recreates all tables, then re-runs the
seed script.

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

## Deploying to Vercel (with Neon Postgres)

This gets you a real, shareable URL. Takes about 5–10 minutes.

1. **Create a Neon database.** Go to [neon.tech](https://neon.tech), sign up
   free, and create a project. Copy the pooled connection string it gives you
   (starts with `postgresql://...` and includes `?sslmode=require`).

2. **Push this repo to GitHub** if it isn't already (it is, if you're reading
   this from the repo Claude pushed to).

3. **Import the project into Vercel.**
   - Go to [vercel.com/new](https://vercel.com/new) and import the GitHub
     repo.
   - Since the app lives in the `community-app/` folder, set **Root
     Directory** to `community-app` in the import settings.
   - Framework preset should auto-detect as Next.js.

4. **Add environment variables** in the Vercel project settings
   (Settings → Environment Variables):
   - `DATABASE_URL` — the Neon connection string from step 1
   - `SESSION_SECRET` — a random value from `openssl rand -base64 32`

5. **Deploy.** Vercel will run `npm install` (which runs `prisma generate`
   automatically via the `postinstall` script) and `npm run build`.

6. **Apply the database schema.** The build doesn't run migrations
   automatically. From your own machine, with `DATABASE_URL` set to the same
   Neon connection string:

   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

   (Or run these against Neon's dashboard SQL editor using the SQL in
   `prisma/migrations/`.)

Once that's done, your Vercel deployment URL is live — sign in as the admin
using the credentials the seed command printed, and start generating invite
codes for real members.

### Keeping it deployed

Any time you change `prisma/schema.prisma`, run
`npx prisma migrate dev --name <description>` locally against a dev database
first, commit the generated migration file, push, then run
`npx prisma migrate deploy` against the production `DATABASE_URL` after the
deploy finishes.
