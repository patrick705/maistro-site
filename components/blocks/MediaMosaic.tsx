import Image from 'next/image'

import { MediaTileContent } from '@/components/MediaTile'
import type { MediaMosaicBlock } from '@/lib/content/types'
import styles from './MediaMosaic.module.css'

/** `ImgComponent` defaults to next/image; Kitchen's preview passes a plain-`<img>` stand-in since there's no image optimizer in the Studio bundle. */
export function MediaMosaic({
  block,
  ImgComponent = Image,
}: {
  block: MediaMosaicBlock
  ImgComponent?: (props: { src: string; alt: string; fill?: boolean; className?: string }) => React.ReactNode
}) {
  const tiles = (block.tiles ?? []).filter((t) => (t.type === 'video' ? (t.poster?.url || t.video?.url) : t.image?.url))
  if (!tiles.length) return null

  return (
    <section className={styles.section}>
      {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
      <div className={styles.grid}>
        {tiles.map((tile, i) => (
          <div key={tile._key} className={`${styles.tile} ${i === 0 ? styles.lead : ''}`}>
            <MediaTileContent tile={tile} ImgComponent={ImgComponent} />
          </div>
        ))}
      </div>
    </section>
  )
}
