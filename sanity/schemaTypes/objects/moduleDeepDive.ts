import { defineField, defineType } from 'sanity'

export const moduleDeepDive = defineType({
  name: 'moduleDeepDive',
  title: 'Module deep-dive',
  type: 'object',
  fields: [
    defineField({ name: 'icon', title: 'Icon (emoji)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'eyebrow', title: 'Module name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Body copy', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'bullets', title: 'Feature bullets', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'widget',
      title: 'Illustration',
      type: 'string',
      description: 'Which static illustrated mockup to show next to this module.',
      options: {
        list: [
          { title: 'Rota', value: 'rota' },
          { title: 'Stock levels', value: 'stock' },
          { title: 'Voice call', value: 'voice' },
          { title: 'Forecast chart', value: 'forecast' },
          { title: 'Report tiles', value: 'reports' },
        ],
      },
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'eyebrow', subtitle: 'headline' },
  },
})
