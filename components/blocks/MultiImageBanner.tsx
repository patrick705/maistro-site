import Image from 'next/image'

import type { MultiImageBannerBlock } from '@/lib/content/types'
import styles from './MultiImageBanner.module.css'

/** `ImgComponent` defaults to next/image; Kitchen's preview passes a plain-`<img>` stand-in since there's no image optimizer in the Studio bundle. */
export function MultiImageBanner({
  block,
  ImgComponent = Image,
}: {
  block: MultiImageBannerBlock
  ImgComponent?: (props: { src: string; alt: string; fill?: boolean; className?: string }) => React.ReactNode
}) {
  const images = (block.images ?? []).filter((item) => item.image?.url)
  if (!images.length) return null

  const hasCopy = Boolean(block.eyebrow || block.heading)

  return (
    <section className={styles.section}>
      <div className={styles.row}>
        {images.map((item) => (
          <div key={item._key} className={styles.imgWrap}>
            <ImgComponent src={item.image!.url} alt={item.image!.alt} fill className={styles.img} />
          </div>
        ))}
      </div>
      <div className={styles.scrim} />
      {hasCopy && (
        <div className={styles.overlay}>
          {block.eyebrow && <span className={styles.eyebrow}>{block.eyebrow}</span>}
          {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
        </div>
      )}
    </section>
  )
}
