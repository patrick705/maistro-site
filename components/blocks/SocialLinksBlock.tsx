import type { SocialLinksBlockData } from '@/lib/content/types'
import { SocialLinksRow } from '../SocialLinksRow'
import styles from './SocialLinksBlock.module.css'

export function SocialLinksBlock({ block }: { block: SocialLinksBlockData }) {
  const links = block.links ?? []
  if (!links.length) return null

  return (
    <section className={styles.section}>
      {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
      <SocialLinksRow links={links} className={styles.row} />
    </section>
  )
}
