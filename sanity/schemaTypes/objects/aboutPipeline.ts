import { defineField, defineType } from 'sanity'

export const aboutPipeline = defineType({
  name: 'aboutPipeline',
  title: 'About diagram',
  type: 'object',
  description:
    'The channels → Menu Manager → Maistro → outputs diagram in the About section. Menu Manager manages the sales channels; Maistro takes the resulting data and turns it into decisions.',
  groups: [
    { name: 'channels', title: 'Channels' },
    { name: 'menuManager', title: 'Menu Manager' },
    { name: 'maistro', title: 'Maistro' },
    { name: 'outputs', title: 'Outputs' },
  ],
  fields: [
    defineField({ name: 'channelsIcon', title: 'Icon (emoji)', type: 'string', group: 'channels', initialValue: '🛒' }),
    defineField({ name: 'channelsLabel', title: 'Label', type: 'string', group: 'channels', initialValue: 'Sales channels' }),
    defineField({
      name: 'channelsTags',
      title: 'Channel tags',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'channels',
    }),
    defineField({ name: 'menuManagerIcon', title: 'Icon (emoji)', type: 'string', group: 'menuManager', initialValue: '❤️' }),
    defineField({ name: 'menuManagerTitle', title: 'Title', type: 'string', group: 'menuManager', initialValue: 'Menu Manager' }),
    defineField({ name: 'menuManagerSub', title: 'Subtitle', type: 'string', group: 'menuManager' }),
    defineField({ name: 'maistroIcon', title: 'Icon (emoji)', type: 'string', group: 'maistro', initialValue: '🧠' }),
    defineField({ name: 'maistroTitle', title: 'Title', type: 'string', group: 'maistro', initialValue: 'Maistro' }),
    defineField({ name: 'maistroSub', title: 'Subtitle', type: 'string', group: 'maistro' }),
    defineField({ name: 'deliversIcon', title: 'Icon (emoji)', type: 'string', group: 'outputs', initialValue: '✨' }),
    defineField({ name: 'deliversLabel', title: 'Label', type: 'string', group: 'outputs', initialValue: 'Maistro delivers' }),
    defineField({
      name: 'outputs',
      title: 'Outputs',
      type: 'array',
      of: [{ type: 'pipelineOutput' }],
      group: 'outputs',
    }),
  ],
})
