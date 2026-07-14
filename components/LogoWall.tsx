import styles from './LogoWall.module.css'

export function LogoWall({ logos }: { logos: string[] }) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {logos.map((logo) => (
          <div key={logo} className={styles.tile}>
            <span className={styles.wordmark}>{logo}</span>
          </div>
        ))}
        <div className={styles.moreTile}>
          <span className={styles.moreText}>+ many more</span>
        </div>
      </div>
    </section>
  )
}
