import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'

import styles from './NewsArticleView.module.css'
import { urlFor } from '@/lib/sanity/image'
import type { NewsArticle } from '@/lib/content/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className={styles.paragraph}>{children}</p>,
    h2: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
    h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
    blockquote: ({ children }) => <blockquote className={styles.blockquote}>{children}</blockquote>,
  },
  types: {
    image: ({ value }) => (
      <span className={styles.imageWrap}>
        <Image
          src={urlFor(value).width(1120).fit('max').auto('format').url()}
          alt={value.alt}
          width={1120}
          height={630}
          className={styles.image}
        />
      </span>
    ),
  },
}

export function NewsArticleView({ article }: { article: NewsArticle }) {
  return (
    <article className={styles.section}>
      <Link href="/news" className={styles.backLink}>
        ← All news
      </Link>

      {article.heroImage?.url && (
        <span className={styles.heroImageWrap}>
          <Image
            src={article.heroImage.url}
            alt={article.heroImage.alt || article.title}
            width={1120}
            height={630}
            priority
            className={styles.heroImage}
          />
        </span>
      )}

      <div className={styles.metaRow}>
        <span className={styles.iconBadge} data-variant={article.variant}>
          {article.icon}
        </span>
        <span className={styles.category}>{article.category}</span>
        <span className={styles.date}>{formatDate(article.publishedAt)}</span>
        {article.author && <span className={styles.author}>By {article.author}</span>}
      </div>

      <h1 className={styles.title}>{article.title}</h1>
      <p className={styles.excerpt}>{article.excerpt}</p>

      {article.body && article.body.length > 0 && (
        <div className={styles.body}>
          <PortableText value={article.body} components={portableTextComponents} />
        </div>
      )}
    </article>
  )
}
