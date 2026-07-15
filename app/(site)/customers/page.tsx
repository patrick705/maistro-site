import type { Metadata } from 'next'

import { CtaBand } from '@/components/CtaBand'
import { FeaturedCaseStudy } from '@/components/FeaturedCaseStudy'
import { LogoWall } from '@/components/LogoWall'
import { SimpleHero } from '@/components/SimpleHero'
import { TestimonialGrid } from '@/components/TestimonialGrid'
import { getCustomersPage } from '@/lib/sanity/fetch'
import { buildMetadata } from '@/lib/seoMeta'

export async function generateMetadata(): Promise<Metadata> {
  const customersPage = await getCustomersPage()
  return buildMetadata(customersPage.seo, 'Customers — Maistro', customersPage.heroSubhead)
}

export default async function CustomersPage() {
  const customersPage = await getCustomersPage()

  return (
    <main>
      <SimpleHero content={customersPage} headlineClamp="clamp(40px, 10vw, 80px)" />
      <LogoWall logos={customersPage.logos} />
      <FeaturedCaseStudy content={customersPage} />
      <TestimonialGrid content={customersPage} />
      <CtaBand content={customersPage} />
    </main>
  )
}
