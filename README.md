# Maistro website

Next.js (App Router, TypeScript) rebuild of the Maistro Homepage design, with
content managed in an embedded Sanity Studio.

## What's here

- **Homepage** (`/`) — fully built, pixel-matching the approved
  `Maistro Homepage.dc.html` mockup: hero, tabbed ops dashboard, About
  pipeline diagram, services grid, results band, and a contact form.
  Copy, stats, service cards, results and the demo-modal text are all
  editable in the Studio.
- **Product** (`/product`) — built to match the approved `Product.dc.html`
  mockup: hero (no stats row), a horizontal pipeline strip (channels →
  Menu Manager → Maistro → outcomes, distinct from the homepage's vertical
  About diagram), five alternating module deep-dive sections (Staff,
  Stock, Voice Ordering, Forecasting, Reports) each with its own static
  illustrated widget (rota bars, stock levels, a voice-call transcript, a
  forecast chart, report tiles), and an "Integrations" band. Ends in a
  `CtaBand`.
- **Customers** (`/customers`) — matches `Customers.dc.html`: a simple
  hero (no CTA/stats), a client logo wall (rendered as text wordmark
  tiles — no real logo artwork was available to pull in), a featured
  Romayo's case-study band, and 3 testimonials with real names (Dario
  Macari/Romayo's, George Stamopoulos/Yeeros, Peter O'Sullivan/Fired Up
  Pizza). Ends in a `CtaBand`.
- **News** (`/news`) — matches `News.dc.html`: a simple hero and a grid of
  6 real articles, each its own repeatable "News Article" document in the
  Studio (title, excerpt, category, icon, date). Card thumbnails are
  colored icon placeholders, not real photos — the mockup's photography
  couldn't be pulled through my tooling (files over the 256KB read cap
  came back truncated); drop real images into `public/images` and wire
  them into `components/NewsGrid.tsx` whenever you have them. **No CTA
  band** — the real mockup ends right after the grid.
- Product/Customers/News reuse the homepage's design tokens (palette,
  fonts, "playful" mode, emoji iconography) and its `Hero`/`CtaBand`
  components where the mockups actually call for them, but each has its
  own dedicated layout components (`PipelineStrip`, `ModuleFeature`,
  `IntegrationsBand`, `SimpleHero`, `LogoWall`, `FeaturedCaseStudy`,
  `TestimonialGrid`, `NewsGrid`) — the three pages are not simple reskins
  of the homepage's sections.
- **Contact** — the nav's "Contact" link jumps to the contact form at the
  bottom of the homepage (`/#contact`); there's no separate Contact page yet.
- **"Book a demo"** (nav, hero, contact) opens an animated modal. Both that
  modal and the homepage contact form POST to `/api/leads`, which stores a
  `lead` document in Sanity — check the Studio's **Leads** list.
- **Theme**: the palette (5 options), "playful" mode, and the results-band
  visibility are all editable in Site Settings in the Studio — no code
  changes needed to retheme.
- The "designed dashboard" (KPIs, charts, rota, stock bars) is illustrative
  product UI, not marketing copy — it's static data in
  `lib/content/dashboardData.ts`, not wired to Sanity.

## One-time setup

1. **Create a Sanity project** (free) at <https://www.sanity.io/manage> if
   you don't already have one. Note its **Project ID**.
2. **Create an API token**: in that project, go to API → Tokens → Add API
   token, give it the **Editor** role, and copy it — you'll only see it
   once.
3. Copy the env template and fill it in:
   ```bash
   cp .env.local.example .env.local
   ```
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=<your project id>
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_WRITE_TOKEN=<the token you just created>
   ```
4. Install dependencies and seed the starting content (hero copy, services,
   results, etc. — the same copy as the mockup):
   ```bash
   npm install
   npm run seed
   ```

Without a `.env.local`, the site still runs and renders using the same
copy as a hardcoded fallback (see `lib/content/defaults.ts`) — useful for
quick local previews — but nothing will be editable and lead submissions
will just be logged to the server console instead of saved.

## Running it

```bash
npm run dev
```

- Site: <http://localhost:3000>
- Studio (content editor): <http://localhost:3000/studio>

## Project structure

- `app/(site)/` — marketing pages, sharing `layout.tsx` (header, footer,
  demo modal, theme).
- `app/studio/` — embedded Sanity Studio, outside the `(site)` layout.
- `app/api/leads/` — route handler that stores demo/contact submissions in
  Sanity.
- `sanity/schemaTypes/` — content schema (Site Settings, Home/Product/
  Customers/News Pages, News Article, Lead).
- `lib/content/` — TypeScript types, the palette definitions, the
  hardcoded dashboard data, and the fallback/seed copy.
- `lib/sanity/` — Sanity client, GROQ queries, and fetch-with-fallback
  helpers.
- `components/` — the actual page building blocks.

## Deploying

Deploy like any Next.js app (e.g. Vercel). Set the same env vars from
`.env.local` in your hosting provider, then run `npm run seed` once
(pointed at your production dataset) to populate initial content — or just
write it directly in the Studio.
