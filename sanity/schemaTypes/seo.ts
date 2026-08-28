import { defineField, defineType } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'metaTitle', title: 'Meta title', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'Meta description', type: 'text', rows: 3 }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'analyticsOverride',
      title: 'Override site-wide analytics for this page',
      description: 'Off inherits GTM / GA4 / Meta Pixel / Google Ads from Site settings → Analytics & Tracking.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics override',
      type: 'object',
      hidden: ({ parent }) => !parent?.analyticsOverride,
      fields: [
        defineField({ name: 'gtmId', title: 'GTM container (override)', type: 'string', description: 'e.g. GTM-XXXXXXX' }),
        defineField({ name: 'ga4Id', title: 'GA4 measurement ID (override)', type: 'string', description: 'e.g. G-XXXXXXXXXX' }),
        defineField({ name: 'metaPixelId', title: 'Meta Pixel ID (override)', type: 'string', description: '15–16 digit pixel ID' }),
        defineField({ name: 'googleAdsId', title: 'Google Ads conversion ID (override)', type: 'string', description: 'e.g. AW-XXXXXXXXX' }),
      ],
    }),
  ],
})
