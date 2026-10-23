# Maistro site — runbook

**Project:** `maistro-site` (Next.js App Router + embedded Sanity Studio / Kitchen CMS)
**Sanity project ID:** `u7g3hn1o` · **dataset:** `production`

This replaces `docs/page-builder-spec.md` (the original kickoff spec, now
obsolete — most of it shipped, some of it shipped differently than planned).
It describes what's actually in the repo and the live dataset today, not
what was originally requested.

---

## 1. Routes

| Path | File | Resolves to |
|---|---|---|
| `/` | `app/(site)/page.tsx` | hardcoded `getPageBySlug('home')` |
| `/[slug]` | `app/(site)/[slug]/page.tsx` | `getPageBySlug(slug)`, any other published, non-archived page |
| `/news` | a `page` document with slug `news` (via `[slug]`) | — |
| `/news/[slug]` | `app/(site)/news/[slug]/page.tsx` | `newsArticle` documents |
| `/studio/*` | `app/studio/[[...tool]]/page.tsx` | embedded Sanity Studio (Kitchen CMS) |

Both page routes run the same GROQ (`pageBySlugQuery`, `lib/sanity/queries.ts`):

```groq
*[_type == "page" && slug.current == $slug && archived != true][0]
```

against the published perspective (`lib/sanity/client.ts`: `perspective:
'published'`, `useCdn: true`) — drafts are never served. **Neither route
filters on `pageKind`** — a `customSite` embed page and a normal block-stack
page render through the exact same `<PageBuilder>` call.

**`/` is hardcoded to the literal slug `"home"`**, not to a document ID or a
settings field. Whatever `page` document currently holds `slug: "home"` is
what serves the root route — rename or unpublish that document's slug and
`/` 404s.

**The document currently at that slug (`page-home`) is a `customSite`
page** (`pageKind: "customSite"`) — a single `customHtmlBlock` holding one
uploaded/pasted HTML embed, not a block-stack page. This is a live-content
fact, not a code fact, and it can change the moment someone edits it in
Kitchen — but as of this writing, **the rich homepage design the README
describes (hero, tabbed dashboard, About pipeline, services grid, results
band, contact form) is not what's live at `/`**. That content still exists,
published, at `/home-classic`.

### Reachable-but-unlinked pages

The dataset has three "home"-shaped pages, all published, all distinct slugs:

| slug | `_id` | `pageKind` | blocks | in nav? |
|---|---|---|---|---|
| `home` | `page-home` | `customSite` | 1 (`customHtmlBlock`) | — (served at `/`, not via nav) |
| `home-3` | `1d36fea9-…` | `standard` | 3 | no (`showInMenu: false`) |
| `home-classic` | `page-home-classic` | `standard` | 8 (richHero, roiCalculator, dashboardShowcase, aboutSection, servicesGrid, statsBand, contactForm, customHtml) | no (`showInMenu: false`) |

`home-3` and `home-classic` are both **reachable at `/home-3` and
`/home-classic`** — nothing blocks them. `RESERVED_SLUGS` (see §6) does not
apply to them; it only governs what *new* slugs Kitchen will let an editor
type.

### What's actually in the top nav right now

`app/(site)/layout.tsx` builds nav as:

```ts
const navItems = [...siteSettings.navItems, ...pageNavItems]
```

`siteSettings.navItems` is a static list on the Site Settings singleton —
**currently empty (`[]`) in the live dataset**, despite `defaultSiteSettings`
(`lib/content/defaults.ts`) hardcoding Home/Product/Customers/News/Contact as
a fallback. `pageNavItems` comes from `getPagesForNav()` — every `page` with
`showInMenu: true`, ordered by `menuOrder`. Live, that's only the four
`customSite` pages: **Meet Maistro, Explore, Our Story, Say Hi**
(`meet-maistro`, `explore`, `our-story`, `say-hi`). `/product`, `/customers`,
`/news`, `/contact`, `/home-3` and `/home-classic` all exist and resolve,
but none of them currently have `showInMenu: true` — they're only reachable
by typing the URL.

