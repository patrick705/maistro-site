import { defineField, defineType } from 'sanity'

export const kpiTile = defineType({
  name: 'kpiTile',
  title: 'KPI tile',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'value', title: 'Value', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'valueVariant',
      title: 'Value colour (optional)',
      type: 'string',
      options: { list: [{ title: 'Brand', value: 'brand' }, { title: 'Accent', value: 'accent' }] },
    }),
    defineField({ name: 'small', title: 'Render value in smaller size', type: 'boolean', initialValue: false }),
    defineField({ name: 'delta', title: 'Delta / context text', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'tone',
      title: 'Delta tone',
      type: 'string',
      options: { list: [{ title: 'Neutral', value: 'neutral' }, { title: 'Positive', value: 'pos' }, { title: 'Accent', value: 'accent' }] },
      initialValue: 'neutral',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'value' },
  },
})
