/**
 * Static data for the "designed dashboard" showcase on the homepage. This is
 * an illustrative product screenshot, not marketing copy, so — unlike the
 * rest of the homepage — it isn't wired to Sanity. Edit it here directly.
 */

export type Tone = 'neutral' | 'pos' | 'accent'

export interface Kpi {
  label: string
  value: string
  valueVariant?: 'brand' | 'accent'
  small?: boolean
  delta: string
  tone: Tone
}

export interface DayBar {
  day: string
  forecast: number
  actual: number
  actualHighlight?: boolean
}

export interface SingleBar {
  day: string
  height: number
  variant: 'soft' | 'brand' | 'accent'
}

export interface Person {
  name: string
  role: string
  color: 'warm' | 'pos' | 'brand'
}

export interface ProgressItem {
  name: string
  status: string
  percent: number
  /** Fill colour family. For 'warm', the status text renders in the darker warm-deep tone (matches the mockup's "Low" stock label). */
  color: 'accent' | 'warm' | 'pos'
}

export interface RotaRow {
  name: string
  left: number
  width: number
  color: 'warm' | 'pos' | 'accent' | 'brand'
}

export const overviewKpis: Kpi[] = [
  { label: 'Sales today', value: '£4,820', delta: '▲ 12% vs forecast', tone: 'pos' },
  { label: 'Labour', value: '23.5%', delta: 'of sales · on target', tone: 'neutral' },
  { label: 'Food GP', value: '71%', delta: '▲ 2 pts', tone: 'pos' },
  { label: 'Forecast accuracy', value: '98%', delta: '7-day rolling', tone: 'neutral' },
]

export const overviewChart: DayBar[] = [
  { day: 'Mon', forecast: 88, actual: 80 },
  { day: 'Tue', forecast: 106, actual: 100 },
  { day: 'Wed', forecast: 98, actual: 94 },
  { day: 'Thu', forecast: 124, actual: 120 },
  { day: 'Fri', forecast: 146, actual: 138 },
  { day: 'Sat', forecast: 150, actual: 144, actualHighlight: true },
  { day: 'Sun', forecast: 120, actual: 116 },
]

export const onShift: Person[] = [
  { name: 'Ana R.', role: 'Floor · until 17:00', color: 'warm' },
  { name: 'Bruno M.', role: 'Kitchen · until 16:30', color: 'pos' },
  { name: 'Chloé D.', role: 'Bar · until 18:00', color: 'brand' },
]

export const stockAlerts: ProgressItem[] = [
  { name: 'Whole milk', status: 'Reorder', percent: 18, color: 'accent' },
  { name: 'Oat milk', status: 'Healthy', percent: 74, color: 'pos' },
]

export const forecastKpis: Kpi[] = [
  { label: 'Predicted covers today', value: '480', delta: '▲ 8% vs last week', tone: 'pos' },
  { label: 'Peak window', value: '6–8pm', delta: 'busiest today', tone: 'neutral' },
  { label: 'Confidence', value: '98%', delta: '7-day rolling', tone: 'neutral' },
]

export const forecastChart: SingleBar[] = [
  { day: 'Mon', height: 96, variant: 'soft' },
  { day: 'Tue', height: 112, variant: 'soft' },
  { day: 'Wed', height: 104, variant: 'soft' },
  { day: 'Thu', height: 128, variant: 'soft' },
  { day: 'Fri', height: 150, variant: 'brand' },
  { day: 'Sat', height: 162, variant: 'accent' },
  { day: 'Sun', height: 130, variant: 'soft' },
]

export const staffKpis: Kpi[] = [
  { label: 'On shift now', value: '8', delta: 'across 3 sections', tone: 'neutral' },
  { label: 'Labour', value: '23.5%', delta: 'on target', tone: 'pos' },
  { label: 'Overtime', value: '0h', delta: 'this week', tone: 'neutral' },
]

export const rota: RotaRow[] = [
  { name: 'Ana R.', left: 8, width: 52, color: 'warm' },
  { name: 'Bruno M.', left: 20, width: 48, color: 'pos' },
  { name: 'Chloé D.', left: 35, width: 55, color: 'accent' },
  { name: 'Diego P.', left: 12, width: 40, color: 'brand' },
]

export const stockKpis: Kpi[] = [
  { label: 'Items tracked', value: '342', delta: 'across all sites', tone: 'neutral' },
  { label: 'Low stock', value: '3', valueVariant: 'accent', delta: 'reorder suggested', tone: 'neutral' },
  { label: 'Waste', value: '1.9%', delta: '▼ 0.6 pts', tone: 'pos' },
]

export const stockLevels: ProgressItem[] = [
  { name: 'Whole milk', status: 'Reorder', percent: 16, color: 'accent' },
  { name: 'Syrups', status: 'Low', percent: 32, color: 'warm' },
  { name: 'Coffee beans', status: 'Healthy', percent: 61, color: 'pos' },
  { name: 'Oat milk', status: 'Healthy', percent: 74, color: 'pos' },
]

export const reportsKpis: Kpi[] = [
  { label: 'Net sales · wk', value: '£31.4k', small: true, delta: '▲ 8%', tone: 'pos' },
  { label: 'Labour', value: '22.8%', small: true, delta: 'on target', tone: 'neutral' },
  { label: 'Gross profit', value: '71%', small: true, delta: '▲ 2 pts', tone: 'pos' },
  { label: 'Waste', value: '1.9%', small: true, delta: '▼ 0.6 pts', tone: 'pos' },
]

export const reportBand = {
  title: 'Month-end close in 3.5 hours',
  subtitle: 'Down from ~2 days before Maistro.',
  pill: 'Auto-generated',
}
