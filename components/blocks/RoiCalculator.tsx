'use client'

import { useMemo, useState, type FormEvent } from 'react'

import { submitLead } from '@/lib/submitLead'
import type { RoiCalculatorBlock } from '@/lib/content/types'
import styles from './RoiCalculator.module.css'

// Fixed model constants — confirmed against the real calculator, not
// editable per-block. `onlinePct` is collected as an input but, per that
// same confirmation, doesn't feed the displayed total.
const FOOD_TARGET_PCT = 28
const LABOUR_TARGET_PCT = 28
const VOICE_SAVE_RATE = 0.75 // € saved per phone call handled by voice AI

function currencySymbol(currency: string | undefined) {
  if (currency?.includes('£')) return '£'
  if (currency?.includes('$')) return '$'
  return '€'
}

function formatMoney(value: number, symbol: string) {
  return `${symbol}${Math.round(value).toLocaleString('en-IE')}`
}

interface Inputs {
  monthlySales: number
  stockPct: number
  staffPct: number
  onlinePct: number
  phoneCalls: number
}

function calculate(inputs: Inputs, voiceEnabled: boolean) {
  const stockCost = (inputs.monthlySales * inputs.stockPct) / 100
  const staffCost = (inputs.monthlySales * inputs.staffPct) / 100
  const stockAfterPct = Math.min(inputs.stockPct, FOOD_TARGET_PCT)
  const staffAfterPct = Math.min(inputs.staffPct, LABOUR_TARGET_PCT)
  const stockSave = (stockCost * (inputs.stockPct - stockAfterPct)) / 100
  const staffSave = (staffCost * (inputs.staffPct - staffAfterPct)) / 100
  const voiceSave = voiceEnabled ? inputs.phoneCalls * VOICE_SAVE_RATE : 0
  const totalMonthly = stockSave + staffSave + voiceSave
  return { stockCost, staffCost, stockAfterPct, staffAfterPct, stockSave, staffSave, voiceSave, totalMonthly, annual: totalMonthly * 12 }
}

type ExportStatus = 'idle' | 'open' | 'submitting' | 'success' | 'error'

