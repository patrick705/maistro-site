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
