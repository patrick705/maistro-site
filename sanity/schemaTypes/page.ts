import { defineField, defineType } from 'sanity'

export const RESERVED_SLUGS = ['', 'home', 'studio', 'api']

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
        { type: 'backgroundVideoBlock' },
        { type: 'roiCalculatorBlock' },
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
        { type: 'scrollGalleryBlock' },
        { type: 'mediaMosaicBlock' },
        { type: 'mediaCardGridBlock' },
        { type: 'imageBannerBlock' },
        { type: 'multiImageBannerBlock' },
        { type: 'customHtmlBlock' },
      ],
    }),
    defineField({ name: 'navLabel', title: 'Top-menu label', description: 'Falls back to Title if left empty.', type: 'string', group: 'nav' }),
    defineField({
      name: 'navStyle',
      title: 'Top nav style',
      description: 'Overrides the site-wide "Transparent top nav" setting for this page only.',
      type: 'string',
      group: 'nav',
      options: {
        list: [
          { title: 'Use site default', value: 'inherit' },
          { title: 'Transparent', value: 'transparent' },
          { title: 'Solid', value: 'solid' },
        ],
        layout: 'radio',
      },
      initialValue: 'inherit',
    }),
    defineField({
      name: 'navTransparentColor',
      title: 'Transparent nav text colour',
      description: 'Only matters when this page\'s header ends up transparent (inherited or explicit). Nav links, logo and burger switch to this colour instead of the default white.',
      type: 'string',
      group: 'nav',
      options: {
        list: [
          { title: 'White (default)', value: 'white' },
          { title: 'Teal', value: 'teal' },
          { title: 'Brand colour', value: 'brand' },
          { title: 'Accent colour', value: 'accent' },
        ],
        layout: 'radio',
      },
      initialValue: 'white',
    }),
    defineField({ name: 'showInMenu', title: 'Show in top menu', type: 'boolean', group: 'nav', initialValue: false }),
    defineField({ name: 'menuOrder', title: 'Menu order', description: 'Lower numbers appear first.', type: 'number', group: 'nav' }),
    defineField({
      name: 'parentId',
      title: 'Parent page (subpage of)',
      description: 'Set automatically by "+ Add subpage" — a page with this set is a subpage and can\'t have subpages of its own.',
      type: 'string',
      group: 'nav',
    }),
    defineField({
      name: 'archived',
      title: 'Archived',
      description: 'Archived pages are taken offline — their URL 404s and they drop out of the top menu — but stay editable here.',
      type: 'boolean',
      group: 'nav',
      initialValue: false,
    }),
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
