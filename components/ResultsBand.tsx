import styles from './ResultsBand.module.css'
import type { HomePage } from '@/lib/content/types'

type ResultsContent = Pick<HomePage, 'resultsEyebrow' | 'resultsHeadline' | 'resultStats'>

export function ResultsBand({ content }: { content: ResultsContent }) {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <div className={styles.eyebrow}>{content.resultsEyebrow}</div>
        <h2 className={styles.headline}>{content.resultsHeadline}</h2>
      </div>
      <div className={styles.grid}>
        {content.resultStats.map((stat) => (
          <div key={stat.label} className={styles.card} data-variant={stat.variant}>
            <div className={styles.cardEyebrow}>{stat.eyebrow}</div>
            {stat.prefix && <div className={styles.prefix}>{stat.prefix}</div>}
            <div className={styles.value}>{stat.value}</div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
