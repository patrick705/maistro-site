import type { BlockDesign } from './types'

const HEADING_SCALE: Record<string, number> = { s: 0.8, m: 1, l: 1.25 }
const PADDING_SCALE: Record<string, number> = { compact: 0.65, standard: 1, roomy: 1.4 }

const PALETTE_ROLE_BG: Record<string, string> = {
  surface: 'var(--surface)',
  white: '#fff',
  brand: 'var(--brand)',
  accent: 'var(--accent)',
}

const PALETTE_ROLE_INK: Record<string, string> = {
  surface: 'var(--brand)',
  white: 'var(--brand)',
  brand: 'var(--brand-ink)',
  accent: 'var(--accent-ink)',
}

/**
 * Turns a block's `design` overrides into inline style props for its root
 * element. Each block's own CSS module reads these as CSS custom properties
 * with a fallback to its existing literal (heading font-family, font-size,
 * and vertical padding via `calc(<literal> * var(--block-*-scale, 1))`,
 * background/ink color, and max-width) — so an untouched block renders
 * byte-for-byte as it always did.
 */
export function blockDesignStyle(design: BlockDesign | undefined): React.CSSProperties | undefined {
  if (!design) return undefined
  const vars: Record<string, string> = {}

  if (design.headingFont === 'body') vars['--block-heading-font'] = 'var(--font-body)'
  if (design.headingScale && HEADING_SCALE[design.headingScale] !== 1) {
    vars['--block-heading-scale'] = String(HEADING_SCALE[design.headingScale])
  }
  if (design.padding && PADDING_SCALE[design.padding] !== 1) {
    vars['--block-padding-scale'] = String(PADDING_SCALE[design.padding])
  }
  if (design.paletteRole) {
    vars['--block-bg'] = PALETTE_ROLE_BG[design.paletteRole]
    vars['--block-ink'] = PALETTE_ROLE_INK[design.paletteRole]
  }
  if (design.fullBleed === false) {
    vars['--block-max-width'] = '1200px'
  }

  return Object.keys(vars).length > 0 ? (vars as React.CSSProperties) : undefined
}
