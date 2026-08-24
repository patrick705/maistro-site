import { BookDemoButton } from './BookDemoButton'
import { Logo } from './Logo'
import { SiteNav } from './SiteNav'
import styles from './SiteHeader.module.css'
import type { NavItem, PrimaryCta, SeoImage } from '@/lib/content/types'

export function SiteHeader({
  siteName,
  logo,
  navItems,
  primaryCta,
  stickyNav,
}: {
  siteName: string
  logo?: SeoImage
  navItems: NavItem[]
  primaryCta: PrimaryCta
  stickyNav?: boolean
}) {
  return (
    <header className={stickyNav ? `${styles.header} ${styles.sticky}` : styles.header}>
      <div className={styles.logoWrap}>
        <Logo siteName={siteName} variant="header" logo={logo} />
      </div>

      <input type="checkbox" id="navtoggle" className={styles.navToggle} />
      <SiteNav navItems={navItems} />

      <BookDemoButton label={primaryCta.label} href={primaryCta.href} className={styles.cta} />

      <label htmlFor="navtoggle" className={styles.burger} aria-label="Open menu">
        ☰
      </label>
    </header>
  )
}
