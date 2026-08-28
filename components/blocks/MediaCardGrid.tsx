import Image from 'next/image'

import { MediaTileContent } from '@/components/MediaTile'
import type { MediaCardGridBlock } from '@/lib/content/types'
import styles from './MediaCardGrid.module.css'

/** `ImgComponent` defaults to next/image; Kitchen's preview passes a plain-`<img>` stand-in since there's no image optimizer in the Studio bundle. */
export function MediaCardGrid({
  block,
  ImgComponent = Image,
}: {
  block: MediaCardGridBlock
  ImgComponent?: (props: { src: string; alt: string; fill?: boolean; className?: string }) => React.ReactNode
}) {
  const tiles = (block.tiles ?? []).filter((t) => (t.type === 'video' ? t.video?.url : t.image?.url))
  if (!tiles.length) return null

  return (
    <section className={styles.section}>
      {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
      <div className={styles.grid}>
        {tiles.map((tile) => (
          <div key={tile._key} className={styles.tile}>
            <MediaTileContent tile={tile} ImgComponent={ImgComponent} />
          </div>
        ))}
      </div>
    </section>
  )
}
