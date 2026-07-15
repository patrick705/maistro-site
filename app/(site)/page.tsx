import type { Metadata } from 'next'

import { AboutSection } from '@/components/AboutSection'
import { ContactSection } from '@/components/ContactSection'
import { DashboardShowcase } from '@/components/DashboardShowcase'
import { Hero } from '@/components/Hero'
import { ResultsBand } from '@/components/ResultsBand'
import { ServicesGrid } from '@/components/ServicesGrid'
import { getHomePage, getSiteSettings } from '@/lib/sanity/fetch'
import { buildMetadata } from '@/lib/seoMeta'
import { jsonLdScript, organizationJsonLd } from '@/lib/structuredData'

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePage()
  return buildMetadata(homePage.seo, 'Maistro — Run your whole operation with one AI', homePage.heroSubhead)
}

export default async function HomePage() {
  const [homePage, siteSettings] = await Promise.all([getHomePage(), getSiteSettings()])

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd(siteSettings, homePage)) }}
      />
      <Hero content={homePage} />
      <DashboardShowcase />
      <AboutSection content={homePage} />
      <ServicesGrid content={homePage} />
      {siteSettings.theme.showResults && <ResultsBand content={homePage} />}
      <ContactSection content={homePage} />
    </main>
  )
}
