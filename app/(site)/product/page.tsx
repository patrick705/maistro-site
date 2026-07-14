import type { Metadata } from 'next'

import { CtaBand } from '@/components/CtaBand'
import { Hero } from '@/components/Hero'
import { IntegrationsBand } from '@/components/IntegrationsBand'
import { ModuleFeature, ModulesHeading } from '@/components/ModuleFeature'
import { PipelineStrip } from '@/components/PipelineStrip'
import { getProductPage } from '@/lib/sanity/fetch'

export const metadata: Metadata = { title: 'Product — Maistro' }

export default async function ProductPage() {
  const productPage = await getProductPage()

  return (
    <main>
      <Hero content={productPage} secondaryHref="#modules" />
      <PipelineStrip content={productPage} />
      <section id="modules">
        <ModulesHeading eyebrow={productPage.modulesEyebrow} headline={productPage.modulesHeadline} />
        {productPage.modules.map((module, i) => (
          <ModuleFeature key={module.eyebrow} content={module} reversed={i % 2 === 1} />
        ))}
      </section>
      <IntegrationsBand content={productPage} />
      <CtaBand content={productPage} />
    </main>
  )
}
