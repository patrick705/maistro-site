import { client, isSanityConfigured } from './client'
import {
  newsArticleBySlugQuery,
  newsArticlesQuery,
  pageBySlugQuery,
  pagesForNavQuery,
  siteSettingsQuery,
} from './queries'
import { defaultNewsArticles, defaultSiteSettings } from '@/lib/content/defaults'
import { mergeDefined } from '@/lib/content/merge'
import type { NavItem, NewsArticle, Page, SiteSettings } from '@/lib/content/types'

const REVALIDATE_SECONDS = 60

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured) return defaultSiteSettings
  try {
    const data = await client.fetch<Partial<SiteSettings> | null>(
      siteSettingsQuery,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } },
    )
    const merged = mergeDefined(defaultSiteSettings, data, ['theme', 'primaryCta', 'seoDefaults', 'demoModal'])
    // An unset or dangling `theme.palette` reference dereferences to null in
    // GROQ — fall back to the default palette rather than crash color math.
    // Same for pairing/typeScale/chromeFont on documents saved before those
    // fields existed: GROQ projects them as null rather than omitting them,
    // so mergeDefined's nested-object spread overwrites the default with null.
    if (!merged.theme.palette) merged.theme.palette = defaultSiteSettings.theme.palette
    if (!merged.theme.pairing) merged.theme.pairing = defaultSiteSettings.theme.pairing
    if (!merged.theme.typeScale) merged.theme.typeScale = defaultSiteSettings.theme.typeScale
    if (merged.theme.chromeFont == null) merged.theme.chromeFont = defaultSiteSettings.theme.chromeFont
    return merged
  } catch (err) {
    console.warn('[sanity] failed to fetch siteSettings, using defaults:', err)
    return defaultSiteSettings
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

export async function getPagesForNav(): Promise<NavItem[]> {
  if (!isSanityConfigured) return []
  try {
    const data = await client.fetch<
      { title: string; navLabel?: string; slug: string; menuOrder?: number }[] | null
    >(pagesForNavQuery, {}, { next: { revalidate: REVALIDATE_SECONDS } })
    return (data ?? []).map((page) => ({ label: page.navLabel || page.title, href: `/${page.slug}` }))
  } catch (err) {
    console.warn('[sanity] failed to fetch pages for nav:', err)
    return []
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  if (!isSanityConfigured) return null
  try {
    const data = await client.fetch<Page | null>(
      pageBySlugQuery,
      { slug },
      { next: { revalidate: REVALIDATE_SECONDS } },
    )
    return data ?? null
  } catch (err) {
    console.warn('[sanity] failed to fetch page by slug:', err)
    return null
  }
}
