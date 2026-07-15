import { defineField, defineType } from 'sanity'

export const dayBar = defineType({
  name: 'dayBar',
  title: 'Forecast vs actual bar',
  type: 'object',
  fields: [
    defineField({ name: 'day', title: 'Day label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'forecast', title: 'Forecast bar height (px)', type: 'number', validation: (r) => r.required() }),
    defineField({ name: 'actual', title: 'Actual bar height (px)', type: 'number', validation: (r) => r.required() }),
    defineField({ name: 'actualHighlight', title: 'Highlight actual bar (accent colour)', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'day', subtitle: 'actual' },
  },
})
