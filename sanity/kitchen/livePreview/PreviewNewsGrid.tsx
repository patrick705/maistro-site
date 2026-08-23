import styles from '../../../components/NewsGrid.module.css'
import { useLiveQuery } from '../useLiveQuery'
import type { NewsArticle } from '../../../lib/content/types'

const NEWS_QUERY = `*[_type == "newsArticle" && archived != true] | order(publishedAt desc){
  title, excerpt, category, icon, variant, publishedAt, "slug": slug.current
}`

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Card({ article }: { article: NewsArticle }) {
  return (
    <a href={`/news/${article.slug}`} className={styles.card}>
      <div className={styles.thumb} data-variant={article.variant}>
        <span className={styles.thumbIcon}>{article.icon}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.metaRow}>
          <span className={styles.category}>{article.category}</span>
          <span className={styles.date}>{formatDate(article.publishedAt)}</span>
        </div>
        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.excerpt}>{article.excerpt}</p>
        <span className={styles.readMore}>Read →</span>
      </div>
    </a>
  )
}

/** Live-preview fork of `components/NewsGrid.tsx` — same CSS, fetches articles itself (the real one takes them as a server-fetched prop), plain `<a>` instead of `next/link`. */
export function PreviewNewsGrid() {
  const { data: articles } = useLiveQuery<NewsArticle[]>(NEWS_QUERY)

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {(articles ?? []).map((article) => (
          <Card key={article.title} article={article} />
        ))}
      </div>
    </section>
  )
}
