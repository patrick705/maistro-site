import { defineField, defineType } from 'sanity'
import { colorVariantField } from './colorVariant'

export const serviceCard = defineType({
  name: 'serviceCard',
  title: 'Service card',
  type: 'object',
  fields: [
    defineField({ name: 'icon', title: 'Icon (emoji)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({
      name: 'bullets',
      title: 'Feature bullets',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Leave empty to render the short card style (no bullet list), like Voice Ordering.',
    }),
    colorVariantField,
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
})
