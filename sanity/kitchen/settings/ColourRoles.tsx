import { useState } from 'react'
import { useClient } from 'sanity'

import { derivePaletteColors } from '@/lib/content/colorMath'
import { useLiveQuery } from '../useLiveQuery'
import { kitchen } from '../theme'

const API_VERSION = '2024-01-01'
const HEX_RE = /^#[0-9a-fA-F]{6}$/

interface PaletteDoc {
  _id: string
  name: string
  brandHex: string
  accentHex: string
  warmHex: string
  posHex: string
  surfaceHex?: string
  brandTintHex?: string
  brandSoftHex?: string
  brandInkHex?: string
  accentInkHex?: string
  warmDeepHex?: string
  posTintHex?: string
  bodyHex?: string
}

type DerivedKey = keyof ReturnType<typeof derivePaletteColors>

interface RoleRow {
  key: DerivedKey
  field: keyof PaletteDoc
  label: string
  note: string
  base: boolean
}

const ROLES: RoleRow[] = [
  { key: 'brand', field: 'brandHex', label: 'Brand', note: 'Dark sections, headings', base: true },
  { key: 'accent', field: 'accentHex', label: 'Accent', note: 'Buttons, links, highlights', base: true },
  { key: 'warm', field: 'warmHex', label: 'Warm', note: 'Highlight pills, hero stats', base: true },
  { key: 'pos', field: 'posHex', label: 'Positive', note: 'Success states, up-deltas', base: true },
  { key: 'surface', field: 'surfaceHex', label: 'Surface', note: 'Tinted page background', base: false },
  { key: 'brandTint', field: 'brandTintHex', label: 'Brand tint', note: 'Muted copy on brand bands', base: false },
  { key: 'brandSoft', field: 'brandSoftHex', label: 'Brand soft', note: 'Soft fills, chart bars', base: false },
  { key: 'brandInk', field: 'brandInkHex', label: 'Brand ink', note: 'Text on a brand fill', base: false },
  { key: 'accentInk', field: 'accentInkHex', label: 'Accent ink', note: 'Text on an accent fill', base: false },
  { key: 'warmDeep', field: 'warmDeepHex', label: 'Warm deep', note: 'Eyebrows, warm text', base: false },
  { key: 'posTint', field: 'posTintHex', label: 'Positive tint', note: 'Labels on positive fills', base: false },
  { key: 'body', field: 'bodyHex', label: 'Body text', note: 'Long-form copy', base: false },
]

const PALETTE_QUERY = `*[_id == $id][0]{
  _id, name, brandHex, accentHex, warmHex, posHex,
  surfaceHex, brandTintHex, brandSoftHex, brandInkHex, accentInkHex, warmDeepHex, posTintHex, bodyHex
}`

export function ColourRoles({ paletteId }: { paletteId?: string }) {
  const client = useClient({ apiVersion: API_VERSION })
  const { data: palette } = useLiveQuery<PaletteDoc | null>(PALETTE_QUERY, { id: paletteId ?? '' })
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  if (!paletteId) return null
  if (!palette) return <div style={{ padding: 24, color: kitchen.textFaint }}>Loading…</div>

  const derived = derivePaletteColors(palette)
  const overrideCount = ROLES.filter((r) => !r.base && Boolean(palette[r.field])).length

  function handleChange(role: RoleRow, raw: string) {
    setDrafts((d) => ({ ...d, [role.key]: raw }))
    if (HEX_RE.test(raw)) {
      client.patch(palette!._id).set({ [role.field]: raw }).commit()
    }
  }

  function reset(role: RoleRow) {
    setDrafts((d) => {
      const next = { ...d }
      delete next[role.key]
      return next
    })
    client.patch(palette!._id).unset([role.field]).commit()
  }

  function resetAll() {
    setDrafts({})
    client
      .patch(palette!._id)
      .unset(ROLES.filter((r) => !r.base).map((r) => r.field as string))
      .commit()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
        <span style={sectionLabel()}>Colour roles</span>
        <div style={{ flex: 1, height: 1, background: kitchen.border }} />
        <span style={{ fontSize: 10, color: kitchen.textFaint, fontFamily: kitchen.fontMono }}>
          {overrideCount ? `${overrideCount} overridden` : 'all derived'}
        </span>
        {overrideCount > 0 && (
          <button type="button" onClick={resetAll} style={resetAllBtnStyle()}>
            Reset all
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 8 }}>
        {ROLES.map((role) => {
          const draft = drafts[role.key]
          const stored = palette[role.field] as string | undefined
          const value = draft !== undefined ? draft : (stored ?? derived[role.key])
          const hasOverride = !role.base && Boolean(stored)
          const origin = role.base ? 'editable' : hasOverride ? 'override' : 'derived'

          return (
            <div
              key={role.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                border: `1px solid ${kitchen.borderSoft}`,
                borderRadius: 10,
                background: '#fff',
              }}
            >
              <span
                style={{
                  flex: '0 0 auto',
                  width: 42,
                  height: 42,
                  borderRadius: 9,
                  background: HEX_RE.test(value) ? value : '#fff',
                  border: '1px solid rgba(0,0,0,0.10)',
                }}
              />
              <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{role.label}</span>
                  <span style={originPillStyle(origin)}>{origin}</span>
                </div>
                <span style={{ fontSize: 11, color: kitchen.textMuted }}>{role.note}</span>
              </div>
              <input
                value={value}
                onChange={(e) => handleChange(role, e.target.value)}
                style={{
                  flex: '0 0 auto',
                  width: 100,
                  padding: '6px 8px',
                  border: `1px solid ${kitchen.borderInput}`,
                  borderRadius: 7,
                  background: '#fff',
                  font: 'inherit',
                  fontFamily: kitchen.fontMono,
                  fontSize: 11.5,
                  color: kitchen.ink,
                }}
              />
              {hasOverride && (
                <button type="button" onClick={() => reset(role)} style={resetBtnStyle()}>
                  Reset
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function sectionLabel(): React.CSSProperties {
  return { fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }
}

function originPillStyle(origin: 'editable' | 'override' | 'derived'): React.CSSProperties {
  const active = origin === 'override'
  return {
    flex: '0 0 auto',
    fontSize: 9,
    fontFamily: kitchen.fontMono,
    padding: '1px 5px',
    borderRadius: 4,
    border: `1px solid ${active ? '#d7cdf2' : kitchen.borderSoft}`,
    background: active ? '#EEE9F8' : kitchen.surface,
    color: active ? kitchen.accent : kitchen.textMuted,
  }
}

function resetBtnStyle(): React.CSSProperties {
  return {
    flex: '0 0 auto',
    padding: '4px 9px',
    border: `1px solid ${kitchen.borderInput}`,
    borderRadius: 6,
    background: '#fff',
    cursor: 'pointer',
    font: 'inherit',
    fontSize: 10.5,
    color: kitchen.textSubtle,
  }
}

function resetAllBtnStyle(): React.CSSProperties {
  return {
    padding: '3px 10px',
    border: `1px solid ${kitchen.borderInput}`,
    borderRadius: 7,
    background: '#fff',
    cursor: 'pointer',
    font: 'inherit',
    fontSize: 11,
    fontWeight: 600,
    color: kitchen.textBody,
  }
}
