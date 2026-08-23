import { defineField, defineType } from 'sanity'

export const servicesGridBlock = defineType({
  name: 'servicesGridBlock',
  title: 'Services Grid',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'services', title: 'Service cards', type: 'array', of: [{ type: 'serviceCard' }] }),
    defineField({ name: 'design', title: 'Design', type: 'blockDesign' }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'eyebrow' },
    prepare({ title, subtitle }) {
      return { title: title || 'Services Grid', subtitle }
    },
  },
})
