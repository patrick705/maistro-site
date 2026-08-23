import { defineField, defineType } from 'sanity'

export const liveVideoBlock = defineType({
  name: 'liveVideoBlock',
  title: 'Live Video',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'embedUrl',
      title: 'Live stream embed URL',
      type: 'url',
      description:
        'A YouTube Live / Vimeo Live / other iframe-embeddable URL. Leave empty to show the offline state below.',
    }),
    defineField({
      name: 'posterImage',
      title: 'Poster / offline image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (r) =>
            r.custom((alt, context) => {
              const parent = context.parent as { asset?: unknown } | undefined
              if (parent?.asset && !alt) return 'Required when a poster image is uploaded'
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'offlineMessage',
      title: 'Offline message',
      type: 'string',
      initialValue: 'Stream is currently offline',
    }),
  ],
  preview: {
    select: { title: 'title', media: 'posterImage' },
    prepare({ title, media }) {
      return { title: title || 'Live Video', media }
    },
  },
})
