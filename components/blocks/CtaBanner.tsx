import { blockDesignStyle } from '@/lib/content/blockDesignStyle'
import type { CtaBannerBlock } from '@/lib/content/types'
import styles from './CtaBanner.module.css'

export function CtaBanner({
  block,
  renderCta,
}: {
  block: CtaBannerBlock
  /** Injected rather than hardcoded so this component has no dependency on the live demo-modal — lets the Kitchen CMS preview reuse it with an inert stand-in. */
  renderCta: (label: string, href: string | undefined, className: string) => React.ReactNode
}) {
  return (
    <section className={styles.section} style={blockDesignStyle(block.design)}>
      <h2 className={styles.heading}>{block.heading}</h2>
      {block.subhead && <p className={styles.subhead}>{block.subhead}</p>}
      {renderCta(block.buttonLabel, block.buttonHref, styles.button)}
    </section>
  )
}
