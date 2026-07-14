import { defineField, defineType } from 'sanity'

/** A small icon + label tile, used in the Product page's pipeline strip (channels/outcomes). */
export const iconTile = defineType({
  name: 'iconTile',
  title: 'Icon tile',
  type: 'object',
  fields: [
    defineField({ name: 'icon', title: 'Icon (emoji)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'icon' },
  },
})
