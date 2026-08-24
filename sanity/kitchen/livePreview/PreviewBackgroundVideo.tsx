import { useClient } from 'sanity'

import styles from '../../../components/blocks/BackgroundVideo.module.css'
import { studioFileUrlFor } from '../studioFileUrl'
import { studioUrlFor } from '../studioImageUrl'
import { PreviewInertCta } from './PreviewInertCta'

const API_VERSION = '2024-01-01'

/**
 * Live-preview fork of `components/blocks/BackgroundVideo.tsx` — same CSS,
 * but resolves the raw video/poster asset refs straight off Kitchen's
 * in-memory draft (no dereferencing query backs this preview) instead of
 * assuming they're already resolved URLs.
 */
export function PreviewBackgroundVideo({ block }: { block: Record<string, any> }) {
  const client = useClient({ apiVersion: API_VERSION })

  const videoUrl =
    typeof block.video === 'string' ? block.video : studioFileUrlFor(client, block.video?.asset?._ref)
  const posterUrl =
    typeof block.posterImage?.url === 'string'
      ? block.posterImage.url
      : block.posterImage?.asset
        ? studioUrlFor(client, block.posterImage).width(1600).url()
        : undefined

  const full = (block.videoHeight ?? 'Full screen') === 'Full screen'
  const overlayCopy = block.overlayCopy !== false
  const scrim = block.scrim !== false
  const hasCopy = Boolean(block.eyebrow || block.heading || block.subhead || block.primaryCta || block.secondaryCta)

  return (
    <section className={`${styles.section} ${full ? styles.sectionFull : styles.sectionThreeQuarter}`}>
      {videoUrl ? (
        <video className={styles.video} src={videoUrl} poster={posterUrl} autoPlay muted loop playsInline />
      ) : (
        posterUrl && <img src={posterUrl} alt="" className={styles.video} />
      )}
      {overlayCopy && scrim && <div className={styles.scrim} />}
      {overlayCopy && hasCopy && (
        <div className={styles.overlay}>
          {block.eyebrow && <span className={styles.eyebrow}>{block.eyebrow}</span>}
          {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
          {block.subhead && <p className={styles.subhead}>{block.subhead}</p>}
          {(block.primaryCta || block.secondaryCta) && (
            <div className={styles.ctas}>
              {block.primaryCta && <PreviewInertCta label={block.primaryCta} className={styles.primaryCta} />}
              {block.secondaryCta && <PreviewInertCta label={block.secondaryCta} className={styles.secondaryCta} />}
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
              {block.primaryCta && <PreviewInertCta label={block.primaryCta} className={styles.belowPrimaryCta} />}
              {block.secondaryCta && <PreviewInertCta label={block.secondaryCta} className={styles.belowSecondaryCta} />}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
