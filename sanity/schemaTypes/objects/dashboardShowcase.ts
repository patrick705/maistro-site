import { defineField, defineType } from 'sanity'

export const dashboardShowcase = defineType({
  name: 'dashboardShowcase',
  title: 'Dashboard showcase',
  type: 'object',
  description:
    'The illustrative "Operations" product dashboard on the homepage (Overview/Forecast/Staff/Stock/Reports tabs) — not real data, just a designed screenshot of the product.',
  fieldsets: [
    { name: 'overview', title: 'Overview tab' },
    { name: 'forecast', title: 'Forecast tab' },
    { name: 'staff', title: 'Staff tab' },
    { name: 'stock', title: 'Stock tab' },
    { name: 'reports', title: 'Reports tab' },
  ],
  fields: [
    defineField({
      name: 'overviewKpis',
      title: 'KPI tiles',
      type: 'array',
      of: [{ type: 'kpiTile' }],
      fieldset: 'overview',
      validation: (r) => r.max(4),
    }),
    defineField({
      name: 'overviewChart',
      title: 'Sales — forecast vs actual (bars)',
      type: 'array',
      of: [{ type: 'dayBar' }],
      fieldset: 'overview',
    }),
    defineField({
      name: 'onShift',
      title: 'On shift now',
      type: 'array',
      of: [{ type: 'shiftPerson' }],
      fieldset: 'overview',
    }),
    defineField({
      name: 'stockAlerts',
      title: 'Stock alerts',
      type: 'array',
      of: [{ type: 'progressItem' }],
      fieldset: 'overview',
    }),

    defineField({
      name: 'forecastKpis',
      title: 'KPI tiles',
      type: 'array',
      of: [{ type: 'kpiTile' }],
      fieldset: 'forecast',
      validation: (r) => r.max(3),
    }),
    defineField({
      name: 'forecastChart',
      title: 'Predicted sales bars',
      type: 'array',
      of: [{ type: 'singleBar' }],
      fieldset: 'forecast',
    }),

    defineField({
      name: 'staffKpis',
      title: 'KPI tiles',
      type: 'array',
      of: [{ type: 'kpiTile' }],
      fieldset: 'staff',
      validation: (r) => r.max(3),
    }),
    defineField({
      name: 'rota',
      title: "Today's rota",
      type: 'array',
      of: [{ type: 'rotaRow' }],
      fieldset: 'staff',
    }),

    defineField({
      name: 'stockKpis',
      title: 'KPI tiles',
      type: 'array',
      of: [{ type: 'kpiTile' }],
      fieldset: 'stock',
      validation: (r) => r.max(3),
    }),
    defineField({
      name: 'stockLevels',
      title: 'Stock levels',
      type: 'array',
      of: [{ type: 'progressItem' }],
      fieldset: 'stock',
    }),

    defineField({
      name: 'reportsKpis',
      title: 'KPI tiles',
      type: 'array',
      of: [{ type: 'kpiTile' }],
      fieldset: 'reports',
      validation: (r) => r.max(4),
    }),
    defineField({
      name: 'reportBand',
      title: 'Report band',
      type: 'object',
      fieldset: 'reports',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
        defineField({ name: 'pill', title: 'Pill label', type: 'string' }),
      ],
    }),
  ],
})
