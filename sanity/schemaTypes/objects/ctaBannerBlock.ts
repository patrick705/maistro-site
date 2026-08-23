import { defineField, defineType } from 'sanity'

export const ctaBannerBlock = defineType({
  name: 'ctaBannerBlock',
  title: 'CTA Banner',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'subhead', title: 'Subhead', type: 'text', rows: 2 }),
    defineField({ name: 'buttonLabel', title: 'Button label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'buttonHref',
      title: 'Button link',
      type: 'string',
      description:
        'A path on this site (e.g. /product) or an external https:// URL. Leave empty to open the book-a-demo modal instead.',
    }),
    defineField({ name: 'design', title: 'Design', type: 'blockDesign' }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'buttonLabel' },
    prepare({ title, subtitle }) {
      return { title: title || 'CTA Banner', subtitle }
    },
  },
})
