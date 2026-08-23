import { defineField, defineType } from 'sanity'

export const logoStripBlock = defineType({
  name: 'logoStripBlock',
  title: 'Logo Strip',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [{ type: 'clientLogo' }],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'logos.0.logo' },
    prepare({ title, media }) {
      return { title: title || 'Logo Strip', media }
    },
  },
})
