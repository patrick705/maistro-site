import { defineField, defineType } from 'sanity'

export const dashboardShowcaseBlock = defineType({
  name: 'dashboardShowcaseBlock',
  title: 'Dashboard Showcase',
  type: 'object',
  fields: [defineField({ name: 'showcase', title: 'Dashboard showcase', type: 'dashboardShowcase' })],
  preview: {
    prepare() {
      return { title: 'Dashboard Showcase' }
    },
  },
})
