# Handoff: Rooted With Ally — Instagram Content Planner

## Overview
A personal Instagram content planner for the creator brand **Rooted With Ally** (warm, honest,
faith-led content for burned-out Christian moms). It lets the creator ("Ally") plan, schedule,
and organize posts across four content pillars, with Month / Week / Day calendar views, an idea
backlog, drag-to-reschedule, an AI idea + caption generator with an approval flow, and
localStorage persistence.

The goal of this handoff is to turn the working HTML prototype into a **real, multi-device app**
(persistent database, accounts, sync) in a production codebase.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing the
intended look and behavior. They are **not production code to copy directly**. The task is to
**recreate this design in the target codebase's environment** (React/Next, Vue, SwiftUI, native,
etc.) using that codebase's established patterns, component library, and data layer. If no
codebase exists yet, choose an appropriate stack — **recommended: Next.js (React) + a hosted
Postgres (e.g. Supabase) + an auth provider** — and implement there.

The prototype is built as a single "Design Component" HTML file (`Content Calendar.dc.html`)
whose UI is authored in a `class Component` using `React.createElement`. Treat that class as the
**behavioral spec**, not as shippable source — re-implement it idiomatically (JSX components,
hooks, a real store).

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing, radii, shadows, and interactions are final
and intentional, drawn from the Rooted With Ally design system. Recreate the UI to match. All
exact values are listed under **Design Tokens** below.

---

## Design System Context
The prototype consumes the **Rooted With Ally Design System** (tokens + React components) loaded
from a bundle. In production, either port those tokens into the target design system or install
the equivalent. Key facts:

- **Fonts**: Playfair Display (serif, headings/display — the `--font-display`), Poppins (sans,
  body/UI/labels — the `--font-body`), Handmade Stars (script accent, self-hosted; used only for
  the wordmark, not in this planner). One extra display face is used **only** for the banner word
  "Becoming": **Archivo Black** (Google Fonts).
- **Voice/tone** (matters for all copy and AI prompts): warm, gentle, honest, encouraging — a
  trusted mom-friend, never preachy, never hype. Lowercase lyrical accents. Em-dashes. **No emoji.**

---

## Screens / Views
Single-page app. A left **sidebar** (fixed 262px) + a **main column** sit under a full-width
**banner**. The main column swaps between four views (`month`, `week`, `day`, `ideas`). Two modals
(post editor, plan-my-week) and one full modal (AI idea studio) overlay everything.

Root layout: `min-height:100vh; background:var(--rw-white); padding:40px 44px 72px`. Inner wrapper
`max-width:1180px; margin:0 auto`. Content grid: `grid-template-columns:262px minmax(0,1fr);
gap:44px; align-items:start; margin-top:30px`.

### Banner (top, full width)
- **Purpose**: brand header + primary "New post" action.
- **Layout**: `position:relative; border-radius:var(--radius-lg); overflow:hidden;
  box-shadow:var(--shadow-md); margin-bottom:30px`. A flex row of **5 photo slots**, height 230px,
  flex weights `1 / 1 / 1.2 / 1 / 1` (a filmstrip of warm lifestyle photos supplied by the user).
- **Overlay wash** (absolute, `pointer-events:none`) — a warm tortoise darkening so the photos read
  as one cohesive strip and light text pops. Exact background:
  `radial-gradient(ellipse 52% 78% at 50% 54%, rgba(60,42,28,0.40) 0%, rgba(60,42,28,0.16) 48%, rgba(60,42,28,0) 78%), linear-gradient(180deg, rgba(60,42,28,0.12) 0%, rgba(60,42,28,0.06) 45%, rgba(60,42,28,0.20) 100%), rgba(60,42,28,0.30)`.