---

## 2. Block types

29 real block types, defined under `sanity/schemaTypes/objects/`, registered
in `sanity/schemaTypes/index.ts`, and allowed in `page.blocks`
(`sanity/schemaTypes/page.ts`). The "+ Add block" picker
(`sanity/kitchen/blockTypes.ts`) groups them into 7 categories and also
offers one **pseudo-type**, `customHtmlBlock:beforeAfter` — a pre-filled
`customHtmlBlock` variant (same before/after kitchen-comparison embed as on
Home), not a real schema name. `REAL_BLOCK_TYPES` filters it back out
wherever a real `_type` is required (e.g. Block Showcase).

| Category | Block types |
|---|---|
| Heroes & headers | Hero (`richHeroBlock`), Simple hero, Page header (`heroCarouselBlock`), Background video, Image banner, Multi-image banner |
| Product & story | Dashboard showcase, About section, Services grid, Pipeline strip, Module deep-dives |
| Proof | Results band (`statsBandBlock`), Logo wall (`logoStripBlock`), Featured case study, Testimonial grid, Integrations band |
| Media & social | Gallery (`imageGalleryBlock`), Video (`liveVideoBlock`), Social links, Scroll gallery, Media mosaic, Media card grid |
| Editorial & conversion | News grid, Contact section (`contactFormBlock`), CTA band |
| Custom blocks | ROI calculator, Custom HTML, *Before/After comparison (pseudo)* |
| Other | Text box, Side-by-side |

**Design tab coverage** (`DESIGN_TAB_BLOCK_TYPES` in `blockTypes.ts`) — 16 of
the 29 get a themeable-section Design tab (heading font/scale, padding,
palette role, full-bleed); the rest (news grid, logo strip, social links,
gallery, video, scroll gallery, mosaic, card grid, image/multi-image banner,
background video, ROI calculator, custom HTML) are utility/media blocks with
no section identity of their own to restyle.

- Heading controls: all 16 except `pipelineStripBlock` (no heading field).
- Palette-role background override: 13 of the 16 — excludes
  `heroCarouselBlock` (image, not a color surface), `pipelineStripBlock` and
  `featuredCaseStudyBlock` (their colored surface is a nested `.band`, not
  the section itself).
- Full-bleed toggle: `aboutSectionBlock`, `integrationsBlock`,
  `dashboardShowcaseBlock` only (already edge-to-edge by default).

Front-end renderers live in `components/blocks/` (plus a few top-level
`components/*`), dispatched by `components/PageBuilder.tsx`. The GROQ
projection for every block type lives in `pageBySlugQuery`
(`lib/sanity/queries.ts`) — **adding a block type means updating three
places**: the schema object, `page.ts`'s `blocks.of[]`, `blockTypes.ts`
(picker + `emptyBlock()`), and the GROQ projection, or the new fields come
back `undefined` on the frontend.

Kitchen's own live-preview renderer (`sanity/kitchen/livePreview/`, 13
components) is a **separate, smaller implementation** from the real
frontend components — it does not cover every block type 1:1, so Kitchen's
preview and the deployed page can diverge for less common blocks.

---

## 3. Kitchen CMS views

Kitchen (`sanity/kitchen/KitchenTool.tsx`) is the primary editing surface,
registered as the only visible tool in `sanity.config.ts` (the native
structure tool stays mounted and reachable at `/studio/structure` as an
escape hatch, but is hidden from the tool switcher). `KitchenView` has 8
kinds:

