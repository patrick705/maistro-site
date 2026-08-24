/**
 * Fixed Kitchen CMS admin-chrome brand — deliberately separate from the
 * site's own editable brand palette (`brandPalette` documents). The CMS
 * shell always looks like this, regardless of what palette the site itself
 * is currently using.
 */
export const kitchen = {
  ink: '#3A2A66',
  accent: '#7B5BE6',
  accentDeep: '#6a49d8',
  warm: '#F0B84E',
  danger: '#a4413f',
  surface: '#F4F0F7',
  white: '#fff',
  border: '#e2dced',
  borderSoft: '#e6e1ef',
  borderDashed: '#cdc4e0',
  borderInput: '#ddd6ea',
  textMuted: '#8b83a3',
  textFaint: '#a9a2bd',
  textBody: '#4b4269',
  textSubtle: '#6b6288',
  fontDisplay: "'Bricolage Grotesque', sans-serif",
  // Reads the site's own --kitchen-font-body custom property when "Use this
  // pairing for the CMS too" is on (set by KitchenTool.tsx on the root
  // container); falls back to Kitchen's own Space Grotesk otherwise.
  fontBody: 'var(--kitchen-font-body, "Space Grotesk", system-ui, sans-serif)',
  fontMono: "'JetBrains Mono', monospace",
}

export const googleFontsHref =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@600;700;800&family=Manrope:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"

/** Literal font stacks for the Type Pairing previews — Kitchen loads these itself via googleFontsHref, it has no next/font-generated CSS variables. */
export const PAIRING_FONTS: Record<string, { display: string; body: string; mono: string }> = {
  'Bricolage / Space Grotesk': { display: "'Bricolage Grotesque', sans-serif", body: "'Space Grotesk', sans-serif", mono: "'JetBrains Mono', monospace" },
  'Instrument Serif / Work Sans': { display: "'Instrument Serif', serif", body: "'Work Sans', sans-serif", mono: "'IBM Plex Mono', monospace" },
  'Sora / DM Sans': { display: "'Sora', sans-serif", body: "'DM Sans', sans-serif", mono: "'DM Mono', monospace" },
  'Playfair / Manrope': { display: "'Playfair Display', serif", body: "'Manrope', sans-serif", mono: "'Space Mono', monospace" },
}
