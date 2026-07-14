import styles from './SimpleHero.module.css'

type SimpleHeroContent = {
  heroEyebrow: string
  heroHeadlineBefore: string
  heroHeadlineHighlight: string
  heroSubhead: string
}

export function SimpleHero({ content, headlineClamp }: { content: SimpleHeroContent; headlineClamp: string }) {
  return (
    <section className={styles.hero}>
      <div className={styles.eyebrow}>{content.heroEyebrow}</div>
      <h1 className={styles.headline} style={{ fontSize: headlineClamp }}>
        {content.heroHeadlineBefore}{' '}
        <span className={styles.headlineHighlight}>{content.heroHeadlineHighlight}</span>
      </h1>
      <p className={styles.subhead}>{content.heroSubhead}</p>
    </section>
  )
}
