/**
 * Populates a fresh Sanity dataset with the Site Settings and Home Page
 * singletons, using the same copy as the approved design mockup
 * (lib/content/defaults.ts). Safe to re-run — it upserts by a fixed _id
 * rather than creating duplicates.
 *
 * Usage: npm run seed   (requires NEXT_PUBLIC_SANITY_PROJECT_ID and
 * SANITY_API_WRITE_TOKEN in .env.local)
 */
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

async function main() {
  const { getWriteClient, isSanityConfigured } = await import('../lib/sanity/client')
  const { defaultHomePage, defaultSiteSettings } = await import('../lib/content/defaults')

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
  await client.createOrReplace({ _id: 'siteSettings', _type: 'siteSettings', ...defaultSiteSettings })

  console.log('Seeding Home Page…')
  await client.createOrReplace({ _id: 'homePage', _type: 'homePage', ...defaultHomePage })

  console.log('✔ Done. Open /studio to edit the content.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
