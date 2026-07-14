import styles from './PipelineStrip.module.css'

type PipelineItem = { icon: string; label: string }

type PipelineStripContent = {
  channelsLabel: string
  channelsItems: PipelineItem[]
  menuManagerIcon: string
  menuManagerTitle: string
  menuManagerSub: string
  maistroIcon: string
  maistroTitle: string
  maistroSub: string
  outcomesLabel: string
  outcomesItems: PipelineItem[]
}

function Tiles({ items }: { items: PipelineItem[] }) {
  return (
    <div className={styles.tileGrid}>
      {items.map((item) => (
        <div key={item.label} className={styles.tile}>
          <span className={styles.tileIcon}>{item.icon}</span>
          <span className={styles.tileLabel}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function Connector() {
  return (
    <div className={styles.connector}>
      <div className={styles.connectorDot} />
    </div>
  )
}

export function PipelineStrip({ content }: { content: PipelineStripContent }) {
  return (
    <section className={styles.section}>
      <div className={styles.band}>
        <div className={styles.pipe}>
          <div className={styles.groupNode}>
            <div className={styles.groupLabel}>{content.channelsLabel}</div>
            <Tiles items={content.channelsItems} />
          </div>
          <Connector />
          <div className={styles.coreNode} style={{ background: 'var(--accent)' }}>
            <div className={styles.coreIcon}>{content.menuManagerIcon}</div>
            <div className={styles.coreTitle} style={{ color: 'var(--accent-ink)' }}>
              {content.menuManagerTitle}
            </div>
            <div className={styles.coreSub} style={{ color: 'var(--accent-ink)' }}>
              {content.menuManagerSub}
            </div>
          </div>
          <Connector />
          <div className={styles.coreNode} style={{ background: 'var(--warm)' }}>
            <div className={styles.coreIcon}>{content.maistroIcon}</div>
            <div className={styles.coreTitle} style={{ color: 'var(--brand)' }}>
              {content.maistroTitle}
            </div>
            <div className={styles.coreSub} style={{ color: 'var(--warm-deep)' }}>
              {content.maistroSub}
            </div>
          </div>
          <Connector />
          <div className={styles.groupNode}>
            <div className={styles.groupLabel}>{content.outcomesLabel}</div>
            <Tiles items={content.outcomesItems} />
          </div>
        </div>
      </div>
    </section>
  )
}
