import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'about', title: 'About' },
    { name: 'dashboard', title: 'Dashboard showcase' },
    { name: 'services', title: 'Services' },
    { name: 'results', title: 'Results' },
    { name: 'contact', title: 'Contact' },
    { name: 'demo', title: 'Demo modal' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Hero
    defineField({ name: 'heroEyebrow', title: 'Eyebrow', type: 'string', group: 'hero' }),
    defineField({ name: 'heroHeadlineBefore', title: 'Headline (before highlight)', type: 'string', group: 'hero' }),
    defineField({
      name: 'heroHeadlineHighlight',
      title: 'Headline highlight',
      type: 'string',
      description: 'Rendered in the highlighted pill, e.g. "one AI."',
      group: 'hero',
    }),
    defineField({ name: 'heroSubhead', title: 'Subhead', type: 'text', rows: 3, group: 'hero' }),
    defineField({ name: 'heroPrimaryCta', title: 'Primary CTA label', type: 'string', group: 'hero' }),
    defineField({ name: 'heroSecondaryCta', title: 'Secondary CTA label', type: 'string', group: 'hero' }),
    defineField({
      name: 'heroStats',
      title: 'Hero stat badges',
      type: 'array',
      of: [{ type: 'statBadge' }],
      group: 'hero',
      validation: (r) => r.max(3),
    }),

    // About
    defineField({ name: 'aboutEyebrow', title: 'Eyebrow', type: 'string', group: 'about' }),
    defineField({ name: 'aboutHeadlineBefore', title: 'Headline (before highlight)', type: 'text', rows: 2, group: 'about' }),
    defineField({ name: 'aboutHeadlineHighlight', title: 'Headline highlight', type: 'string', group: 'about' }),
    defineField({ name: 'aboutHeadlineAfter', title: 'Headline (after highlight)', type: 'text', rows: 2, group: 'about' }),
    defineField({ name: 'aboutBody', title: 'Body copy', type: 'text', rows: 4, group: 'about' }),
    defineField({ name: 'aboutPipeline', title: 'Diagram', type: 'aboutPipeline', group: 'about' }),

    // Dashboard showcase
    defineField({
      name: 'dashboardShowcase',
      title: 'Dashboard showcase',
      type: 'dashboardShowcase',
      group: 'dashboard',
    }),

    // Services
    defineField({ name: 'servicesEyebrow', title: 'Eyebrow', type: 'string', group: 'services' }),
    defineField({ name: 'servicesHeadline', title: 'Headline', type: 'string', group: 'services' }),
    defineField({
      name: 'services',
      title: 'Service cards',
      type: 'array',
      of: [{ type: 'serviceCard' }],
      group: 'services',
    }),

    // Results
    defineField({ name: 'resultsEyebrow', title: 'Eyebrow', type: 'string', group: 'results' }),
    defineField({ name: 'resultsHeadline', title: 'Headline', type: 'string', group: 'results' }),
    defineField({
      name: 'resultStats',
      title: 'Result stats',
      type: 'array',
      of: [{ type: 'resultStat' }],
      group: 'results',
    }),

    // Contact
    defineField({ name: 'contactHeadline', title: 'Headline', type: 'string', group: 'contact' }),
    defineField({ name: 'contactSubhead', title: 'Subhead', type: 'text', rows: 2, group: 'contact' }),

    // Demo modal
    defineField({ name: 'demoModal', title: 'Book-a-demo modal', type: 'demoModalContent', group: 'demo' }),

    // SEO
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' }
    },
  },
})
