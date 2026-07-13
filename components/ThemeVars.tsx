import type { CSSProperties, ReactNode } from 'react'

import { paletteToCssVars } from '@/lib/content/palettes'
import type { SiteTheme } from '@/lib/content/types'

export function ThemeVars({ theme, children }: { theme: SiteTheme; children: ReactNode }) {
  const style: CSSProperties = {
    width: '100%',
    background: 'var(--surface)',
    fontFamily: 'var(--font-body)',
    ...(paletteToCssVars(theme.palette, theme.playful, theme.showResults) as CSSProperties),
  }

  return <div style={style}>{children}</div>
}
