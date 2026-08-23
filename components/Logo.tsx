import Image from 'next/image'

import styles from './Logo.module.css'
import type { SeoImage } from '@/lib/content/types'

function splitAi(name: string) {
  const idx = name.toLowerCase().indexOf('ai')
  if (idx === -1) return { before: name, ai: '', after: '' }
  return { before: name.slice(0, idx), ai: name.slice(idx, idx + 2), after: name.slice(idx + 2) }
}

export function Logo({
  siteName,
  variant,
  logo,
}: {
  siteName: string
  variant: 'header' | 'footer'
  logo?: SeoImage
}) {
  if (logo?.url) {
    return (
      <Image
        src={logo.url}
        alt={logo.alt || siteName}
        width={variant === 'header' ? 132 : 108}
        height={variant === 'header' ? 36 : 30}
        className={variant === 'header' ? styles.headerImage : styles.footerImage}
      />
    )
  }

  const { before, ai, after } = splitAi(siteName)
  return (
    <span className={variant === 'header' ? styles.header : styles.footer}>
      {before}
      {ai && <span className={variant === 'header' ? styles.aiHeader : styles.aiFooter}>{ai}</span>}
      {after}
    </span>
  )
}
