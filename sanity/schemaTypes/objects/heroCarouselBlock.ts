import { defineField, defineType } from 'sanity'

export const heroCarouselBlock = defineType({
  name: 'heroCarouselBlock',
  title: 'Hero / Carousel',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'overlayHeading', title: 'Overlay heading', type: 'string' }),
    defineField({ name: 'overlaySubhead', title: 'Overlay subtext', type: 'text', rows: 2 }),
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      validation: (r) => r.min(1),
      of: [
        {
          type: 'object',
          name: 'slide',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (r) => r.required(),
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alternative text',
                  type: 'string',
                  validation: (r) => r.required(),
                }),
              ],
            }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
          preview: {
            select: { title: 'caption', media: 'image' },
            prepare({ title, media }) {
              return { title: title || 'Slide', media }
            },
          },
        },
      ],
    }),
    defineField({ name: 'design', title: 'Design', type: 'blockDesign' }),
  ],
  preview: {
    select: { title: 'overlayHeading', media: 'slides.0.image' },
    prepare({ title, media }) {
      return { title: title || 'Hero / Carousel', media }
    },
  },
})
