import { defineField, defineType } from 'sanity'

export const socialLinksBlock = defineType({
  name: 'socialLinksBlock',
  title: 'Social Links',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'socialLink' }],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: 'heading', count: 'links.length' },
    prepare({ title, count }) {
      return { title: title || 'Social Links', subtitle: count ? `${count} link(s)` : undefined }
    },
  },
})
