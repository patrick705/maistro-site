import { useState } from 'react'

import { BLOCK_CATEGORIES, BLOCK_TYPES } from './blockTypes'
import { kitchen } from './theme'
import { useIsMobile } from './useIsMobile'

interface DemoModalEntry {
  label: string
  icon: string
  description: string
}

const DEMO_MODAL_ENTRY: DemoModalEntry = {
  label: 'Book-a-demo modal',
  icon: '🔲',
  description: 'Global modal content — edited once in Site Settings, not per page',
}

export function AddBlockPicker({ onAdd, onOpenDemoModalSettings }: { onAdd: (type: string) => void; onOpenDemoModalSettings: () => void }) {
  const [search, setSearch] = useState('')
  const isMobile = useIsMobile()
  const gridColumns = isMobile ? '1fr' : '1fr 1fr'

  const query = search.trim().toLowerCase()
  const matches = (label: string, description: string) => !query || label.toLowerCase().includes(query) || description.toLowerCase().includes(query)

  const grouped = BLOCK_CATEGORIES.map((category) => ({
    category,
    items: BLOCK_TYPES.filter((t) => t.category === category && matches(t.label, t.description)),
  })).filter((g) => g.items.length > 0)

  const showDemoModalEntry = matches(DEMO_MODAL_ENTRY.label, DEMO_MODAL_ENTRY.description)
  const totalAvailable = BLOCK_TYPES.length + 1 // + the Book-a-demo modal pseudo-entry

  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${kitchen.borderSoft}`,
        borderRadius: 10,
        boxShadow: '0 8px 24px rgba(58,42,102,0.12)',
        padding: '16px 18px 20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <input
          autoFocus
          type="search"
          placeholder="Search section components…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: '9px 12px',
            border: `1px solid ${kitchen.borderInput}`,
            borderRadius: 9,
            background: '#fff',
            font: 'inherit',
            fontSize: 13,
            color: kitchen.ink,
          }}
        />
        <span style={{ fontSize: 11, color: kitchen.textFaint, fontFamily: kitchen.fontMono, whiteSpace: 'nowrap' }}>
          {totalAvailable} available
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {grouped.map((g) => (
          <div key={g.category}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                color: kitchen.textMuted,
                marginBottom: 10,
              }}
            >
              {g.category}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: gridColumns, columnGap: 20, rowGap: 14 }}>
              {g.items.map((t) => (
                <BlockOption key={t.type} icon={t.icon} label={t.label} description={t.description} onClick={() => onAdd(t.type)} />
              ))}
            </div>
          </div>
        ))}

        {showDemoModalEntry && (
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                color: kitchen.textMuted,
                marginBottom: 10,
              }}
            >
              Global
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: gridColumns, columnGap: 20, rowGap: 14 }}>
              <BlockOption
                icon={DEMO_MODAL_ENTRY.icon}
                label={DEMO_MODAL_ENTRY.label}
                description={DEMO_MODAL_ENTRY.description}
                onClick={onOpenDemoModalSettings}
              />
            </div>
          </div>
        )}

        {grouped.length === 0 && !showDemoModalEntry && (
          <div style={{ color: kitchen.textFaint, fontSize: 13, padding: '8px 2px' }}>No components match “{search}”.</div>
        )}
      </div>
    </div>
  )
}

function BlockOption({ icon, label, description, onClick }: { icon: string; label: string; description: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '2px 4px',
        border: 'none',
        background: 'transparent',
        textAlign: 'left',
        cursor: 'pointer',
        borderRadius: 8,
      }}
    >
      <span
        style={{
          flex: '0 0 auto',
          width: 30,
          height: 30,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 8,
          background: kitchen.surface,
          fontSize: 14,
        }}
      >
        {icon}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span style={{ fontFamily: kitchen.fontDisplay, fontSize: 13.5, fontWeight: 700, color: kitchen.ink }}>{label}</span>
        <span style={{ fontSize: 11.5, color: kitchen.textMuted }}>{description}</span>
      </span>
    </button>
  )
}
