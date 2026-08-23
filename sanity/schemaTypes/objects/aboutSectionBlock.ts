import { defineField, defineType } from 'sanity'

export const aboutSectionBlock = defineType({
  name: 'aboutSectionBlock',
  title: 'About Section',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'headlineBefore', title: 'Headline (before highlight)', type: 'text', rows: 2 }),
    defineField({ name: 'headlineHighlight', title: 'Headline highlight', type: 'string' }),
    defineField({ name: 'headlineAfter', title: 'Headline (after highlight)', type: 'text', rows: 2 }),
    defineField({ name: 'body', title: 'Body copy', type: 'text', rows: 4 }),
    defineField({ name: 'pipeline', title: 'Diagram', type: 'aboutPipeline' }),
    defineField({ name: 'design', title: 'Design', type: 'blockDesign' }),
  ],
  preview: {
    select: { title: 'headlineBefore', subtitle: 'eyebrow' },
    prepare({ title, subtitle }) {
      return { title: title || 'About Section', subtitle }
    },
  },
})
