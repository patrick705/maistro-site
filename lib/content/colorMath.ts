/**
 * Hex <-> HSL conversion and tint/shade derivation, used to turn a palette's
 * 4 base hex values (brand/accent/warm/pos) into the full 10-role color set
 * that `paletteToCssVars` needs, without requiring an editor to pick every
 * shade by hand.
 */

interface Hsl {
  h: number
  s: number
  l: number
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const num = parseInt(full, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
  return '#' + [r, g, b].map((n) => clamp(n).toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): Hsl {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: l * 100 }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  switch (max) {
    case rn:
      h = (gn - bn) / d + (gn < bn ? 6 : 0)
      break
    case gn:
      h = (bn - rn) / d + 2
      break
    default:
      h = (rn - gn) / d + 4
  }
  return { h: h * 60, s: s * 100, l: l * 100 }
}

function hslToRgb({ h, s, l }: Hsl): { r: number; g: number; b: number } {
  const sn = s / 100
  const ln = l / 100
  if (sn === 0) return { r: ln * 255, g: ln * 255, b: ln * 255 }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
  const p = 2 * ln - q
  const hue2rgb = (t: number) => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }
  const hn = h / 360
  return {
    r: hue2rgb(hn + 1 / 3) * 255,
    g: hue2rgb(hn) * 255,
    b: hue2rgb(hn - 1 / 3) * 255,
  }
}

function toHsl(hex: string): Hsl {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHsl(r, g, b)
}

function fromHsl(hsl: Hsl): string {
  const { r, g, b } = hslToRgb(hsl)
  return rgbToHex(r, g, b)
}

/** Very light, moderately-saturated version of a color — for tinted borders/fills. */
export function deriveTint(hex: string): string {
  const hsl = toHsl(hex)
  return fromHsl({ h: hsl.h, s: hsl.s * 0.55, l: 83 })
}

/** Even lighter, lower-saturation version — for large soft background fills. */
export function deriveSoft(hex: string): string {
  const hsl = toHsl(hex)
  return fromHsl({ h: hsl.h, s: hsl.s * 0.42, l: 87 })
}

/** Darkened version — for hover/pressed states and deep accents. */
export function deriveDeep(hex: string): string {
  const hsl = toHsl(hex)
  return fromHsl({ h: hsl.h, s: Math.min(100, hsl.s * 1.1), l: hsl.l * 0.52 })
}

/** Near-white neutral page background carrying a faint hue cast from the brand color. */
export function deriveSurface(hex: string): string {
  const hsl = toHsl(hex)
  return fromHsl({ h: hsl.h, s: Math.min(hsl.s, 22), l: 96 })
}

/** Readable text/icon color on top of a solid fill of `hex` (WCAG-ish luminance check). */
export function deriveInk(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#1A1A1A' : '#FFFFFF'
}

export interface PaletteBase {
  brandHex: string
  accentHex: string
  warmHex: string
  posHex: string
  // Optional per-role overrides — when unset, the role is auto-derived from
  // the 4 base colors above (see Kitchen's "Colour roles" panel).
  surfaceHex?: string
  brandTintHex?: string
  brandSoftHex?: string
  brandInkHex?: string
  accentInkHex?: string
  warmDeepHex?: string
  posTintHex?: string
  bodyHex?: string
}

export interface DerivedPaletteColors {
  brand: string
  brandTint: string
  brandSoft: string
  brandInk: string
  warm: string
  warmDeep: string
  pos: string
  posTint: string
  accent: string
  accentInk: string
  surface: string
  body: string
}

/** Flat neutral used for long-form body copy — unlike the other roles this isn't derived from brand hue. */
const DEFAULT_BODY = '#4a4636'

/** Expands a palette's 4 editable base colors into the full CSS-variable color set, honoring any per-role overrides. */
export function derivePaletteColors(base: PaletteBase): DerivedPaletteColors {
  return {
    brand: base.brandHex,
    brandTint: base.brandTintHex || deriveTint(base.brandHex),
    brandSoft: base.brandSoftHex || deriveSoft(base.brandHex),
    brandInk: base.brandInkHex || deriveInk(base.brandHex),
    warm: base.warmHex,
    warmDeep: base.warmDeepHex || deriveDeep(base.warmHex),
    pos: base.posHex,
    posTint: base.posTintHex || deriveTint(base.posHex),
    accent: base.accentHex,
    accentInk: base.accentInkHex || deriveInk(base.accentHex),
    surface: base.surfaceHex || deriveSurface(base.brandHex),
    body: base.bodyHex || DEFAULT_BODY,
  }
}
