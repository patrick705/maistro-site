import type { ReactNode } from 'react'

import { DemoModal } from '@/components/DemoModal'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { ThemeVars } from '@/components/ThemeVars'
import { DemoModalProvider } from '@/lib/demo-modal-context'
import { HeaderOverlayProvider } from '@/lib/header-overlay-context'
import { getPagesForNav, getSiteSettings } from '@/lib/sanity/fetch'

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [siteSettings, pageNavItems] = await Promise.all([getSiteSettings(), getPagesForNav()])
  const navItems = [...siteSettings.navItems, ...pageNavItems]

  return (
    <ThemeVars theme={siteSettings.theme}>
      <DemoModalProvider>
        <HeaderOverlayProvider>
          <SiteHeader
            siteName={siteSettings.siteName}
            logo={siteSettings.logo}
            navItems={navItems}
            primaryCta={siteSettings.primaryCta}
            stickyNav={siteSettings.stickyNav}
          />
          {children}
        </HeaderOverlayProvider>
        <SiteFooter
          siteName={siteSettings.siteName}
          footerText={siteSettings.footerText}
          socialLinks={siteSettings.socialLinks}
        />
        <DemoModal content={siteSettings.demoModal} />
      </DemoModalProvider>
    </ThemeVars>
  )
}
