/**
 * Populates a fresh Sanity dataset with Site Settings, the brand palette
 * library, and the News Articles, using the same copy as the approved
 * design mockup (lib/content/defaults.ts). Safe to re-run — it upserts by a
 * fixed _id rather than creating duplicates.
 *
 * The marketing pages themselves (Home/Product/Customers/News) live as
 * `page` documents in Sanity now, not seeded content — see
 * docs/page-builder-spec.md.
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
  const { defaultNewsArticles, defaultSiteSettings } = await import('../lib/content/defaults')

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

  console.log('Seeding Brand Palettes…')
  const BRAND_PALETTES = [
    { id: 'brandPalette-violet', name: 'Violet', brandHex: '#3A2A66', accentHex: '#7B5BE6', warmHex: '#F0B84E', posHex: '#4F9E86', isDefault: true },
    { id: 'brandPalette-ink-terracotta', name: 'Ink & Terracotta', brandHex: '#1F2A44', accentHex: '#D8593C', warmHex: '#E8A94B', posHex: '#3E9E7A', isDefault: false },
    { id: 'brandPalette-plum-peach', name: 'Plum & Peach', brandHex: '#4A2340', accentHex: '#EE6C4D', warmHex: '#F0B84E', posHex: '#4F9E86', isDefault: false },
    { id: 'brandPalette-forest-clay', name: 'Forest & Clay', brandHex: '#243E2E', accentHex: '#C85A3E', warmHex: '#E4A34A', posHex: '#C86B45', isDefault: false },
    { id: 'brandPalette-brazil', name: 'Brazil', brandHex: '#1B48D9', accentHex: '#FF5C39', warmHex: '#FFD400', posHex: '#00A651', isDefault: false },
  ]
  await Promise.all(
    BRAND_PALETTES.map((p) =>
      client.createOrReplace({
        _id: p.id,
        _type: 'brandPalette',
        name: p.name,
        brandHex: p.brandHex,
        accentHex: p.accentHex,
        warmHex: p.warmHex,
        posHex: p.posHex,
        isDefaultForNewSites: p.isDefault,
      }),
    ),
  )

  console.log('Seeding Site Settings…')
  const { theme: defaultTheme, ...siteSettingsRest } = defaultSiteSettings
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    ...(assignKeys(siteSettingsRest) as Record<string, unknown>),
    theme: {
      ...(assignKeys({ playful: defaultTheme.playful, showResults: defaultTheme.showResults }) as Record<
        string,
        unknown
      >),
      palette: { _type: 'reference', _ref: 'brandPalette-violet' },
    },
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
