import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { NewsArticleView } from '@/components/NewsArticleView'
import { getNewsArticleBySlug } from '@/lib/sanity/fetch'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getNewsArticleBySlug(slug)
  return { title: article ? `${article.title} — Maistro` : 'News — Maistro' }
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getNewsArticleBySlug(slug)

  if (!article) notFound()

  return (
    <main>
      <NewsArticleView article={article} />
    </main>
  )
}
