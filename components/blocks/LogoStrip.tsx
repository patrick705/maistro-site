import { LogoWall } from '../LogoWall'
import type { LogoStripBlock } from '@/lib/content/types'
import styles from './LogoStrip.module.css'

export function LogoStrip({ block }: { block: LogoStripBlock }) {
  const logos = block.logos ?? []
  if (!logos.length) return null

  return (
    <section className={styles.section}>
      {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
      <LogoWall logos={logos} />
    </section>
  )
}
