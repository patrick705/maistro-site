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

function hexOverrideField(name: string, title: string) {
  return defineField({
    name,
    title,
    description: 'Optional — leave empty to keep the value auto-derived from the 4 base colors.',
    type: 'string',
    validation: (r) => r.regex(HEX_RE, { name: 'hex color' }),
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
    hexOverrideField('surfaceHex', 'Surface (override)'),
    hexOverrideField('brandTintHex', 'Brand tint (override)'),
    hexOverrideField('brandSoftHex', 'Brand soft (override)'),
    hexOverrideField('brandInkHex', 'Brand ink (override)'),
    hexOverrideField('accentInkHex', 'Accent ink (override)'),
    hexOverrideField('warmDeepHex', 'Warm deep (override)'),
    hexOverrideField('posTintHex', 'Positive tint (override)'),
    hexOverrideField('bodyHex', 'Body text (override)'),
  ],
  preview: {
    select: { title: 'name', brand: 'brandHex', accent: 'accentHex' },
    prepare({ title, brand, accent }) {
      return { title, subtitle: [brand, accent].filter(Boolean).join(' · ') }
    },
  },
})
