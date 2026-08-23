import { defineField, defineType } from 'sanity'

export const pipelineStripBlock = defineType({
  name: 'pipelineStripBlock',
  title: 'Pipeline Strip',
  type: 'object',
  fields: [
    defineField({ name: 'channelsLabel', title: 'Channels column label', type: 'string' }),
    defineField({ name: 'channelsItems', title: 'Channel tiles', type: 'array', of: [{ type: 'iconTile' }] }),
    defineField({ name: 'menuManagerIcon', title: 'Menu Manager icon', type: 'string' }),
    defineField({ name: 'menuManagerTitle', title: 'Menu Manager title', type: 'string' }),
    defineField({ name: 'menuManagerSub', title: 'Menu Manager sub-copy', type: 'string' }),
    defineField({ name: 'maistroIcon', title: 'Maistro icon', type: 'string' }),
    defineField({ name: 'maistroTitle', title: 'Maistro title', type: 'string' }),
    defineField({ name: 'maistroSub', title: 'Maistro sub-copy', type: 'string' }),
    defineField({ name: 'outcomesLabel', title: 'Outcomes column label', type: 'string' }),
    defineField({ name: 'outcomesItems', title: 'Outcome tiles', type: 'array', of: [{ type: 'iconTile' }] }),
    defineField({ name: 'design', title: 'Design', type: 'blockDesign' }),
  ],
  preview: {
    prepare() {
      return { title: 'Pipeline Strip' }
    },
  },
})
