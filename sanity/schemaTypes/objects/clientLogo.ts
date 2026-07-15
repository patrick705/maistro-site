import { defineField, defineType } from 'sanity'

export const clientLogo = defineType({
  name: 'clientLogo',
  title: 'Client',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Client name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'logo',
      title: 'Logo image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional — leave empty to show the client name as a text wordmark tile instead.',
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
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description:
        'Shown in the "more info" popup on the live site — real descriptive text here also helps search engines and AI answer engines understand this client relationship, not just the logo image.',
    }),
    defineField({ name: 'website', title: 'Client website (optional)', type: 'url' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'description', media: 'logo' },
  },
})
