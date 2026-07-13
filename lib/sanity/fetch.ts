import { client, isSanityConfigured } from './client'
import { homePageQuery, siteSettingsQuery } from './queries'
import { defaultHomePage, defaultSiteSettings } from '@/lib/content/defaults'
import { mergeDefined } from '@/lib/content/merge'
import type { HomePage, SiteSettings } from '@/lib/content/types'

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
    return mergeDefined(defaultHomePage, data, ['aboutPipeline', 'demoModal'])
  } catch (err) {
    console.warn('[sanity] failed to fetch homePage, using defaults:', err)
    return defaultHomePage
  }
}
