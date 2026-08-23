import { defineField, defineType } from 'sanity'

export const statsBandBlock = defineType({
  name: 'statsBandBlock',
  title: 'Stats Band',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'stats', title: 'Stats', type: 'array', of: [{ type: 'resultStat' }] }),
    defineField({ name: 'design', title: 'Design', type: 'blockDesign' }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'eyebrow' },
    prepare({ title, subtitle }) {
      return { title: title || 'Stats Band', subtitle }
    },
  },
})
