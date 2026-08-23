import { defineField, defineType } from 'sanity'

export const simpleHeroBlock = defineType({
  name: 'simpleHeroBlock',
  title: 'Hero (simple)',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'headlineBefore', title: 'Headline (before highlight)', type: 'string' }),
    defineField({ name: 'headlineHighlight', title: 'Headline highlight', type: 'string' }),
    defineField({ name: 'subhead', title: 'Subhead', type: 'text', rows: 3 }),
    defineField({
      name: 'headlineClamp',
      title: 'Headline font-size (CSS clamp, optional)',
      type: 'string',
      description: 'e.g. clamp(40px, 10vw, 80px). Leave empty for the default size.',
    }),
    defineField({ name: 'design', title: 'Design', type: 'blockDesign' }),
  ],
  preview: {
    select: { title: 'headlineBefore', subtitle: 'eyebrow' },
    prepare({ title, subtitle }) {
      return { title: title || 'Hero (simple)', subtitle }
    },
  },
})
