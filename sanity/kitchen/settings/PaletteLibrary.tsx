import { useState } from 'react'
import { useClient } from 'sanity'

import { derivePaletteColors } from '@/lib/content/colorMath'
import { useLiveQuery } from '../useLiveQuery'
import { kitchen } from '../theme'

interface PaletteDoc {
  _id: string
  name: string
  brandHex: string
  accentHex: string
  warmHex: string
  posHex: string
  isDefaultForNewSites?: boolean
  surfaceHex?: string
  brandTintHex?: string
  brandSoftHex?: string
  brandInkHex?: string
  accentInkHex?: string
  warmDeepHex?: string
  posTintHex?: string
  bodyHex?: string
}

const API_VERSION = '2024-01-01'
const PALETTES_QUERY = `*[_type == "brandPalette" && !(_id in path("drafts.**"))] | order(name asc){
  _id, name, brandHex, accentHex, warmHex, posHex, isDefaultForNewSites,
  surfaceHex, brandTintHex, brandSoftHex, brandInkHex, accentInkHex, warmDeepHex, posTintHex, bodyHex
}`

function randomId() {
  return 'brandPalette-' + Math.random().toString(36).slice(2, 10)
}

export function PaletteLibrary({ currentPaletteId, onApply }: { currentPaletteId?: string; onApply: (id: string) => void }) {
  const client = useClient({ apiVersion: API_VERSION })
  const { data: palettes, refetch } = useLiveQuery<PaletteDoc[]>(PALETTES_QUERY)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ name: '', brandHex: '#3A2A66', accentHex: '#7B5BE6', warmHex: '#F0B84E', posHex: '#4F9E86' })

  async function makeDefault(id: string) {
    await Promise.all(
      (palettes ?? []).map((p) => client.patch(p._id).set({ isDefaultForNewSites: p._id === id }).commit()),
    )
    refetch()
  }

  async function saveNew() {
    if (!form.name.trim()) return
    await client.create({
      _id: randomId(),
      _type: 'brandPalette',
      name: form.name,
      brandHex: form.brandHex,
      accentHex: form.accentHex,
      warmHex: form.warmHex,
      posHex: form.posHex,
      isDefaultForNewSites: false,
    })
    setForm({ name: '', brandHex: '#3A2A66', accentHex: '#7B5BE6', warmHex: '#F0B84E', posHex: '#4F9E86' })
    setFormOpen(false)
    refetch()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
        <span style={sectionLabel()}>Palette library</span>
        <div style={{ flex: 1, height: 1, background: kitchen.border }} />
        <span style={{ fontSize: 10, color: kitchen.textFaint, fontFamily: kitchen.fontMono }}>{palettes?.length ?? 0}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(228px, 1fr))', gap: 8 }}>
        {(palettes ?? []).map((p) => {
          const derived = derivePaletteColors(p)
          const active = p._id === currentPaletteId
          return (
            <div key={p._id} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, border: `1px solid ${active ? kitchen.accent : kitchen.borderSoft}`, borderRadius: 10, background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                {active && <span style={pillStyle('#DFF0E8', '#2f6b52')}>Live</span>}
                {p.isDefaultForNewSites && <span style={pillStyle('#FCEFD8', '#9c6a1c')}>Default</span>}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[derived.brand, derived.accent, derived.warm, derived.pos, derived.surface].map((c, i) => (
                  <span key={i} style={{ width: 20, height: 20, borderRadius: 5, background: c, border: '1px solid rgba(0,0,0,0.08)' }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, fontSize: 9, color: kitchen.textFaint, fontFamily: kitchen.fontMono }}>
                <span>{p.brandHex}</span>
                <span>{p.accentHex}</span>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                <button type="button" onClick={() => onApply(p._id)} style={btnStyle()}>
                  {active ? 'Applied' : 'Apply'}
                </button>
                <button type="button" onClick={() => makeDefault(p._id)} style={btnStyle()}>
                  Default for new sites
                </button>
              </div>
            </div>
          )
        })}

        {!formOpen && (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: 118, padding: 14, border: `1px dashed ${kitchen.borderDashed}`, borderRadius: 10, background: '#fff', cursor: 'pointer', color: kitchen.textSubtle }}
          >
            <span style={{ fontSize: 17, lineHeight: 1 }}>+</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>New palette</span>
          </button>
        )}
      </div>

      {formOpen && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10, padding: 14, border: `1px solid ${kitchen.borderInput}`, borderRadius: 10, background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>New brand palette</span>
            <button type="button" onClick={() => setFormOpen(false)} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', color: kitchen.textMuted }}>
              ✕
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
            <HexField label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} isText />
            <HexField label="Brand" value={form.brandHex} onChange={(v) => setForm((f) => ({ ...f, brandHex: v }))} />
            <HexField label="Accent" value={form.accentHex} onChange={(v) => setForm((f) => ({ ...f, accentHex: v }))} />
            <HexField label="Warm" value={form.warmHex} onChange={(v) => setForm((f) => ({ ...f, warmHex: v }))} />
            <HexField label="Positive" value={form.posHex} onChange={(v) => setForm((f) => ({ ...f, posHex: v }))} />
          </div>
          <div>
            <button type="button" onClick={saveNew} style={{ padding: '6px 13px', border: `1px solid ${kitchen.accent}`, borderRadius: 7, background: kitchen.accent, color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
              Save palette
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function HexField({ label, value, onChange, isText }: { label: string; value: string; onChange: (v: string) => void; isText?: boolean }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 10.5, fontWeight: 600, color: kitchen.textBody }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${kitchen.borderInput}`, borderRadius: 7, padding: '4px 6px', background: '#fff' }}>
        {!isText && <span style={{ width: 14, height: 14, borderRadius: 4, background: value }} />}
        <input value={value} onChange={(e) => onChange(e.target.value)} style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', font: 'inherit', fontSize: 12, background: 'transparent' }} />
      </div>
    </label>
  )
}

function sectionLabel(): React.CSSProperties {
  return { fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }
}

function btnStyle(): React.CSSProperties {
  return { padding: '5px 9px', border: `1px solid ${kitchen.borderInput}`, borderRadius: 7, background: '#fff', cursor: 'pointer', fontSize: 10.5, color: kitchen.textBody }
}

function pillStyle(bg: string, fg: string): React.CSSProperties {
  return { fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: bg, color: fg }
}
