import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, projectId } from './lib/sanity/env'
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

export default defineConfig({
  name: 'maistro',
  title: 'Maistro',

  projectId: projectId || 'placeholder',
  dataset,

  basePath: '/studio',

  schema: { types: schemaTypes },

  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
})
