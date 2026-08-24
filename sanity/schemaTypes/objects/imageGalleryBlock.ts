import { defineField, defineType } from 'sanity'

export const imageGalleryBlock = defineType({
  name: 'imageGalleryBlock',
  title: 'Image Gallery',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['Grid', 'Mosaic', 'Filmstrip'] },
      initialValue: 'Grid',
      description: 'Grid: even tiles. Mosaic: a large lead tile plus a wide tile mid-grid. Filmstrip: a horizontal run with a wider opening frame.',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      validation: (r) => r.min(1),
      of: [
        {
          type: 'object',
          name: 'galleryImage',
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
              return { title: title || 'Image', media }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'images.0.image' },
    prepare({ title, media }) {
      return { title: title || 'Image Gallery', media }
    },
  },
})
