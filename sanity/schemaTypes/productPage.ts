import { defineField, defineType } from 'sanity'

export const productPage = defineType({
  name: 'productPage',
  title: 'Product Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'pipeline', title: 'Pipeline strip' },
    { name: 'modules', title: 'Modules' },
    { name: 'integrations', title: 'Integrations' },
    { name: 'cta', title: 'CTA' },
  ],
  fields: [
    // Hero
    defineField({ name: 'heroEyebrow', title: 'Eyebrow', type: 'string', group: 'hero' }),
    defineField({ name: 'heroHeadlineBefore', title: 'Headline (before highlight)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroHeadlineHighlight', title: 'Headline highlight', type: 'string', group: 'hero' }),
    defineField({ name: 'heroSubhead', title: 'Subhead', type: 'text', rows: 3, group: 'hero' }),
    defineField({ name: 'heroPrimaryCta', title: 'Primary CTA label', type: 'string', group: 'hero' }),
    defineField({
      name: 'heroSecondaryCta',
      title: 'Secondary CTA label',
      type: 'string',
      description: 'Links to the modules section further down the page.',
      group: 'hero',
    }),
    defineField({
      name: 'heroStats',
      title: 'Hero stat badges (optional)',
      type: 'array',
      of: [{ type: 'statBadge' }],
      group: 'hero',
      validation: (r) => r.max(3),
    }),

    // Pipeline strip
    defineField({ name: 'channelsLabel', title: 'Channels column label', type: 'string', group: 'pipeline' }),
    defineField({
      name: 'channelsItems',
      title: 'Channel tiles',
      type: 'array',
      of: [{ type: 'iconTile' }],
      group: 'pipeline',
    }),
    defineField({ name: 'menuManagerIcon', title: 'Menu Manager icon', type: 'string', group: 'pipeline' }),
    defineField({ name: 'menuManagerTitle', title: 'Menu Manager title', type: 'string', group: 'pipeline' }),
    defineField({ name: 'menuManagerSub', title: 'Menu Manager sub-copy', type: 'string', group: 'pipeline' }),
    defineField({ name: 'maistroIcon', title: 'Maistro icon', type: 'string', group: 'pipeline' }),
    defineField({ name: 'maistroTitle', title: 'Maistro title', type: 'string', group: 'pipeline' }),
    defineField({ name: 'maistroSub', title: 'Maistro sub-copy', type: 'string', group: 'pipeline' }),
    defineField({ name: 'outcomesLabel', title: 'Outcomes column label', type: 'string', group: 'pipeline' }),
    defineField({
      name: 'outcomesItems',
      title: 'Outcome tiles',
      type: 'array',
      of: [{ type: 'iconTile' }],
      group: 'pipeline',
    }),

    // Modules
    defineField({ name: 'modulesEyebrow', title: 'Eyebrow', type: 'string', group: 'modules' }),
    defineField({ name: 'modulesHeadline', title: 'Headline', type: 'string', group: 'modules' }),
    defineField({
      name: 'modules',
      title: 'Module deep-dives',
      type: 'array',
      of: [{ type: 'moduleDeepDive' }],
      group: 'modules',
    }),

    // Integrations
    defineField({ name: 'integrationsEyebrow', title: 'Eyebrow', type: 'string', group: 'integrations' }),
    defineField({ name: 'integrationsHeadline', title: 'Headline', type: 'string', group: 'integrations' }),
    defineField({
      name: 'integrations',
      title: 'Integration pills',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'integrations',
    }),

    // Closing CTA
    defineField({ name: 'ctaHeadline', title: 'Headline', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaSubhead', title: 'Subhead', type: 'text', rows: 2, group: 'cta' }),
    defineField({ name: 'ctaButtonLabel', title: 'Button label', type: 'string', group: 'cta' }),
  ],
  preview: {
    prepare() {
      return { title: 'Product Page' }
    },
  },
})
