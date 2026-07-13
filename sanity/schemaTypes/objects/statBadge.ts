import { defineField, defineType } from 'sanity'
import { colorVariantField } from './colorVariant'

export const statBadge = defineType({
  name: 'statBadge',
  title: 'Stat badge',
  type: 'object',
  fields: [
    defineField({ name: 'value', title: 'Value', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    colorVariantField,
  ],
  preview: {
    select: { title: 'value', subtitle: 'label' },
  },
})
