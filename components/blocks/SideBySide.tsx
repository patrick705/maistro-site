import { PortableText } from '@portabletext/react'
import Image from 'next/image'

import { blockDesignStyle } from '@/lib/content/blockDesignStyle'
import type { SideBySideBlock as SideBySideBlockData } from '@/lib/content/types'
import styles from './SideBySide.module.css'

export function SideBySide({ block }: { block: SideBySideBlockData }) {
  // The image is schema-required, but Kitchen's custom save path doesn't
  // enforce that before publish — an incomplete block here shouldn't be able
  // to crash next/image (and with it the whole page) for the rest of the site.
  if (!block.image?.url) return null

  return (
    <section className={styles.section} data-position={block.imagePosition} style={blockDesignStyle(block.design)}>
      <div className={styles.imageWrap}>
        <Image src={block.image.url} alt={block.image.alt} fill className={styles.image} />
      </div>
      <div className={styles.textWrap}>
        <h2 className={styles.heading}>{block.heading}</h2>
        {block.body && block.body.length > 0 && (
          <div className={styles.body}>
            <PortableText value={block.body} />
          </div>
        )}
      </div>
    </section>
  )
}
