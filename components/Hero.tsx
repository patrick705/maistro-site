import { BookDemoButton } from './BookDemoButton'
import styles from './Hero.module.css'
import type { HomePage } from '@/lib/content/types'

type HeroContent = Pick<
  HomePage,
  'heroEyebrow' | 'heroHeadlineBefore' | 'heroHeadlineHighlight' | 'heroSubhead' | 'heroPrimaryCta' | 'heroSecondaryCta' | 'heroStats'
>

export function Hero({ content, secondaryHref = '#' }: { content: HeroContent; secondaryHref?: string }) {
  return (
    <section className={styles.hero}>
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
        <BookDemoButton label={content.heroPrimaryCta} className={styles.primaryCta} />
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
