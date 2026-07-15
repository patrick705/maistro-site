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
import { seo } from './seo'

import { siteSettings } from './siteSettings'
import { homePage } from './homePage'
import { productPage } from './productPage'
import { customersPage } from './customersPage'
import { newsPage } from './newsPage'
import { newsArticle } from './newsArticle'
import { lead } from './lead'

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
  seo,
  // documents
  siteSettings,
  homePage,
  productPage,
  customersPage,
  newsPage,
  newsArticle,
  lead,
]
