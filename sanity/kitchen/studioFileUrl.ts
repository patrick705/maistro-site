import type { SanityClient } from 'sanity'

/** File asset refs look like "file-<id>-<extension>" — same direct-CDN pattern used for images, but files have no transform API, so this just builds the plain URL. */
export function studioFileUrlFor(client: SanityClient, ref: string | undefined): string | null {
  if (!ref) return null
  const match = /^file-([a-zA-Z0-9]+)-(\w+)$/.exec(ref)
  if (!match) return null
  const [, id, ext] = match
  const { projectId, dataset } = client.config()
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`
}
