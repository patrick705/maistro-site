import type { ImageBannerBlock } from '@/lib/content/types'
import styles from './ImageBanner.module.css'

export function ImageBanner({
  block,
  renderCta,
}: {
  block: ImageBannerBlock
  renderCta: (label: string, href: string | undefined, className: string) => React.ReactNode
}) {
  const hasCopy = Boolean(block.eyebrow || block.heading || block.subhead || block.buttonLabel)

  return (
    <section className={styles.section} style={block.image?.url ? { backgroundImage: `url(${block.image.url})` } : undefined}>
      <div className={styles.scrim} />
      {hasCopy && (
        <div className={styles.overlay}>
          {block.eyebrow && <span className={styles.eyebrow}>{block.eyebrow}</span>}
          {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
          {block.subhead && <p className={styles.subhead}>{block.subhead}</p>}
          {block.buttonLabel && renderCta(block.buttonLabel, block.buttonHref, styles.button)}
        </div>
      )}
    </section>
  )
}