- **Centered title stack** (absolute, centered, `gap:6px`, `text-align:center`):
  - Eyebrow: `.rw-eyebrow` (uppercase, tracked), `color:var(--rw-shell)`,
    `text-shadow:0 1px 8px rgba(60,42,28,0.55)`, text **"The Content Planner"**.
  - Title: **"Becoming"**, `font-family:'Archivo Black'; font-size:4.2rem; line-height:0.88;
    letter-spacing:-0.04em; text-transform:uppercase; color:var(--rw-pastel-blue)`,
    `text-shadow:0 2px 4px rgba(60,42,28,0.45), 0 1px 20px rgba(60,42,28,0.4)`.
  - Script line: **"little by little · an Instagram studio"**, `font-family:var(--font-display);
    font-style:italic; font-size:1.35rem; color:var(--rw-buttermilk)`,
    `text-shadow:0 1px 8px rgba(60,42,28,0.55)`.
- **Top-right**: primary pill Button, size sm, label **"+ New post"** → opens the post editor
  modal with a blank idea (no date).

### Sidebar (left, 262px, `display:flex; flex-direction:column; gap:26px`)
Sections top to bottom:
1. **Affirmation card** — `background:var(--rw-buttermilk); border-radius:var(--radius-md);
   padding:24px 20px; text-align:center; box-shadow:var(--shadow-sunny)`. Display text
   "consistency is **key.**" (the word "key." is italic, `color:var(--rw-golden-honey)`).
2. **quick view** — section label (eyebrow + hairline rule). "Hello, Ally!" (Playfair 1.2rem) +
   "Today is August 3, 2026" (muted 0.75rem). Then a bulleted status list (golden-honey dot
   bullets):
   - "You have {today} post(s) to publish today"
   - **Overdue nudge** (only if >0): burgundy `#B0553E` text/dot — "{n} post(s) slipped past —
     reschedule or mark posted"
   - "You have {drafted} post(s) to review"
   - "{scheduled} scheduled & ready to go"
   - "{ideas} idea(s) waiting in the backlog"
3. **my pillars** (label toggles to "my pillars · filtering" when a filter is active) — 4 clickable
   pillar rows, each a color dot + full name. Clicking filters all views by that pillar; clicking
   again clears. Active row `background:var(--rw-buttermilk-200)`, others dim to `opacity:0.5`.
4. **my audience** — label + paragraph: "Burned-out Christian moms in the hard, holy mess —
   quietly coming back to themselves."
5. **the planner** — label + 4 nav items (content calendar / this week / today / content ideas).
   Each nav item: a golden-honey "|" glyph + label; active item `background:var(--rw-buttermilk)`.
6. **Two action buttons** (stacked, `gap:9px`):
   - "Generate ideas with AI" — filled buttermilk pill, `box-shadow:var(--shadow-sunny)` → opens
     AI idea studio.
   - "Plan my week" — outline pill (`1px solid var(--border-soft)`, transparent) → opens
     plan-my-week modal.
7. **Photo slot** — `border-radius:var(--radius-md); overflow:hidden; height:200px`, one
   user-supplied portrait photo (no wash — intentionally left natural).

### Main header + toolbar (above every calendar view)
- **mainHeader**: centered italic Playfair label flanked by hairline rules — reads
  "content calendar" / "this week" / "today" / "content ideas" per view.
- **toolbar** (hidden on ideas view): a row with the period title (Playfair 1.9rem, e.g.
  "August 2026" or a week range or a long date) + an optional sub (muted). Right side: circular
  nav buttons `‹` / `›` (34px, pill, hairline border) and a "Today" pill that jumps the cursor to
  today. Below: a **Status filter** row — eyebrow "Status" + 4 status chips
  (Idea/Drafted/Scheduled/Posted), each a dot + label pill; active chip fills buttermilk with a
  tortoise border; click toggles. A hairline rule closes the toolbar.

### Month view
- **Format legend** (`By format` eyebrow + 4 swatch+label items) above the grid.
- **7-column grid**, weekday headers Mon–Sun. 42 day cells (6 weeks). Each cell: height 132px,
  hairline right/bottom borders, `overflow:hidden` (becomes `visible` + raised z-index when it
  holds the hovered chip so the caption preview can escape). In-month cells `background:
  var(--rw-white)`, out-of-month `var(--rw-shell)`. Header row per cell: day number (Playfair
  1.1rem; today gets a 1.5px tortoise ring, 26px circle) + a small post-count when >0.
