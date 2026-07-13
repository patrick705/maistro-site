'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { NavItem } from '@/lib/content/types'
import styles from './SiteHeader.module.css'

export function SiteNav({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      {navItems.map((item) => {
        const isAnchor = item.href.includes('#')
        const hrefPath = item.href.split('#')[0] || '/'
        const isActive = !isAnchor && hrefPath === pathname
        return (
          <Link
            key={item.href}
            href={item.href}
            className={isActive ? styles.navLinkActive : styles.navLink}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
