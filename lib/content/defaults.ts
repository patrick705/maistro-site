import type { HomePage, SiteSettings } from './types'

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
  ctaLabel: 'Book a demo',
  footerText: '© 2026 BossIT · São Paulo · London',
  theme: {
    palette: 'Violet',
    playful: false,
    showResults: true,
  },
}

export const defaultHomePage: HomePage = {
  heroEyebrow: 'NEW FROM BOSSIT',
  heroHeadlineBefore: 'Run your whole operation with',
  heroHeadlineHighlight: 'one AI.',
  heroSubhead:
    "One crew of AI assistants for staff, stock, voice ordering, forecasting and reports so good you'll want to frame them. Maistro runs the day-to-day — you get back your time.",
  heroPrimaryCta: 'Book a demo →',
  heroSecondaryCta: 'Watch product tour',
  heroStats: [
    { value: '100+', label: 'hrs saved / mo', variant: 'brand' },
    { value: '3.2×', label: 'faster workflows', variant: 'pos' },
    { value: '99.9%', label: 'uptime', variant: 'accent' },
  ],

  aboutEyebrow: 'About Maistro',
  aboutHeadlineBefore: 'Maestro means conductor. Mais means more. And the ',
  aboutHeadlineHighlight: 'AI',
  aboutHeadlineAfter: '? Right there in the middle.',
  aboutBody:
    'Built inside BossIT, Maistro brings the systems that run your venues — staff, stock, ordering and reporting — into one intelligent operation that works in harmony. You set the vision; Maistro keeps everything in time.',
  aboutPipeline: {
    channelsIcon: '🛒',
    channelsLabel: 'Sales channels',
    channelsTags: ['POS', 'Online', 'Delivery', 'Kiosks'],
    menuManagerIcon: '❤️',
    menuManagerTitle: 'Menu Manager',
    menuManagerSub: 'the heart · manages every channel',
    maistroIcon: '🧠',
    maistroTitle: 'Maistro',
    maistroSub: 'the brain · turns data into decisions',
    deliversIcon: '✨',
    deliversLabel: 'Maistro delivers',
    outputs: [
      { icon: '🔮', label: 'Forecasting' },
      { icon: '📊', label: 'Reports' },
    ],
  },

  servicesEyebrow: 'What Maistro does',
  servicesHeadline: 'Everything your operation needs.',
  services: [
    {
      icon: '🧑‍🍳',
      title: 'Staff',
      description:
        'Build rotas in seconds, forecast the right labour for every shift, and keep the floor covered without the overspend.',
      bullets: [
        'Auto-drafted rotas from your demand forecast',
        'Live labour % against sales, all day',
        'Holidays, swaps & compliance handled',
      ],
      variant: 'warm',
    },
    {
      icon: '📦',
      title: 'Stock',
      description:
        'Track inventory in real time, cut waste, and auto-reorder the moment levels dip — before you ever run out.',
      bullets: [
        'Live counts across every site',
        'Auto purchase orders before you hit par',
        'Waste tracked to the ingredient',
      ],
      variant: 'pos',
    },
    {
      icon: '🎙️',
      title: 'Voice Ordering',
      description:
        'AI answers the phone and drive-thru, takes every order accurately, and never puts a customer on hold.',
      bullets: [],
      variant: 'accent',
    },
    {
      icon: '🔮',
      title: 'Forecasting',
      description:
        "Predict sales, prep and staffing for every day, site and season — so you're always ready, never guessing.",
      bullets: [
        'Sales & covers by day, hour and item',
        'Weather, events & seasonality factored in',
        'Sharpens with every service',
      ],
      variant: 'brand',
    },
    {
      icon: '📊',
      title: 'Amazing Reports',
      description:
        'Real-time P&L, labour and margins in reports that are actually a joy to read — the numbers that matter, beautifully.',
      bullets: [
        'Real-time P&L per site and group-wide',
        'Month-end close in hours, not days',
        'One-tap export to your accounts',
      ],
      variant: 'warm',
    },
  ],

  resultsEyebrow: 'Proven results',
  resultsHeadline: 'Numbers our clients actually feel.',
  resultStats: [
    { eyebrow: 'Labour', value: '10–25%', label: 'lower cost of labour', variant: 'brand' },
    { eyebrow: 'Inventory', prefix: 'up to', value: '50%', label: 'less food waste', variant: 'pos' },
    { eyebrow: 'Admin', value: '100+', label: 'admin hours saved / month', variant: 'accent' },
  ],

  contactHeadline: 'Ready to see Maistro live?',
  contactSubhead: "Tell us about your operation and we'll show you a working demo in two weeks.",

  demoModal: {
    eyebrow: 'BOOK A DEMO',
    headline: 'See Maistro run your venue.',
    subhead: 'A two-week working demo, tailored to your operation.',
    successHeadline: "You're on the list!",
    successBody: "We'll be in touch within one working day.",
  },
}
