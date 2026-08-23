import { defineField, defineType } from 'sanity'

export const featuredCaseStudyBlock = defineType({
  name: 'featuredCaseStudyBlock',
  title: 'Featured Case Study',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'body', title: 'Body copy', type: 'text', rows: 3 }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 2 }),
    defineField({ name: 'author', title: 'Quote author', type: 'string' }),
    defineField({
      name: 'heroStat',
      title: 'Headline stat',
      type: 'object',
      fields: [
        defineField({ name: 'value', title: 'Value', type: 'string' }),
        defineField({ name: 'label', title: 'Label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Supporting stats',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'caseStudyStat',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
      validation: (r) => r.max(2),
    }),
    defineField({ name: 'design', title: 'Design', type: 'blockDesign' }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'eyebrow' },
    prepare({ title, subtitle }) {
      return { title: title || 'Featured Case Study', subtitle }
    },
  },
})
