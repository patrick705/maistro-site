import { BookDemoButton } from './BookDemoButton'
import { Logo } from './Logo'
import { SiteNav } from './SiteNav'
import styles from './SiteHeader.module.css'
import type { NavItem } from '@/lib/content/types'

export function SiteHeader({
  siteName,
  navItems,
  ctaLabel,
}: {
  siteName: string
  navItems: NavItem[]
  ctaLabel: string
}) {
  return (
    <header className={styles.header}>
      <div className={styles.logoWrap}>
        <Logo siteName={siteName} variant="header" />
      </div>

      <input type="checkbox" id="navtoggle" className={styles.navToggle} />
      <SiteNav navItems={navItems} />

      <BookDemoButton label={ctaLabel} className={styles.cta} />

      <label htmlFor="navtoggle" className={styles.burger} aria-label="Open menu">
        ☰
      </label>
    </header>
  )
}
