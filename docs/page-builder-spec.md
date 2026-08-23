# Task: Page Builder & Navigation Editing for maistro-site

**Status:** Not started
**Project:** `maistro-site` (Next.js frontend + Sanity Studio, project ID `u7g3hn1o`)
**Goal:** Let non-developers add new top-menu pages and build out flexible page content, without touching code.

---

## Prompt for Claude Code

Paste the full contents of this doc into the Claude Code session first (or save it in the repo as `docs/page-builder-spec.md` so it can be read directly), then use this as the kickoff instruction:

> Build the reusable block system for maistro-site's Sanity Studio, following the independent-instances model described in this spec: each block is a type (Hero/Carousel, Text Box, Side-by-Side Image+Text, Image Gallery, Live Video, Social Links, Logo Strip, CTA Banner, etc.), and any page can add any number of independently-editable instances of any block type — editing one instance never affects another, even across pages or future customer-site clones. Pages should support drag-to-reorder of their block stack. Also implement the "+ Add new page" flow (new `page` document type with slug, top-menu label, and menu order, feeding a dynamic top nav) and the global Site Settings singleton (logo, sticky-nav toggle, primary CTA label/link, social links list) as described in Section 3. Use the existing `maistro-site` Sanity project (`u7g3hn1o`) and follow the `.env` (not `.env.local`) convention for env vars, since Vite only bundles `SANITY_STUDIO_`-prefixed variables. Start by reviewing the current schema before writing anything, and flag any conflicts with what's already in place.

---

## 1. Add New Pages (Top Menu)

- New Sanity document type: `page` — title, slug, top-menu label, menu order/position, optional "show in menu" toggle.
- Next.js needs a dynamic route (e.g. `app/[slug]/page.tsx`) that resolves any published `page` document by slug, rather than hardcoded routes per page.
- Top nav component should pull its list of links from all `page` documents flagged "show in menu," ordered by the menu-order field — instead of a hardcoded nav array.
- Consideration: reserve/protect existing routes (Home, Product, Customers, News) so a new page can't collide with them.

## 2. Flexible Page Content (Page Builder Blocks)

