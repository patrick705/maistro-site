import type { Metadata } from 'next'

import type { Seo } from './content/types'

export function buildMetadata(seo: Seo | undefined, fallbackTitle: string, fallbackDescription: string): Metadata {
  return {
    title: seo?.metaTitle || fallbackTitle,
    description: seo?.metaDescription || fallbackDescription,
    ...(seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
    ...(seo?.ogImage?.url
      ? { openGraph: { images: [{ url: seo.ogImage.url, alt: seo.ogImage.alt }] } }
      : {}),
  }
}
