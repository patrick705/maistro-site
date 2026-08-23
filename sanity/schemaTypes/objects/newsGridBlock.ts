import { defineField, defineType } from 'sanity'

/** Marker block — renders the live News Articles grid at this position. No real config, just a placeholder field (Sanity requires at least one). */
export const newsGridBlock = defineType({
  name: 'newsGridBlock',
  title: 'News Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'note',
      title: 'Note',
      type: 'string',
      readOnly: true,
      initialValue: 'Shows every published News Article — nothing to configure.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'News Grid', subtitle: 'Shows all published News Articles' }
    },
  },
})
