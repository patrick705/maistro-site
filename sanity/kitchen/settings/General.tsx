import { ImageUploadField, type SanityImageValue } from '../ImageUploadField'
import { kitchen } from '../theme'
import { useKitchenPatch } from '../useKitchenPatch'

interface SiteSettingsDoc {
  _id: string
  siteName?: string
  logo?: SanityImageValue
  logoDark?: SanityImageValue
  footerText?: string
  gtmContainerId?: string
}

const inputStyle: React.CSSProperties = {
  padding: '9px 11px',
  border: `1px solid ${kitchen.borderInput}`,
  borderRadius: 9,
  background: '#fff',
  font: 'inherit',
  fontSize: 13,
  color: kitchen.ink,
  width: '100%',
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }}>
        {label}
      </span>
      {children}
      {hint && <span style={{ fontSize: 11, color: kitchen.textMuted }}>{hint}</span>}
    </label>
  )
}

export function GeneralSettings() {
  const { doc, patch } = useKitchenPatch('siteSettings', 'siteSettings')
  const settings = doc as SiteSettingsDoc | null
  if (!settings) return <div style={{ padding: 24, color: kitchen.textFaint }}>Loading…</div>

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '26px 24px 72px' }}>
      <h1 style={{ margin: '0 0 5px', fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700 }}>General</h1>
      <div style={{ fontSize: 11, color: kitchen.textMuted, fontFamily: kitchen.fontMono, marginBottom: 22 }}>siteSettings</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Field label="Site name">
          <input style={inputStyle} value={settings.siteName ?? ''} onChange={(e) => patch({ siteName: e.target.value })} />
        </Field>

        <Field label="Logo" hint="Optional — leave empty to show the site name as a text wordmark instead.">
          <ImageUploadField value={settings.logo} onChange={(v) => patch({ logo: v })} />
        </Field>

        <Field label="Logo (dark background variant)" hint="Optional — used on dark backgrounds if provided.">
          <ImageUploadField value={settings.logoDark} onChange={(v) => patch({ logoDark: v })} />
        </Field>

        <Field label="Footer text">
          <input style={inputStyle} value={settings.footerText ?? ''} onChange={(e) => patch({ footerText: e.target.value })} />
        </Field>

        <Field label="Google Tag Manager container ID" hint="e.g. GTM-XXXXXXX. Leave empty to disable GTM site-wide.">
          <input style={inputStyle} value={settings.gtmContainerId ?? ''} onChange={(e) => patch({ gtmContainerId: e.target.value })} />
        </Field>
      </div>
    </div>
  )
}
