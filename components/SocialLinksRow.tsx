import type { SocialLink } from '@/lib/content/types'
import styles from './SocialLinksRow.module.css'

const PLATFORM_ICON: Record<SocialLink['platform'], string> = {
  instagram: '📷',
  facebook: '📘',
  linkedin: '💼',
  x: '✕',
  tiktok: '🎵',
  youtube: '▶️',
  other: '🔗',
}

const PLATFORM_LABEL: Record<SocialLink['platform'], string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  x: 'X',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  other: 'Link',
}

export function SocialLinksRow({ links, className }: { links: SocialLink[]; className?: string }) {
  if (!links.length) return null

  return (
    <div className={`${styles.row} ${className ?? ''}`}>
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className={styles.iconLink}
          aria-label={PLATFORM_LABEL[link.platform]}
        >
          <span aria-hidden="true">{PLATFORM_ICON[link.platform]}</span>
        </a>
      ))}
    </div>
  )
}
