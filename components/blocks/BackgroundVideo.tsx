import type { BackgroundVideoBlock as BackgroundVideoBlockData } from '@/lib/content/types'
import styles from './BackgroundVideo.module.css'

export function BackgroundVideo({
  block,
  renderPrimaryCta,
  renderSecondaryCta,
}: {
  block: BackgroundVideoBlockData
  renderPrimaryCta: (label: string, className: string) => React.ReactNode
  renderSecondaryCta: (label: string, className: string) => React.ReactNode
}) {
  const full = (block.videoHeight ?? 'Full screen') === 'Full screen'
  const overlayCopy = block.overlayCopy !== false
  const scrim = block.scrim !== false
  const hasCopy = Boolean(block.eyebrow || block.heading || block.subhead || block.primaryCta || block.secondaryCta)

  return (
    <section
      className={`${styles.section} ${full ? styles.sectionFull : styles.sectionThreeQuarter}`}
      style={block.posterImage.url ? { backgroundImage: `url(${block.posterImage.url})` } : undefined}
    >
      <video
        className={styles.video}
        src={block.video}
        poster={block.posterImage.url}
        autoPlay
        muted={block.muted !== false}
        loop={block.loop !== false}
        playsInline
      />
      {overlayCopy && scrim && <div className={styles.scrim} />}
      {overlayCopy && hasCopy && (
        <div className={styles.overlay}>
          {block.eyebrow && <span className={styles.eyebrow}>{block.eyebrow}</span>}
          {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
          {block.subhead && <p className={styles.subhead}>{block.subhead}</p>}
          {(block.primaryCta || block.secondaryCta) && (
            <div className={styles.ctas}>
              {block.primaryCta && renderPrimaryCta(block.primaryCta, styles.primaryCta)}
              {block.secondaryCta && renderSecondaryCta(block.secondaryCta, styles.secondaryCta)}
            </div>
          )}
        </div>
      )}
      {!overlayCopy && hasCopy && (
        <div className={styles.below}>
          {block.eyebrow && <span className={styles.belowEyebrow}>{block.eyebrow}</span>}
          {block.heading && <h2 className={styles.belowHeading}>{block.heading}</h2>}
          {block.subhead && <p className={styles.belowSubhead}>{block.subhead}</p>}
          {(block.primaryCta || block.secondaryCta) && (
            <div className={styles.belowCtas}>
              {block.primaryCta && renderPrimaryCta(block.primaryCta, styles.belowPrimaryCta)}
              {block.secondaryCta && renderSecondaryCta(block.secondaryCta, styles.belowSecondaryCta)}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
