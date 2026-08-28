import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AnalyticsScripts } from '@/components/AnalyticsScripts'
import { PageBuilder } from '@/components/PageBuilder'
import { resolveAnalytics } from '@/lib/analytics'
import { getPageBySlug, getSiteSettings } from '@/lib/sanity/fetch'
import { buildMetadata } from '@/lib/seoMeta'
import { clientsJsonLd, jsonLdScript } from '@/lib/structuredData'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [page, siteSettings] = await Promise.all([getPageBySlug(slug), getSiteSettings()])
  if (!page) return { title: 'Maistro' }
  return buildMetadata(page.seo, page.title, page.seo?.metaDescription || '', siteSettings.seoDefaults)
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [page, siteSettings] = await Promise.all([getPageBySlug(slug), getSiteSettings()])

  if (!page) notFound()

  const logoStrip = page.blocks.find((b) => b._type === 'logoStripBlock')

  return (
    <main>
      <AnalyticsScripts {...resolveAnalytics(siteSettings.analytics, page.seo)} />
      {logoStrip && 'logos' in logoStrip && logoStrip.logos.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(clientsJsonLd(logoStrip.logos)) }}
        />
      )}
      <PageBuilder blocks={page.blocks} />
    </main>
  )
}
