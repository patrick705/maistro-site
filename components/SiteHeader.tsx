'use client'

import { useState } from 'react'

import { BookDemoButton } from './BookDemoButton'
import { Logo } from './Logo'
import { MobileNavDrawer } from './MobileNavDrawer'
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
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={stickyNav ? `${styles.header} ${styles.sticky}` : styles.header}>
      <div className={styles.logoWrap}>
        <Logo siteName={siteName} variant="header" logo={logo} />
      </div>

      <SiteNav navItems={navItems} />

      <div className={styles.headerActions}>
        <BookDemoButton label={primaryCta.label} href={primaryCta.href} className={styles.cta} />

        <button type="button" className={styles.burger} onClick={() => setMenuOpen(true)} aria-label="Open menu">
          ☰
        </button>
      </div>

      <MobileNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} navItems={navItems} primaryCta={primaryCta} />
    </header>
  )
}
