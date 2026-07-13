import { defineField, defineType } from 'sanity'
import { colorVariantField } from './colorVariant'

export const resultStat = defineType({
  name: 'resultStat',
  title: 'Result stat',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'prefix',
      title: 'Prefix (optional)',
      type: 'string',
      description: 'e.g. "up to" before the value.',
    }),
    defineField({ name: 'value', title: 'Value', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    colorVariantField,
  ],
  preview: {
    select: { title: 'value', subtitle: 'label' },
  },
})
