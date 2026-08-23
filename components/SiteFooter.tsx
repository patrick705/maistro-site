import { Logo } from './Logo'
import { SocialLinksRow } from './SocialLinksRow'
import styles from './SiteFooter.module.css'
import type { SocialLink } from '@/lib/content/types'

export function SiteFooter({
  siteName,
  footerText,
  socialLinks,
}: {
  siteName: string
  footerText: string
  socialLinks?: SocialLink[]
}) {
  return (
    <footer className={styles.footer}>
      <Logo siteName={siteName} variant="footer" />
      <span className={styles.copyright}>{footerText}</span>
      {socialLinks && socialLinks.length > 0 && <SocialLinksRow links={socialLinks} />}
    </footer>
  )
}
