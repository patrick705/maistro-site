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
    defineField({
      name: 'textEdits',
      title: 'Text edits',
      description:
        'Override specific text inside the embed without touching its code — match an existing CSS selector (class, ID, or tag) from the embedded HTML and give it new text. Only plain text content is replaced; the surrounding markup, styles and scripts are untouched.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'textEdit',
          fields: [
            defineField({
              name: 'selector',
              title: 'CSS selector',
              description: 'e.g. "#contactTitle" or ".hero-title-meet" — must match an element already in the embed.',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'text',
              title: 'New text',
              type: 'text',
              rows: 2,
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { selector: 'selector', text: 'text' },
            prepare({ selector, text }) {
              return { title: selector, subtitle: text }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'label' },
    prepare({ title }) {
      return { title: title || 'Custom HTML' }
    },
  },
})
