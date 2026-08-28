import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AnalyticsScripts } from '@/components/AnalyticsScripts'
import { PageBuilder } from '@/components/PageBuilder'
import { resolveAnalytics } from '@/lib/analytics'
import { getPageBySlug, getSiteSettings } from '@/lib/sanity/fetch'
import { buildMetadata } from '@/lib/seoMeta'
import { jsonLdScript, organizationJsonLd } from '@/lib/structuredData'

function heroSubhead(page: { blocks: { _type: string; subhead?: string }[] }): string {
  const hero = page.blocks.find((b) => b._type === 'richHeroBlock')
  return (hero as { subhead?: string } | undefined)?.subhead ?? ''
}

export async function generateMetadata(): Promise<Metadata> {
  const [page, siteSettings] = await Promise.all([getPageBySlug('home'), getSiteSettings()])
  if (!page) return { title: 'Maistro' }
  return buildMetadata(page.seo, 'Run your whole operation with one AI', heroSubhead(page), siteSettings.seoDefaults)
}

export default async function HomePage() {
  const [page, siteSettings] = await Promise.all([getPageBySlug('home'), getSiteSettings()])

  if (!page) notFound()

  return (
    <main>
      <AnalyticsScripts {...resolveAnalytics(siteSettings.analytics, page.seo)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(organizationJsonLd(siteSettings, page.seo, heroSubhead(page))),
        }}
      />
      <PageBuilder blocks={page.blocks} />
    </main>
  )
}
