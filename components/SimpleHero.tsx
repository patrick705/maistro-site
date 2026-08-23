import styles from './SimpleHero.module.css'

type SimpleHeroContent = {
  heroEyebrow: string
  heroHeadlineBefore: string
  heroHeadlineHighlight: string
  heroSubhead: string
}

export function SimpleHero({
  content,
  headlineClamp,
  style,
}: {
  content: SimpleHeroContent
  headlineClamp: string
  style?: React.CSSProperties
}) {
  return (
    <section className={styles.hero} style={style}>
      <div className={styles.eyebrow}>{content.heroEyebrow}</div>
      <h1 className={styles.headline} style={{ ['--simple-hero-clamp' as string]: headlineClamp }}>
        {content.heroHeadlineBefore}{' '}
        <span className={styles.headlineHighlight}>{content.heroHeadlineHighlight}</span>
      </h1>
      <p className={styles.subhead}>{content.heroSubhead}</p>
    </section>
  )
}
