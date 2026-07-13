import { createClient, type SanityClient } from 'next-sanity'
import { apiVersion, dataset, isSanityConfigured, projectId, readToken } from './env'

/**
 * Read client for public site rendering. Uses the CDN for speed; falls back
 * to `null` project id handling in ./fetch.ts when Sanity isn't configured yet.
 */
export const client: SanityClient = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: true,
  token: readToken || undefined,
  perspective: 'published',
})

/** Write client for server-only mutations (lead capture, seed script). */
export function getWriteClient(): SanityClient {
  return createClient({
    projectId: projectId || 'placeholder',
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
  })
}

export { isSanityConfigured }
