import type { SchemaTypeDefinition } from 'sanity'

import { navItem } from './objects/navItem'
import { statBadge } from './objects/statBadge'
import { serviceCard } from './objects/serviceCard'
import { resultStat } from './objects/resultStat'
import { pipelineOutput } from './objects/pipelineOutput'
import { aboutPipeline } from './objects/aboutPipeline'
import { demoModalContent } from './objects/demoModal'

import { siteSettings } from './siteSettings'
import { homePage } from './homePage'
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
  // documents
  siteSettings,
  homePage,
  lead,
]
