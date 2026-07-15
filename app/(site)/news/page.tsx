import type { Metadata } from 'next'

import { NewsGrid } from '@/components/NewsGrid'
import { SimpleHero } from '@/components/SimpleHero'
import { getNewsArticles, getNewsPage } from '@/lib/sanity/fetch'
import { buildMetadata } from '@/lib/seoMeta'

export async function generateMetadata(): Promise<Metadata> {
  const newsPage = await getNewsPage()
  return buildMetadata(newsPage.seo, 'News — Maistro', newsPage.heroSubhead)
}

export default async function NewsPage() {
  const [newsPage, articles] = await Promise.all([getNewsPage(), getNewsArticles()])

  return (
    <main>
      <SimpleHero content={newsPage} headlineClamp="clamp(40px, 11vw, 78px)" />
      <NewsGrid articles={articles} />
    </main>
  )
}
