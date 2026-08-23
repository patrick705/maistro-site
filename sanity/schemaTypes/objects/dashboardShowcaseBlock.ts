import { defineField, defineType } from 'sanity'

export const dashboardShowcaseBlock = defineType({
  name: 'dashboardShowcaseBlock',
  title: 'Dashboard Showcase',
  type: 'object',
  fields: [
    defineField({ name: 'showcase', title: 'Dashboard showcase', type: 'dashboardShowcase' }),
    defineField({ name: 'design', title: 'Design', type: 'blockDesign' }),
  ],
  preview: {
    prepare() {
      return { title: 'Dashboard Showcase' }
    },
  },
})
