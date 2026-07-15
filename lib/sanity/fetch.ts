import { client, isSanityConfigured } from './client'
import {
  customersPageQuery,
  homePageQuery,
  newsArticleBySlugQuery,
  newsArticlesQuery,
  newsPageQuery,
  productPageQuery,
  siteSettingsQuery,
} from './queries'
import {
  defaultCustomersPage,
  defaultHomePage,
  defaultNewsArticles,
  defaultNewsPage,
  defaultProductPage,
  defaultSiteSettings,
} from '@/lib/content/defaults'
import { mergeDefined } from '@/lib/content/merge'
import type {
  CustomersPage,
  HomePage,
  NewsArticle,
  NewsPage,
  ProductPage,
  SiteSettings,
} from '@/lib/content/types'

const REVALIDATE_SECONDS = 60

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured) return defaultSiteSettings
  try {
    const data = await client.fetch<Partial<SiteSettings> | null>(
      siteSettingsQuery,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } },
    )
    return mergeDefined(defaultSiteSettings, data, ['theme'])
  } catch (err) {
    console.warn('[sanity] failed to fetch siteSettings, using defaults:', err)
    return defaultSiteSettings
  }
}

export async function getHomePage(): Promise<HomePage> {
  if (!isSanityConfigured) return defaultHomePage
  try {
    const data = await client.fetch<Partial<HomePage> | null>(
      homePageQuery,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } },
    )
    return mergeDefined(defaultHomePage, data, ['aboutPipeline', 'demoModal', 'seo', 'dashboardShowcase'])
  } catch (err) {
    console.warn('[sanity] failed to fetch homePage, using defaults:', err)
    return defaultHomePage
  }
}

export async function getProductPage(): Promise<ProductPage> {
  if (!isSanityConfigured) return defaultProductPage
  try {
    const data = await client.fetch<Partial<ProductPage> | null>(
      productPageQuery,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } },
    )
    return mergeDefined(defaultProductPage, data, ['seo'])
  } catch (err) {
    console.warn('[sanity] failed to fetch productPage, using defaults:', err)
    return defaultProductPage
  }
}

export async function getCustomersPage(): Promise<CustomersPage> {
  if (!isSanityConfigured) return defaultCustomersPage
  try {
    const data = await client.fetch<Partial<CustomersPage> | null>(
      customersPageQuery,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } },
    )
    return mergeDefined(defaultCustomersPage, data, ['caseStudyHeroStat', 'seo'])
  } catch (err) {
    console.warn('[sanity] failed to fetch customersPage, using defaults:', err)
    return defaultCustomersPage
  }
}

export async function getNewsPage(): Promise<NewsPage> {
  if (!isSanityConfigured) return defaultNewsPage
  try {
    const data = await client.fetch<Partial<NewsPage> | null>(
      newsPageQuery,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } },
    )
    return mergeDefined(defaultNewsPage, data, ['seo'])
  } catch (err) {
    console.warn('[sanity] failed to fetch newsPage, using defaults:', err)
    return defaultNewsPage
  }
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  if (!isSanityConfigured) return defaultNewsArticles
  try {
    const data = await client.fetch<NewsArticle[] | null>(
      newsArticlesQuery,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } },
    )
    return data && data.length > 0 ? data : defaultNewsArticles
  } catch (err) {
    console.warn('[sanity] failed to fetch newsArticles, using defaults:', err)
    return defaultNewsArticles
  }
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const fallback = () => defaultNewsArticles.find((article) => article.slug === slug) ?? null
  if (!isSanityConfigured) return fallback()
  try {
    const data = await client.fetch<NewsArticle | null>(
      newsArticleBySlugQuery,
      { slug },
      { next: { revalidate: REVALIDATE_SECONDS } },
    )
    return data ?? fallback()
  } catch (err) {
    console.warn('[sanity] failed to fetch newsArticle by slug, using defaults:', err)
    return fallback()
  }
}
