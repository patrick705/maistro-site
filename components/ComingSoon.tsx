import Link from 'next/link'

import styles from './ComingSoon.module.css'

export function ComingSoon({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <main>
      <section className={styles.section}>
        <div className={styles.eyebrow}>{eyebrow}</div>
        <h1 className={styles.headline}>{title}</h1>
        <p className={styles.body}>{body}</p>
        <Link href="/" className={styles.cta}>
          ← Back to home
        </Link>
      </section>
    </main>
  )
}
