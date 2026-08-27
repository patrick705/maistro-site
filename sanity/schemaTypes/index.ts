import type { SchemaTypeDefinition } from 'sanity'

import { navItem } from './objects/navItem'
import { statBadge } from './objects/statBadge'
import { serviceCard } from './objects/serviceCard'
import { resultStat } from './objects/resultStat'
import { pipelineOutput } from './objects/pipelineOutput'
import { aboutPipeline } from './objects/aboutPipeline'
import { demoModalContent } from './objects/demoModal'
import { testimonial } from './objects/testimonial'
import { iconTile } from './objects/iconTile'
import { moduleDeepDive } from './objects/moduleDeepDive'
import { clientLogo } from './objects/clientLogo'
import { kpiTile } from './objects/kpiTile'
import { dayBar } from './objects/dayBar'
import { singleBar } from './objects/singleBar'
import { shiftPerson } from './objects/shiftPerson'
import { progressItem } from './objects/progressItem'
import { rotaRow } from './objects/rotaRow'
import { dashboardShowcase } from './objects/dashboardShowcase'
import { blockDesign } from './objects/blockDesign'
import { seo } from './seo'
import { socialLink } from './objects/socialLink'
import { heroCarouselBlock } from './objects/heroCarouselBlock'
import { textBlock } from './objects/textBlock'
import { sideBySideBlock } from './objects/sideBySideBlock'
import { imageGalleryBlock } from './objects/imageGalleryBlock'
import { socialLinksBlock } from './objects/socialLinksBlock'
import { liveVideoBlock } from './objects/liveVideoBlock'
import { backgroundVideoBlock } from './objects/backgroundVideoBlock'
import { roiCalculatorBlock } from './objects/roiCalculatorBlock'
import { logoStripBlock } from './objects/logoStripBlock'
import { ctaBannerBlock } from './objects/ctaBannerBlock'
import { richHeroBlock } from './objects/richHeroBlock'
import { simpleHeroBlock } from './objects/simpleHeroBlock'
import { aboutSectionBlock } from './objects/aboutSectionBlock'
import { dashboardShowcaseBlock } from './objects/dashboardShowcaseBlock'
import { servicesGridBlock } from './objects/servicesGridBlock'
import { statsBandBlock } from './objects/statsBandBlock'
import { contactFormBlock } from './objects/contactFormBlock'
import { pipelineStripBlock } from './objects/pipelineStripBlock'
import { moduleDeepDiveListBlock } from './objects/moduleDeepDiveListBlock'
import { integrationsBlock } from './objects/integrationsBlock'
import { featuredCaseStudyBlock } from './objects/featuredCaseStudyBlock'
import { testimonialGridBlock } from './objects/testimonialGridBlock'
import { newsGridBlock } from './objects/newsGridBlock'

import { siteSettings } from './siteSettings'
import { newsArticle } from './newsArticle'
import { page } from './page'
import { lead } from './lead'
import { brandPalette } from './brandPalette'

export const schemaTypes: SchemaTypeDefinition[] = [
  // objects
  navItem,
  statBadge,
  serviceCard,
  resultStat,
  pipelineOutput,
  aboutPipeline,
  demoModalContent,
  testimonial,
  iconTile,
  moduleDeepDive,
  clientLogo,
  kpiTile,
  dayBar,
  singleBar,
  shiftPerson,
  progressItem,
  rotaRow,
  dashboardShowcase,
  blockDesign,
  seo,
  socialLink,
  heroCarouselBlock,
  textBlock,
  sideBySideBlock,
  imageGalleryBlock,
  socialLinksBlock,
  liveVideoBlock,
  backgroundVideoBlock,
  roiCalculatorBlock,
  logoStripBlock,
  ctaBannerBlock,
  richHeroBlock,
  simpleHeroBlock,
  aboutSectionBlock,
  dashboardShowcaseBlock,
  servicesGridBlock,
  statsBandBlock,
  contactFormBlock,
  pipelineStripBlock,
  moduleDeepDiveListBlock,
  integrationsBlock,
  featuredCaseStudyBlock,
  testimonialGridBlock,
  newsGridBlock,
  // documents
  siteSettings,
  newsArticle,
  page,
  lead,
  brandPalette,
]
