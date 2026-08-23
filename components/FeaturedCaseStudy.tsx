import styles from './FeaturedCaseStudy.module.css'

type Stat = { value: string; label: string }

type CaseStudyContent = {
  caseStudyEyebrow: string
  caseStudyHeadline: string
  caseStudyBody: string
  caseStudyQuote: string
  caseStudyAuthor: string
  caseStudyHeroStat: Stat
  caseStudyStats: Stat[]
}

export function FeaturedCaseStudy({ content, style }: { content: CaseStudyContent; style?: React.CSSProperties }) {
  return (
    <section className={styles.section} style={style}>
      <div className={styles.band}>
        <div className={styles.copy}>
          <div className={styles.eyebrow}>{content.caseStudyEyebrow}</div>
          <h2 className={styles.headline}>{content.caseStudyHeadline}</h2>
          <p className={styles.body}>{content.caseStudyBody}</p>
          <div className={styles.quoteChip}>
            <span className={styles.quoteText}>&ldquo;{content.caseStudyQuote}&rdquo;</span>
          </div>
          <div className={styles.author}>{content.caseStudyAuthor}</div>
        </div>
        <div className={styles.statsCol}>
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>{content.caseStudyHeroStat.value}</div>
            <div className={styles.heroStatLabel}>{content.caseStudyHeroStat.label}</div>
          </div>
          <div className={styles.statRow}>
            {content.caseStudyStats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
