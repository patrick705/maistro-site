'use client'

import nextDynamic from 'next/dynamic'

import config from '@/sanity.config'

// The Studio is an authenticated admin tool with no SEO/SSR benefit, and
// server-rendering it here has caused duplicate-React "invalid hook call"
// errors in dev — load it client-only instead.
const NextStudio = nextDynamic(() => import('next-sanity/studio').then((mod) => mod.NextStudio), {
  ssr: false,
})

export function StudioClient() {
  return <NextStudio config={config} />
}
