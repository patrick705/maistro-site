/** Block types with a themeable section identity — these get a real Design tab. Utility/media blocks (news grid, logo strip, social links, gallery, video) don't have a section identity of their own to restyle. */
export const DESIGN_TAB_BLOCK_TYPES = new Set([
  'richHeroBlock',
  'simpleHeroBlock',
  'heroCarouselBlock',
  'aboutSectionBlock',
  'dashboardShowcaseBlock',
  'servicesGridBlock',
  'statsBandBlock',
  'pipelineStripBlock',
  'moduleDeepDiveListBlock',
  'integrationsBlock',
  'featuredCaseStudyBlock',
  'testimonialGridBlock',
  'contactFormBlock',
  'ctaBannerBlock',
  'textBlock',
  'sideBySideBlock',
])

/** pipelineStripBlock has no heading field at all — its Design tab shows Colour source only, no heading controls with nothing to target. */
export function hasHeadingControls(type: string): boolean {
  return DESIGN_TAB_BLOCK_TYPES.has(type) && type !== 'pipelineStripBlock'
}

/**
 * Blocks whose colored surface IS their own outer section (not a nested
 * "band" card, and not an image-carousel frame) — the only ones where a
 * palette-role background override is meaningful and where the auto-flip
 * ink actually lands on the right element. heroCarouselBlock (image, not a
 * color surface), pipelineStripBlock and featuredCaseStudyBlock (the colored
 * surface is a nested `.band`, not the section itself) are deliberately not
 * wired for this axis rather than half-implemented against the wrong target.
 * dashboardShowcaseBlock's role targets its outer `.wrap`, not the white
 * `.card` floating on top of it, so the card itself never needs an ink flip.
 */
export function hasPaletteRoleControl(type: string): boolean {
  return DESIGN_TAB_BLOCK_TYPES.has(type) && !['heroCarouselBlock', 'pipelineStripBlock', 'featuredCaseStudyBlock'].includes(type)
}

/** Blocks whose background is already edge-to-edge by default get the full-bleed toggle. */
export function hasFullBleedControl(type: string): boolean {
  return type === 'aboutSectionBlock' || type === 'integrationsBlock' || type === 'dashboardShowcaseBlock'
}

export const BLOCK_CATEGORIES =['Custom blocks', 'Heroes & headers', 'Product & story', 'Proof', 'Media & social', 'Editorial & conversion', 'Other'] as const

export const BLOCK_TYPES: { type: string; label: string; icon: string; category: (typeof BLOCK_CATEGORIES)[number]; description: string }[] = [
  { type: 'richHeroBlock', label: 'Hero', icon: '🌟', category: 'Heroes & headers', description: 'Eyebrow, headline, CTAs, stat badges' },
  { type: 'simpleHeroBlock', label: 'Simple hero', icon: '✨', category: 'Heroes & headers', description: 'Headline + subhead, no CTA row' },
  { type: 'heroCarouselBlock', label: 'Page header', icon: '🖼️', category: 'Heroes & headers', description: 'Image or rotating images banner' },
  { type: 'backgroundVideoBlock', label: 'Background video', icon: '📽️', category: 'Heroes & headers', description: 'Full-bleed looping video, optional overlay' },
  { type: 'imageBannerBlock', label: 'Image banner', icon: '🏔️', category: 'Heroes & headers', description: 'Full-bleed background image, scrim, centered copy + CTA' },
  { type: 'multiImageBannerBlock', label: 'Multi-image banner', icon: '🎞️', category: 'Heroes & headers', description: 'Full-bleed row of images, scrim, centered copy' },

  { type: 'dashboardShowcaseBlock', label: 'Dashboard showcase', icon: '📊', category: 'Product & story', description: 'Overview / Forecast / Staff / Stock / Reports' },
  { type: 'aboutSectionBlock', label: 'About section', icon: '🧭', category: 'Product & story', description: 'Headline, body copy, pipeline diagram' },
  { type: 'servicesGridBlock', label: 'Services grid', icon: '🧩', category: 'Product & story', description: 'Service cards' },
  { type: 'pipelineStripBlock', label: 'Pipeline strip', icon: '🔀', category: 'Product & story', description: 'Channels → Menu Manager → Maistro' },
  { type: 'moduleDeepDiveListBlock', label: 'Module deep-dives', icon: '🔍', category: 'Product & story', description: 'Alternating module features' },

  { type: 'statsBandBlock', label: 'Results band', icon: '📈', category: 'Proof', description: 'Result stat cards' },
  { type: 'logoStripBlock', label: 'Logo wall', icon: '🏷️', category: 'Proof', description: 'Client tiles with popups' },
  { type: 'featuredCaseStudyBlock', label: 'Featured case study', icon: '🏆', category: 'Proof', description: 'Quote, body, headline stat' },
  { type: 'testimonialGridBlock', label: 'Testimonial grid', icon: '💬', category: 'Proof', description: 'Testimonial cards' },
  { type: 'integrationsBlock', label: 'Integrations band', icon: '🔌', category: 'Proof', description: 'Integration pills' },

  { type: 'imageGalleryBlock', label: 'Gallery', icon: '🗂️', category: 'Media & social', description: 'Grid of images with captions' },
  { type: 'liveVideoBlock', label: 'Video', icon: '🎥', category: 'Media & social', description: 'Embed URL with poster / offline fallback' },
  { type: 'socialLinksBlock', label: 'Social links', icon: '🔗', category: 'Media & social', description: 'Heading + a list of platform links' },
  { type: 'scrollGalleryBlock', label: 'Scroll gallery', icon: '📜', category: 'Media & social', description: 'Full-bleed horizontal scrolling strip' },
  { type: 'mediaMosaicBlock', label: 'Media mosaic', icon: '🖼️', category: 'Media & social', description: '3-col grid with a 2×2 featured tile' },
  { type: 'mediaCardGridBlock', label: 'Media card grid', icon: '▦', category: 'Media & social', description: 'Uniform grid, no featured tile' },

  { type: 'newsGridBlock', label: 'News grid', icon: '📰', category: 'Editorial & conversion', description: 'Pulls from News Articles' },
  { type: 'contactFormBlock', label: 'Contact section', icon: '✉️', category: 'Editorial & conversion', description: 'Headline, subhead, lead form' },
  { type: 'roiCalculatorBlock', label: 'ROI calculator', icon: '◱', category: 'Custom blocks', description: 'Stores, prime cost and voice AI — live savings' },
  { type: 'ctaBannerBlock', label: 'CTA band', icon: '📣', category: 'Editorial & conversion', description: 'Closing headline + button' },

  { type: 'textBlock', label: 'Text box', icon: '📝', category: 'Other', description: 'Freeform heading + paragraphs' },
  { type: 'sideBySideBlock', label: 'Side-by-side', icon: '⬛', category: 'Other', description: 'Image + text, either side' },
]

