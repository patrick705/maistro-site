import type { MediaTile as MediaTileData } from '@/lib/content/types'
import styles from './MediaTile.module.css'

type ImgComponentType = (props: { src: string; alt: string; fill?: boolean; className?: string }) => React.ReactNode

/**
 * Shared innards for one gallery tile (scroll gallery, media mosaic, media
 * card grid) — image or video fill, play-icon overlay, bottom caption scrim.
 * The outer sizing box (position, width/height, grid-area) is each gallery's
 * own concern since that's the one thing that differs between layouts.
 * `ImgComponent` is swapped for a plain `<img>` in the Kitchen preview fork,
 * where next/image's optimizer isn't available.
 */
export function MediaTileContent({ tile, ImgComponent }: { tile: MediaTileData; ImgComponent: ImgComponentType }) {
  const captionMode = tile.captionMode ?? 'none'
  const hasCaption = captionMode !== 'none' && Boolean(tile.title || tile.description)
  // A poster image (static thumbnail) takes priority over the raw video file
  // when both are set — same "swap in the real one later" pattern as the
  // rest of the block's placeholder assets.
  const showPoster = tile.type === 'video' && Boolean(tile.poster?.url)
  const showRawVideo = tile.type === 'video' && !tile.poster?.url && Boolean(tile.video?.url)
  const showImage = tile.type !== 'video' && Boolean(tile.image?.url)

  return (
    <>
      {showRawVideo ? (
        <video className={styles.media} src={tile.video!.url} muted loop playsInline />
      ) : showPoster ? (
        <ImgComponent src={tile.poster!.url} alt={tile.poster!.alt || ''} fill className={styles.media} />
      ) : showImage ? (
        <ImgComponent src={tile.image!.url} alt={tile.image!.alt || ''} fill className={styles.media} />
      ) : null}
      {tile.type === 'video' && <span className={styles.playIcon}>▶</span>}
      {hasCaption && (
        <div className={styles.scrim}>
          {tile.title && <span className={styles.tileTitle}>{tile.title}</span>}
          {captionMode === 'full' && tile.description && <span className={styles.tileDesc}>{tile.description}</span>}
        </div>
      )}
    </>
  )
}
