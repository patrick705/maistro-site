import { defineField, defineType } from 'sanity'

const RESERVED_SLUGS = ['', 'home', 'studio', 'api']

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'nav', title: 'Navigation' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title' },
      validation: (r) =>
        r
          .required()
          .custom((slug) => {
            const current = (slug as { current?: string } | undefined)?.current?.toLowerCase().trim()
            if (current !== undefined && RESERVED_SLUGS.includes(current)) {
              return `"/${current}" is reserved for an existing page — choose a different slug.`
            }
            return true
          }),
    }),
    defineField({
      name: 'blocks',
      title: 'Blocks',
      type: 'array',
      group: 'content',
      of: [
        { type: 'heroCarouselBlock' },
        { type: 'textBlock' },
        { type: 'sideBySideBlock' },
        { type: 'imageGalleryBlock' },
        { type: 'socialLinksBlock' },
        { type: 'liveVideoBlock' },
        { type: 'logoStripBlock' },
        { type: 'ctaBannerBlock' },
        { type: 'richHeroBlock' },
        { type: 'simpleHeroBlock' },
        { type: 'aboutSectionBlock' },
        { type: 'dashboardShowcaseBlock' },
        { type: 'servicesGridBlock' },
        { type: 'statsBandBlock' },
        { type: 'contactFormBlock' },
        { type: 'pipelineStripBlock' },
        { type: 'moduleDeepDiveListBlock' },
        { type: 'integrationsBlock' },
        { type: 'featuredCaseStudyBlock' },
        { type: 'testimonialGridBlock' },
        { type: 'newsGridBlock' },
      ],
    }),
    defineField({ name: 'navLabel', title: 'Top-menu label', description: 'Falls back to Title if left empty.', type: 'string', group: 'nav' }),
    defineField({ name: 'showInMenu', title: 'Show in top menu', type: 'boolean', group: 'nav', initialValue: false }),
    defineField({ name: 'menuOrder', title: 'Menu order', description: 'Lower numbers appear first.', type: 'number', group: 'nav' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current', showInMenu: 'showInMenu' },
    prepare({ title, subtitle, showInMenu }) {
      return {
        title,
        subtitle: subtitle ? `/${subtitle}${showInMenu ? ' · in menu' : ''}` : undefined,
      }
    },
  },
})
