import { defineField, defineType } from 'sanity'

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

function hexField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: 'string',
    validation: (r) => r.required().regex(HEX_RE, { name: 'hex color' }),
  })
}

export const brandPalette = defineType({
  name: 'brandPalette',
  title: 'Brand Palette',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    hexField('brandHex', 'Brand color'),
    hexField('accentHex', 'Accent color'),
    hexField('warmHex', 'Warm color'),
    hexField('posHex', 'Positive/success color'),
    defineField({
      name: 'isDefaultForNewSites',
      title: 'Default for new sites',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'name', brand: 'brandHex', accent: 'accentHex' },
    prepare({ title, brand, accent }) {
      return { title, subtitle: [brand, accent].filter(Boolean).join(' · ') }
    },
  },
})