| `kind` | View | Covers |
|---|---|---|
| `page` | `PageBuilderView` | block stack, drag-reorder, per-block Design tab, SEO drawer |
| `customSitePage` | `CustomSitePageView` | single embedded HTML site (`pageKind: 'customSite'`) |
| `settings` | 6 sections: General, Navigation, Theme, Analytics & Tracking, SEO defaults, Demo modal | site-wide config |
| `collection` | `NewsCollectionView` (newsArticle) / `CollectionListView` (lead) | list views |
| `doc` | `CollectionDocEditor` | single `newsArticle` edit |
| `media` | `MediaLibraryView` | asset library |
| `blockShowcase` | `BlockShowcaseView` | preview gallery of every real block type |
| `customHtmlIndex` | `CustomHtmlIndexView` | index of all Custom HTML block instances across pages |

The **Theme** settings section hosts the **Palette library** (see §4) via
`sanity/kitchen/settings/PaletteLibrary.tsx`.

---

## 4. Brand palette library

Schema (`sanity/schemaTypes/brandPalette.ts`): `name` + 4 required base hex
fields (`brandHex`, `accentHex`, `warmHex`, `posHex`) + 8 optional hex
*overrides* (surface, brand tint/soft/ink, accent ink, warm deep, pos tint,
body) + `isDefaultForNewSites`. Anything not explicitly overridden is
derived by `lib/content/colorMath.ts`; `paletteToCssVars()`
(`lib/content/palettes.ts`) turns the resolved palette into CSS custom
properties alongside the chosen font pairing and type scale.

**The live dataset has 44 `brandPalette` documents. `scripts/seed.ts` only
knows 5** (Violet, Ink & Terracotta, Plum & Peach, Forest & Clay, Brazil) —
running `npm run seed` against a fresh dataset reproduces 5 of 44, not the
full library. The other 39 were added directly in Kitchen's Palette library
UI and were never backfilled into the seed script. Treat the seed script as
a bootstrap-only tool for a brand-new dataset, not a source of truth for the
current palette set.

- **Default for new sites:** `Violet` (`isDefaultForNewSites: true`) — also
  the hardcoded fallback in `lib/content/defaults.ts`, used when Sanity
  isn't configured at all.
- **Currently live** (Site Settings → Theme): palette **Teal & Gold**,
  pairing **Sora / DM Sans**, type scale **Compact**, playful mode off,
  results band shown.

---

## 5. Env conventions

Two different bundlers read Sanity config, and each only inlines its own
prefix — this is why both `.env` and `.env.local` exist side by side:

- **Next.js** (the app, and the embedded `/studio` route) auto-loads
  `.env.local` and only inlines `NEXT_PUBLIC_*`-prefixed vars into
  client code.
- **The standalone Sanity CLI** (`sanity deploy`, `sanity.cli.ts`) does its
  own build and does **not** read `.env.local` — only `.env` — and only
  inlines `SANITY_STUDIO_*`-prefixed vars.

Both `sanity.config.ts` and `sanity.cli.ts` fall back across both
prefixes (`process.env.SANITY_STUDIO_PROJECT_ID || projectId`) so the same
config file works under either bundler. (The original spec attributed this
split to "Vite" — this project doesn't use Vite; the real cause is the two
separate bundlers above.)

