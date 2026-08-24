import { useClient } from 'sanity'

import styles from '../../../components/blocks/BackgroundVideo.module.css'
import { studioFileUrlFor } from '../studioFileUrl'
import { studioUrlFor } from '../studioImageUrl'
import { useLiveQuery } from '../useLiveQuery'
import { PreviewInertCta } from './PreviewInertCta'

const API_VERSION = '2024-01-01'

const NAV_QUERY = `{
  "pages": *[_type == "page" && showInMenu == true && archived != true] | order(menuOrder asc){ title, navLabel },
  "settings": *[_id == "siteSettings"][0]{ siteName, primaryCta }
}`

interface NavPreviewData {
  pages: { title: string; navLabel?: string }[]
  settings: { siteName?: string; primaryCta?: { label?: string } } | null
}

/**
 * Live-preview fork of `components/blocks/BackgroundVideo.tsx` — same CSS,
 * but resolves the raw video/poster asset refs straight off Kitchen's
 * in-memory draft (no dereferencing query backs this preview) instead of
 * assuming they're already resolved URLs.
 */
export function PreviewBackgroundVideo({ block, isFirst }: { block: Record<string, any>; isFirst?: boolean }) {
  const client = useClient({ apiVersion: API_VERSION })

  // Real SiteHeader only overlays the leading block on a page — the same
  // condition is mirrored here so the preview doesn't show a floating nav on
  // a video dropped further down a page, where it would never really appear.
  const showNavOverlay = isFirst !== false && block.menuOverlay !== false
  const { data: nav } = useLiveQuery<NavPreviewData>(showNavOverlay ? NAV_QUERY : '*[false]')

  const videoUrl =
    typeof block.video === 'string' ? block.video : studioFileUrlFor(client, block.video?.asset?._ref)
  const posterUrl =
    typeof block.posterImage?.url === 'string'
      ? block.posterImage.url
      : block.posterImage?.asset
        ? studioUrlFor(client, block.posterImage).width(1600).url()
        : undefined

  const full = (block.videoHeight ?? 'Full screen') === 'Full screen'
  const overlayCopy = block.overlayCopy !== false
  const scrim = block.scrim !== false
  const hasCopy = Boolean(block.eyebrow || block.heading || block.subhead || block.primaryCta || block.secondaryCta)

  return (
    <section className={`${styles.section} ${full ? styles.sectionFull : styles.sectionThreeQuarter}`}>
      {showNavOverlay && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '12px 18px',
          }}
        >
          <span
            style={{
              fontWeight: 800,
              letterSpacing: '-0.01em',
              fontSize: 13,
              color: '#fff',
              textShadow: '0 1px 6px rgba(0, 0, 0, 0.55)',
            }}
          >
            {nav?.settings?.siteName || 'Maistro'}
          </span>
          {(nav?.pages ?? []).map((page) => (
            <span
              key={page.title}
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                color: 'rgba(255, 255, 255, 0.92)',
                textShadow: '0 1px 6px rgba(0, 0, 0, 0.55)',
              }}
            >
              {page.navLabel || page.title}
            </span>
          ))}
          <span
            style={{
              marginLeft: 'auto',
              flex: '0 0 auto',
              fontSize: 10,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              padding: '5px 11px',
              borderRadius: 6,
              border: '1px solid rgba(255, 255, 255, 0.7)',
              color: '#fff',
            }}
          >
            {nav?.settings?.primaryCta?.label || 'Book a demo'}
          </span>
        </div>
      )}
      {videoUrl ? (
        <video className={styles.video} src={videoUrl} poster={posterUrl} autoPlay muted loop playsInline />
      ) : (
        posterUrl && <img src={posterUrl} alt="" className={styles.video} />
      )}
      {overlayCopy && scrim && <div className={styles.scrim} />}
      {overlayCopy && hasCopy && (
        <div className={styles.overlay}>
          {block.eyebrow && <span className={styles.eyebrow}>{block.eyebrow}</span>}
          {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
          {block.subhead && <p className={styles.subhead}>{block.subhead}</p>}
          {(block.primaryCta || block.secondaryCta) && (
            <div className={styles.ctas}>
              {block.primaryCta && <PreviewInertCta label={block.primaryCta} className={styles.primaryCta} />}
              {block.secondaryCta && <PreviewInertCta label={block.secondaryCta} className={styles.secondaryCta} />}
            </div>
          )}
        </div>
      )}
      {!overlayCopy && hasCopy && (
        <div className={styles.below}>
          {block.eyebrow && <span className={styles.belowEyebrow}>{block.eyebrow}</span>}
          {block.heading && <h2 className={styles.belowHeading}>{block.heading}</h2>}
          {block.subhead && <p className={styles.belowSubhead}>{block.subhead}</p>}
          {(block.primaryCta || block.secondaryCta) && (
            <div className={styles.belowCtas}>
              {block.primaryCta && <PreviewInertCta label={block.primaryCta} className={styles.belowPrimaryCta} />}
              {block.secondaryCta && <PreviewInertCta label={block.secondaryCta} className={styles.belowSecondaryCta} />}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
