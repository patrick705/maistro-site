import { PaletteLibrary } from './PaletteLibrary'
import { TypePairing } from './TypePairing'
import { Toggle } from '../Toggle'
import { kitchen } from '../theme'
import { useKitchenPatch } from '../useKitchenPatch'

interface SiteSettingsDoc {
  _id: string
  theme?: {
    palette?: { _ref?: string }
    playful?: boolean
    showResults?: boolean
    pairing?: string
    typeScale?: string
    chromeFont?: boolean
  }
}

export function ThemeSettings() {
  const { doc, patch } = useKitchenPatch('siteSettings', 'siteSettings')
  const settings = doc as SiteSettingsDoc | null
  if (!settings) return <div style={{ padding: 24, color: kitchen.textFaint }}>Loading…</div>

  const theme = settings.theme ?? {}

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '26px 24px 72px' }}>
      <h1 style={{ margin: '0 0 5px', fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700 }}>Theme</h1>
      <div style={{ fontSize: 11, color: kitchen.textMuted, fontFamily: kitchen.fontMono, marginBottom: 22 }}>siteSettings.theme</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <PaletteLibrary
          currentPaletteId={theme.palette?._ref}
          onApply={(id) => patch({ theme: { ...theme, palette: { _type: 'reference', _ref: id } } })}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Toggle
            label="Playful mode"
            hint="Adds tilted stat cards and floating hero shapes"
            value={Boolean(theme.playful)}
            onChange={(v) => patch({ theme: { ...theme, playful: v } })}
          />
          <Toggle
            label="Show results band"
            hint="Shows the stats band on the homepage"
            value={theme.showResults !== false}
            onChange={(v) => patch({ theme: { ...theme, showResults: v } })}
          />
        </div>

        <TypePairing
          pairing={theme.pairing ?? 'Bricolage / Space Grotesk'}
          typeScale={theme.typeScale ?? 'Default'}
          chromeFont={Boolean(theme.chromeFont)}
          onApplyPairing={(name) => patch({ theme: { ...theme, pairing: name } })}
          onSetScale={(scale) => patch({ theme: { ...theme, typeScale: scale } })}
          onSetChromeFont={(v) => patch({ theme: { ...theme, chromeFont: v } })}
        />
      </div>
    </div>
  )
}
