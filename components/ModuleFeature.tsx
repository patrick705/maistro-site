import type { ReactElement } from 'react'

import styles from './ModuleFeature.module.css'

export type ModuleWidgetKey = 'rota' | 'stock' | 'voice' | 'forecast' | 'reports'

type ModuleFeatureContent = {
  icon: string
  eyebrow: string
  headline: string
  body: string
  bullets: string[]
  widget: ModuleWidgetKey
}

function RotaWidget() {
  const rows = [
    { name: 'Ana R.', left: 8, width: 52, color: 'var(--warm)' },
    { name: 'Bruno M.', left: 20, width: 48, color: 'var(--pos)' },
    { name: 'Chloé D.', left: 35, width: 55, color: 'var(--accent)' },
    { name: 'Diego P.', left: 12, width: 40, color: 'var(--brand)' },
  ]
  return (
    <div className={styles.widget}>
      <div className={styles.widgetHead}>Today · Camden Road</div>
      <div className={styles.rotaRows}>
        {rows.map((row) => (
          <div key={row.name} className={styles.rotaRow}>
            <span className={styles.rotaName}>{row.name}</span>
            <div className={styles.rotaTrack}>
              <div
                className={styles.rotaFill}
                style={{ left: `${row.left}%`, width: `${row.width}%`, background: row.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.rotaHours}>
        <span>9a</span>
        <span>12p</span>
        <span>3p</span>
        <span>6p</span>
        <span>9p</span>
      </div>
    </div>
  )
}

function StockWidget() {
  const rows = [
    { name: 'Whole milk', status: 'Reorder', color: 'var(--accent)', fill: 16 },
    { name: 'Oat milk', status: 'Healthy', color: 'var(--pos)', fill: 74 },
    { name: 'Coffee beans', status: 'Healthy', color: 'var(--pos)', fill: 61 },
    { name: 'Syrups', status: 'Low', color: 'var(--warm)', fill: 32 },
  ]
  return (
    <div className={styles.widget}>
      <div className={styles.widgetHead}>Stock levels</div>
      <div className={styles.stockRows}>
        {rows.map((row) => (
          <div key={row.name}>
            <div className={styles.stockRowHead}>
              <span className={styles.stockName}>{row.name}</span>
              <span style={{ color: row.color, fontWeight: 600 }}>{row.status}</span>
            </div>
            <div className={styles.stockTrack}>
              <div className={styles.stockFill} style={{ width: `${row.fill}%`, background: row.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VoiceWidget() {
  return (
    <div className={styles.widget}>
      <div className={styles.widgetHead}>Live call · 0:42</div>
      <div className={styles.chatCol}>
        <div className={styles.bubbleLeft}>&ldquo;Can I get two flat whites and a pain au chocolat?&rdquo;</div>
        <div className={styles.bubbleRight}>
          &ldquo;Two flat whites and a pain au chocolat — anything from today&apos;s specials?&rdquo;
        </div>
        <div className={styles.bubbleLeft}>&ldquo;Add a cinnamon bun.&rdquo;</div>
        <div className={styles.confirmPill}>✓ Order sent to POS · £11.40</div>
      </div>
    </div>
  )
}

function ForecastWidget() {
  const bars = [
    { label: 'M', height: 78, color: 'var(--brand-soft)' },
    { label: 'T', height: 96, color: 'var(--brand-soft)' },
    { label: 'W', height: 88, color: 'var(--brand-soft)' },
    { label: 'T', height: 112, color: 'var(--brand)' },
    { label: 'F', height: 132, color: 'var(--brand)' },
    { label: 'S', height: 145, color: 'var(--warm)' },
    { label: 'S', height: 120, color: 'var(--brand-soft)' },
  ]
  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeadRow}>
        <span className={styles.widgetHead} style={{ marginBottom: 0 }}>
          Next 7 days · forecast
        </span>
        <span className={styles.accuracyBadge}>98% accurate</span>
      </div>
      <div className={styles.forecastBars}>
        {bars.map((bar, i) => (
          <div key={i} className={styles.forecastBar}>
            <div className={styles.forecastBarFill} style={{ height: `${bar.height}px`, background: bar.color }} />
            <span className={styles.forecastBarLabel}>{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportsWidget() {
  const tiles = [
    { label: 'Net sales', value: '£31.4k', delta: '▲ 8% wk', color: 'var(--pos)' },
    { label: 'Labour', value: '22.8%', delta: 'on target', color: '#8a8f9c' },
    { label: 'Gross profit', value: '71%', delta: '▲ 2 pts', color: 'var(--pos)' },
    { label: 'Waste', value: '1.9%', delta: '▼ 0.6 pts', color: 'var(--pos)' },
  ]
  return (
    <div className={styles.widget}>
      <div className={styles.statGrid}>
        {tiles.map((tile) => (
          <div key={tile.label} className={styles.statTile}>
            <div className={styles.statLabel}>{tile.label}</div>
            <div className={styles.statValue}>{tile.value}</div>
            <div className={styles.statDelta} style={{ color: tile.color }}>
              {tile.delta}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const widgets: Record<ModuleWidgetKey, () => ReactElement> = {
  rota: RotaWidget,
  stock: StockWidget,
  voice: VoiceWidget,
  forecast: ForecastWidget,
  reports: ReportsWidget,
}

export function ModulesHeading({ eyebrow, headline }: { eyebrow: string; headline: string }) {
  return (
    <div className={styles.headSection}>
      <div className={styles.headEyebrow}>{eyebrow}</div>
      <h2 className={styles.headHeadline}>{headline}</h2>
    </div>
  )
}

export function ModuleFeature({ content, reversed }: { content: ModuleFeatureContent; reversed: boolean }) {
  const Widget = widgets[content.widget]
  return (
    <section className={styles.section}>
      <div className={`${styles.grid} ${reversed ? styles.reversed : ''}`}>
        <div className={styles.copy}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowIcon}>{content.icon}</span>
            {content.eyebrow}
          </div>
          <h3 className={styles.headline}>{content.headline}</h3>
          <p className={styles.body}>{content.body}</p>
          <div className={styles.bullets}>
            {content.bullets.map((bullet) => (
              <div key={bullet} className={styles.bullet}>
                <span className={styles.check}>✓</span>
                <span className={styles.bulletText}>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.widgetSlot}>
          <Widget />
        </div>
      </div>
    </section>
  )
}
