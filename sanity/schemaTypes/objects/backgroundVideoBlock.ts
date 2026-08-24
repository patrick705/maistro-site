import { defineField, defineType } from 'sanity'

export const backgroundVideoBlock = defineType({
  name: 'backgroundVideoBlock',
  title: 'Background Video',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'heading', title: 'Overlay heading', type: 'string' }),
    defineField({ name: 'subhead', title: 'Overlay subtext', type: 'text', rows: 2 }),
    defineField({ name: 'primaryCta', title: 'Primary CTA label', type: 'string' }),
    defineField({ name: 'secondaryCta', title: 'Secondary CTA label', type: 'string' }),
    defineField({
      name: 'video',
      title: 'Video file',
      type: 'file',
      description: 'A short, muted, looping clip — self-hosted (mp4/webm), not an embed URL.',
      options: { accept: 'video/mp4,video/webm' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'posterImage',
      title: 'Poster frame',
      description: 'Shown before the video loads and if playback fails.',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
      fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: (r) => r.required() })],
    }),
    defineField({ name: 'loop', title: 'Loop continuously', type: 'boolean', initialValue: true }),
    defineField({
      name: 'muted',
      title: 'Muted',
      type: 'boolean',
      initialValue: true,
      description: 'Required for autoplay in every browser — turning this off means the video will not autoplay.',
    }),
    defineField({
      name: 'videoHeight',
      title: 'Section height',
      type: 'string',
      options: { list: ['Full screen', 'Three-quarter'] },
      initialValue: 'Full screen',
    }),
    defineField({
      name: 'menuOverlay',
      title: 'Top menu over the video',
      type: 'boolean',
      initialValue: true,
      description: 'Draws the site nav transparently over the footage instead of a solid bar above it. Off starts the video below a solid nav.',
    }),
    defineField({
      name: 'overlayCopy',
      title: 'Text overlay',
      type: 'boolean',
      initialValue: true,
      description: 'Off plays the video alone and puts the copy beneath it instead.',
    }),
    defineField({
      name: 'scrim',
      title: 'Darken video behind text',
      type: 'boolean',
      initialValue: true,
      description: 'Keeps overlay copy legible over moving footage.',
    }),
    defineField({
      name: 'overlayPreset',
      title: 'Overlay copy',
      type: 'string',
      options: { list: ['Full', 'Minimal'] },
      initialValue: 'Full',
      description: 'Minimal drops the eyebrow, subhead and second CTA — less to read over moving footage.',
    }),
    defineField({
      name: 'scrollCue',
      title: 'Scroll cue',
      type: 'boolean',
      initialValue: true,
      description: 'Shows a small bobbing ↓ indicator at the bottom of the hero.',
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'posterImage' },
    prepare({ title, media }) {
      return { title: title || 'Background Video', media }
    },
  },
})
