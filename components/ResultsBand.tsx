import styles from './ResultsBand.module.css'
import type { ResultStat } from '@/lib/content/types'

interface ResultsContent {
  resultsEyebrow: string
  resultsHeadline: string
  resultStats: ResultStat[]
}

export function ResultsBand({ content, style }: { content: ResultsContent; style?: React.CSSProperties }) {
  return (
    <section className={styles.section} style={style}>
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
