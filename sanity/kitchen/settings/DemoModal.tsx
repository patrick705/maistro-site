import { kitchen } from '../theme'
import { useKitchenPatch } from '../useKitchenPatch'

interface DemoModalContent {
  eyebrow?: string
  headline?: string
  subhead?: string
  successHeadline?: string
  successBody?: string
}

interface SiteSettingsDoc {
  _id: string
  demoModal?: DemoModalContent
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

export function DemoModalSettings() {
  const { doc, patch } = useKitchenPatch('siteSettings', 'siteSettings')
  const settings = doc as SiteSettingsDoc | null
  if (!settings) return <div style={{ padding: 24, color: kitchen.textFaint }}>Loading…</div>

  const modal = settings.demoModal ?? {}

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '26px 24px 72px' }}>
      <h1 style={{ margin: '0 0 5px', fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700 }}>Demo modal</h1>
      <div style={{ fontSize: 11, color: kitchen.textMuted, fontFamily: kitchen.fontMono, marginBottom: 22 }}>
        siteSettings.demoModal — shown sitewide whenever a &quot;Book a demo&quot; button is clicked, on any page
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Field label="Eyebrow">
          <input style={inputStyle} value={modal.eyebrow ?? ''} onChange={(e) => patch({ demoModal: { ...modal, eyebrow: e.target.value } })} />
        </Field>

        <Field label="Headline">
          <input style={inputStyle} value={modal.headline ?? ''} onChange={(e) => patch({ demoModal: { ...modal, headline: e.target.value } })} />
        </Field>

        <Field label="Subhead">
          <textarea
            style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
            value={modal.subhead ?? ''}
            onChange={(e) => patch({ demoModal: { ...modal, subhead: e.target.value } })}
          />
        </Field>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }}>
            After submitting
          </span>
          <div style={{ flex: 1, height: 1, background: kitchen.border }} />
        </div>

        <Field label="Success headline">
          <input
            style={inputStyle}
            value={modal.successHeadline ?? ''}
            onChange={(e) => patch({ demoModal: { ...modal, successHeadline: e.target.value } })}
          />
        </Field>

        <Field label="Success body">
          <textarea
            style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
            value={modal.successBody ?? ''}
            onChange={(e) => patch({ demoModal: { ...modal, successBody: e.target.value } })}
          />
        </Field>
      </div>
    </div>
  )
}
