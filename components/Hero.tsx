import styles from './Hero.module.css'
import type { StatBadge } from '@/lib/content/types'

interface HeroContent {
  heroEyebrow: string
  heroHeadlineBefore: string
  heroHeadlineHighlight: string
  heroSubhead: string
  heroPrimaryCta: string
  heroSecondaryCta: string
  heroStats: StatBadge[]
}

export function Hero({
  content,
  secondaryHref = '#',
  renderPrimaryCta,
  style,
}: {
  content: HeroContent
  secondaryHref?: string
  /** Injected rather than hardcoded so this component has no dependency on the live demo-modal — lets the Kitchen CMS preview reuse it with an inert stand-in. */
  renderPrimaryCta: (label: string, className: string) => React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <section className={styles.hero} style={style}>
      <div className={`${styles.shape} ${styles.shapeA}`} />
      <div className={`${styles.shape} ${styles.shapeB}`} />
      <div className={`${styles.shape} ${styles.shapeC}`} />

      <div className={styles.eyebrow}>{content.heroEyebrow}</div>

      <h1 className={styles.headline}>
        {content.heroHeadlineBefore}{' '}
        <span className={styles.headlineHighlight}>{content.heroHeadlineHighlight}</span>
      </h1>

      <p className={styles.subhead}>{content.heroSubhead}</p>

      <div className={styles.ctaRow}>
        {renderPrimaryCta(content.heroPrimaryCta, styles.primaryCta)}
        <a href={secondaryHref} className={styles.secondaryCta}>
          {content.heroSecondaryCta}
        </a>
      </div>

      {content.heroStats.length > 0 && (
        <div className={styles.statsRow}>
          {content.heroStats.map((stat, i) => (
            <div key={i} className={styles.stat} data-variant={stat.variant}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
