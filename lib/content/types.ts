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
  theme: SiteTheme
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
}