- **Post chips** (up to 3, then "+N more"): pill, `padding:3px 8px; border-radius:7px;
  background:<format tint>`; title text ellipsized. Overdue chips get a 6px burgundy dot.
  Hover raises `box-shadow:var(--shadow-sm)` and shows a **caption preview popover** (see
  Interactions). Chips are draggable to another day; empty-cell click opens a new post for that day.

### Week view
- **Missing-format nudge** (if a format has no post this week): a buttermilk banner listing which
  of Reel/Carousel/Story/Post are missing — "No {…} planned this week — even one small one counts."
- **7-column grid**, min-height 420px per day column. Column header: weekday short + day number
  (today column tinted `var(--rw-buttermilk-200)`) + a small "+" to add a post that day.
- **Compact cards** per post (see `card(post, false)`), draggable; empty column shows a soft
  "— rest, or add one" prompt.

### Day view
- Centered single column (max 720px). If empty: a "a quiet page" empty state (italic Playfair
  headline + gentle paragraph + "+ Plan a post" outline button). Otherwise a stack of **full
  cards** (`card(post, true)`) with caption, optional photo, pillar, hashtags, CTA.

### Ideas (backlog) view
- Intro paragraph. A responsive grid (`repeat(auto-fill, minmax(280px, 1fr))`) of **full cards**
  for all undated posts (filtered by pillar/status). "+ Capture an idea" outline button at the end.

### Post editor modal
- Overlay `rgba(60,42,28,0.32)`, centered card max 560px, `border-radius:var(--radius-lg);
  box-shadow:var(--shadow-lg)`. Header: eyebrow (pillar dot + "New/Edit post") + the post's date
  (long) or "An idea — no date yet"; a circular × close.
- Fields (label = uppercase tracked eyebrow):
  - **Hook / title** (text; rendered in Playfair inside the input).
  - **Content pillar** — segmented pill picker (4 pillars, dot + short name).
  - **Format** + **Status** — two segmented pickers side by side.
  - **Date** (`<input type=date>`) + **Time** (`<input type=time>`).
  - **Caption** — textarea; label row has a **"Write with AI"** link that fills the caption via
    the AI helper (shows "Writing…").
  - **Hashtags** (text), **Call to action / link** (text).
  - **Photo** — thumbnail + "Add/Replace photo" file input (stored as a data URL in the prototype;
    in production upload to object storage and keep a URL) + "Remove".
  - **Reuse this idea** (existing posts only) — "Duplicate" + "Repurpose as {Reel/Carousel/Story/Post}"
    chips that clone the post as a new idea.
- Footer: "Copy caption" (copies caption + hashtags to clipboard, shows "Copied ✓"), "Delete"
  (existing only, burgundy), "Cancel", and "Save post" (filled buttermilk).

### Plan-my-week modal
- Centered card. Presents a fixed **7-day template** (one row per day: weekday, pillar dot,
  format, title) across the four pillars. "Add these to my week" inserts all 7 as ideas dated to
  the currently-viewed week; "Not now" dismisses.

### AI Idea Studio modal
- Centered card max 600px. Header: eyebrow "Idea studio", italic Playfair "little by little,
  ideas", intro paragraph ("Nothing saves until you approve it…").
- **Controls**: Pillar select (All pillars + 4), Format select (Any + 4), free-text "On your mind
  (optional)" input (Enter triggers generate). Two buttons:
  - **"Generate ideas"** — filled tortoise pill.
  - **"Viral boost"** — buttermilk pill with a ✦ glyph + golden-honey border; runs generation
    biased toward proven high-share IG formats adapted to the niche.
  - Helper note: "Viral boost adapts proven high-share Instagram formats to your niche. It draws
    on what tends to travel — not today's live trends."
