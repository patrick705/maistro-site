import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ComingSoon'

export const metadata: Metadata = { title: 'News — Maistro' }

export default function NewsPage() {
  return (
    <ComingSoon
      eyebrow="News"
      title="News is coming soon."
      body="Product updates, customer wins and guides from the Maistro team will land here."
    />
  )
}
