import { NewsGrid } from '../NewsGrid'
import { getNewsArticles } from '@/lib/sanity/fetch'

export async function NewsGridBlockView() {
  const articles = await getNewsArticles()
  return <NewsGrid articles={articles} />
}
