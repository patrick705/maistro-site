import { defineField, defineType } from 'sanity'

export const mediaTile = defineType({
  name: 'mediaTile',
  title: 'Media tile',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: ['image', 'video'] },
      initialValue: 'image',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => (parent as { type?: string } | undefined)?.type !== 'image',
      fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string' })],
    }),
    defineField({
      name: 'video',
      title: 'Video file',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ parent }) => (parent as { type?: string } | undefined)?.type !== 'video',
    }),
    defineField({
      name: 'captionMode',
      title: 'Caption',
      type: 'string',
      options: { list: ['none', 'title', 'full'] },
      initialValue: 'none',
    }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'title', media: 'image', type: 'type' },
    prepare({ title, media, type }) {
      return { title: title || (type === 'video' ? 'Video tile' : 'Image tile'), media }
    },
  },
})
