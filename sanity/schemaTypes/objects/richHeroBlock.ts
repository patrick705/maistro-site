import { defineField, defineType } from 'sanity'

export const richHeroBlock = defineType({
  name: 'richHeroBlock',
  title: 'Hero (rich)',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'headlineBefore', title: 'Headline (before highlight)', type: 'string' }),
    defineField({ name: 'headlineHighlight', title: 'Headline highlight', type: 'string' }),
    defineField({ name: 'subhead', title: 'Subhead', type: 'text', rows: 3 }),
    defineField({ name: 'primaryCta', title: 'Primary CTA label', type: 'string' }),
    defineField({ name: 'secondaryCta', title: 'Secondary CTA label', type: 'string' }),
    defineField({
      name: 'secondaryHref',
      title: 'Secondary CTA link',
      type: 'string',
      description: 'e.g. #modules to scroll to a section further down this page. Defaults to "#".',
    }),
    defineField({
      name: 'heroStats',
      title: 'Stat badges (optional)',
      type: 'array',
      of: [{ type: 'statBadge' }],
      validation: (r) => r.max(3),
    }),
    defineField({ name: 'design', title: 'Design', type: 'blockDesign' }),
  ],
  preview: {
    select: { title: 'headlineBefore', subtitle: 'eyebrow' },
    prepare({ title, subtitle }) {
      return { title: title || 'Hero (rich)', subtitle }
    },
  },
})
