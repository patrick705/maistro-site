import styles from '../../../components/blocks/LiveVideo.module.css'
import { PreviewImg } from './PreviewImg'
import type { LiveVideoBlock } from '../../../lib/content/types'

/** Live-preview fork of `components/blocks/LiveVideo.tsx` — same CSS, `next/image` swapped for a plain `<img>`. */
export function PreviewLiveVideo({ block }: { block: LiveVideoBlock }) {
  const isLive = Boolean(block.embedUrl)

  return (
    <section className={styles.section}>
      <div className={styles.frame}>
        {isLive ? (
          <>
            <span className={styles.liveBadge}>● LIVE</span>
            <iframe
              src={block.embedUrl}
              className={styles.iframe}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </>
        ) : (
          <div className={styles.offline}>
            {block.posterImage?.url && (
              <PreviewImg src={block.posterImage.url} alt={block.posterImage.alt} fill className={styles.posterImage} />
            )}
            <div className={styles.offlineOverlay}>
              <span className={styles.offlineMessage}>{block.offlineMessage || 'Stream is currently offline'}</span>
            </div>
          </div>
        )}
      </div>
      {block.title && <p className={styles.caption}>{block.title}</p>}
    </section>
  )
}
