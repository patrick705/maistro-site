/**
 * Populates a fresh Sanity dataset with the Site Settings and Home Page
 * singletons, using the same copy as the approved design mockup
 * (lib/content/defaults.ts). Safe to re-run — it upserts by a fixed _id
 * rather than creating duplicates.
 *
 * Usage: npm run seed   (requires NEXT_PUBLIC_SANITY_PROJECT_ID and
 * SANITY_API_WRITE_TOKEN in .env.local)
 */
import { randomBytes } from 'node:crypto'

import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

/**
 * Sanity requires every item in an array-of-objects field to have a unique
 * `_key` so the Studio can track/reorder/edit it. The Studio's own editor
 * assigns these automatically, but writing raw objects through the API (as
 * this script does) does not — so every array-of-objects field seeded this
 * way needs one assigned by hand. Walks the whole object tree and adds a
 * `_key` to every array item that's a plain object (portable text blocks,
 * service cards, testimonials, etc.), leaving arrays of primitives
 * (strings, numbers) untouched, since those don't need one.
 */
function assignKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => {
      const processed = assignKeys(item)
      if (processed && typeof processed === 'object' && !Array.isArray(processed)) {
        const obj = processed as Record<string, unknown>
        return { _key: typeof obj._key === 'string' ? obj._key : randomBytes(6).toString('hex'), ...obj }
      }
      return processed
    })
  }
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, v] of Object.entries(value)) {
      result[key] = assignKeys(v)
    }
    return result
  }
  return value
}

async function main() {
  const { getWriteClient, isSanityConfigured } = await import('../lib/sanity/client')
  const {
    defaultCustomersPage,
    defaultHomePage,
    defaultNewsArticles,
    defaultNewsPage,
    defaultProductPage,
    defaultSiteSettings,
  } = await import('../lib/content/defaults')

  if (!isSanityConfigured) {
    console.error(
      '✖ NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Copy .env.local.example to .env.local and fill it in first.',
    )
    process.exit(1)
  }
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('✖ SANITY_API_WRITE_TOKEN is not set. Add a write token to .env.local first.')
    process.exit(1)
  }

  const client = getWriteClient()

  console.log('Seeding Site Settings…')
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    ...(assignKeys(defaultSiteSettings) as Record<string, unknown>),
  })

  console.log('Seeding Home Page…')
  await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    ...(assignKeys(defaultHomePage) as Record<string, unknown>),
  })

  console.log('Seeding Product Page…')
  await client.createOrReplace({
    _id: 'productPage',
    _type: 'productPage',
    ...(assignKeys(defaultProductPage) as Record<string, unknown>),
  })

  console.log('Seeding Customers Page…')
  await client.createOrReplace({
    _id: 'customersPage',
    _type: 'customersPage',
    ...(assignKeys(defaultCustomersPage) as Record<string, unknown>),
  })

  console.log('Seeding News Page…')
  await client.createOrReplace({
    _id: 'newsPage',
    _type: 'newsPage',
    ...(assignKeys(defaultNewsPage) as Record<string, unknown>),
  })

  console.log('Seeding News Articles…')
  await Promise.all(
    defaultNewsArticles.map((article, i) =>
      client.createOrReplace({
        _id: `newsArticle-${i + 1}`,
        _type: 'newsArticle',
        ...(assignKeys(article) as Record<string, unknown>),
        // The `slug` schema field expects Sanity's slug object shape, not a bare string.
        slug: { _type: 'slug', current: article.slug },
      }),
    ),
  )

  console.log('✔ Done. Open /studio to edit the content.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