export function randomKey() {
  return Math.random().toString(36).slice(2, 10)
}

/** Display-only "component name" tag for the block-row chrome, e.g. "Results band" -> "ResultsBand". */
export function pascalTag(label: string): string {
  return label
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('')
}

export function emptyBlock(type: string): Record<string, any> {
  const _key = randomKey()
  switch (type) {
    case 'heroCarouselBlock':
      return { _type: type, _key, slides: [] }
    case 'textBlock':
      return { _type: type, _key, body: [] }
    case 'sideBySideBlock':
      return { _type: type, _key, imagePosition: 'left', heading: 'New section' }
    case 'imageGalleryBlock':
      return { _type: type, _key, layout: 'Grid', images: [] }
    case 'socialLinksBlock':
      return { _type: type, _key, links: [] }
    case 'liveVideoBlock':
      return { _type: type, _key, offlineMessage: 'Stream is currently offline' }
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
      }
    case 'imageBannerBlock':
      return { _type: type, _key }
    case 'multiImageBannerBlock':
      return { _type: type, _key, images: [] }
    case 'scrollGalleryBlock':
    case 'mediaMosaicBlock':
    case 'mediaCardGridBlock':
      return { _type: type, _key, tiles: [] }
    case 'roiCalculatorBlock':
      return {
        _type: type,
        _key,
        currency: 'EUR €',
        defaultMonthlySales: 50000,
        defaultStockPct: 30,
        defaultStaffPct: 30,
        defaultOnlinePct: 25,
        defaultPhoneCalls: 200,
        benchmarks: [],
        voiceEnabled: true,
        consultationHeading: 'Get a free consultation',
        exportLabel: 'Get consultation',
      }
    case 'logoStripBlock':
      return { _type: type, _key, logos: [] }
    case 'ctaBannerBlock':
      return { _type: type, _key, heading: 'New CTA', buttonLabel: 'Learn more' }
    case 'richHeroBlock':
      return { _type: type, _key, secondaryHref: '#', heroStats: [] }
    case 'simpleHeroBlock':
      return { _type: type, _key }
    case 'aboutSectionBlock':
      return { _type: type, _key }
    case 'dashboardShowcaseBlock':
      return { _type: type, _key }
    case 'servicesGridBlock':
      return { _type: type, _key, services: [] }
    case 'statsBandBlock':
      return { _type: type, _key, stats: [] }
    case 'contactFormBlock':
      return { _type: type, _key, headline: 'Ready to see Maistro live?' }
    case 'pipelineStripBlock':
      return { _type: type, _key, channelsItems: [], outcomesItems: [] }
    case 'moduleDeepDiveListBlock':
      return { _type: type, _key, modules: [] }
    case 'integrationsBlock':
      return { _type: type, _key, integrations: [] }
    case 'featuredCaseStudyBlock':
      return { _type: type, _key, stats: [] }
    case 'testimonialGridBlock':
      return { _type: type, _key, testimonials: [] }
    case 'newsGridBlock':
      return { _type: type, _key }
    default:
      return { _type: type, _key }
  }
}

/** Plain-text in, single portable-text block out — a deliberate simplification (see plan notes). */
export function textToPortableBody(text: string): Record<string, any>[] {
  if (!text.trim()) return []
  return [
    {
      _type: 'block',
      _key: randomKey(),
      style: 'normal',
      children: [{ _type: 'span', _key: randomKey(), text }],
    },
  ]
}

export function portableBodyToText(body: Record<string, any>[] | undefined): string {
  if (!body) return ''
  return body
    .map((b) => (b.children ?? []).map((c: any) => c.text ?? '').join(''))
    .join('\n\n')
}
