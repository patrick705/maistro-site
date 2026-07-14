import { defineField, defineType } from 'sanity'

export const newsPage = defineType({
  name: 'newsPage',
  title: 'News Page',
  type: 'document',
  fields: [
    defineField({ name: 'heroEyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'heroHeadlineBefore', title: 'Headline (before highlight)', type: 'string' }),
    defineField({ name: 'heroHeadlineHighlight', title: 'Headline highlight', type: 'string' }),
    defineField({ name: 'heroSubhead', title: 'Subhead', type: 'text', rows: 3 }),
  ],
  preview: {
    prepare() {
      return { title: 'News Page' }
    },
  },
})
