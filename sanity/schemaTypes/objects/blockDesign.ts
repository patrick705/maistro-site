import { defineField, defineType } from 'sanity'

export const blockDesign = defineType({
  name: 'blockDesign',
  title: 'Design',
  type: 'object',
  fields: [
    defineField({
      name: 'headingFont',
      title: 'Heading typeface',
      type: 'string',
      options: { list: [{ title: 'Display', value: 'display' }, { title: 'Body', value: 'body' }] },
      initialValue: 'display',
    }),
    defineField({
      name: 'headingScale',
      title: 'Heading scale',
      description: 'Relative to this section’s default heading size.',
      type: 'string',
      options: { list: [{ title: 'S', value: 's' }, { title: 'M', value: 'm' }, { title: 'L', value: 'l' }] },
      initialValue: 'm',
    }),
    defineField({
      name: 'padding',
      title: 'Section padding',
      description: 'Relative to this section’s default vertical padding.',
      type: 'string',
      options: { list: [{ title: 'Compact', value: 'compact' }, { title: 'Standard', value: 'standard' }, { title: 'Roomy', value: 'roomy' }] },
      initialValue: 'standard',
    }),
    defineField({
      name: 'paletteRole',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'Surface', value: 'surface' },
          { title: 'White', value: 'white' },
          { title: 'Brand', value: 'brand' },
          { title: 'Accent', value: 'accent' },
        ],
      },
    }),
    defineField({
      name: 'fullBleed',
      title: 'Full-bleed band',
      description: 'Edge-to-edge background. Off constrains it to a centered, contained band.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
