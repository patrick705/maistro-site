import { defineField, defineType } from 'sanity'

export const scrollGalleryBlock = defineType({
  name: 'scrollGalleryBlock',
  title: 'Scroll Gallery',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'tiles',
      title: 'Tiles',
      description: 'Full-bleed horizontal scrolling strip. The first tile renders wider than the rest.',
      type: 'array',
      of: [{ type: 'mediaTile' }],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: 'heading', count: 'tiles.length' },
    prepare({ title, count }) {
      return { title: title || 'Scroll Gallery', subtitle: count ? `${count} tile(s)` : undefined }
    },
  },
})
