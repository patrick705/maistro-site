import { defineField, defineType } from 'sanity'

export const roiCalculatorBlock = defineType({
  name: 'roiCalculatorBlock',
  title: 'ROI Calculator',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'heading', title: 'Headline', type: 'string' }),
    defineField({ name: 'subhead', title: 'Subhead', type: 'text', rows: 3 }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: { list: ['EUR €', 'GBP £', 'USD $'] },
      initialValue: 'EUR €',
    }),
    defineField({
      name: 'defaultMonthlySales',
      title: 'Default monthly sales',
      type: 'number',
      initialValue: 50000,
      description: 'Starting slider position — visitors drag it to their own numbers.',
    }),
    defineField({ name: 'defaultStockPct', title: 'Default stock cost (%)', type: 'number', initialValue: 30 }),
    defineField({ name: 'defaultStaffPct', title: 'Default staff cost (%)', type: 'number', initialValue: 30 }),
    defineField({ name: 'defaultOnlinePct', title: 'Default online sales (%)', type: 'number', initialValue: 25 }),
    defineField({ name: 'defaultPhoneCalls', title: 'Default phone calls / month', type: 'number', initialValue: 200 }),
    defineField({
      name: 'benchmarks',
      title: 'Benchmark bands',
      description:
        'The first entry shows as the "target" hint under the stock slider, the second under the staff slider. Informational only, not part of the calculation.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'benchmarkBand',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'range', title: 'Range', type: 'string', description: 'e.g. "25–28%"' }),
          ],
          preview: { select: { title: 'label', subtitle: 'range' } },
        },
      ],
    }),
    defineField({
      name: 'voiceEnabled',
      title: 'Show voice AI automation savings',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'consultationHeading',
      title: 'Consultation banner heading',
      type: 'string',
      initialValue: 'Get a free consultation',
    }),
    defineField({ name: 'exportLabel', title: 'Consultation button label', type: 'string', initialValue: 'Get consultation' }),
    defineField({
      name: 'disclaimer',
      title: 'Disclaimer',
      type: 'text',
      rows: 2,
      initialValue:
        'Estimates only. Savings model brings food and labour cost back inside the QSR benchmark bands; voice AI is modelled at €0.75 per call handled.',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'eyebrow' },
    prepare({ title, subtitle }) {
      return { title: title || 'ROI Calculator', subtitle }
    },
  },
})
