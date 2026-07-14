import styles from './NewsGrid.module.css'
import type { NewsArticle } from '@/lib/content/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Card({ article }: { article: NewsArticle }) {
  return (
    <div className={styles.card}>
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
    </div>
  )
}

export function NewsGrid({ articles }: { articles: NewsArticle[] }) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {articles.map((article) => (
          <Card key={article.title} article={article} />
        ))}
      </div>
    </section>
  )
}
