import { hasHeadingControls, hasPaletteRoleControl, hasFullBleedControl } from './blockTypes'
import { useLiveQuery } from './useLiveQuery'
import { kitchen } from './theme'

const THEME_QUERY = `*[_id == "siteSettings"][0]{
  "palette": theme.palette->{name, brandHex, accentHex}
}`

type HeadingFont = 'display' | 'body'
type HeadingScale = 's' | 'm' | 'l'
type Padding = 'compact' | 'standard' | 'roomy'
type PaletteRole = 'surface' | 'white' | 'brand' | 'accent'

export function DesignTab({
  block,
  onPatchDesign,
  onOpenThemeSettings,
}: {
  block: Record<string, any>
  onPatchDesign: (fields: Record<string, unknown>) => void
  onOpenThemeSettings: () => void
}) {
  const { data } = useLiveQuery<{ palette?: { name?: string; brandHex?: string; accentHex?: string } }>(THEME_QUERY)
  const palette = data?.palette
  const design = block.design ?? {}

  const headingFont: HeadingFont = design.headingFont === 'body' ? 'body' : 'display'
  const headingScale: HeadingScale = design.headingScale ?? 'm'
  const padding: Padding = design.padding ?? 'standard'
  const paletteRole: PaletteRole | undefined = design.paletteRole
  const fullBleed: boolean = design.fullBleed !== false

  function patch(fields: Record<string, unknown>) {
    onPatchDesign({ design: { ...design, ...fields } })
  }

  const showHeading = hasHeadingControls(block._type)
  const showPaletteRole = hasPaletteRoleControl(block._type)
  const showFullBleed = hasFullBleedControl(block._type)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 14 }}>
      {showHeading ? (
        <>
          <Field label="Heading typeface">
            <SegmentedControl
              options={[{ value: 'display', label: 'Display' }, { value: 'body', label: 'Body' }]}
              value={headingFont}
              onChange={(v) => patch({ headingFont: v })}
            />
          </Field>
          <Field label="Heading scale">
            <SegmentedControl
              options={[{ value: 's', label: 'S' }, { value: 'm', label: 'M' }, { value: 'l', label: 'L' }]}
              value={headingScale}
              onChange={(v) => patch({ headingScale: v })}
            />
          </Field>
        </>
      ) : (
        <div style={{ fontSize: 12, color: kitchen.textFaint }}>This section has no heading text to restyle.</div>
      )}

      <Field label="Section padding">
        <SegmentedControl
          options={[{ value: 'compact', label: 'Compact' }, { value: 'standard', label: 'Standard' }, { value: 'roomy', label: 'Roomy' }]}
          value={padding}
          onChange={(v) => patch({ padding: v })}
        />
      </Field>

      {showPaletteRole && (
        <Field label="Background">
          <SegmentedControl
            options={[
              { value: 'surface', label: 'Surface' },
              { value: 'white', label: 'White' },
              { value: 'brand', label: 'Brand' },
              { value: 'accent', label: 'Accent' },
            ]}
            value={paletteRole ?? ''}
            onChange={(v) => patch({ paletteRole: v })}
            allowUnset
          />
        </Field>
      )}

      {showFullBleed && (
        <Field label="Full-bleed band">
          <button
            type="button"
            onClick={() => patch({ fullBleed: !fullBleed })}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              border: `1px solid ${kitchen.borderInput}`,
              borderRadius: 9,
              background: '#fff',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <span style={{ fontSize: 12.5, color: kitchen.textBody }}>Edge-to-edge background</span>
            <span
              style={{
                width: 34,
                height: 20,
                borderRadius: 999,
                background: fullBleed ? kitchen.accent : kitchen.borderInput,
                position: 'relative',
                transition: 'background 0.15s',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: fullBleed ? 16 : 2,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#fff',
                  transition: 'left 0.15s',
                }}
              />
            </span>
          </button>
        </Field>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={labelStyle()}>Colour source</span>
          <div style={{ flex: 1, height: 1, background: kitchen.border }} />
        </div>
        <InfoRow label="Palette" value={palette?.name ?? 'Loading…'} />
        {palette?.brandHex && <InfoRow label="Brand / accent" value={`${palette.brandHex} · ${palette.accentHex}`} />}
        <InfoRow label="Type pairing" value="Bricolage Grotesque / Space Grotesk" />
        <button type="button" onClick={onOpenThemeSettings} style={linkBtnStyle()}>
          Open Site Settings → Theme
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={labelStyle()}>{label}</span>
      {children}
    </label>
  )
}

function SegmentedControl({
  options,
  value,
  onChange,
  allowUnset,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  allowUnset?: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(allowUnset && active ? '' : opt.value)}
            style={{
              flex: 1,
              padding: '7px 0',
              border: `1px solid ${active ? kitchen.accent : kitchen.borderInput}`,
              borderRadius: 8,
              background: active ? kitchen.accent : '#fff',
              color: active ? '#fff' : kitchen.textBody,
              fontWeight: 600,
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
      <span style={{ color: kitchen.textMuted }}>{label}</span>
      <span style={{ color: kitchen.textBody, fontFamily: kitchen.fontMono, fontSize: 11.5 }}>{value}</span>
    </div>
  )
}

function labelStyle(): React.CSSProperties {
  return { fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }
}

function linkBtnStyle(): React.CSSProperties {
  return {
    alignSelf: 'flex-start',
    padding: '6px 10px',
    border: `1px dashed ${kitchen.borderDashed}`,
    borderRadius: 7,
    background: 'transparent',
    color: kitchen.textSubtle,
    fontSize: 11.5,
    fontWeight: 600,
    cursor: 'pointer',
  }
}