| Var | Read by | Lives in |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` / `_DATASET` / `_API_VERSION` | Next.js bundle (site + embedded Studio) | `.env.local`, `.env` |
| `SANITY_STUDIO_PROJECT_ID` / `_DATASET` | Sanity CLI (`sanity.cli.ts`, standalone `sanity deploy`) | `.env` only |
| `SANITY_API_WRITE_TOKEN` | server-only: lead capture (`/api/leads`), `scripts/seed.ts`, Kitchen writes | `.env.local`, `.env` |
| `SANITY_API_READ_TOKEN` | server-only: authenticated reads if ever needed | `.env.local`, `.env` |

Note: the README's setup steps reference `.env.local.example` as a template
to copy — **that file doesn't exist in the repo.** Create `.env.local`
directly with the vars above instead of running the `cp` step.

---

## 6. Deploying — two separate Studios

This project ships **two independently-deployed copies of Sanity Studio**,
both pointed at the same `u7g3hn1o` / `production` dataset and the same
schema/Kitchen code, but deployed through entirely different pipelines:

1. **Embedded Studio** (`app/studio/[[...tool]]/page.tsx`, served at
   `/studio` on whatever domain the Next app is deployed to). This deploys
   automatically as part of the normal Next.js deploy (e.g. a Vercel
   build/push) — there is no separate step. It needs the
   `NEXT_PUBLIC_SANITY_*` vars and `SANITY_API_WRITE_TOKEN`/
   `SANITY_API_READ_TOKEN` set in the hosting provider's env config.

2. **Standalone hosted Studio** (Sanity's own hosting, configured by
   `sanity.cli.ts`, `deployment.appId: 'xkffam856j81dv8eba8fw85a'`). This
   does **not** redeploy with the Next app — it only updates when you
   explicitly run:
   ```bash
   npx sanity deploy
   ```
   This reads `SANITY_STUDIO_PROJECT_ID`/`SANITY_STUDIO_DATASET` from
   `.env` (see §5) and bundles the same `sanity.config.ts` (same schema,
   same Kitchen UI) independently.

**Any schema change (new block type, new field) needs no Next.js redeploy
by itself** to take effect in the embedded `/studio` — that ships with the
next normal app deploy. But it needs an explicit `npx sanity deploy` to
reach the standalone hosted Studio. Frontend code that *consumes* a new
field (a new GROQ projection key, a new block renderer) does need a Next.js
deploy, same as any other code change.

---

## 7. Reserved-slug behaviour

`RESERVED_SLUGS = ['', 'home', 'studio', 'api']`
(`sanity/schemaTypes/page.ts`) is a **Studio-side authoring guard only**:

- Enforced by the `page` schema's slug validation (blocks saving a *new*
  page document with one of these slugs) and surfaced as a warning in
  `PageBuilderView.tsx` / `CustomSitePageView.tsx` when an existing page
  somehow already has one of these slugs.
- It has **no effect on routing** — `pageBySlugQuery` doesn't know it
  exists. It only stops an editor from typing a *new* colliding slug in
  Kitchen; it does nothing to protect slugs that aren't literally in the
  list (`home-3`, `home-classic`, etc. are untouched by it), and it doesn't
  retroactively validate documents created before the check existed.
- Because `"home"` is reserved, no one can create a *second* page claiming
  that slug through Kitchen's normal "+ Add new page" flow — but the
  existing `page-home` document can still have its slug edited away or its
  `pageKind`/blocks changed freely, which is exactly what makes `/`'s
  current content fragile (§1).

---

## 8. Open questions

Carried forward from the original spec (still unresolved):

1. **Any max/recommended limits** on gallery image count or carousel slide
   count, for performance?
2. **Who should be able to edit Site Settings** (logo, primary CTA, social
   links, theme/palette) — BossIT's internal team only, or should
   restaurant-owner customer accounts get write access too, once the
   per-customer filtered Studio view exists?

New, from the current state of the dataset and code:

3. **Is `page-home` (the `customSite` embed) meant to be the permanent
   homepage**, with `home-classic` kept only as a reference/fallback
   design, or did the swap happen without an intent to retire the
   block-built homepage? Worth confirming before anyone "cleans up" either
   page.
4. **Should `/product`, `/customers`, `/news`, `/contact`, `/home-3` and
   `/home-classic` be added back into the nav** (`showInMenu: true` +
   `menuOrder`), or are they intentionally unlinked drafts/alternates being
   kept live-but-hidden? They're all publicly reachable by URL today either
   way.
5. **Should `scripts/seed.ts` be brought in line with the live palette
   library** (all 44), or re-scoped to just seed the schema + a minimal
   starter palette and leave the rest to Kitchen's Palette library UI?
6. Nothing currently guards `/` against the document at slug `"home"`
   being deleted, archived, or re-sluged — is a safeguard (e.g. a
   non-deletable/non-archivable flag on whichever page is live at `/`)
   worth adding?