- **Review list** (scrollable, max-height 46vh): each generated idea is a card (format swatch,
  format label, pillar dot+short, Playfair title, caption, hashtags, CTA) with **"Add to backlog"**
  (filled buttermilk) and **"Dismiss"** (outline). Approved cards turn buttermilk-tinted and read
  "✓ Added to backlog"; dismissed cards dim to 0.5 and read "Dismissed".
- Footer: a status count ("N added to backlog" / "N waiting for review"), "Done", and
  **"Add all {n}"** for remaining pending ideas.

---

## Interactions & Behavior
- **View switching**: sidebar "the planner" nav sets `view` and persists it.
- **Period nav**: `‹`/`›` shift the cursor by month/week/day depending on view; "Today" resets it.
- **Filters**: pillar filter (sidebar or — in the prototype — toolbar) and status filter (toolbar)
  are independent; both narrow every view and the ideas list. Selecting an active one clears it.
- **Drag to reschedule**: posts (month chips, week cards) are `draggable`; day cells are drop
  targets. Dropping calls `moveTo(id, dateKey)` which sets the post's `date`. Dragged element dims
  to `opacity:0.35`.
- **Caption preview popover** (month view): hovering a chip shows a 262px popover below it (title,
  format+status, caption clamped to 4 lines, hashtags, pillar). The host cell temporarily sets
  `overflow:visible` and `z-index:30` so it isn't clipped. Popover is `pointer-events:none`.
- **Overdue**: `isOverdue(post) = post.date && post.date < today && status !== 'posted'`. Surfaced
  as a burgundy dot on month chips, an "Overdue" tag on cards, and a sidebar nudge count.
