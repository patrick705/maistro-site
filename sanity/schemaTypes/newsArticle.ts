import { defineField, defineType } from 'sanity'
import { colorVariantField } from './objects/colorVariant'

export const newsArticle = defineType({
  name: 'newsArticle',
  title: 'News Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Product', value: 'Product' },
          { title: 'Customer', value: 'Customer' },
          { title: 'Guide', value: 'Guide' },
          { title: 'Company', value: 'Company' },
          { title: 'Playbook', value: 'Playbook' },
        ],
      },
      initialValue: 'Product',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon (emoji)',
      type: 'string',
      description: 'Shown on the placeholder thumbnail — swap for a real photo later if you like.',
      validation: (r) => r.required(),
    }),
    colorVariantField,
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime', validation: (r) => r.required() }),
    defineField({
      name: 'body',
      title: 'Body',
      description: 'The full article content — the excerpt above is just the teaser shown on the News grid.',
      type: 'array',
      of: [
        { type: 'block' },
        {
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
        },
      ],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  orderings: [
    { title: 'Newest first', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
  },
})
