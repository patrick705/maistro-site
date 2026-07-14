import type { Metadata } from 'next'

import { NewsGrid } from '@/components/NewsGrid'
import { SimpleHero } from '@/components/SimpleHero'
import { getNewsArticles, getNewsPage } from '@/lib/sanity/fetch'

export const metadata: Metadata = { title: 'News — Maistro' }

export default async function NewsPage() {
  const [newsPage, articles] = await Promise.all([getNewsPage(), getNewsArticles()])

  return (
    <main>
      <SimpleHero content={newsPage} headlineClamp="clamp(40px, 11vw, 78px)" />
      <NewsGrid articles={articles} />
    </main>
  )
}
