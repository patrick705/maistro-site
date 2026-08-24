'use client'

import { useState } from 'react'
import Image from 'next/image'

import type { ImageGalleryBlock } from '@/lib/content/types'
import styles from './ImageGallery.module.css'

export function ImageGallery({ block }: { block: ImageGalleryBlock }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  // The image is schema-required per item, but Kitchen's custom save path
  // doesn't enforce that before publish — drop any item that never actually
  // got an image attached instead of crashing next/image for the whole page.
  const images = (block.images ?? []).filter((item) => item.image?.url)
  if (!images.length) return null

  const open = openIndex !== null ? images[openIndex] : null
  const layout = block.layout ?? 'Grid'
  const containerClass = layout === 'Mosaic' ? styles.mosaic : layout === 'Filmstrip' ? styles.filmstrip : styles.grid
  // Mosaic's wide tile sits mid-grid rather than right after the lead tile —
  // index 3 reads as "mid" for the 4-column layout without needing a full
  // second row of images to look intentional.
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
              key={item.image.url}
              type="button"
              className={tileClass}
              onClick={() => setOpenIndex(i)}
              aria-label={item.caption || `Open image ${i + 1}`}
            >
              <Image src={item.image.url} alt={item.image.alt} fill className={styles.tileImage} />
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
            <Image src={open.image.url} alt={open.image.alt} fill className={styles.lightboxImage} />
          </div>
          {open.caption && <p className={styles.caption}>{open.caption}</p>}
        </div>
      )}
    </section>
  )
}
