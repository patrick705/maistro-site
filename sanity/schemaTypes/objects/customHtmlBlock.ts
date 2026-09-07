import { defineField, defineType } from 'sanity'

export const customHtmlBlock = defineType({
  name: 'customHtmlBlock',
  title: 'Custom HTML',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Internal label',
      description: 'Shown in the builder only, not on the page.',
      type: 'string',
    }),
    defineField({
      name: 'file',
      title: 'HTML file',
      description: 'Upload a .html file, or paste markup below.',
      type: 'file',
      options: { accept: 'text/html' },
    }),
    defineField({
      name: 'code',
      title: 'Or paste HTML directly',
      type: 'text',
      rows: 8,
    }),
    defineField({
      name: 'sandboxed',
      title: 'Render in a sandboxed iframe',
      description: 'Off allows scripts to run directly in the page — only for trusted sources.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'fullWidth',
      title: 'Full width (ignore page margins)',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'label' },
    prepare({ title }) {
      return { title: title || 'Custom HTML' }
    },
  },
})
