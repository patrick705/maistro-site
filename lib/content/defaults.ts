import type { NewsArticle, SiteSettings } from './types'

/**
 * Baseline copy lifted straight from the Maistro Homepage design mockup.
 * Used two ways:
 *  - as the render fallback when Sanity isn't configured or a fetch fails,
 *    so the site always renders something sensible.
 *  - as the payload for scripts/seed.ts, so the Sanity dataset starts out
 *    matching the approved design instead of empty documents.
 */

export const defaultSiteSettings: SiteSettings = {
  siteName: 'Maistro',
  navItems: [
    { label: 'Home', href: '/' },
    { label: 'Product', href: '/product' },
    { label: 'Customers', href: '/customers' },
    { label: 'News', href: '/news' },
    { label: 'Contact', href: '/#contact' },
  ],
  stickyNav: false,
  primaryCta: { label: 'Book a demo', href: '' },
  socialLinks: [],
  footerText: '© 2026 BossIT · São Paulo · London',
  theme: {
    palette: {
      name: 'Violet',
      brandHex: '#3A2A66',
      accentHex: '#7B5BE6',
      warmHex: '#F0B84E',
      posHex: '#4F9E86',
    },
    playful: false,
    showResults: true,
  },
  seoDefaults: {
    metaTitleSuffix: '— Maistro',
    defaultMetaDescription: 'Run your whole operation with one AI — staff, stock, voice ordering, forecasting and reports.',
  },
  demoModal: {
    eyebrow: 'BOOK A DEMO',
    headline: 'See Maistro run your venue.',
    subhead: 'A two-week working demo, tailored to your operation.',
    successHeadline: "You're on the list!",
    successBody: "We'll be in touch within one working day.",
  },
}

function textBlock(text: string) {
  return {
    _type: 'block' as const,
    style: 'normal',
    children: [{ _type: 'span' as const, text }],
  }
}

export const defaultNewsArticles: NewsArticle[] = [
  {
    title: 'Voice ordering lands in the US',
    slug: 'voice-ordering-lands-in-the-us',
    excerpt: "Maistro's AI now answers the phone and drive-thru across every US venue, straight into your POS.",
    category: 'Product',
    icon: '🎙️',
    variant: 'accent',
    publishedAt: '2026-07-02T09:00:00.000Z',
    body: [
      textBlock(
        "Voice Ordering is now live across every US venue running on Maistro. The same AI that answers the phone and drive-thru in the UK and Ireland now handles orders coast to coast, straight into your POS.",
      ),
      textBlock(
        "US menus bring their own quirks — regional naming, combo logic, and a lot more modifiers per order than the average European ticket. Voice Ordering has been retrained on thousands of real US drive-thru calls to handle all of it without dropping an order.",
      ),
      textBlock('Rolling out now to all US accounts — no setup required on your end.'),
    ],
  },
  {
    title: "Romayo's lifts kiosk value 30%",
    slug: 'romayos-lifts-kiosk-value-30',
    excerpt: 'How a 23-venue family group centralised every sales channel with Maistro.',
    category: 'Customer',
    icon: '📦',
    variant: 'pos',
    publishedAt: '2026-06-24T09:00:00.000Z',
    body: [
      textBlock(
        "Romayo's has been serving quick-service food across 23 venues for three generations. Before Maistro, each site ran its own patchwork of POS, delivery and kiosk systems — with no single view of the business.",
      ),
      textBlock(
        'Centralising every channel through Menu Manager gave the group real-time stock control and analytics across all sites for the first time, and let them tune kiosk upsell flows the same way everywhere.',
      ),
      textBlock('The result: average kiosk order value is up more than 30% group-wide.'),
    ],
  },
  {
    title: '5 ways AI forecasting cuts waste',
    slug: '5-ways-ai-forecasting-cuts-waste',
    excerpt: 'Practical tactics operators use to protect margins, service after service.',
    category: 'Guide',
    icon: '🔮',
    variant: 'brand',
    publishedAt: '2026-06-18T09:00:00.000Z',
    body: [
      textBlock(
        'Food waste rarely comes from one big mistake — it comes from dozens of small over-preps, repeated every service. Here are five ways operators use Maistro forecasting to close that gap.',
      ),
      textBlock('1. Prep to the forecast, not to habit — let demand data set par levels, not last Tuesday.'),
      textBlock('2. Factor in weather and local events, which move footfall more than most rotas account for.'),
      textBlock('3. Review the forecast-vs-actual variance weekly, not just at month-end.'),
      textBlock('4. Push accurate forecasts down to suppliers so purchase orders shrink automatically.'),
      textBlock('5. Let the model keep learning — accuracy compounds with every service you run.'),
    ],
  },
  {
    title: 'Maistro joins the BossIT suite',
    slug: 'maistro-joins-the-bossit-suite',
    excerpt: 'One platform for staff, stock, ordering and reporting — now part of BossIT.',
    category: 'Company',
    icon: '✨',
    variant: 'warm',
    publishedAt: '2026-05-30T09:00:00.000Z',
    body: [
      textBlock(
        "Maistro started as an internal project inside BossIT to solve a problem we kept hearing from our own hospitality clients: too many disconnected systems, not enough time to run the business in between.",
      ),
      textBlock(
        'From today, Maistro is officially part of the BossIT product suite — one platform for staff, stock, ordering and reporting, built and supported by the same team.',
      ),
    ],
  },
  {
    title: 'Inside the AI that builds your rota',
    slug: 'inside-the-ai-that-builds-your-rota',
    excerpt: 'A look at how demand forecasting drafts the right labour in seconds.',
    category: 'Product',
    icon: '🧑‍🍳',
    variant: 'accent',
    publishedAt: '2026-05-12T09:00:00.000Z',
    body: [
      textBlock(
        'Every rota Maistro drafts starts with the same forecast that drives stock and prep — sales and covers predicted by day, hour and item, factoring in weather, events and seasonality.',
      ),
      textBlock(
        'From there, the Staff module matches predicted demand to your team\'s availability, contracted hours and skills, and drafts a rota that keeps labour cost on target without leaving shifts short.',
      ),
      textBlock('Managers review and approve in minutes — swaps, holidays and compliance are handled automatically.'),
    ],
  },
  {
    title: 'How multi-site groups run as one',
    slug: 'how-multi-site-groups-run-as-one',
    excerpt: 'The operating model behind consistent margins across dozens of locations.',
    category: 'Playbook',
    icon: '📊',
    variant: 'warm',
    publishedAt: '2026-04-28T09:00:00.000Z',
    body: [
      textBlock(
        'The groups that scale best across dozens of venues share one thing in common: every site runs on the same data, not just the same brand.',
      ),
      textBlock(
        'That means one Menu Manager for every channel, one forecast model tuned per site but built the same way everywhere, and one reporting view so head office sees real-time performance without waiting on a spreadsheet.',
      ),
      textBlock("It's less about controlling every site centrally, and more about giving every site the same good defaults."),
    ],
  },
]