- **AI generation** (see State + the prototype's `runGen`, `writeCaption`): calls an LLM with a
  brand-voice system prompt, expects a strict JSON array of ideas, parses defensively (strips code
  fences, slices to the outer `[...]`), maps to review items with `_state: 'pending'`. Approve →
  push a real post (status `idea`, no date) into the store. In production, proxy the LLM call
  through a backend endpoint (never expose an API key client-side); keep the same prompt + JSON
  contract.
- **Copy caption**: writes `caption + "\n\n" + hashtags` to the clipboard.
- **Animations**: `rwaFade` (opacity + 6px rise, `--dur-base`) on view/modal mount; `rwaOverlay`
  (opacity) on modal backdrops. Easing `--ease-soft`. Keep motion gentle — no bounce/spring.
- **Hover states**: cards/chips lift shadow; nav + pillar rows warm their background; buttons
  darken/lift slightly.

## State Management
Prototype state (recreate as a store + persisted DB):
- `view` ('month'|'week'|'day'|'ideas') — persisted.
- `cursor` — a `YYYY-MM-DD` key for the focused date/period.
- `posts[]` — the core data (see Data model). Persisted to `localStorage` key
  `rwa_ig_calendar_v1` in the prototype; **replace with a database table keyed to the user**.
- `editing` — the post currently open in the editor (or null); `_isNew` flag distinguishes create.
- `dragId`, `hover`, `filter` (pillar id), `sfilter` (status id), `copied`.
- `planOpen`, `genOpen` + AI studio state: `genPillar`, `genFormat`, `genTopic`, `genLoading`,
  `genResults[]` (each `{_id,_state:'pending'|'approved'|'dismissed', title, caption, hashtags, cta,
  type, pillar}`), `genError`, `genViral`, `capLoading`.

### Data model — Post
```
{
  id: string,
  date: string | null,        // 'YYYY-MM-DD'; null = idea/backlog
  time: string,               // 'HH:MM'
  type: 'Reel'|'Carousel'|'Story'|'Post',
  pillar: 'quiet'|'faith'|'coming'|'real',
  status: 'idea'|'drafted'|'scheduled'|'posted',
  title: string,              // the hook
  caption: string,
  hashtags: string,           // space-separated '#tags'
  cta: string,
  thumb: string | null        // data URL in prototype → object-storage URL in prod
}
```

### Pillars (id → name / short / colors)
- `quiet` — "The Quiet Disappearing" / "Quiet Disappearing" — dot `#C9B48F`, tint `#EFE7D3`
- `faith` — "Faith That Went Silent" / "Faith Went Silent" — dot `#8FBBD1`, tint `#DCEAF1`
- `coming` — "Coming Back Without Fixing" / "Coming Back" — dot `#E4C24E`, tint `#FDF6D3`
- `real` — "The Real Thoughts" / "Real Thoughts" — dot `#BA8C5A`, tint `#EEE0CD`

### Statuses (id → label / dot)
- `idea` — "Idea" `#C9B48F` · `drafted` — "Drafted" `#E4C24E` · `scheduled` — "Scheduled" `#8FBBD1`
  · `posted` — "Posted" `#3C2A1C`

### Format color coding (type → tint / accent) — used for chips, cards, legend, AI swatches
- **Reel** — tint `#C1DBE8`, accent `#7FA9BE`  *(pastel blue, matches the banner title)*
- **Carousel** — tint `#CBD69C`, accent `#7E9038`
- **Story** — tint `#FFD3AA`, accent `#E8944A`
- **Post** — tint `#FFF1C4`, accent `#E6C862`

## Design Tokens
From the Rooted With Ally design system (CSS custom properties used throughout):
- **Colors**: `--rw-white` (warm white page), `--rw-shell` (off-white), `--rw-cream`/`--surface-page`
  (cream), `--rw-buttermilk` `#FFF1B5` + `--rw-buttermilk-100/200` tints, `--rw-pastel-blue`
  `#C1DBE8`, `--rw-golden-honey` `#BA8C5A`, `--rw-sandy-shore` `#D4C2A8`, `--rw-dark-tortoise`
  `#3C2A1C`. Semantic: `--text-heading`, `--text-body`, `--text-muted`, `--border-soft`,
  `--border-ink`. Warning/destructive accent used here: burgundy `#B0553E`.
- **Type**: `--font-display` (Playfair Display), `--font-body` (Poppins). Banner title only:
  Archivo Black. Eyebrows = uppercase, ~0.6875rem, letter-spacing ~0.14–0.16em.
- **Radii**: `--radius-md` 16px, `--radius-lg` 28px, `--radius-pill` 999px. Small ad-hoc radii
  7–12px on chips/inputs.
- **Shadows**: `--shadow-sm/md/lg` (warm brown-based, never grey) + `--shadow-sunny` (honeyed, for
  yellow elements). All built on `rgba(60,42,28,…)`.
- **Motion**: `--dur-fast` / `--dur-base` (~140–420ms) on `--ease-soft`.
- **Spacing**: 4px base; container 1180px here; sidebar 262px; grid gap 44px.

## Assets
- **Banner photos (5)** and **sidebar portrait (1)** are user-supplied lifestyle images (warm,
  golden-hour: coffee & linen, sunlit desk, open journal, lemons & daisies, cozy corner, a portrait).
  In the prototype these are drag-drop `<image-slot>` placeholders persisted by id. In production,
  store as uploaded assets with real URLs.
- **Fonts**: Playfair Display + Poppins (Google Fonts); Archivo Black (Google Fonts, banner title
  only); Handmade Stars (self-hosted in the design system — not used in this planner).
- **Icons**: none required here (the brand is type-led). The design system substitutes Lucide if
  icons are ever needed.

## Files
Bundled in this handoff (design references):
- `screens/` — reference screenshots of each view: `01-month.png`, `02-week.png`, `03-day.png`,
  `04-ideas.png`, `05-ai-studio.png`.
- `Content Calendar.dc.html` — the full prototype: layout markup + the `class Component` behavioral
  spec (all views, modals, AI logic, drag/drop, persistence).
- `support.js` — the Design Component runtime used to render the prototype (reference only; **do
  not port** — it's the prototype harness, not app code).
- `image-slot.js` — the drag-drop image placeholder web component used for the banner/sidebar photo
  slots (reference only).

The Rooted With Ally design system (tokens + React components) is referenced by the prototype from
`_ds/…` in the project; port those tokens/components into the target app or install the equivalent.
