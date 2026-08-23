import { ImageUploadField, type SanityImageValue } from './ImageUploadField'
import { kitchen } from './theme'

interface PageSeo {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImageValue
  noIndex?: boolean
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

/** Per-page SEO & metadata — falls back to Site Settings → SEO defaults on the live site when any of these are left empty. */
export function PageSeoDrawer({
  seo,
  onPatchSeo,
  onClose,
}: {
  seo: PageSeo | undefined
  onPatchSeo: (fields: Record<string, unknown>) => void
  onClose: () => void
}) {
  const s = seo ?? {}

  function patch(fields: Partial<PageSeo>) {
    onPatchSeo({ seo: { ...s, ...fields } })
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 47,
        right: 0,
        bottom: 0,
        width: 440,
        maxWidth: '100%',
        background: '#fff',
        borderLeft: `1px solid ${kitchen.borderSoft}`,
        boxShadow: '-8px 0 24px rgba(58,42,102,0.12)',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: `1px solid ${kitchen.border}` }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }}>
          SEO &amp; metadata
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 15, color: kitchen.textFaint, lineHeight: 1 }}
        >
          ✕
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontSize: 11, color: kitchen.textMuted }}>
          Leave any of these empty to fall back to the sitewide SEO defaults.
        </div>

        <Field label="Meta title">
          <input style={inputStyle} value={s.metaTitle ?? ''} onChange={(e) => patch({ metaTitle: e.target.value })} />
        </Field>

        <Field label="Meta description">
          <textarea
            style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
            value={s.metaDescription ?? ''}
            onChange={(e) => patch({ metaDescription: e.target.value })}
          />
        </Field>

        <Field label="Social share image">
          <ImageUploadField value={s.ogImage} onChange={(v) => patch({ ogImage: v })} />
        </Field>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: kitchen.textBody }}>
          <input type="checkbox" checked={s.noIndex ?? false} onChange={(e) => patch({ noIndex: e.target.checked })} />
          Hide from search engines
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 16px', borderTop: `1px solid ${kitchen.border}` }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '7px 16px',
            border: `1px solid ${kitchen.accent}`,
            borderRadius: 8,
            background: kitchen.accent,
            color: '#fff',
            fontWeight: 600,
            fontSize: 12.5,
            cursor: 'pointer',
          }}
        >
          Done
        </button>
      </div>
    </div>
  )
}
