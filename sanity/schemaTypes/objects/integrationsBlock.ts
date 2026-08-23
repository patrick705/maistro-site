import { defineField, defineType } from 'sanity'

export const integrationsBlock = defineType({
  name: 'integrationsBlock',
  title: 'Integrations Band',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'integrations', title: 'Integration pills', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'design', title: 'Design', type: 'blockDesign' }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'eyebrow' },
    prepare({ title, subtitle }) {
      return { title: title || 'Integrations Band', subtitle }
    },
  },
})
