import { defineField, defineType } from 'sanity'

export const multiImageBannerBlock = defineType({
  name: 'multiImageBannerBlock',
  title: 'Multi-Image Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      description: 'Full-bleed equal-width row of images with a dark scrim and centered copy over the top.',
      type: 'array',
      validation: (r) => r.min(2),
      of: [
        {
          type: 'object',
          name: 'bannerImage',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (r) => r.required(),
              fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: (r) => r.required() })],
            }),
          ],
          preview: { select: { media: 'image' }, prepare: ({ media }) => ({ title: 'Image', media }) },
        },
      ],
    }),
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'heading', title: 'Headline', type: 'string' }),
  ],
  preview: {
    select: { title: 'heading', media: 'images.0.image' },
    prepare({ title, media }) {
      return { title: title || 'Multi-Image Banner', media }
    },
  },
})
