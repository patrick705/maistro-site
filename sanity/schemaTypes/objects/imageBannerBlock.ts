import { defineField, defineType } from 'sanity'

export const imageBannerBlock = defineType({
  name: 'imageBannerBlock',
  title: 'Image Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Background image',
      description: 'Full-bleed background image with a dark scrim and centered copy.',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
      fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: (r) => r.required() })],
    }),
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'heading', title: 'Headline', type: 'string' }),
    defineField({ name: 'subhead', title: 'Subhead', type: 'text', rows: 2 }),
    defineField({ name: 'buttonLabel', title: 'Button label', type: 'string' }),
    defineField({
      name: 'buttonHref',
      title: 'Button link',
      type: 'string',
      description: 'A path on this site or an external https:// URL. Leave empty to open the book-a-demo modal.',
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Image Banner', media }
    },
  },
})
