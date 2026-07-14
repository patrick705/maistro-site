import type { CustomersPage, HomePage, NewsArticle, NewsPage, ProductPage, SiteSettings } from './types'

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

export const defaultProductPage: ProductPage = {
  heroEyebrow: 'THE PRODUCT',
  heroHeadlineBefore: 'One platform to run',
  heroHeadlineHighlight: 'every venue.',
  heroSubhead:
    'Your channels are managed by the Menu Manager. Maistro takes that data and turns it into forecasts, rotas, orders and reports — automatically.',
  heroPrimaryCta: 'Book a demo →',
  heroSecondaryCta: 'Explore modules',
  heroStats: [],

  channelsLabel: 'Channels',
  channelsItems: [
    { icon: '🧾', label: 'POS' },
    { icon: '🛒', label: 'Online' },
    { icon: '🖥️', label: 'Kiosks' },
    { icon: '🛵', label: 'Delivery' },
  ],
  menuManagerIcon: '❤️',
  menuManagerTitle: 'Menu Manager',
  menuManagerSub: 'manages every channel',
  maistroIcon: '🧠',
  maistroTitle: 'Maistro',
  maistroSub: 'turns data into decisions',
  outcomesLabel: 'Outcomes',
  outcomesItems: [
    { icon: '🔮', label: 'Forecasts' },
    { icon: '🧑‍🍳', label: 'Rotas' },
    { icon: '📦', label: 'Orders' },
    { icon: '📊', label: 'Reports' },
  ],

  modulesEyebrow: 'The modules',
  modulesHeadline: 'Five modules. One brain.',
  modules: [
    {
      icon: '🧑‍🍳',
      eyebrow: 'Staff',
      headline: 'Rotas that build themselves.',
      body: 'Maistro forecasts demand and drafts the right rota for every shift, then keeps labour on target as the day changes.',
      bullets: [
        'Demand-based scheduling in one click',
        'Live labour-cost tracking against sales',
        'Holiday, shift-swaps and compliance built in',
      ],
      widget: 'rota',
    },
    {
      icon: '📦',
      eyebrow: 'Stock',
      headline: 'Never run out. Never over-order.',
      body: 'Real-time inventory tracks every item against forecast demand, then auto-builds purchase orders before you dip below par.',
      bullets: [
        'Live stock counts across every site',
        'Automatic reordering to supplier',
        'Waste tracking down to the ingredient',
      ],
      widget: 'stock',
    },
    {
      icon: '🎙️',
      eyebrow: 'Voice Ordering',
      headline: 'Every call answered. Every order right.',
      body: "Maistro's voice AI picks up the phone and the drive-thru, takes the order into your POS, and never leaves a customer on hold.",
      bullets: [
        'Natural conversation in multiple languages',
        'Upsells the specials, every time',
        'Straight into the same order flow as staff',
      ],
      widget: 'voice',
    },
    {
      icon: '🔮',
      eyebrow: 'Forecasting',
      headline: 'Know tomorrow, today.',
      body: 'Sales, prep and staffing predicted for every day, site and season — the forecast that powers every other module.',
      bullets: [
        'Weather, events and trends factored in',
        'Down to the hour and the item',
        'Gets sharper with every service',
      ],
      widget: 'forecast',
    },
    {
      icon: '📊',
      eyebrow: 'Amazing Reports',
      headline: 'The numbers that matter, beautifully.',
      body: 'Real-time P&L, labour and margin reporting across every venue — ready the moment service ends, no spreadsheets required.',
      bullets: [
        'Group and per-site views in one place',
        'Month-end close in hours, not days',
        'Export to your accounting stack',
      ],
      widget: 'reports',
    },
  ],

  integrationsEyebrow: 'Plugs into your stack',
  integrationsHeadline: 'Keep the tools you love. Connect them once.',
  integrations: ['POS systems', 'Delivery platforms', 'Payroll', 'Accounting', 'Kiosks', 'Online ordering'],

  ctaHeadline: 'See it running your venue.',
  ctaSubhead: "Tell us about your operation and we'll show you a working demo in two weeks.",
  ctaButtonLabel: 'Book a demo →',
}

