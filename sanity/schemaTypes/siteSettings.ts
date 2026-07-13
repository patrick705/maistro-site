import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'theme', title: 'Theme' },
  ],
  fields: [
    defineField({ name: 'siteName', title: 'Site name', type: 'string', group: 'general', initialValue: 'Maistro' }),
    defineField({
      name: 'navItems',
      title: 'Navigation',
      type: 'array',
      of: [{ type: 'navItem' }],
      group: 'general',
    }),
    defineField({ name: 'ctaLabel', title: '"Book a demo" button label', type: 'string', group: 'general', initialValue: 'Book a demo' }),
    defineField({ name: 'footerText', title: 'Footer text', type: 'string', group: 'general' }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'object',
      group: 'theme',
      fields: [
        defineField({
          name: 'palette',
          title: 'Colour palette',
          type: 'string',
          options: {
            list: [
              { title: 'Violet', value: 'Violet' },
              { title: 'Ink & Terracotta', value: 'Ink & Terracotta' },
              { title: 'Plum & Peach', value: 'Plum & Peach' },
              { title: 'Forest & Clay', value: 'Forest & Clay' },
              { title: 'Brazil', value: 'Brazil' },
            ],
          },
          initialValue: 'Violet',
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
