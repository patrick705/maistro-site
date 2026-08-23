import { kitchen } from './theme'
import { useDragReorder } from './useDragReorder'

interface Keyed {
  _key: string
}

export function ArrayEditor<T extends Keyed>({
  items,
  onChange,
  newItem,
  renderItem,
  addLabel = '+ Add item',
  max,
}: {
  items: T[]
  onChange: (next: T[]) => void
  newItem: () => T
  renderItem: (item: T, update: (fields: Partial<T>) => void, index: number) => React.ReactNode
  addLabel?: string
  /** Mirrors a Sanity array field's `validation: r.max(N)` — disables adding past the limit and explains why. */
  max?: number
}) {
  const { dragHandlers } = useDragReorder(items, onChange)
  const atLimit = max !== undefined && items.length >= max

  return (
    <div>
      {items.map((item, i) => (
        <div
          key={item._key}
          {...dragHandlers(item._key)}
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start',
            padding: 8,
            border: `1px solid ${kitchen.borderSoft}`,
            borderRadius: 8,
            marginBottom: 6,
            background: '#fff',
          }}
        >
          <span style={{ cursor: 'grab', color: kitchen.borderDashed, paddingTop: 4, letterSpacing: '-2px' }}>⠿</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            {renderItem(item, (fields) => onChange(items.map((it, j) => (j === i ? { ...it, ...fields } : it))), i)}
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            title="Remove"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: kitchen.textFaint, fontSize: 13, paddingTop: 4 }}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        disabled={atLimit}
        onClick={() => onChange([...items, newItem()])}
        style={{
          padding: '5px 11px',
          border: `1px dashed ${kitchen.borderDashed}`,
          borderRadius: 7,
          background: '#fff',
          cursor: atLimit ? 'not-allowed' : 'pointer',
          fontSize: 11.5,
          fontWeight: 600,
          color: kitchen.textSubtle,
          opacity: atLimit ? 0.5 : 1,
        }}
      >
        {addLabel}
      </button>
      {atLimit && (
        <div style={{ marginTop: 5, fontSize: 11, color: '#9c6a1c' }}>
          Schema allows {max} — remove one to add another.
        </div>
      )}
    </div>
  )
}
