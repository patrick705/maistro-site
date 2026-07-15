import type { PortableTextBlock } from '@portabletext/types'

export type ColorVariant = 'brand' | 'warm' | 'pos' | 'accent'

export type PaletteName =
  | 'Violet'
  | 'Ink & Terracotta'
  | 'Plum & Peach'
  | 'Forest & Clay'
  | 'Brazil'

export interface NavItem {
  label: string
  href: string
}

export interface SiteTheme {
  palette: PaletteName
  playful: boolean
  showResults: boolean
}

export interface SiteSettings {
  siteName: string
  navItems: NavItem[]
  ctaLabel: string
  footerText: string
  gtmContainerId?: string
  theme: SiteTheme
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

export interface ProductPage {
  heroEyebrow: string
  heroHeadlineBefore: string
  heroHeadlineHighlight: string
  heroSubhead: string
  heroPrimaryCta: string
  heroSecondaryCta: string
  heroStats: StatBadge[]

  channelsLabel: string
  channelsItems: IconTile[]
  menuManagerIcon: string
  menuManagerTitle: string
  menuManagerSub: string
  maistroIcon: string
  maistroTitle: string
  maistroSub: string
  outcomesLabel: string
  outcomesItems: IconTile[]

  modulesEyebrow: string
  modulesHeadline: string
  modules: ModuleDeepDive[]

  integrationsEyebrow: string
  integrationsHeadline: string
  integrations: string[]

  ctaHeadline: string
  ctaSubhead: string
  ctaButtonLabel: string

  seo?: Seo
}

export interface CustomersPage {
  heroEyebrow: string
  heroHeadlineBefore: string
  heroHeadlineHighlight: string
  heroSubhead: string

  logos: ClientLogo[]

  caseStudyEyebrow: string
  caseStudyHeadline: string
  caseStudyBody: string
  caseStudyQuote: string
  caseStudyAuthor: string
  caseStudyHeroStat: Stat
  caseStudyStats: Stat[]

  testimonialsEyebrow: string
  testimonialsHeadline: string
  testimonials: Testimonial[]

  ctaHeadline: string
  ctaSubhead: string
  ctaButtonLabel: string

  seo?: Seo
}

export interface NewsPage {
  heroEyebrow: string
  heroHeadlineBefore: string
  heroHeadlineHighlight: string
  heroSubhead: string

  seo?: Seo
}

export interface HomePage {
  heroEyebrow: string
  heroHeadlineBefore: string
  heroHeadlineHighlight: string
  heroSubhead: string
  heroPrimaryCta: string
  heroSecondaryCta: string
  heroStats: StatBadge[]

  aboutEyebrow: string
  aboutHeadlineBefore: string
  aboutHeadlineHighlight: string
  aboutHeadlineAfter: string
  aboutBody: string
  aboutPipeline: AboutPipeline

  servicesEyebrow: string
  servicesHeadline: string
  services: ServiceCard[]

  resultsEyebrow: string
  resultsHeadline: string
  resultStats: ResultStat[]

  contactHeadline: string
  contactSubhead: string

  demoModal: DemoModalContent

  seo?: Seo
}
