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
    { name: 'analytics', title: 'Analytics & Tracking' },
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
      name: 'analytics',
      title: 'Analytics & Tracking',
      description: 'Scripts fire on every page unless a page\'s SEO & metadata panel turns on "Override site-wide analytics for this page."',
      type: 'object',
      group: 'analytics',
      fields: [
        defineField({ name: 'gtmId', title: 'Google Tag Manager container ID', type: 'string', description: 'e.g. GTM-XXXXXXX' }),
        defineField({ name: 'gtmOn', title: 'Enable Google Tag Manager', type: 'boolean', initialValue: false }),
        defineField({ name: 'ga4Id', title: 'Google Analytics (GA4) measurement ID', type: 'string', description: 'e.g. G-XXXXXXXXXX' }),
        defineField({ name: 'ga4On', title: 'Enable GA4', type: 'boolean', initialValue: false }),
        defineField({ name: 'metaPixelId', title: 'Meta Pixel ID', type: 'string', description: '15–16 digit pixel ID' }),
        defineField({ name: 'metaOn', title: 'Enable Meta Pixel', type: 'boolean', initialValue: false }),
        defineField({ name: 'googleAdsId', title: 'Google Ads conversion tracking ID', type: 'string', description: 'e.g. AW-XXXXXXXXX' }),
        defineField({ name: 'adsOn', title: 'Enable Google Ads conversion tracking', type: 'boolean', initialValue: false }),
      ],
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
        defineField({
          name: 'pairing',
          title: 'Type pairing',
          description: 'Display / body / mono font set used site-wide.',
          type: 'string',
          options: {
            list: [
              'Bricolage / Space Grotesk',
              'Instrument Serif / Work Sans',
              'Sora / DM Sans',
              'Playfair / Manrope',
            ],
          },
          initialValue: 'Bricolage / Space Grotesk',
        }),
        defineField({
          name: 'typeScale',
          title: 'Type scale',
          description: 'Scales every heading and body size across the site.',
          type: 'string',
          options: { list: ['Compact', 'Default', 'Large'] },
          initialValue: 'Default',
        }),
        defineField({
          name: 'chromeFont',
          title: 'Use this pairing for the CMS too',
          description: "Interface text follows the site's body font.",
          type: 'boolean',
          initialValue: false,
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
