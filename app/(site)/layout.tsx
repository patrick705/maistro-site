import type { ReactNode } from 'react'

import { DemoModal } from '@/components/DemoModal'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { ThemeVars } from '@/components/ThemeVars'
import { DemoModalProvider } from '@/lib/demo-modal-context'
import { getHomePage, getSiteSettings } from '@/lib/sanity/fetch'

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [siteSettings, homePage] = await Promise.all([getSiteSettings(), getHomePage()])

  return (
    <ThemeVars theme={siteSettings.theme}>
      <DemoModalProvider>
        <SiteHeader
          siteName={siteSettings.siteName}
          navItems={siteSettings.navItems}
          ctaLabel={siteSettings.ctaLabel}
        />
        {children}
        <SiteFooter siteName={siteSettings.siteName} footerText={siteSettings.footerText} />
        <DemoModal content={homePage.demoModal} />
      </DemoModalProvider>
    </ThemeVars>
  )
}
