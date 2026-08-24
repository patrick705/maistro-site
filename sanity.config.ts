import { defineConfig } from 'sanity'
import type { ToolMenuProps } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, projectId } from './lib/sanity/env'
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'
import { KitchenTool } from './sanity/kitchen/KitchenTool'

export default defineConfig({
  name: 'maistro',
  title: 'Maistro',

  // Two different bundlers read this file: the Sanity CLI's own build (for
  // the standalone `sanity deploy`) only inlines `SANITY_STUDIO_*`-prefixed
  // vars, while Next.js's bundler (for the embedded /studio route) only
  // inlines `NEXT_PUBLIC_*`-prefixed ones. Whichever bundler doesn't
  // recognize its variable leaves it undefined at runtime, so the fallback
  // chain lets each build pick up the value its own convention exposes.
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || projectId || 'placeholder',
  dataset: process.env.SANITY_STUDIO_DATASET || dataset || 'production',

  basePath: '/studio',

  schema: { types: schemaTypes },

  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],

  // Kitchen CMS is the primary editing surface; the default structure tool
  // stays registered as a fallback escape hatch for anything the bespoke
  // Kitchen views don't cover yet (see docs/page-builder-spec.md follow-up) —
  // reachable via the "Default Studio view" link in Kitchen's own sidebar,
  // at /studio/structure, even though it's hidden from the tool switcher below.
  tools: (prev) => [{ name: 'kitchen', title: 'Kitchen CMS', component: KitchenTool }, ...prev],

  // Kitchen is a full replacement UI with its own header — the native
  // tool-switcher row is dead weight above it. Sanity collapses the tool menu
  // to nothing once only one tool remains, so this shrinks the navbar down to
  // its minimum instead of just hiding buttons.
  studio: {
    components: {
      toolMenu: (props: ToolMenuProps) => props.renderDefault({ ...props, tools: props.tools.filter((t) => t.name === 'kitchen') }),
    },
  },
})
