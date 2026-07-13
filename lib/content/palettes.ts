import type { PaletteName } from './types'

export interface PaletteColors {
  brand: string
  brandTint: string
  brandSoft: string
  warm: string
  warmDeep: string
  pos: string
  posTint: string
  accent: string
  accentInk: string
  surface: string
}

export const palettes: Record<PaletteName, PaletteColors> = {
  'Ink & Terracotta': {
    brand: '#1F2A44', brandTint: '#b9c0d4', brandSoft: '#ccd3e6',
    warm: '#E8A94B', warmDeep: '#9c6a1c',
    pos: '#3E9E7A', posTint: '#d6ede3',
    accent: '#D8593C', accentInk: '#ffffff',
    surface: '#F5EEE3',
  },
  'Plum & Peach': {
    brand: '#4A2340', brandTint: '#d8bcd0', brandSoft: '#e0c8d8',
    warm: '#F0B84E', warmDeep: '#a76a12',
    pos: '#4F9E86', posTint: '#d9efe7',
    accent: '#EE6C4D', accentInk: '#ffffff',
    surface: '#F6EEE9',
  },
  'Forest & Clay': {
    brand: '#243E2E', brandTint: '#bcd0c4', brandSoft: '#cadbd0',
    warm: '#E4A34A', warmDeep: '#8f5f18',
    pos: '#C86B45', posTint: '#f0ddd0',
    accent: '#C85A3E', accentInk: '#ffffff',
    surface: '#F3EFE4',
  },
  Violet: {
    brand: '#3A2A66', brandTint: '#c7bde6', brandSoft: '#d5cdee',
    warm: '#F0B84E', warmDeep: '#a76a12',
    pos: '#4F9E86', posTint: '#d9efe7',
    accent: '#7B5BE6', accentInk: '#ffffff',
    surface: '#F4F0F7',
  },
  Brazil: {
    brand: '#1B48D9', brandTint: '#c3d0f5', brandSoft: '#C9D6F7',
    warm: '#FFD400', warmDeep: '#c79400',
    pos: '#00A651', posTint: '#dff3e6',
    accent: '#FF5C39', accentInk: '#ffffff',
    surface: '#FBF6EA',
  },
}

export function paletteToCssVars(
  name: PaletteName,
  playful: boolean,
  showResults: boolean,
): Record<string, string> {
  const p = palettes[name] ?? palettes.Violet
  return {
    '--brand': p.brand,
    '--brand-tint': p.brandTint,
    '--brand-soft': p.brandSoft,
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
