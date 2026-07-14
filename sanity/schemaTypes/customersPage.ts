import { defineField, defineType } from 'sanity'

export const customersPage = defineType({
  name: 'customersPage',
  title: 'Customers Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'logos', title: 'Logo wall' },
    { name: 'caseStudy', title: 'Featured case study' },
    { name: 'testimonials', title: 'Testimonials' },
    { name: 'cta', title: 'CTA' },
  ],
  fields: [
    // Hero (simple — no CTA row, no stats)
    defineField({ name: 'heroEyebrow', title: 'Eyebrow', type: 'string', group: 'hero' }),
    defineField({ name: 'heroHeadlineBefore', title: 'Headline (before highlight)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroHeadlineHighlight', title: 'Headline highlight', type: 'string', group: 'hero' }),
    defineField({ name: 'heroSubhead', title: 'Subhead', type: 'text', rows: 3, group: 'hero' }),

    // Logo wall
    defineField({
      name: 'logos',
      title: 'Client names',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Rendered as text wordmark tiles. A "+ many more" tile is always appended.',
      group: 'logos',
    }),

    // Featured case study
    defineField({ name: 'caseStudyEyebrow', title: 'Eyebrow', type: 'string', group: 'caseStudy' }),
    defineField({ name: 'caseStudyHeadline', title: 'Headline', type: 'string', group: 'caseStudy' }),
    defineField({ name: 'caseStudyBody', title: 'Body copy', type: 'text', rows: 3, group: 'caseStudy' }),
    defineField({ name: 'caseStudyQuote', title: 'Quote', type: 'text', rows: 2, group: 'caseStudy' }),
    defineField({ name: 'caseStudyAuthor', title: 'Quote author', type: 'string', group: 'caseStudy' }),
    defineField({
      name: 'caseStudyHeroStat',
      title: 'Headline stat',
      type: 'object',
      group: 'caseStudy',
      fields: [
        defineField({ name: 'value', title: 'Value', type: 'string' }),
        defineField({ name: 'label', title: 'Label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'caseStudyStats',
      title: 'Supporting stats',
      type: 'array',
      group: 'caseStudy',
      of: [
        {
          type: 'object',
          name: 'caseStudyStat',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
      validation: (r) => r.max(2),
    }),

    // Testimonials
    defineField({ name: 'testimonialsEyebrow', title: 'Eyebrow', type: 'string', group: 'testimonials' }),
    defineField({ name: 'testimonialsHeadline', title: 'Headline', type: 'string', group: 'testimonials' }),
    defineField({
      name: 'testimonials',
      title: 'Testimonial cards',
      type: 'array',
      of: [{ type: 'testimonial' }],
      group: 'testimonials',
    }),

    // Closing CTA
    defineField({ name: 'ctaHeadline', title: 'Headline', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaSubhead', title: 'Subhead', type: 'text', rows: 2, group: 'cta' }),
    defineField({ name: 'ctaButtonLabel', title: 'Button label', type: 'string', group: 'cta' }),
  ],
  preview: {
    prepare() {
      return { title: 'Customers Page' }
    },
  },
})
