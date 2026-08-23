'use client'

import { useState } from 'react'
import Image from 'next/image'

import type { ImageGalleryBlock } from '@/lib/content/types'
import styles from './ImageGallery.module.css'

export function ImageGallery({ block }: { block: ImageGalleryBlock }) {
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
            <Image src={item.image.url} alt={item.image.alt} fill className={styles.tileImage} />
          </button>
        ))}
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
