import { ImageUploadField, type SanityImageValue } from '../ImageUploadField'
import { kitchen } from '../theme'
import { useKitchenPatch } from '../useKitchenPatch'

interface SiteSettingsDoc {
  _id: string
  seoDefaults?: {
    metaTitleSuffix?: string
    defaultMetaDescription?: string
    defaultOgImage?: SanityImageValue
    twitterHandle?: string
  }
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

export function SeoDefaultsSettings() {
  const { doc, patch } = useKitchenPatch('siteSettings', 'siteSettings')
  const settings = doc as SiteSettingsDoc | null
  if (!settings) return <div style={{ padding: 24, color: kitchen.textFaint }}>Loading…</div>

  const seo = settings.seoDefaults ?? {}

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '26px 24px 72px' }}>
      <h1 style={{ margin: '0 0 5px', fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700 }}>SEO defaults</h1>
      <div style={{ fontSize: 11, color: kitchen.textMuted, fontFamily: kitchen.fontMono, marginBottom: 22 }}>
        siteSettings.seoDefaults — used when a page has no SEO fields of its own
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Field label="Title suffix" hint='Appended to every page title, e.g. "— Maistro".'>
          <input style={inputStyle} value={seo.metaTitleSuffix ?? ''} onChange={(e) => patch({ seoDefaults: { ...seo, metaTitleSuffix: e.target.value } })} />
        </Field>

        <Field label="Default meta description">
          <textarea
            style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
            value={seo.defaultMetaDescription ?? ''}
            onChange={(e) => patch({ seoDefaults: { ...seo, defaultMetaDescription: e.target.value } })}
          />
        </Field>

        <Field label="Default social share image">
          <ImageUploadField value={seo.defaultOgImage} onChange={(v) => patch({ seoDefaults: { ...seo, defaultOgImage: v } })} />
        </Field>

        <Field label="X / Twitter handle" hint="e.g. @maistroapp. Leave empty to omit Twitter card metadata.">
          <input style={inputStyle} value={seo.twitterHandle ?? ''} onChange={(e) => patch({ seoDefaults: { ...seo, twitterHandle: e.target.value } })} />
        </Field>
      </div>
    </div>
  )
}
