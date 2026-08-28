import type { PortableTextBlock } from '@portabletext/types'

export type ColorVariant = 'brand' | 'warm' | 'pos' | 'accent'

export interface BrandPalette {
  name: string
  brandHex: string
  accentHex: string
  warmHex: string
  posHex: string
  surfaceHex?: string
  brandTintHex?: string
  brandSoftHex?: string
  brandInkHex?: string
  accentInkHex?: string
  warmDeepHex?: string
  posTintHex?: string
  bodyHex?: string
}

export interface NavItem {
  label: string
  href: string
}

export type TypePairing =
  | 'Bricolage / Space Grotesk'
  | 'Instrument Serif / Work Sans'
  | 'Sora / DM Sans'
  | 'Playfair / Manrope'

export type TypeScale = 'Compact' | 'Default' | 'Large'

export interface SiteTheme {
  palette: BrandPalette
  playful: boolean
  showResults: boolean
  pairing: TypePairing
  typeScale: TypeScale
  chromeFont: boolean
}

export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'linkedin' | 'x' | 'tiktok' | 'youtube' | 'other'
  url: string
}

export interface PrimaryCta {
  label: string
  href?: string
}

export interface SeoDefaults {
  metaTitleSuffix?: string
  defaultMetaDescription?: string
  defaultOgImage?: SeoImage
  twitterHandle?: string
}

export interface SiteAnalytics {
  gtmId?: string
  gtmOn?: boolean
  ga4Id?: string
  ga4On?: boolean
  metaPixelId?: string
  metaOn?: boolean
  googleAdsId?: string
  adsOn?: boolean
}

export interface AnalyticsOverride {
  gtmId?: string
  ga4Id?: string
  metaPixelId?: string
  googleAdsId?: string
}

export interface SiteSettings {
  siteName: string
  logo?: SeoImage
  logoDark?: SeoImage
  navItems: NavItem[]
  stickyNav: boolean
  primaryCta: PrimaryCta
  socialLinks: SocialLink[]
  footerText: string
  analytics?: SiteAnalytics
  theme: SiteTheme
  seoDefaults: SeoDefaults
  demoModal: DemoModalContent
}

export interface SeoImage {
  url: string
  alt: string
}

export interface Seo {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SeoImage
  noIndex?: boolean
  analyticsOverride?: boolean
  analytics?: AnalyticsOverride
}

export interface ClientLogo {
  name: string
  logo?: SeoImage
  description?: string
  website?: string
}

export interface StatBadge {
  value: string
  label: string
  variant: ColorVariant
}

export interface PipelineOutput {
  icon: string
  label: string
}

export interface AboutPipeline {
  channelsIcon: string
  channelsLabel: string
  channelsTags: string[]
  menuManagerIcon: string
  menuManagerTitle: string
  menuManagerSub: string
  maistroIcon: string
  maistroTitle: string
  maistroSub: string
  deliversIcon: string
  deliversLabel: string
  outputs: PipelineOutput[]
}

export interface ServiceCard {
  icon: string
  title: string
  description: string
  bullets: string[]
  variant: ColorVariant
}

export interface ResultStat {
  eyebrow: string
  prefix?: string
  value: string
  label: string
  variant: ColorVariant
}

export interface DemoModalContent {
  eyebrow: string
  headline: string
  subhead: string
  successHeadline: string
  successBody: string
}

export interface Testimonial {
  quote: string
  author: string
  role?: string
  venue: string
}

export interface NewsArticle {
  title: string
  slug: string
  excerpt: string
  category: string
  icon: string
  variant: ColorVariant
  heroImage?: SeoImage
  author?: string
  publishedAt: string
  body?: PortableTextBlock[]
  seo?: Seo
}

export interface IconTile {
  icon: string
  label: string
}

export type ModuleWidgetKey = 'rota' | 'stock' | 'voice' | 'forecast' | 'reports'

export interface ModuleDeepDive {
  icon: string
  eyebrow: string
  headline: string
  body: string
  bullets: string[]
  widget: ModuleWidgetKey
}

export interface Stat {
  value: string
  label: string
}

export interface KpiTile {
  label: string
  value: string
  valueVariant?: 'brand' | 'accent'
  small?: boolean
  delta: string
  tone: 'neutral' | 'pos' | 'accent'
}

