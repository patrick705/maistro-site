'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { BookDemoButton } from './BookDemoButton'
import styles from './MobileNavDrawer.module.css'
import type { NavItem, PrimaryCta } from '@/lib/content/types'

export function MobileNavDrawer({
  open,
  onClose,
  navItems,
  primaryCta,
}: {
  open: boolean
  onClose: () => void
  navItems: NavItem[]
  primaryCta: PrimaryCta
}) {
  const pathname = usePathname()

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div className={styles.scrim} onClick={onClose} />
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="Menu">
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Menu</span>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>
        <nav className={styles.drawerNav}>
          {navItems.map((item) => {
            const isAnchor = item.href.includes('#')
            const hrefPath = item.href.split('#')[0] || '/'
            const isActive = !isAnchor && hrefPath === pathname
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={isActive ? styles.drawerLinkActive : styles.drawerLink}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className={styles.drawerCtaWrap} onClick={onClose}>
          <BookDemoButton label={primaryCta.label} href={primaryCta.href} className={styles.drawerCta} />
        </div>
      </div>
    </>
  )
}
