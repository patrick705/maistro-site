import { defineField, defineType } from 'sanity'

export const singleBar = defineType({
  name: 'singleBar',
  title: 'Forecast bar',
  type: 'object',
  fields: [
    defineField({ name: 'day', title: 'Day label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'height', title: 'Bar height (px)', type: 'number', validation: (r) => r.required() }),
    defineField({
      name: 'variant',
      title: 'Colour',
      type: 'string',
      options: {
        list: [
          { title: 'Soft (default)', value: 'soft' },
          { title: 'Brand', value: 'brand' },
          { title: 'Accent', value: 'accent' },
        ],
      },
      initialValue: 'soft',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'day', subtitle: 'variant' },
  },
})
