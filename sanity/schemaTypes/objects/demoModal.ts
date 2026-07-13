import { defineField, defineType } from 'sanity'

export const demoModalContent = defineType({
  name: 'demoModalContent',
  title: 'Book-a-demo modal',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'subhead', title: 'Subhead', type: 'text', rows: 2 }),
    defineField({ name: 'successHeadline', title: 'Success headline', type: 'string' }),
    defineField({ name: 'successBody', title: 'Success body', type: 'text', rows: 2 }),
  ],
})
