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
  const layout = block.layout ?? 'Grid'
  const containerClass = layout === 'Mosaic' ? styles.mosaic : layout === 'Filmstrip' ? styles.filmstrip : styles.grid
  const wideIndex = layout === 'Mosaic' && images.length > 3 ? 3 : -1

  return (
    <section className={styles.section}>
      {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
      <div className={containerClass}>
        {images.map((item, i) => {
          const tileClass = [
            styles.tile,
            layout === 'Mosaic' && i === 0 && styles.mosaicLead,
            layout === 'Mosaic' && i === wideIndex && styles.mosaicWide,
            layout === 'Filmstrip' && i === 0 && styles.filmstripLead,
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={item.image?.url ?? i}
              type="button"
              className={tileClass}
              onClick={() => item.image?.url && setOpenIndex(i)}
              aria-label={item.caption || `Open image ${i + 1}`}
            >
              {item.image?.url ? (
                <PreviewImg src={item.image.url} alt={item.image.alt} fill className={styles.tileImage} />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f1eef7',
                    color: '#8b83a3',
                    fontSize: 11,
                    textAlign: 'center',
                    padding: 8,
                  }}
                >
                  No image uploaded yet
                </div>
              )}
            </button>
          )
        })}
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
