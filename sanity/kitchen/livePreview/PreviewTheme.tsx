import { paletteToCssVars } from '../../../lib/content/palettes'
import type { BrandPalette, TypePairing, TypeScale } from '../../../lib/content/types'
import { useLiveQuery } from '../useLiveQuery'

const THEME_QUERY = `*[_id == "siteSettings"][0]{
  theme{
    "palette": palette->{
      name, brandHex, accentHex, warmHex, posHex,
      surfaceHex, brandTintHex, brandSoftHex, brandInkHex, accentInkHex, warmDeepHex, posTintHex, bodyHex
    },
    playful,
    showResults,
    pairing,
    typeScale
  }
}`

const DEFAULT_PALETTE: BrandPalette = {
  name: 'Default',
  brandHex: '#3A2A66',
  accentHex: '#7B5BE6',
  warmHex: '#F0B84E',
  posHex: '#4F9E86',
}

// Literal family names, since the `next/font`-generated CSS variables those
// components normally read (`--font-bricolage` etc.) don't exist outside the
// Next.js app — Kitchen loads the actual font files itself via googleFontsHref.
const PREVIEW_FONTS: Record<TypePairing, { display: string; body: string; mono: string }> = {
  'Bricolage / Space Grotesk': { display: "'Bricolage Grotesque', sans-serif", body: "'Space Grotesk', sans-serif", mono: "'JetBrains Mono', monospace" },
  'Instrument Serif / Work Sans': { display: "'Instrument Serif', serif", body: "'Work Sans', sans-serif", mono: "'IBM Plex Mono', monospace" },
  'Sora / DM Sans': { display: "'Sora', sans-serif", body: "'DM Sans', sans-serif", mono: "'DM Mono', monospace" },
  'Playfair / Manrope': { display: "'Playfair Display', serif", body: "'Manrope', sans-serif", mono: "'Space Mono', monospace" },
}

/**
 * Kitchen-side equivalent of `components/ThemeVars.tsx` — real block components
 * read colours/fonts from CSS variables set by that wrapper on the live site.
 * The Studio never renders `ThemeVars`, so without this, reused components would
 * render colourless (every `var(--brand)` etc. would be unset).
 */
export function PreviewTheme({ children }: { children: React.ReactNode }) {
  const { data } = useLiveQuery<{
    theme?: { palette?: BrandPalette; playful?: boolean; showResults?: boolean; pairing?: TypePairing; typeScale?: TypeScale }
  }>(THEME_QUERY)
  const theme = data?.theme
  const pairing = theme?.pairing ?? 'Bricolage / Space Grotesk'
  const fonts = PREVIEW_FONTS[pairing] ?? PREVIEW_FONTS['Bricolage / Space Grotesk']

  return (
    <div
      style={{
        width: '100%',
        background: 'var(--surface)',
        fontFamily: 'var(--font-body)',
        ...(paletteToCssVars({
          palette: theme?.palette ?? DEFAULT_PALETTE,
          playful: theme?.playful ?? false,
          showResults: theme?.showResults ?? true,
          pairing,
          typeScale: theme?.typeScale ?? 'Default',
          chromeFont: false,
        }) as React.CSSProperties),
        ['--font-display' as string]: fonts.display,
        ['--font-body' as string]: fonts.body,
        ['--font-mono' as string]: fonts.mono,
      }}
    >
      {children}
    </div>
  )
}
