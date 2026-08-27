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

function centsLabel(symbol: string) {
  if (symbol === '£') return '75p'
  if (symbol === '$') return '75¢'
  return '75c'
}

function formatMoney(value: number, symbol: string) {
  return `${symbol}${Math.round(value).toLocaleString('en-IE')}`
}

function formatPct(value: number) {
  return `${value.toFixed(1)}%`
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
  return { stockCost, staffCost, stockAfterPct, staffAfterPct, stockSave, staffSave, voiceSave, totalMonthly }
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

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

  const [inputs, setInputs] = useState<Inputs>({
    monthlySales: block.defaultMonthlySales ?? 50000,
    stockPct: block.defaultStockPct ?? 30,
    staffPct: block.defaultStaffPct ?? 30,
    onlinePct: block.defaultOnlinePct ?? 25,
    phoneCalls: block.defaultPhoneCalls ?? 200,
  })

  const result = useMemo(() => calculate(inputs, voiceEnabled), [inputs, voiceEnabled])
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const onlineRevenue = (inputs.monthlySales * inputs.onlinePct) / 100
  const stockTarget = block.benchmarks?.[0]?.range
  const staffTarget = block.benchmarks?.[1]?.range

  const description = voiceEnabled
    ? `Modelled at ${centsLabel(symbol)} savings and upsell per call, and a ${FOOD_TARGET_PCT}% stock / ${LABOUR_TARGET_PCT}% staff benchmark target`
    : `Modelled at a ${FOOD_TARGET_PCT}% stock / ${LABOUR_TARGET_PCT}% staff benchmark target`

  function setInput(key: keyof Inputs) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setInputs((prev) => ({ ...prev, [key]: Number(e.target.value) }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setStatus('submitting')
    const summary = `ROI Calculator — monthly sales ${formatMoney(inputs.monthlySales, symbol)}, stock ${formatPct(inputs.stockPct)}, staff ${formatPct(inputs.staffPct)}, ${inputs.phoneCalls} calls/mo. Estimated savings: ${formatMoney(result.stockSave, symbol)} stock, ${formatMoney(result.staffSave, symbol)} staff, ${formatMoney(result.voiceSave, symbol)} voice AI. Total ${formatMoney(result.totalMonthly, symbol)}/mo.`
    try {
      await onExport({
        name: '',
        email: String(data.get('email') || ''),
        company: '',
        message: summary,
      })
      setStatus('success')
    } catch {
      setStatus('error')
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
            <span className={styles.cardLabel}>Sales &amp; operating costs</span>

            <label className={styles.row}>
              <span className={styles.rowLabelLine}>
                <span className={styles.rowLabel}>Monthly sales</span>
                <span className={styles.rowValue}>{formatMoney(inputs.monthlySales, symbol)} / mo</span>
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
                <span className={styles.rowValue}>
                  {formatMoney(result.stockCost, symbol)} ({formatPct(inputs.stockPct)})
                </span>
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
              {stockTarget && <span className={styles.targetHint}>target {stockTarget}</span>}
            </label>

            <label className={styles.row}>
              <span className={styles.rowLabelLine}>
                <span className={styles.rowLabel}>Monthly staff costs</span>
                <span className={styles.rowValue}>
                  {formatMoney(result.staffCost, symbol)} ({formatPct(inputs.staffPct)})
                </span>
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
              {staffTarget && <span className={styles.targetHint}>target {staffTarget}</span>}
            </label>

            <label className={styles.row}>
              <span className={styles.rowLabelLine}>
                <span className={styles.rowLabel}>Online sales</span>
                <span className={styles.rowValue}>{formatPct(inputs.onlinePct)}</span>
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
              <span className={styles.subHint}>{formatMoney(onlineRevenue, symbol)} / mo</span>
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
            <span className={styles.resultKicker}>Monthly net savings unlocked</span>
            <span className={styles.resultBig}>{formatMoney(result.totalMonthly, symbol)}</span>
            <p className={styles.resultDescription}>{description}</p>
            <span className={styles.resultBenchmark}>
              Benchmark: {FOOD_TARGET_PCT}% stock · {LABOUR_TARGET_PCT}% staff
            </span>

            <div className={styles.resultRows}>
              <div className={styles.resultRow}>
                <span className={styles.resultBullet} data-tone="stock" />
                <span className={styles.resultRowLabel}>Maistro stock savings</span>
                <span className={styles.resultRowValue}>{formatMoney(result.stockSave, symbol)}</span>
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultBullet} data-tone="staff" />
                <span className={styles.resultRowLabel}>Maistro staff savings</span>
                <span className={styles.resultRowValue}>{formatMoney(result.staffSave, symbol)}</span>
              </div>
              {voiceEnabled && (
                <div className={styles.resultRow}>
                  <span className={styles.resultBullet} data-tone="voice" />
                  <span className={styles.resultRowLabel}>Maistro voice AI savings</span>
                  <span className={styles.resultRowValue}>{formatMoney(result.voiceSave, symbol)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {block.disclaimer && <p className={styles.disclaimer}>{block.disclaimer}</p>}

        <div className={styles.consultBanner}>
          <span className={styles.consultHeading}>{block.consultationHeading || 'Get a free consultation'}</span>
          {status === 'success' ? (
            <p className={styles.consultStatus}>Sent — we'll follow up with your numbers.</p>
          ) : (
            <form className={styles.consultForm} onSubmit={handleSubmit}>
              <input
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className={styles.consultInput}
              />
              <button type="submit" className={styles.consultBtn} disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : block.exportLabel || 'Get consultation'}
              </button>
            </form>
          )}
          {status === 'error' && <p className={styles.consultStatus}>Something went wrong — try again.</p>}
        </div>
      </div>
    </section>
  )
}
