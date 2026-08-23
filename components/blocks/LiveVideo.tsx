import Image from 'next/image'

import type { LiveVideoBlock } from '@/lib/content/types'
import styles from './LiveVideo.module.css'

export function LiveVideo({ block }: { block: LiveVideoBlock }) {
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
              <Image
                src={block.posterImage.url}
                alt={block.posterImage.alt}
                fill
                className={styles.posterImage}
              />
            )}
            <div className={styles.offlineOverlay}>
              <span className={styles.offlineMessage}>
                {block.offlineMessage || 'Stream is currently offline'}
              </span>
            </div>
          </div>
        )}
      </div>
      {block.title && <p className={styles.caption}>{block.title}</p>}
    </section>
  )
}
