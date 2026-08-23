import { useState } from 'react'

import styles from '../../../components/blocks/ImageGallery.module.css'
import { PreviewImg } from './PreviewImg'
import type { ImageGalleryBlock } from '../../../lib/content/types'

/** Live-preview fork of `components/blocks/ImageGallery.tsx` — same CSS, `next/image` swapped for a plain `<img>`. */
export function PreviewImageGallery({ block }: { block: ImageGalleryBlock }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const images = block.images ?? []
  if (!images.length) return null

  const open = openIndex !== null ? images[openIndex] : null

  return (
    <section className={styles.section}>
      {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
      <div className={styles.grid}>
        {images.map((item, i) => (
          <button
            key={item.image.url}
            type="button"
            className={styles.tile}
            onClick={() => setOpenIndex(i)}
            aria-label={item.caption || `Open image ${i + 1}`}
          >
            <PreviewImg src={item.image.url} alt={item.image.alt} fill className={styles.tileImage} />
          </button>
        ))}
      </div>

      {open && (
        <div className={styles.lightbox} onClick={() => setOpenIndex(null)} role="dialog" aria-modal="true">
          <button type="button" className={styles.closeBtn} onClick={() => setOpenIndex(null)} aria-label="Close">
            ✕
          </button>
          <div className={styles.lightboxImageWrap}>
            <PreviewImg src={open.image.url} alt={open.image.alt} fill className={styles.lightboxImage} />
          </div>
          {open.caption && <p className={styles.caption}>{open.caption}</p>}
        </div>
      )}
    </section>
  )
}
