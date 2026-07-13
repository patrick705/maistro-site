import { Logo } from './Logo'
import styles from './SiteFooter.module.css'

export function SiteFooter({ siteName, footerText }: { siteName: string; footerText: string }) {
  return (
    <footer className={styles.footer}>
      <Logo siteName={siteName} variant="footer" />
      <span className={styles.copyright}>{footerText}</span>
    </footer>
  )
}
