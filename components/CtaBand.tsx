import { BookDemoButton } from './BookDemoButton'
import styles from './CtaBand.module.css'

type CtaContent = { ctaHeadline: string; ctaSubhead: string; ctaButtonLabel: string }

export function CtaBand({ content }: { content: CtaContent }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.headline}>{content.ctaHeadline}</h2>
      <p className={styles.subhead}>{content.ctaSubhead}</p>
      <BookDemoButton label={content.ctaButtonLabel} className={styles.cta} />
    </section>
  )
}