Each `page` document should have a **content field of repeatable, reorderable blocks** (Sanity's "Array of objects" pattern — sometimes called Page Builder or Flexible Content). Requested block types:

- **Hero / carousel images at top** — one or more images with optional captions, auto-rotating or manual-swipe carousel.
- **Text box** — rich text block (heading + body), for standalone copy sections.
- **Side-by-side image + text** — image on left/right (toggle), text block on the other side. Common "feature row" pattern.
- **Image gallery** — grid of images, likely with lightbox/click-to-enlarge behavior.
- **Social links** — icon row linking out to social profiles (Instagram, Facebook, LinkedIn, etc.), configurable per page or pulled from a global site setting.

### Other block ideas worth considering (not yet confirmed — flag for discussion)
- **Live video block** — embeds a live stream (e.g. YouTube Live, Vimeo Live, or a restaurant's kiosk/floor camera feed) rather than a static pre-recorded clip. Useful for showing a live venue feed, a live event, or a "watch our kitchen board in action" demo. Needs a fallback state (poster image + "offline" message) for when nothing is currently streaming.
- **Standard video embed block** — YouTube/Vimeo embed with caption, for pre-recorded video (product demos, testimonials).
- **Testimonial/quote block** — single quote or rotating set, useful for Customers-style pages.
- **CTA banner** — heading + button linking somewhere (e.g. "Book a demo").
- **FAQ/accordion block** — expandable Q&A list.
- **Stats/numbers row** — e.g. "100+ hrs saved/mo" style stat callouts, reusable across pages.
- **Logo strip / "as seen in" block** — row of partner or press logos (e.g. Square App Marketplace badge).
- **Pricing/plans table block** — comparison columns for tiered offerings.
- **Team/staff grid block** — photo + name + role cards, useful for an About-style page.
- **Map/location block** — embedded map pin, useful for a venue or office location page.
- **Timeline/process block** — step-by-step horizontal or vertical sequence (e.g. "How it works: 1. Sign up 2. Connect POS 3. Go live").
- **Two-column comparison block** — "Before BossIt / After BossIt" style side-by-side contrast.
- **Newsletter signup block** — email capture field + button, for a footer or dedicated page section.
- **Spacer/divider block** — simple layout control between other blocks.

---

## Implementation Notes

- Follows the existing content hierarchy pattern already established in `studio-maistro` (Menu → Category → Product) — same idea of "generic containers holding an ordered list of typed blocks" applies here.
- Since restaurant owners eventually get an **embedded, filtered Studio view** rather than direct Studio access (per existing architecture decision), keep the block schema simple/opinionated rather than infinitely configurable — favor a curated set of block types over a raw layout/CSS editor.
- Image fields should use Sanity's built-in image type (supports hotspot/crop) rather than plain URL strings.
- Reminder: any new Studio schema changes require `sanity deploy` afterward (see runbook) — schema changes alone don't need a Next.js redeploy, but consuming the new fields in the frontend does.

---

## 3. Site-Wide Settings (Global, not per-page)

Alongside per-page blocks, add a **global site settings** document in Sanity (singleton type, one instance only) covering things that apply across the whole site rather than a single page:

- **Logo** — upload/change the site logo image from Studio, rather than it being hardcoded in the Next.js codebase. Should support at minimum a standard logo; optionally a separate variant for dark/light backgrounds if the design calls for it.
- **Top menu scroll behavior** — toggle for whether the top nav is "sticky" (stays fixed at the top of the viewport while scrolling) or scrolls away with the page normally. Should be a simple on/off setting, not something requiring a code change to adjust.
- **Primary call-to-action (CTA) button** — currently "Book Now" in the top nav; make this editable from settings so it can be changed to a different label and link (e.g. "Book a Demo," "Get Started," "Contact Sales") without a code deploy. Fields: button label (text) and button link (URL or internal page reference).
- **Additional CTAs sitewide** — beyond the one main nav CTA, allow defining CTAs that can be reused across the site (e.g. in page-builder CTA banner blocks) so they're managed centrally in settings rather than typed fresh on every page.
- **Social links** — global list of social profile links (Instagram, Facebook, LinkedIn, X, etc.), each with a platform/icon type and a URL. This feeds both the site-wide social links row (e.g. footer) and can be reused by the "social links" page-builder block from Section 2, so they don't need to be re-entered per page.

### Implementation Notes for Settings
- Model as a Sanity **singleton document** (a document type the Studio only ever allows one instance of), commonly done via a custom Studio structure that pins it as "Site Settings" outside the normal document list.
- Next.js should fetch this settings document once per request/build (or via ISR) and pass logo, nav behavior, CTA, and social links down to the relevant components (Nav, Footer, and any CTA/social blocks).
- Since restaurant owners get a filtered/embedded Studio view per the existing architecture decision, confirm whether site-wide settings should be editable by them at all, or restricted to BossIt's own team — this is a global setting affecting the whole marketing site, not a single client's page.

---

## Block Reuse Model (confirmed)

**Model: Independent instances (not shared/singleton blocks).**

- Each block is a **type** (Hero, Text Box, Side-by-Side, Gallery, Live Video, Logo Strip, etc.), not a single shared document.
- Any page — on this site, or on a **new customer site cloned from this one** — can add any number of instances of any block type.
- Each instance has its **own independent content**. Editing one block instance never affects another instance of the same type, even on the same page or a cloned site.
- Blocks are **freely reorderable** within a page's content stack (standard drag-to-reorder page-builder behavior).
- **No shared/singleton blocks** for now — global settings (logo, primary CTA, social links — see Section 3) remain the one exception, since those are explicitly meant to be site-wide values rather than page content, not "blocks" in the page-builder sense.

**Why this matters for the customer-site use case:** since `maistro-site` will be recreated per customer, each customer's clone needs to end up with its own fully independent content in the same block types — not content that stays linked back to the original template. Independent instances is what makes that possible; a shared/singleton model would do the opposite (keep clones tied to one source of truth).

---

## Claude Design Prompts (for the visual design phase)

Suggested workflow: design each block in Claude Design first, refine until happy, then hand the design intent to Claude Code to build as real Sanity schema + Next.js components. Paste these in one at a time (or combine into one page mockup) as a starting point — adjust tone/style to match the existing maistro-site branding.

**Overall page layout**
> Design a flexible content page layout for a restaurant tech company's marketing site (maistro-site). The page should be built from stackable, reorderable sections. Show an example page combining: a hero image carousel at the top, a text section, a side-by-side image-and-text section, an image gallery, and a social links row at the bottom. Clean, modern, professional — similar tone to a SaaS product site.

**Hero / carousel block**
> Design a hero section for a webpage with a full-width image carousel (3-5 rotating images), an optional heading and short subtext overlay, and small dot indicators for carousel position.

**Text box block**
> Design a simple content section with a heading and a paragraph of body text, no image — used as a flexible "read more" or informational section on a webpage.

**Side-by-side image + text block**
> Design a "feature row" section: an image on one side and a heading + paragraph of text on the other side, with the ability to flip which side the image is on. Show two stacked examples, one with image-left and one with image-right, to show both variants.

**Live video block**
> Design a live video section for a webpage — a large video player area showing a live stream, with a small "LIVE" badge/indicator, a short title/caption below, and a fallback "offline" state showing a poster image with a "Stream is currently offline" message.

**Image gallery block**
> Design an image gallery grid section for a webpage — a responsive grid of photos that opens a larger lightbox view on click.

**Social links block**
> Design a compact horizontal row of social media icon links (Instagram, Facebook, LinkedIn, X) suitable for the bottom of a webpage section.

**Top navigation (dynamic pages)**
> Design a website top navigation bar where menu items are dynamically generated from a list of page titles — show how it would look with 5-6 page links, clean and minimal, matching a modern SaaS marketing site.

**Sticky vs. scrolling nav (two states)**
> Show two versions of the same top navigation bar: one "sticky" version pinned to the top of the screen while the page content scrolls beneath it with a subtle shadow, and one "normal" version that scrolls away naturally with the page content.

**Configurable CTA button**
> Design a top navigation bar with a single prominent call-to-action button on the right side. Show 2-3 variations of the same button with different labels — "Book Now," "Book a Demo," "Get Started" — to show how the button style stays consistent while the label and emphasis can change.

**Sanity Studio admin UI (Kitchen-style layout)**
> Design a content management admin interface styled after a "Kitchen"-style CMS layout: a fixed left-hand sidebar listing content sections (e.g. Pages, Site Settings, Media), with each page shown as its own item under a "Pages" section. Include a "+ Add new page" action at the top of that section. The main content area shows the selected page's builder view: a vertical stack of content blocks (e.g. hero carousel, text, image gallery), each with a visible "Edit" affordance and a persistent "+ Add block" button at the bottom of the stack to insert a new block. Clean, functional, dashboard-style — dense and practical rather than decorative, similar to a Notion or Sanity Studio aesthetic.

**Site settings / admin panel view**
> Design a simple settings screen (like a CMS admin panel) for managing global site options: a logo upload field, a toggle switch for "sticky navigation," a call-to-action button label + link field, and a repeatable list of social media links each with an icon and URL field.

---

## Open Questions (to resolve before/at implementation)

1. Should new pages default to *not* appearing in the top menu until explicitly enabled, or auto-appear on publish?
2. Any need for nested/dropdown menu items, or is it a flat top-menu list for now?
3. Any max/recommended limits on gallery image count or carousel slide count for performance?
4. Should site-wide settings (logo, CTA, social links, nav behavior) be editable by restaurant owners in their filtered Studio view, or restricted to BossIt's internal team only?
5. Sticky nav — is this a global on/off setting, or could it eventually vary per-page (e.g. sticky on marketing pages, not sticky on a long-form article page)?

---

*Created: 2026-07-25*