export interface DayBar {
  day: string
  forecast: number
  actual: number
  actualHighlight?: boolean
}

export interface SingleBar {
  day: string
  height: number
  variant: 'soft' | 'brand' | 'accent'
}

export interface ShiftPerson {
  name: string
  role: string
  color: 'warm' | 'pos' | 'brand'
}

export interface ProgressItem {
  name: string
  status: string
  percent: number
  color: 'accent' | 'warm' | 'pos'
}

export interface RotaRow {
  name: string
  left: number
  width: number
  color: 'warm' | 'pos' | 'accent' | 'brand'
}

export interface ReportBand {
  title: string
  subtitle: string
  pill: string
}

export interface DashboardShowcase {
  overviewKpis: KpiTile[]
  overviewChart: DayBar[]
  onShift: ShiftPerson[]
  stockAlerts: ProgressItem[]

  forecastKpis: KpiTile[]
  forecastChart: SingleBar[]

  staffKpis: KpiTile[]
  rota: RotaRow[]

  stockKpis: KpiTile[]
  stockLevels: ProgressItem[]

  reportsKpis: KpiTile[]
  reportBand: ReportBand
}

// --- Page builder blocks ---

export interface HeroSlide {
  image: SeoImage
  caption?: string
}

/** Per-instance design overrides for blocks with a themeable section identity (see docs/page-builder-spec.md phase 2). */
export interface BlockDesign {
  headingFont?: 'display' | 'body'
  headingScale?: 's' | 'm' | 'l'
  padding?: 'compact' | 'standard' | 'roomy'
  paletteRole?: 'surface' | 'white' | 'brand' | 'accent'
  fullBleed?: boolean
}

export interface HeroCarouselBlock {
  _type: 'heroCarouselBlock'
  _key: string
  eyebrow?: string
  overlayHeading?: string
  overlaySubhead?: string
  slides: HeroSlide[]
  design?: BlockDesign
}

export interface TextBlockData {
  _type: 'textBlock'
  _key: string
  heading?: string
  body: PortableTextBlock[]
  design?: BlockDesign
}

export interface SideBySideBlock {
  _type: 'sideBySideBlock'
  _key: string
  image: SeoImage
  imagePosition: 'left' | 'right'
  heading: string
  body?: PortableTextBlock[]
  design?: BlockDesign
}

export interface GalleryImage {
  image: SeoImage
  caption?: string
}

export interface ImageGalleryBlock {
  _type: 'imageGalleryBlock'
  _key: string
  heading?: string
  layout?: 'Grid' | 'Mosaic' | 'Filmstrip'
  images: GalleryImage[]
}

export interface SocialLinksBlockData {
  _type: 'socialLinksBlock'
  _key: string
  heading?: string
  links: SocialLink[]
}

export interface LiveVideoBlock {
  _type: 'liveVideoBlock'
  _key: string
  title?: string
  embedUrl?: string
  posterImage?: SeoImage
  offlineMessage?: string
}

export interface BackgroundVideoBlock {
  _type: 'backgroundVideoBlock'
  _key: string
  eyebrow?: string
  heading?: string
  subhead?: string
  primaryCta?: string
  secondaryCta?: string
  video: string
  posterImage: SeoImage
  loop?: boolean
  muted?: boolean
  videoHeight?: 'Full screen' | 'Three-quarter'
  overlayCopy?: boolean
  scrim?: boolean
  menuOverlay?: boolean
  overlayPreset?: 'Full' | 'Minimal'
  scrollCue?: boolean
}

export interface RoiBenchmarkBand {
  _key: string
  label?: string
  range?: string
}

export interface RoiCalculatorBlock {
  _type: 'roiCalculatorBlock'
  _key: string
  eyebrow?: string
  heading?: string
  subhead?: string
  currency?: 'EUR €' | 'GBP £' | 'USD $'
  defaultMonthlySales?: number
  defaultStockPct?: number
  defaultStaffPct?: number
  defaultOnlinePct?: number
  defaultPhoneCalls?: number
  benchmarks?: RoiBenchmarkBand[]
  voiceEnabled?: boolean
  consultationHeading?: string
  exportLabel?: string
  disclaimer?: string
}

export interface LogoStripBlock {
  _type: 'logoStripBlock'
  _key: string
  heading?: string
  logos: ClientLogo[]
}

