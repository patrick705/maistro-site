import { randomKey } from './blockTypes'

/**
 * One fully-populated, unbranded example per block type — unlike emptyBlock()
 * (deliberately blank, for a freshly-added real section), these exist only to
 * be browsed and cloned from the Block Showcase. Image-type fields are left
 * unset: there's no generic placeholder asset to reference, and every
 * showcase entry renders inside the same KitchenErrorBoundary already used
 * for real page blocks, so a component that can't handle a missing image
 * degrades to a small error card instead of breaking the page.
 */
export function genericBlockContent(type: string): Record<string, any> {
  const _key = randomKey()
  switch (type) {
    case 'richHeroBlock':
      return {
        _type: type,
        _key,
        eyebrow: 'Eyebrow label',
        headlineBefore: 'A clear, confident headline',
        headlineHighlight: 'that highlights',
        subhead: 'One or two sentences backing up the headline with the specific outcome a visitor gets.',
        primaryCta: 'Primary action',
        secondaryCta: 'Secondary action',
        secondaryHref: '#',
        heroStats: [
          { _key: randomKey(), value: '24/7', label: 'Always on' },
          { _key: randomKey(), value: '10 min', label: 'Time to set up' },
          { _key: randomKey(), value: '99.9%', label: 'Uptime' },
        ],
      }
    case 'simpleHeroBlock':
      return {
        _type: type,
        _key,
        eyebrow: 'Eyebrow label',
        headlineBefore: 'A shorter headline',
        headlineHighlight: 'with emphasis',
        subhead: 'A supporting line of copy under the headline.',
        headlineClamp: 'Default',
      }
    case 'heroCarouselBlock':
      return {
        _type: type,
        _key,
        eyebrow: 'Eyebrow label',
        overlayHeading: 'Page header title',
        overlaySubhead: 'One line of supporting copy over the banner image.',
        slides: [{ _key: randomKey(), caption: 'Slide caption' }],
      }
    case 'backgroundVideoBlock':
      return {
        _type: type,
        _key,
        loop: true,
        muted: true,
        videoHeight: 'Full screen',
        overlayCopy: true,
        scrim: true,
        menuOverlay: true,
        overlayPreset: 'Full',
        scrollCue: true,
        eyebrow: 'Eyebrow label',
        heading: 'A bold statement over moving footage',
        subhead: 'One line of supporting copy.',
      }
    case 'dashboardShowcaseBlock':
      // Its nested KPI/chart/rota fieldsets have no simpler shape to fill with
      // generic data — same scope cut as the real block editor, which defers
      // to the fallback Studio view for this one.
      return { _type: type, _key }
    case 'aboutSectionBlock':
      return {
        _type: type,
        _key,
        eyebrow: 'Eyebrow label',
        headlineBefore: 'A section headline that',
        headlineHighlight: 'draws the eye',
        headlineAfter: 'to the point you’re making.',
        body: 'A paragraph or two explaining the idea in plain terms, without jargon, focused on the reader’s outcome.',
      }
    case 'servicesGridBlock':
      return {
        _type: type,
        _key,
        eyebrow: 'Eyebrow label',
        headline: 'What’s included',
        services: [
          { _key: randomKey(), icon: '✦', title: 'First service', description: 'A short description of what this service does and why it matters.', bullets: ['Benefit one', 'Benefit two'] },
          { _key: randomKey(), icon: '✦', title: 'Second service', description: 'A short description of what this service does and why it matters.', bullets: ['Benefit one', 'Benefit two'] },
          { _key: randomKey(), icon: '✦', title: 'Third service', description: 'A short description of what this service does and why it matters.', bullets: ['Benefit one', 'Benefit two'] },
        ],
      }
    case 'pipelineStripBlock':
      return {
        _type: type,
        _key,
        channelsLabel: 'Inputs',
        channelsItems: [
          { _key: randomKey(), icon: '●', label: 'Channel one' },
          { _key: randomKey(), icon: '●', label: 'Channel two' },
        ],
        menuManagerIcon: '◈',
        menuManagerTitle: 'Middle step',
        menuManagerSub: 'What happens in the middle of the pipeline.',
        maistroIcon: '◆',
        maistroTitle: 'Output step',
        maistroSub: 'What comes out the other end.',
        outcomesLabel: 'Outcomes',
        outcomesItems: [
          { _key: randomKey(), icon: '●', label: 'Outcome one' },
          { _key: randomKey(), icon: '●', label: 'Outcome two' },
        ],
      }
    case 'moduleDeepDiveListBlock':
      return {
        _type: type,
        _key,
        eyebrow: 'Eyebrow label',
        headline: 'How it works, module by module',
        modules: [
          { _key: randomKey(), icon: '✦', eyebrow: 'Module one', headline: 'What this module does', body: 'A paragraph describing this module’s job and the outcome it delivers.', bullets: ['Feature one', 'Feature two'], widget: 'rota' },
          { _key: randomKey(), icon: '✦', eyebrow: 'Module two', headline: 'What this module does', body: 'A paragraph describing this module’s job and the outcome it delivers.', bullets: ['Feature one', 'Feature two'], widget: 'stock' },
        ],
      }
    case 'statsBandBlock':
      return {
        _type: type,
        _key,
        eyebrow: 'Eyebrow label',
        headline: 'The results, in numbers',
        stats: [
          { _key: randomKey(), eyebrow: 'Metric one', prefix: '+', value: '24', label: 'Unit of measure' },
          { _key: randomKey(), eyebrow: 'Metric two', prefix: '', value: '3x', label: 'Unit of measure' },
          { _key: randomKey(), eyebrow: 'Metric three', prefix: '-', value: '18', label: 'Unit of measure' },
        ],
      }
    case 'logoStripBlock':
      return {
        _type: type,
        _key,
        heading: 'Trusted by teams like yours',
        logos: [
          { _key: randomKey(), name: 'Client one', description: 'A line about this client.' },
          { _key: randomKey(), name: 'Client two', description: 'A line about this client.' },
          { _key: randomKey(), name: 'Client three', description: 'A line about this client.' },
        ],
      }
    case 'featuredCaseStudyBlock':
      return {
        _type: type,
        _key,
        eyebrow: 'Eyebrow label',
        headline: 'A customer story headline',
        body: 'A short paragraph setting up the customer’s situation before the change.',
        quote: 'A memorable line from the customer, in their own words.',
        author: 'Customer name, Title',
        heroStat: { value: '2x', label: 'Headline result' },
        stats: [
          { _key: randomKey(), value: '30%', label: 'Supporting stat' },
          { _key: randomKey(), value: '6 wks', label: 'Supporting stat' },
        ],
      }
    case 'testimonialGridBlock':
      return {
        _type: type,
        _key,
        eyebrow: 'Eyebrow label',
        headline: 'What people say',
        testimonials: [
          { _key: randomKey(), quote: 'A specific, believable quote about the result this person got.', author: 'Full name', role: 'Job title', venue: 'Company name' },
          { _key: randomKey(), quote: 'A specific, believable quote about the result this person got.', author: 'Full name', role: 'Job title', venue: 'Company name' },
        ],
      }
    case 'integrationsBlock':
      return {
        _type: type,
        _key,
        eyebrow: 'Eyebrow label',
        headline: 'Works with the tools you already use',
        integrations: ['Integration one', 'Integration two', 'Integration three', 'Integration four'],
      }
    case 'imageGalleryBlock':
      return { _type: type, _key, heading: 'Gallery heading', layout: 'Grid', images: [] }
    case 'liveVideoBlock':
      return { _type: type, _key, title: 'Video title', offlineMessage: 'Stream is currently offline' }
    case 'socialLinksBlock':
      return {
        _type: type,
        _key,
        heading: 'Follow along',
        links: [
          { _key: randomKey(), platform: 'instagram', url: 'https://instagram.com/' },
          { _key: randomKey(), platform: 'linkedin', url: 'https://linkedin.com/' },
        ],
      }
    case 'newsGridBlock':
      return { _type: type, _key }
    case 'contactFormBlock':
      return { _type: type, _key, headline: 'Ready to get started?', subhead: 'Leave a few details and we’ll follow up shortly.' }
    case 'roiCalculatorBlock':
      return {
        _type: type,
        _key,
        eyebrow: 'Eyebrow label',
        heading: 'See what you could save',
        subhead: 'Drag the sliders to match your own numbers.',
        currency: 'EUR €',
        defaultMonthlySales: 50000,
        defaultStockPct: 30,
        defaultStaffPct: 30,
        defaultOnlinePct: 25,
        defaultPhoneCalls: 200,
        benchmarks: [
          { _key: randomKey(), label: 'Stock target', range: '25–28%' },
          { _key: randomKey(), label: 'Staff target', range: '25–28%' },
        ],
        voiceEnabled: true,
        consultationHeading: 'Get a free consultation',
        exportLabel: 'Get consultation',
        disclaimer: 'Estimates only.',
      }
    case 'ctaBannerBlock':
      return { _type: type, _key, heading: 'Ready when you are', subhead: 'One more line making the case to click through.', buttonLabel: 'Get started' }
    case 'textBlock':
      return {
        _type: type,
        _key,
        heading: 'Section heading',
        body: [{ _type: 'block', _key: randomKey(), style: 'normal', children: [{ _type: 'span', _key: randomKey(), text: 'A freeform paragraph of body copy for this section.' }] }],
      }
    case 'sideBySideBlock':
      return { _type: type, _key, imagePosition: 'left', heading: 'A side-by-side section heading', body: [{ _type: 'block', _key: randomKey(), style: 'normal', children: [{ _type: 'span', _key: randomKey(), text: 'A paragraph of copy sitting next to the image.' }] }] }
    // The four below need an uploaded image/video per tile to render anything
    // at all (same "no placeholder asset" tradeoff as the image-only blocks
    // above) — heading text is still filled in for when real media is added.
    case 'scrollGalleryBlock':
      return { _type: type, _key, heading: 'Scroll gallery heading', tiles: [] }
    case 'mediaMosaicBlock':
      return { _type: type, _key, heading: 'Media mosaic heading', tiles: [] }
    case 'mediaCardGridBlock':
      return { _type: type, _key, heading: 'Media card grid heading', tiles: [] }
    case 'imageBannerBlock':
      return { _type: type, _key, eyebrow: 'Eyebrow label', heading: 'An image banner headline', subhead: 'One line of supporting copy.', buttonLabel: 'Get started' }
    case 'multiImageBannerBlock':
      return { _type: type, _key, eyebrow: 'Eyebrow label', heading: 'A multi-image banner headline', images: [] }
    default:
      return { _type: type, _key }
  }
}
