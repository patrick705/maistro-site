import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ComingSoon'

export const metadata: Metadata = { title: 'Product — Maistro' }

export default function ProductPage() {
  return (
    <ComingSoon
      eyebrow="Product"
      title="The full Product page is coming soon."
      body="We're still building out the channels → Menu Manager → Maistro pipeline walkthrough and module deep-dives for this page. In the meantime, the homepage covers what Maistro does."
    />
  )
}
