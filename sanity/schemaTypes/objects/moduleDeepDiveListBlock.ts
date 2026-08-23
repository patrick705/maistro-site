import { defineField, defineType } from 'sanity'

export const moduleDeepDiveListBlock = defineType({
  name: 'moduleDeepDiveListBlock',
  title: 'Module Deep-Dives',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'modules', title: 'Module deep-dives', type: 'array', of: [{ type: 'moduleDeepDive' }] }),
    defineField({ name: 'design', title: 'Design', type: 'blockDesign' }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'eyebrow' },
    prepare({ title, subtitle }) {
      return { title: title || 'Module Deep-Dives', subtitle }
    },
  },
})
