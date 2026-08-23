import styles from '../../../components/blocks/LogoStrip.module.css'
import { PreviewLogoWall } from './PreviewLogoWall'
import type { LogoStripBlock } from '../../../lib/content/types'

/** Live-preview fork of `components/blocks/LogoStrip.tsx` — same CSS, delegates to `PreviewLogoWall` instead of the real (next/image-based) `LogoWall`. */
export function PreviewLogoStrip({ block }: { block: LogoStripBlock }) {
  const logos = block.logos ?? []
  if (!logos.length) return null

  return (
    <section className={styles.section}>
      {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
      <PreviewLogoWall logos={logos} />
    </section>
  )
}
