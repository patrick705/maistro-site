import { SITE_URL } from './site'
import type { ClientLogo, HomePage, NewsArticle, SiteSettings } from './content/types'

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

/**
 * ItemList of client Organizations, so search engines and AI answer engines
 * can see who Maistro's customers are as real entities, not just logo
 * images in a grid.
 */
export function clientsJsonLd(clients: ClientLogo[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: clients.map((client, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Organization',
        name: client.name,
        ...(client.description ? { description: client.description } : {}),
        ...(client.website ? { url: client.website } : {}),
        ...(client.logo?.url ? { logo: client.logo.url } : {}),
      },
    })),
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
