import { AboutSection } from '@/components/AboutSection'
import { ContactSection } from '@/components/ContactSection'
import { DashboardShowcase } from '@/components/DashboardShowcase'
import { Hero } from '@/components/Hero'
import { ResultsBand } from '@/components/ResultsBand'
import { ServicesGrid } from '@/components/ServicesGrid'
import { getHomePage, getSiteSettings } from '@/lib/sanity/fetch'

export default async function HomePage() {
  const [homePage, siteSettings] = await Promise.all([getHomePage(), getSiteSettings()])

  return (
    <main>
      <Hero content={homePage} />
      <DashboardShowcase />
      <AboutSection content={homePage} />
      <ServicesGrid content={homePage} />
      {siteSettings.theme.showResults && <ResultsBand content={homePage} />}
      <ContactSection content={homePage} />
    </main>
  )
}
