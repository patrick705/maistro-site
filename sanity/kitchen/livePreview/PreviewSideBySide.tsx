import { PortableText } from '@portabletext/react'

import styles from '../../../components/blocks/SideBySide.module.css'
import { PreviewImg } from './PreviewImg'
import { blockDesignStyle } from '../../../lib/content/blockDesignStyle'
import type { SideBySideBlock as SideBySideBlockData } from '../../../lib/content/types'

/** Live-preview fork of `components/blocks/SideBySide.tsx` — same CSS, `next/image` swapped for a plain `<img>`. */
export function PreviewSideBySide({ block }: { block: SideBySideBlockData }) {
  return (
    <section className={styles.section} data-position={block.imagePosition} style={blockDesignStyle(block.design)}>
      <div className={styles.imageWrap}>
        {block.image?.url ? (
          <PreviewImg src={block.image.url} alt={block.image.alt} fill className={styles.image} />
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
              fontSize: 12,
              textAlign: 'center',
              padding: 12,
            }}
          >
            No image uploaded yet
          </div>
        )}
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
