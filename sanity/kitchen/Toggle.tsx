import { kitchen } from './theme'

export function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '10px 12px',
        border: `1px solid ${kitchen.borderSoft}`,
        borderRadius: 10,
        background: '#fff',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.35 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 11, color: kitchen.textMuted }}>{hint}</span>
      </div>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 34,
          height: 20,
          borderRadius: 999,
          background: value ? kitchen.accent : kitchen.borderInput,
          padding: 2,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: value ? 'flex-end' : 'flex-start',
        }}
      >
        <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff' }} />
      </div>
    </div>
  )
}
