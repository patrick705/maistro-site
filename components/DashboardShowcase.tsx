'use client'

import { useState } from 'react'

import styles from './DashboardShowcase.module.css'
import {
  forecastChart,
  forecastKpis,
  onShift,
  overviewChart,
  overviewKpis,
  reportBand,
  reportsKpis,
  rota,
  staffKpis,
  stockAlerts,
  stockKpis,
  stockLevels,
  type Kpi,
  type ProgressItem,
} from '@/lib/content/dashboardData'

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'forecast', label: 'Forecast' },
  { key: 'staff', label: 'Staff' },
  { key: 'stock', label: 'Stock' },
  { key: 'reports', label: 'Reports' },
] as const

type TabKey = (typeof TABS)[number]['key']

function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className={styles.kpi}>
      <div className={styles.kpiLabel}>{kpi.label}</div>
      <div
        className={`${styles.kpiValue} ${kpi.small ? styles.kpiValueSmall : ''} ${
          kpi.valueVariant === 'accent' ? styles.kpiValueAccent : ''
        }`}
      >
        {kpi.value}
      </div>
      <div className={`${styles.kpiDelta} ${kpi.tone === 'pos' ? styles.kpiDeltaPos : ''}`}>{kpi.delta}</div>
    </div>
  )
}

function ProgressRow({ item }: { item: ProgressItem }) {
  const statusColor = item.color === 'warm' ? 'var(--warm-deep)' : `var(--${item.color})`
  const fillColor = `var(--${item.color})`
  return (
    <div>
      <div className={styles.progressHead}>
        <span className={styles.progressName}>{item.name}</span>
        <span className={styles.progressStatus} style={{ color: statusColor }}>
          {item.status}
        </span>
      </div>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${item.percent}%`, background: fillColor }} />
      </div>
    </div>
  )
}

export function DashboardShowcase() {
  const [tab, setTab] = useState<TabKey>('overview')

  return (
    <section className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.dashHeader}>
          <div className={styles.dashHeaderLeft}>
            <span className={styles.dashBadge}>M</span>
            <div>
              <div className={styles.dashTitle}>Operations</div>
              <div className={styles.dashSubtitle}>Camden Road · today</div>
            </div>
          </div>
          <div className={styles.dashHeaderRight}>
            <span className={styles.dashDate}>Mon 6 Jul</span>
            <span className={styles.dashAvatar} />
          </div>
        </div>

        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div>
            <div className={styles.kpiGrid}>
              {overviewKpis.map((k) => (
                <KpiCard key={k.label} kpi={k} />
              ))}
            </div>
            <div className={styles.mainGrid}>
              <div className={styles.panelCard}>
                <div className={styles.panelCardTitleRow}>
                  <span className={styles.panelCardTitle}>Sales — forecast vs actual</span>
                  <div className={styles.legend}>
                    <span className={styles.legendItem}>
                      <span className={styles.legendSwatch} style={{ background: 'var(--brand-soft)' }} />
                      Forecast
                    </span>
                    <span className={styles.legendItem}>
                      <span className={styles.legendSwatch} style={{ background: 'var(--brand)' }} />
                      Actual
                    </span>
                  </div>
                </div>
                <div className={styles.chartRow}>
                  {overviewChart.map((d) => (
                    <div key={d.day} className={styles.barGroup}>
                      <div className={styles.barPair}>
                        <div
                          style={{ width: 13, height: d.forecast, background: 'var(--brand-soft)', borderRadius: '4px 4px 0 0' }}
                        />
                        <div
                          style={{
                            width: 13,
                            height: d.actual,
                            background: d.actualHighlight ? 'var(--accent)' : 'var(--brand)',
                            borderRadius: '4px 4px 0 0',
                          }}
                        />
                      </div>
                      <span className={styles.barLabel}>{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.sideCol}>
                <div className={styles.panelCard}>
                  <div className={styles.panelCardTitle} style={{ marginBottom: 14 }}>
                    On shift now
                  </div>
                  <div className={styles.progressBlock}>
                    {onShift.map((p) => (
                      <div key={p.name} className={styles.personRow}>
                        <span className={styles.avatar} style={{ background: `var(--${p.color})` }} />
                        <div>
                          <div className={styles.personName}>{p.name}</div>
                          <div className={styles.personRole}>{p.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.panelCard}>
                  <div className={styles.panelCardTitle} style={{ marginBottom: 14 }}>
                    Stock alerts
                  </div>
                  <div className={styles.progressBlock}>
                    {stockAlerts.map((item) => (
                      <ProgressRow key={item.name} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'forecast' && (
          <div>
            <div className={`${styles.kpiGrid} ${styles.kpiGrid3}`}>
              {forecastKpis.map((k) => (
                <KpiCard key={k.label} kpi={k} />
              ))}
            </div>
            <div className={styles.panelCard}>
              <div className={styles.panelCardTitle} style={{ marginBottom: 20 }}>
                Predicted sales — next 7 days
              </div>
              <div className={styles.chartRow}>
                {forecastChart.map((d) => (
                  <div key={d.day} className={styles.barGroup}>
                    <div className={styles.barSingle}>
                      <div
                        style={{
                          width: 26,
                          height: d.height,
                          borderRadius: '5px 5px 0 0',
                          background:
                            d.variant === 'brand' ? 'var(--brand)' : d.variant === 'accent' ? 'var(--accent)' : 'var(--brand-soft)',
                        }}
                      />
                    </div>
                    <span className={styles.barLabel}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'staff' && (
          <div>
            <div className={`${styles.kpiGrid} ${styles.kpiGrid3}`}>
              {staffKpis.map((k) => (
                <KpiCard key={k.label} kpi={k} />
              ))}
            </div>
            <div className={styles.panelCard}>
              <div className={styles.panelCardTitle} style={{ marginBottom: 16 }}>
                Today&apos;s rota · Camden Road
              </div>
              <div className={styles.progressBlock}>
                {rota.map((r) => (
                  <div key={r.name} className={styles.rotaRow}>
                    <span className={styles.rotaName}>{r.name}</span>
                    <div className={styles.rotaTrack}>
                      <div
                        className={styles.rotaBar}
                        style={{ left: `${r.left}%`, width: `${r.width}%`, background: `var(--${r.color})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.rotaAxis}>
                <span>9a</span>
                <span>12p</span>
                <span>3p</span>
                <span>6p</span>
                <span>9p</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'stock' && (
          <div>
            <div className={`${styles.kpiGrid} ${styles.kpiGrid3}`}>
              {stockKpis.map((k) => (
                <KpiCard key={k.label} kpi={k} />
              ))}
            </div>
            <div className={styles.panelCard}>
              <div className={styles.panelCardTitle} style={{ marginBottom: 16 }}>
                Stock levels
              </div>
              <div className={styles.progressBlock}>
                {stockLevels.map((item) => (
                  <ProgressRow key={item.name} item={item} />
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'reports' && (
          <div>
            <div className={styles.kpiGrid}>
              {reportsKpis.map((k) => (
                <KpiCard key={k.label} kpi={k} />
              ))}
            </div>
            <div className={styles.reportBand}>
              <div>
                <div className={styles.reportBandTitle}>{reportBand.title}</div>
                <div className={styles.reportBandSub}>{reportBand.subtitle}</div>
              </div>
              <span className={styles.reportBandPill}>{reportBand.pill}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
