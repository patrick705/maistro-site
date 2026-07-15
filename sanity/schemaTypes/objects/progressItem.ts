import { defineField, defineType } from 'sanity'

export const progressItem = defineType({
  name: 'progressItem',
  title: 'Progress row',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'status', title: 'Status label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'percent', title: 'Fill percent (0-100)', type: 'number', validation: (r) => r.required().min(0).max(100) }),
    defineField({
      name: 'color',
      title: 'Fill colour',
      type: 'string',
      options: { list: [{ title: 'Accent', value: 'accent' }, { title: 'Warm', value: 'warm' }, { title: 'Positive', value: 'pos' }] },
      initialValue: 'pos',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'status' },
  },
})
