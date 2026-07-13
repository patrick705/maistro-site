import { defineField, defineType } from 'sanity'

export const pipelineOutput = defineType({
  name: 'pipelineOutput',
  title: 'Output',
  type: 'object',
  fields: [
    defineField({ name: 'icon', title: 'Icon (emoji)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'icon' },
  },
})
