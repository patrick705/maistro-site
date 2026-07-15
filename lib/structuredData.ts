import { SITE_URL } from './site'
import type { HomePage, NewsArticle, SiteSettings } from './content/types'

/**
 * JSON-LD is injected via dangerouslySetInnerHTML, so escape `<` to stop
 * CMS-authored text (title, excerpt, etc.) from closing the <script> tag
 * early — e.g. a title containing "</script><script>...".
 */
export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function organizationJsonLd(siteSettings: SiteSettings, homePage: HomePage) {
  const seo = homePage.seo
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteSettings.siteName,
    url: SITE_URL,
    description: seo?.metaDescription || homePage.heroSubhead,
    ...(seo?.ogImage?.url ? { logo: seo.ogImage.url } : {}),
  }
}

export function newsArticleJsonLd(article: NewsArticle) {
  const seo = article.seo
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: seo?.metaTitle || article.title,
    description: seo?.metaDescription || article.excerpt,
    datePublished: article.publishedAt,
    url: `${SITE_URL}/news/${article.slug}`,
    ...(seo?.ogImage?.url ? { image: [seo.ogImage.url] } : {}),
  }
}
