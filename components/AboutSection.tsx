import styles from './AboutSection.module.css'
import type { AboutPipeline } from '@/lib/content/types'

interface AboutContent {
  aboutEyebrow: string
  aboutHeadlineBefore: string
  aboutHeadlineHighlight: string
  aboutHeadlineAfter: string
  aboutBody: string
  aboutPipeline: AboutPipeline
}

function Connector({ delay }: { delay: string }) {
  return (
    <div className={styles.connector}>
      <div className={styles.connectorDot} style={{ animationDelay: delay }} />
    </div>
  )
}

export function AboutSection({ content, style }: { content: AboutContent; style?: React.CSSProperties }) {
  const p = content.aboutPipeline

  return (
    <section className={styles.section} style={style}>
      <div>
        <div className={styles.eyebrow}>{content.aboutEyebrow}</div>
        <h2 className={styles.headline}>
          {content.aboutHeadlineBefore}
          <span className={styles.headlineHighlight}>{content.aboutHeadlineHighlight}</span>
          {content.aboutHeadlineAfter}
        </h2>
        <p className={styles.body}>{content.aboutBody}</p>
      </div>

      <div className={styles.panel}>
        {/* channels */}
        <div className={styles.node}>
          <div className={styles.iconCol}>
            <div className={`${styles.icon} ${styles.iconMuted}`}>{p.channelsIcon}</div>
            <Connector delay="0s" />
          </div>
          <div className={styles.channelsCard}>
            <div className={styles.channelsLabel}>{p.channelsLabel}</div>
            <div className={styles.tagRow}>
              {p.channelsTags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* menu manager */}
        <div className={styles.node}>
          <div className={styles.iconCol}>
            <div className={`${styles.icon} ${styles.iconGlow}`} style={{ background: 'var(--accent)' }}>
              {p.menuManagerIcon}
            </div>
            <Connector delay=".6s" />
          </div>
          <div className={styles.coreCard} style={{ background: 'var(--accent)' }}>
            <div className={styles.coreTitle} style={{ color: 'var(--accent-ink)' }}>
              {p.menuManagerTitle}
            </div>
            <div className={styles.coreSub} style={{ color: 'var(--accent-ink)', opacity: 0.85 }}>
              {p.menuManagerSub}
            </div>
          </div>
        </div>

        {/* maistro */}
        <div className={styles.node}>
          <div className={styles.iconCol}>
            <div className={`${styles.icon} ${styles.iconGlow}`} style={{ background: 'var(--warm)', animationDelay: '.4s' }}>
              {p.maistroIcon}
            </div>
            <Connector delay="1.2s" />
          </div>
          <div className={styles.coreCard} style={{ background: 'var(--warm)' }}>
            <div className={styles.coreTitle} style={{ color: 'var(--brand)' }}>
              {p.maistroTitle}
            </div>
            <div className={styles.coreSub} style={{ color: 'var(--warm-deep)' }}>
              {p.maistroSub}
            </div>
          </div>
        </div>

        {/* delivers */}
        <div className={styles.node}>
          <div className={styles.iconCol}>
            <div className={`${styles.icon} ${styles.iconMuted}`}>{p.deliversIcon}</div>
          </div>
          <div className={styles.outputsCard}>
            <div className={styles.outputsLabel}>{p.deliversLabel}</div>
            <div className={styles.outputsRow}>
              {p.outputs.map((output, i) => (
                <div key={output.label} className={styles.outputTile}>
                  <div className={styles.outputIcon} style={{ animationDelay: `${i * 0.7}s` }}>
                    {output.icon}
                  </div>
                  <div className={styles.outputLabel}>{output.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
