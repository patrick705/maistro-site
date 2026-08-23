import createImageUrlBuilder, { type SanityImageSource } from '@sanity/image-url'
import type { SanityClient } from 'sanity'

/**
 * `lib/sanity/image.ts`'s `urlFor` is bound to the frontend's `client.ts`,
 * which reads `NEXT_PUBLIC_*` env vars — not statically inlined by Sanity's
 * own Vite-based Studio bundler (only `SANITY_STUDIO_*` is; this is the same
 * env-var bundling split fixed for `sanity.config.ts` earlier). Building the
 * URL builder from the already-connected Studio client's own `.config()`
 * sidesteps env vars entirely.
 */
export function studioUrlFor(client: SanityClient, source: SanityImageSource) {
  return createImageUrlBuilder(client).image(source)
}
