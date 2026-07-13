import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ComingSoon'

export const metadata: Metadata = { title: 'Customers — Maistro' }

export default function CustomersPage() {
  return (
    <ComingSoon
      eyebrow="Customers"
      title="Customer stories are coming soon."
      body="We're putting together case studies and testimonials from venues already running on Maistro. Check back soon."
    />
  )
}
