import { defineField, defineType } from 'sanity'

/** Submissions from the "Book a demo" modal, the contact form, and the ROI calculator's export. */
export const lead = defineType({
  name: 'lead',
  title: 'Lead',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Not collected by the ROI calculator export — email-only there.',
    }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'company', title: 'Company', type: 'string' }),
    defineField({ name: 'venues', title: 'Venues', type: 'string' }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 4 }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Demo modal', value: 'demo-modal' },
          { title: 'Contact form', value: 'contact-form' },
          { title: 'ROI calculator', value: 'roi-calculator' },
        ],
      },
    }),
    defineField({ name: 'submittedAt', title: 'Submitted at', type: 'datetime' }),
  ],
  orderings: [
    { title: 'Newest first', name: 'submittedAtDesc', by: [{ field: 'submittedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'email' },
    prepare({ title, subtitle }) {
      return { title: title || subtitle || 'Untitled lead', subtitle: title ? subtitle : undefined }
    },
  },
})
