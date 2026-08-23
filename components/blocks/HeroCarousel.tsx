'use client'

import { useState } from 'react'
import Image from 'next/image'

import { blockDesignStyle } from '@/lib/content/blockDesignStyle'
import type { HeroCarouselBlock } from '@/lib/content/types'
import styles from './HeroCarousel.module.css'

export function HeroCarousel({ block }: { block: HeroCarouselBlock }) {
  const [active, setActive] = useState(0)
  const slides = block.slides ?? []
  if (!slides.length) return null

  return (
    <section className={styles.section} style={blockDesignStyle(block.design)}>
      <div className={styles.frame}>
        {slides.map((slide, i) => (
          <div key={slide.image.url} className={styles.slide} style={{ opacity: i === active ? 1 : 0 }}>
            <Image
              src={slide.image.url}
              alt={slide.image.alt}
              fill
              className={styles.image}
              priority={i === 0}
            />
          </div>
        ))}

        {(block.overlayHeading || block.overlaySubhead) && (
          <div className={styles.overlay}>
            {block.eyebrow && <span className={styles.eyebrow}>{block.eyebrow}</span>}
            {block.overlayHeading && <h2 className={styles.heading}>{block.overlayHeading}</h2>}
            {block.overlaySubhead && <p className={styles.subhead}>{block.overlaySubhead}</p>}
          </div>
        )}

        {slides.length > 1 && (
          <div className={styles.dots}>
            {slides.map((slide, i) => (
              <button
                key={slide.image.url}
                type="button"
                className={i === active ? styles.dotActive : styles.dot}
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
