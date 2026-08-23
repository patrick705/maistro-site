import type { Metadata } from 'next'

import type { Seo, SeoDefaults } from './content/types'

export function buildMetadata(
  seo: Seo | undefined,
  fallbackTitle: string,
  fallbackDescription: string,
  defaults?: SeoDefaults,
): Metadata {
  const title = seo?.metaTitle || fallbackTitle
  const description = seo?.metaDescription || fallbackDescription || defaults?.defaultMetaDescription || ''
  const ogImage = seo?.ogImage?.url ? seo.ogImage : defaults?.defaultOgImage

  return {
    title: defaults?.metaTitleSuffix ? `${title} ${defaults.metaTitleSuffix}` : title,
    description,
    ...(seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
    ...(ogImage?.url ? { openGraph: { images: [{ url: ogImage.url, alt: ogImage.alt }] } } : {}),
    ...(defaults?.twitterHandle
      ? { twitter: { card: 'summary_large_image', site: defaults.twitterHandle } }
      : {}),
  }
}
