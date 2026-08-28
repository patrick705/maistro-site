import Image from 'next/image'

import { MediaTileContent } from '@/components/MediaTile'
import type { ScrollGalleryBlock } from '@/lib/content/types'
import styles from './ScrollGallery.module.css'

/** `ImgComponent` defaults to next/image; Kitchen's preview passes a plain-`<img>` stand-in since there's no image optimizer in the Studio bundle. */
export function ScrollGallery({
  block,
  ImgComponent = Image,
}: {
  block: ScrollGalleryBlock
  ImgComponent?: (props: { src: string; alt: string; fill?: boolean; className?: string }) => React.ReactNode
}) {
  const tiles = (block.tiles ?? []).filter((t) => (t.type === 'video' ? (t.poster?.url || t.video?.url) : t.image?.url))
  if (!tiles.length) return null

  return (
    <section className={styles.section}>
      {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
      <div className={styles.strip}>
        {tiles.map((tile, i) => (
          <div key={tile._key} className={`${styles.tile} ${i === 0 ? styles.tileLead : ''}`}>
            <MediaTileContent tile={tile} ImgComponent={ImgComponent} />
          </div>
        ))}
      </div>
    </section>
  )
}
