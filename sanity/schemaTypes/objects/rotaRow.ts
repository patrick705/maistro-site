import { defineField, defineType } from 'sanity'

export const rotaRow = defineType({
  name: 'rotaRow',
  title: 'Rota row',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'left', title: 'Bar start (% of day)', type: 'number', validation: (r) => r.required().min(0).max(100) }),
    defineField({ name: 'width', title: 'Bar width (% of day)', type: 'number', validation: (r) => r.required().min(0).max(100) }),
    defineField({
      name: 'color',
      title: 'Bar colour',
      type: 'string',
      options: {
        list: [
          { title: 'Warm', value: 'warm' },
          { title: 'Positive', value: 'pos' },
          { title: 'Accent', value: 'accent' },
          { title: 'Brand', value: 'brand' },
        ],
      },
      initialValue: 'brand',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'name' },
  },
})