export function RoiCalculator({
  block,
  onExport = (payload) => submitLead({ ...payload, source: 'roi-calculator' }),
}: {
  block: RoiCalculatorBlock
  /** Overridable so Kitchen's preview can no-op instead of submitting a real lead. */
  onExport?: (payload: { name: string; email: string; company: string; message: string }) => Promise<void>
}) {
  const symbol = currencySymbol(block.currency)
  const voiceEnabled = block.voiceEnabled !== false
  const showBenchmarkTable = block.showBenchmarkTable !== false

  const [inputs, setInputs] = useState<Inputs>({
    monthlySales: block.defaultMonthlySales ?? 50000,
    stockPct: block.defaultStockPct ?? 30,
    staffPct: block.defaultStaffPct ?? 30,
    onlinePct: block.defaultOnlinePct ?? 25,
    phoneCalls: block.defaultPhoneCalls ?? 200,
  })

  const result = useMemo(() => calculate(inputs, voiceEnabled), [inputs, voiceEnabled])

  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle')

  function setInput(key: keyof Inputs) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setInputs((prev) => ({ ...prev, [key]: Number(e.target.value) }))
  }

  async function handleExportSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setExportStatus('submitting')
    const summary = `ROI Calculator — monthly sales ${formatMoney(inputs.monthlySales, symbol)}, stock ${inputs.stockPct}%, staff ${inputs.staffPct}%, ${inputs.phoneCalls} calls/mo. Estimated savings: ${formatMoney(result.stockSave, symbol)} stock, ${formatMoney(result.staffSave, symbol)} staff, ${formatMoney(result.voiceSave, symbol)} voice AI. Total ${formatMoney(result.totalMonthly, symbol)}/mo (${formatMoney(result.annual, symbol)}/yr).`
    try {
      await onExport({
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        company: String(data.get('company') || ''),
        message: summary,
      })
      setExportStatus('success')
    } catch {
      setExportStatus('error')
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {block.eyebrow && <span className={styles.eyebrow}>{block.eyebrow}</span>}
        {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
        {block.subhead && <p className={styles.subhead}>{block.subhead}</p>}

        <div className={styles.wrap}>
          <div className={styles.inputsCard}>
            <span className={styles.cardLabel}>Store &amp; cost inputs</span>

            <label className={styles.row}>
              <span className={styles.rowLabelLine}>
                <span className={styles.rowLabel}>Monthly sales</span>
                <span className={styles.rowValue}>{formatMoney(inputs.monthlySales, symbol)}</span>
              </span>
              <input
                type="range"
                min={5000}
                max={250000}
                step={1000}
                value={inputs.monthlySales}
                onChange={setInput('monthlySales')}
                className={styles.slider}
              />
            </label>

            <label className={styles.row}>
              <span className={styles.rowLabelLine}>
                <span className={styles.rowLabel}>Monthly stock costs</span>
                <span className={styles.rowValue}>{inputs.stockPct}%</span>
              </span>
              <input
                type="range"
                min={15}
                max={50}
                step={0.5}
                value={inputs.stockPct}
                onChange={setInput('stockPct')}
                className={styles.slider}
              />
            </label>

            <label className={styles.row}>
              <span className={styles.rowLabelLine}>
                <span className={styles.rowLabel}>Monthly staff costs</span>
                <span className={styles.rowValue}>{inputs.staffPct}%</span>
              </span>
              <input
                type="range"
                min={15}
                max={50}
                step={0.5}
                value={inputs.staffPct}
                onChange={setInput('staffPct')}
                className={styles.slider}
              />
            </label>

            <label className={styles.row}>
              <span className={styles.rowLabelLine}>
                <span className={styles.rowLabel}>Online sales</span>
                <span className={styles.rowValue}>{inputs.onlinePct}%</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={inputs.onlinePct}
                onChange={setInput('onlinePct')}
                className={styles.slider}
              />
            </label>

            <label className={styles.row}>
              <span className={styles.rowLabelLine}>
                <span className={styles.rowLabel}>Phone calls</span>
                <span className={styles.rowValue}>{inputs.phoneCalls} / mo</span>
              </span>
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={inputs.phoneCalls}
                onChange={setInput('phoneCalls')}
                className={styles.slider}
              />
            </label>
          </div>

          <div className={styles.resultCard}>
            <span className={styles.resultKicker}>Total monthly savings</span>
            <span className={styles.resultBig}>{formatMoney(result.totalMonthly, symbol)}</span>
            <span className={styles.resultAnnual}>{formatMoney(result.annual, symbol)} / year</span>
            <div className={styles.resultStrip}>
              <div className={styles.resultCell}>
                <span className={styles.resultCellCaption}>Stock savings</span>
                <span className={styles.resultCellValue}>{formatMoney(result.stockSave, symbol)}</span>
              </div>
              <div className={styles.resultCell}>
                <span className={styles.resultCellCaption}>Staff savings</span>
                <span className={styles.resultCellValue}>{formatMoney(result.staffSave, symbol)}</span>
              </div>
              {voiceEnabled && (
                <div className={styles.resultCell}>
                  <span className={styles.resultCellCaption}>Voice AI savings</span>
                  <span className={styles.resultCellValue}>{formatMoney(result.voiceSave, symbol)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {showBenchmarkTable && block.benchmarks && block.benchmarks.length > 0 && (
          <div className={styles.benchmarkTable}>
            <div className={styles.benchmarkHeadRow}>
              <span />
              <span>Current</span>
              <span>With Maistro</span>
              <span>Best target</span>
            </div>
            {block.benchmarks.map((b) => (
              <div key={b._key} className={styles.benchmarkRow}>
                <span className={styles.benchmarkLabel}>{b.label}</span>
                <span>—</span>
                <span>—</span>
                <span>{b.range}</span>
              </div>
            ))}
          </div>
        )}

        {block.disclaimer && <p className={styles.disclaimer}>{block.disclaimer}</p>}

        <div className={styles.exportArea}>
          {exportStatus === 'idle' && (
            <button type="button" className={styles.exportBtn} onClick={() => setExportStatus('open')}>
              {block.exportLabel || 'Export Analysis'}
            </button>
          )}

          {exportStatus === 'open' && (
            <form className={styles.exportForm} onSubmit={handleExportSubmit}>
              <input name="name" placeholder="Name" required className={styles.exportInput} />
              <input name="email" type="email" placeholder="Email" required className={styles.exportInput} />
              <input name="company" placeholder="Company (optional)" className={styles.exportInput} />
              <button type="submit" className={styles.exportBtn}>
                Send my numbers
              </button>
            </form>
          )}

          {exportStatus === 'submitting' && <p className={styles.exportStatus}>Sending…</p>}
          {exportStatus === 'success' && <p className={styles.exportStatus}>Sent — we'll follow up with your numbers.</p>}
          {exportStatus === 'error' && <p className={styles.exportStatus}>Something went wrong — try again.</p>}
        </div>
      </div>
    </section>
  )
}
