import { paletteToCssVars } from '../../../lib/content/palettes'
import type { BrandPalette } from '../../../lib/content/types'
import { useLiveQuery } from '../useLiveQuery'

const THEME_QUERY = `*[_id == "siteSettings"][0]{
  theme{
    "palette": palette->{name, brandHex, accentHex, warmHex, posHex},
    playful,
    showResults
  }
}`

const DEFAULT_PALETTE: BrandPalette = {
  name: 'Default',
  brandHex: '#3A2A66',
  accentHex: '#7B5BE6',
  warmHex: '#F0B84E',
  posHex: '#4F9E86',
}

/**
 * Kitchen-side equivalent of `components/ThemeVars.tsx` — real block components
 * read colours/fonts from CSS variables set by that wrapper on the live site.
 * The Studio never renders `ThemeVars`, so without this, reused components would
 * render colourless (every `var(--brand)` etc. would be unset). Font variables
 * point straight at the family names Kitchen already loads via `googleFontsHref`,
 * since the `next/font`-generated variable names those components normally read
 * (`--font-bricolage` etc.) don't exist outside the Next.js app.
 */
export function PreviewTheme({ children }: { children: React.ReactNode }) {
  const { data } = useLiveQuery<{ theme?: { palette?: BrandPalette; playful?: boolean; showResults?: boolean } }>(THEME_QUERY)
  const theme = data?.theme
  const palette = theme?.palette ?? DEFAULT_PALETTE

  return (
    <div
      style={{
        width: '100%',
        background: 'var(--surface)',
        fontFamily: 'var(--font-body)',
        ['--font-display' as string]: "'Bricolage Grotesque', sans-serif",
        ['--font-body' as string]: "'Space Grotesk', sans-serif",
        ['--font-mono' as string]: "'JetBrains Mono', monospace",
        ...(paletteToCssVars(palette, theme?.playful ?? false, theme?.showResults ?? true) as React.CSSProperties),
      }}
    >
      {children}
    </div>
  )
}
