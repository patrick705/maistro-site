import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'nav', title: 'Nav & CTA' },
    { name: 'social', title: 'Social' },
    { name: 'theme', title: 'Theme' },
    { name: 'seo', title: 'SEO defaults' },
    { name: 'demo', title: 'Demo modal' },
  ],
  fields: [
    defineField({ name: 'siteName', title: 'Site name', type: 'string', group: 'general', initialValue: 'Maistro' }),
    defineField({
      name: 'demoModal',
      title: 'Book-a-demo modal',
      description: 'Shown sitewide whenever a "Book a demo" button is clicked, on any page.',
      type: 'demoModalContent',
      group: 'demo',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional — leave empty to show the site name as a text wordmark instead.',
      group: 'general',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (r) =>
            r.custom((alt, context) => {
              const parent = context.parent as { asset?: unknown } | undefined
              if (parent?.asset && !alt) return 'Required when a logo image is uploaded'
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'logoDark',
      title: 'Logo (dark background variant)',
      description: 'Optional — used on dark backgrounds if provided, otherwise the main logo is reused.',
      type: 'image',
      options: { hotspot: true },
      group: 'general',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (r) =>
            r.custom((alt, context) => {
              const parent = context.parent as { asset?: unknown } | undefined
              if (parent?.asset && !alt) return 'Required when a logo image is uploaded'
              return true
            }),
        }),
      ],
    }),
    defineField({ name: 'footerText', title: 'Footer text', type: 'string', group: 'general' }),
    defineField({
      name: 'gtmContainerId',
      title: 'Google Tag Manager container ID',
      description: 'e.g. GTM-XXXXXXX. Leave empty to disable GTM site-wide.',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'navItems',
      title: 'Navigation',
      type: 'array',
      of: [{ type: 'navItem' }],
      group: 'nav',
    }),
    defineField({
      name: 'stickyNav',
      title: 'Sticky top nav',
      description: 'When on, the top nav stays fixed at the top of the viewport while scrolling.',
      type: 'boolean',
      group: 'nav',
      initialValue: false,
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA button',
      type: 'object',
      group: 'nav',
      fields: [
        defineField({
          name: 'label',
          title: 'Button label',
          type: 'string',
          initialValue: 'Book a demo',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'href',
          title: 'Button link',
          type: 'string',
          description:
            'A path on this site (e.g. /product) or an external https:// URL. Leave empty to keep opening the book-a-demo modal.',
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      description: 'Shown site-wide (e.g. in the footer).',
      type: 'array',
      of: [{ type: 'socialLink' }],
      group: 'social',
    }),
    defineField({
      name: 'seoDefaults',
      title: 'SEO defaults',
      description: 'Sitewide fallbacks, used whenever a page has no SEO fields of its own set.',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'metaTitleSuffix',
          title: 'Title suffix',
          description: 'Appended to every page title, e.g. "— Maistro".',
          type: 'string',
        }),
        defineField({
          name: 'defaultMetaDescription',
          title: 'Default meta description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'defaultOgImage',
          title: 'Default social share image',
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              validation: (r) =>
                r.custom((alt, context) => {
                  const parent = context.parent as { asset?: unknown } | undefined
                  if (parent?.asset && !alt) return 'Required when an image is uploaded'
                  return true
                }),
            }),
          ],
        }),
        defineField({
          name: 'twitterHandle',
          title: 'X / Twitter handle',
          description: 'e.g. @maistroapp. Leave empty to omit Twitter card metadata.',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'object',
      group: 'theme',
      fields: [
        defineField({
          name: 'palette',
          title: 'Colour palette',
          type: 'reference',
          to: [{ type: 'brandPalette' }],
        }),
        defineField({
          name: 'playful',
          title: 'Playful mode',
          description: 'Adds tilted stat cards and floating hero shapes.',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'showResults',
          title: 'Show results band',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
