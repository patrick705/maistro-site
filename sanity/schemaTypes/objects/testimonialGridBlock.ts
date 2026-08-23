import { defineField, defineType } from 'sanity'

export const testimonialGridBlock = defineType({
  name: 'testimonialGridBlock',
  title: 'Testimonial Grid',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'testimonials', title: 'Testimonial cards', type: 'array', of: [{ type: 'testimonial' }] }),
    defineField({ name: 'design', title: 'Design', type: 'blockDesign' }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'eyebrow' },
    prepare({ title, subtitle }) {
      return { title: title || 'Testimonial Grid', subtitle }
    },
  },
})
