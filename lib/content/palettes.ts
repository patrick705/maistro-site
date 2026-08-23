import { derivePaletteColors } from './colorMath'
import type { BrandPalette } from './types'

export function paletteToCssVars(
  palette: BrandPalette,
  playful: boolean,
  showResults: boolean,
): Record<string, string> {
  const p = derivePaletteColors(palette)
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
    '--playful-display': playful ? 'block' : 'none',
    '--tilt-a': playful ? '-2deg' : '0deg',
    '--tilt-b': playful ? '2deg' : '0deg',
    '--results-display': showResults ? 'block' : 'none',
  }
}
