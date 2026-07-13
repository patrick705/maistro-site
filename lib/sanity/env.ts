export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''

export const writeToken = process.env.SANITY_API_WRITE_TOKEN || ''

export const readToken = process.env.SANITY_API_READ_TOKEN || ''

/** False until a real Sanity project is wired up via .env.local. */
export const isSanityConfigured = Boolean(projectId)

export function studioUrl(path = '') {
  return `/studio${path}`
}