export interface CtaBannerBlock {
  _type: 'ctaBannerBlock'
  _key: string
  heading: string
  subhead?: string
  buttonLabel: string
  buttonHref?: string
  design?: BlockDesign
}

export interface RichHeroBlock {
  _type: 'richHeroBlock'
  _key: string
  eyebrow?: string
  headlineBefore?: string
  headlineHighlight?: string
  subhead?: string
  primaryCta?: string
  secondaryCta?: string
  secondaryHref?: string
  heroStats?: StatBadge[]
  design?: BlockDesign
}

export interface SimpleHeroBlock {
  _type: 'simpleHeroBlock'
  _key: string
  eyebrow?: string
  headlineBefore?: string
  headlineHighlight?: string
  subhead?: string
  headlineClamp?: string
  design?: BlockDesign
}

export interface AboutSectionBlock {
  _type: 'aboutSectionBlock'
  _key: string
  eyebrow?: string
  headlineBefore?: string
  headlineHighlight?: string
  headlineAfter?: string
  body?: string
  pipeline?: AboutPipeline
  design?: BlockDesign
}

export interface DashboardShowcaseBlock {
  _type: 'dashboardShowcaseBlock'
  _key: string
  showcase?: DashboardShowcase
  design?: BlockDesign
}

export interface ServicesGridBlock {
  _type: 'servicesGridBlock'
  _key: string
  eyebrow?: string
  headline?: string
  services?: ServiceCard[]
  design?: BlockDesign
}

export interface StatsBandBlock {
  _type: 'statsBandBlock'
  _key: string
  eyebrow?: string
  headline?: string
  stats?: ResultStat[]
  design?: BlockDesign
}

export interface ContactFormBlock {
  _type: 'contactFormBlock'
  _key: string
  headline: string
  subhead?: string
  design?: BlockDesign
}

export interface PipelineStripBlock {
  _type: 'pipelineStripBlock'
  _key: string
  channelsLabel?: string
  channelsItems?: IconTile[]
  menuManagerIcon?: string
  menuManagerTitle?: string
  menuManagerSub?: string
  maistroIcon?: string
  maistroTitle?: string
  maistroSub?: string
  outcomesLabel?: string
  outcomesItems?: IconTile[]
  design?: BlockDesign
}

export interface ModuleDeepDiveListBlock {
  _type: 'moduleDeepDiveListBlock'
  _key: string
  eyebrow?: string
  headline?: string
  modules?: ModuleDeepDive[]
  design?: BlockDesign
}

export interface IntegrationsBlock {
  _type: 'integrationsBlock'
  _key: string
  eyebrow?: string
  headline?: string
  integrations?: string[]
  design?: BlockDesign
}

export interface FeaturedCaseStudyBlock {
  _type: 'featuredCaseStudyBlock'
  _key: string
  eyebrow?: string
  headline?: string
  body?: string
  quote?: string
  author?: string
  heroStat?: Stat
  stats?: Stat[]
  design?: BlockDesign
}

export interface TestimonialGridBlock {
  _type: 'testimonialGridBlock'
  _key: string
  eyebrow?: string
  headline?: string
  testimonials?: Testimonial[]
  design?: BlockDesign
}

export interface NewsGridBlock {
  _type: 'newsGridBlock'
  _key: string
}

export type PageBlock =
  | HeroCarouselBlock
  | TextBlockData
  | SideBySideBlock
  | ImageGalleryBlock
  | SocialLinksBlockData
  | LiveVideoBlock
  | BackgroundVideoBlock
  | RoiCalculatorBlock
  | LogoStripBlock
  | CtaBannerBlock
  | RichHeroBlock
  | SimpleHeroBlock
  | AboutSectionBlock
  | DashboardShowcaseBlock
  | ServicesGridBlock
  | StatsBandBlock
  | ContactFormBlock
  | PipelineStripBlock
  | ModuleDeepDiveListBlock
  | IntegrationsBlock
  | FeaturedCaseStudyBlock
  | TestimonialGridBlock
  | NewsGridBlock

export interface Page {
  title: string
  slug: string
  navLabel?: string
  showInMenu: boolean
  menuOrder?: number
  blocks: PageBlock[]
  seo?: Seo
}