export const defaultCustomersPage: CustomersPage = {
  heroEyebrow: 'CUSTOMERS',
  heroHeadlineBefore: 'Built for brands that',
  heroHeadlineHighlight: "don't slow down.",
  heroSubhead:
    'From single sites to 23-venue groups, hospitality operators across the UK & Ireland run on Maistro and BossIT.',

  logos: [
    "Romayo's",
    'Yeeros',
    'Fired Up Pizza',
    "Mizzoni's Pizza",
    'Beshoff',
    "Vincenzo's",
    'Lyons',
    'Ballsbridge Pizza',
    'BASE',
    'The Pizza Co Belfast',
    'Woodfire & Wings',
  ],

  caseStudyEyebrow: "Customer success · Romayo's",
  caseStudyHeadline: 'A third-generation group, running 23 venues as one.',
  caseStudyBody:
    "Romayo's centralised every sales channel, gained real-time stock control and analytics across all sites, and lifted average kiosk order value by more than 30%.",
  caseStudyQuote:
    "I'd highly recommend it for anybody who wants to put their business at the forefront of technology in the QSR sector.",
  caseStudyAuthor: "Dario Macari · Director of Operations, Romayo's",
  caseStudyHeroStat: { value: '+30%', label: 'average kiosk order value' },
  caseStudyStats: [
    { value: '23', label: 'venues, one system' },
    { value: '100%', label: 'channels centralised' },
  ],

  testimonialsEyebrow: 'In their words',
  testimonialsHeadline: "Operators who'd tell a friend.",
  testimonials: [
    {
      quote:
        'One of the main things I like is that, as a platform provider, they were very open to customising their service to suit what we needed.',
      author: 'George Stamopoulos',
      role: 'MD',
      venue: 'Yeeros',
    },
    {
      quote:
        "I'd highly recommend it for anybody who wants to put their business at the forefront of technology in the QSR sector.",
      author: 'Dario Macari',
      role: 'Director of Operations',
      venue: "Romayo's",
    },
    {
      quote: 'I love talking about it — especially how the waiting room, flow, and kitchens have transformed.',
      author: "Peter O'Sullivan",
      role: 'Manager of Operations',
      venue: 'Fired Up Pizza',
    },
  ],

  ctaHeadline: 'Join them.',
  ctaSubhead: 'See what Maistro can do for your venues — a working demo in two weeks.',
  ctaButtonLabel: 'Book a demo →',
}

export const defaultNewsPage: NewsPage = {
  heroEyebrow: 'NEWS',
  heroHeadlineBefore: 'The latest from',
  heroHeadlineHighlight: 'Maistro.',
  heroSubhead: 'Product updates, customer stories, guides and playbooks from the Maistro team.',
}

export const defaultNewsArticles: NewsArticle[] = [
  {
    title: 'Voice ordering lands in the US',
    excerpt: "Maistro's AI now answers the phone and drive-thru across every US venue, straight into your POS.",
    category: 'Product',
    icon: '🎙️',
    variant: 'accent',
    publishedAt: '2026-07-02T09:00:00.000Z',
  },
  {
    title: "Romayo's lifts kiosk value 30%",
    excerpt: 'How a 23-venue family group centralised every sales channel with Maistro.',
    category: 'Customer',
    icon: '📦',
    variant: 'pos',
    publishedAt: '2026-06-24T09:00:00.000Z',
  },
  {
    title: '5 ways AI forecasting cuts waste',
    excerpt: 'Practical tactics operators use to protect margins, service after service.',
    category: 'Guide',
    icon: '🔮',
    variant: 'brand',
    publishedAt: '2026-06-18T09:00:00.000Z',
  },
  {
    title: 'Maistro joins the BossIT suite',
    excerpt: 'One platform for staff, stock, ordering and reporting — now part of BossIT.',
    category: 'Company',
    icon: '✨',
    variant: 'warm',
    publishedAt: '2026-05-30T09:00:00.000Z',
  },
  {
    title: 'Inside the AI that builds your rota',
    excerpt: 'A look at how demand forecasting drafts the right labour in seconds.',
    category: 'Product',
    icon: '🧑‍🍳',
    variant: 'accent',
    publishedAt: '2026-05-12T09:00:00.000Z',
  },
  {
    title: 'How multi-site groups run as one',
    excerpt: 'The operating model behind consistent margins across dozens of locations.',
    category: 'Playbook',
    icon: '📊',
    variant: 'warm',
    publishedAt: '2026-04-28T09:00:00.000Z',
  },
]
