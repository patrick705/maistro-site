import { defineField } from 'sanity'

/** Shared enum: which theme colour a card/stat should render in. */
export const colorVariantField = defineField({
  name: 'variant',
  title: 'Colour',
  type: 'string',
  options: {
    list: [
      { title: 'Brand (ink/navy)', value: 'brand' },
      { title: 'Warm (gold/amber)', value: 'warm' },
      { title: 'Positive (green)', value: 'pos' },
      { title: 'Accent (coral/violet)', value: 'accent' },
    ],
    layout: 'radio',
  },
  initialValue: 'brand',
  validation: (r) => r.required(),
})
