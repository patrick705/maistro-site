import { defineField, defineType } from 'sanity'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'Instagram', value: 'instagram' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'X (Twitter)', value: 'x' },
          { title: 'TikTok', value: 'tiktok' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'Other', value: 'other' },
        ],
      },
      initialValue: 'instagram',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'url', title: 'Profile URL', type: 'url', validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: 'platform', subtitle: 'url' },
  },
})
