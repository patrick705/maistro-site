import { PortableText } from '@portabletext/react'

import { blockDesignStyle } from '@/lib/content/blockDesignStyle'
import type { TextBlockData } from '@/lib/content/types'
import styles from './TextBlock.module.css'

export function TextBlock({ block }: { block: TextBlockData }) {
  return (
    <section className={styles.section} style={blockDesignStyle(block.design)}>
      {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
      {block.body && block.body.length > 0 && (
        <div className={styles.body}>
          <PortableText value={block.body} />
        </div>
      )}
    </section>
  )
}
