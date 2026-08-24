import { derivePaletteColors } from './colorMath'
import type { SiteTheme, TypePairing, TypeScale } from './types'

/** Font stacks for each named pairing — the families themselves are loaded via next/font in app/layout.tsx. */
export const PAIRINGS: Record<TypePairing, { display: string; body: string; mono: string }> = {
  'Bricolage / Space Grotesk': {
    display: 'var(--font-bricolage), sans-serif',
    body: 'var(--font-space-grotesk), sans-serif',
    mono: 'var(--font-jetbrains-mono), monospace',
  },
  'Instrument Serif / Work Sans': {
    display: 'var(--font-instrument-serif), serif',
    body: 'var(--font-work-sans), sans-serif',
    mono: 'var(--font-ibm-plex-mono), monospace',
  },
  'Sora / DM Sans': {
    display: 'var(--font-sora), sans-serif',
    body: 'var(--font-dm-sans), sans-serif',
    mono: 'var(--font-dm-mono), monospace',
  },
  'Playfair / Manrope': {
    display: 'var(--font-playfair-display), serif',
    body: 'var(--font-manrope), sans-serif',
    mono: 'var(--font-space-mono), monospace',
  },
}

export const TYPE_SCALES: Record<TypeScale, number> = { Compact: 0.88, Default: 1, Large: 1.16 }

export function paletteToCssVars(theme: SiteTheme): Record<string, string> {
  const p = derivePaletteColors(theme.palette)
  const fonts = PAIRINGS[theme.pairing] ?? PAIRINGS['Bricolage / Space Grotesk']
  return {
    '--brand': p.brand,
    '--brand-tint': p.brandTint,
    '--brand-soft': p.brandSoft,
    '--brand-ink': p.brandInk,
    '--warm': p.warm,
    '--warm-deep': p.warmDeep,
    '--pos': p.pos,
    '--pos-tint': p.posTint,
    '--accent': p.accent,
    '--accent-ink': p.accentInk,
    '--surface': p.surface,
    '--playful-display': theme.playful ? 'block' : 'none',
    '--tilt-a': theme.playful ? '-2deg' : '0deg',
    '--tilt-b': theme.playful ? '2deg' : '0deg',
    '--results-display': theme.showResults ? 'block' : 'none',
    '--font-display': fonts.display,
    '--font-body': fonts.body,
    '--font-mono': fonts.mono,
    '--type-scale': String(TYPE_SCALES[theme.typeScale] ?? 1),
  }
}
