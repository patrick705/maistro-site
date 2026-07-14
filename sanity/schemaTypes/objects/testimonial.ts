import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'object',
  fields: [
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'author', title: 'Author name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({ name: 'venue', title: 'Venue / company', type: 'string', validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'venue' },
  },
})
