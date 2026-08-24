import { PAIRING_FONTS, kitchen } from '../theme'
import { Toggle } from '../Toggle'

const PAIRING_NAMES = ['Bricolage / Space Grotesk', 'Instrument Serif / Work Sans', 'Sora / DM Sans', 'Playfair / Manrope'] as const

const SCALE_OPTIONS = ['Compact', 'Default', 'Large'] as const

export function TypePairing({
  pairing,
  typeScale,
  chromeFont,
  onApplyPairing,
  onSetScale,
  onSetChromeFont,
}: {
  pairing: string
  typeScale: string
  chromeFont: boolean
  onApplyPairing: (name: string) => void
  onSetScale: (scale: string) => void
  onSetChromeFont: (v: boolean) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={sectionLabel()}>Type pairing</span>
        <div style={{ flex: 1, height: 1, background: kitchen.border }} />
        <span style={{ fontSize: 10, color: kitchen.textFaint, fontFamily: kitchen.fontMono }}>--font-display / body / mono</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(228px, 1fr))', gap: 8 }}>
        {PAIRING_NAMES.map((name) => {
          const fonts = PAIRING_FONTS[name]
          const live = name === pairing
          return (
            <div
              key={name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                padding: 12,
                border: `1px solid ${live ? kitchen.accent : kitchen.borderSoft}`,
                borderRadius: 10,
                background: '#fff',
                boxShadow: live ? '0 0 0 3px rgba(123,91,230,0.10)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                {live && <span style={pillStyle()}>Live</span>}
              </div>
              <span style={{ fontFamily: fonts.display, fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05, color: kitchen.ink }}>
                Run your whole operation
              </span>
              <span style={{ fontFamily: fonts.body, fontSize: 12.5, lineHeight: 1.5, color: kitchen.textBody }}>Body copy, subheads and interface text.</span>
              <span style={{ fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: '0.14em', color: kitchen.textMuted }}>EYEBROW · 0.16EM</span>
              <button type="button" onClick={() => onApplyPairing(name)} style={{ ...btnStyle(), marginTop: 2 }}>
                {live ? 'Applied' : 'Apply pairing'}
              </button>
            </div>
          )
        })}
      </div>

      <div style={rowCard()}>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.35 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600 }}>Type scale</span>
          <span style={{ fontSize: 11, color: kitchen.textMuted }}>Scales every heading and body size across the site</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', border: `1px solid ${kitchen.borderInput}`, borderRadius: 7, overflow: 'hidden', background: '#fff' }}>
          {SCALE_OPTIONS.map((o, i) => (
            <button
              key={o}
              type="button"
              onClick={() => onSetScale(o)}
              style={{
                padding: '5px 12px',
                border: 'none',
                borderLeft: i ? `1px solid ${kitchen.borderInput}` : 'none',
                cursor: 'pointer',
                font: 'inherit',
                fontSize: 11.5,
                fontWeight: 600,
                background: typeScale === o ? kitchen.accent : '#fff',
                color: typeScale === o ? '#fff' : kitchen.textSubtle,
              }}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <Toggle
        label="Use this pairing for the CMS too"
        hint="Interface text follows the site's body font"
        value={chromeFont}
        onChange={onSetChromeFont}
      />
    </div>
  )
}

function sectionLabel(): React.CSSProperties {
  return { fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }
}

function rowCard(): React.CSSProperties {
  return { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: `1px solid ${kitchen.borderSoft}`, borderRadius: 10, background: '#fff', flexWrap: 'wrap' }
}

function btnStyle(): React.CSSProperties {
  return { padding: '5px 8px', border: `1px solid ${kitchen.borderInput}`, borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: kitchen.textBody }
}

function pillStyle(): React.CSSProperties {
  return { flex: '0 0 auto', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: '#DFF0E8', color: '#2f6b52' }
}
