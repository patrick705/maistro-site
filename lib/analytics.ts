import type { AnalyticsOverride, Seo, SiteAnalytics } from './content/types'

export interface ResolvedAnalytics {
  gtmId?: string
  ga4Id?: string
  metaPixelId?: string
  googleAdsId?: string
}

/** Off inherits GTM / GA4 / Meta Pixel / Google Ads from Site settings → Analytics & Tracking. */
export function resolveAnalytics(site: SiteAnalytics | undefined, pageSeo: Seo | undefined): ResolvedAnalytics {
  if (pageSeo?.analyticsOverride) {
    const o: AnalyticsOverride = pageSeo.analytics ?? {}
    return {
      gtmId: o.gtmId || undefined,
      ga4Id: o.ga4Id || undefined,
      metaPixelId: o.metaPixelId || undefined,
      googleAdsId: o.googleAdsId || undefined,
    }
  }
  return {
    gtmId: site?.gtmOn ? site.gtmId : undefined,
    ga4Id: site?.ga4On ? site.ga4Id : undefined,
    metaPixelId: site?.metaOn ? site.metaPixelId : undefined,
    googleAdsId: site?.adsOn ? site.googleAdsId : undefined,
  }
}
