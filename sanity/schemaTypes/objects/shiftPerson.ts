import { defineField, defineType } from 'sanity'

export const shiftPerson = defineType({
  name: 'shiftPerson',
  title: 'On-shift person',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role / until time', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'color',
      title: 'Avatar colour',
      type: 'string',
      options: { list: [{ title: 'Warm', value: 'warm' }, { title: 'Positive', value: 'pos' }, { title: 'Brand', value: 'brand' }] },
      initialValue: 'brand',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
})
