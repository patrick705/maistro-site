import { defineField, defineType } from 'sanity'

export const mediaMosaicBlock = defineType({
  name: 'mediaMosaicBlock',
  title: 'Media Mosaic',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'tiles',
      title: 'Tiles',
      description: '3-column grid — the first tile spans 2×2 as a featured image or video, the rest are uniform.',
      type: 'array',
      of: [{ type: 'mediaTile' }],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: 'heading', count: 'tiles.length' },
    prepare({ title, count }) {
      return { title: title || 'Media Mosaic', subtitle: count ? `${count} tile(s)` : undefined }
    },
  },
})
