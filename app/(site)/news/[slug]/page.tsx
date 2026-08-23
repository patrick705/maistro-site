import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { NewsArticleView } from '@/components/NewsArticleView'
import { getNewsArticleBySlug, getSiteSettings } from '@/lib/sanity/fetch'
import { buildMetadata } from '@/lib/seoMeta'
import { jsonLdScript, newsArticleJsonLd } from '@/lib/structuredData'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [article, siteSettings] = await Promise.all([getNewsArticleBySlug(slug), getSiteSettings()])
  if (!article) return buildMetadata(undefined, 'News', '', siteSettings.seoDefaults)
  return buildMetadata(article.seo, article.title, article.excerpt, siteSettings.seoDefaults)
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getNewsArticleBySlug(slug)

  if (!article) notFound()

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(newsArticleJsonLd(article)) }}
      />
      <NewsArticleView article={article} />
    </main>
  )
}
