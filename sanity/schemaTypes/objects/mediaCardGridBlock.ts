import { defineField, defineType } from 'sanity'

export const mediaCardGridBlock = defineType({
  name: 'mediaCardGridBlock',
  title: 'Media Card Grid',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'tiles',
      title: 'Tiles',
      description: 'Uniform grid of equally-sized tiles — no featured tile.',
      type: 'array',
      of: [{ type: 'mediaTile' }],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: 'heading', count: 'tiles.length' },
    prepare({ title, count }) {
      return { title: title || 'Media Card Grid', subtitle: count ? `${count} tile(s)` : undefined }
    },
  },
})
