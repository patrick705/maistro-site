import { useState } from 'react'

import { AddBlockPicker } from './AddBlockPicker'
import { LivePreview } from './livePreview/LivePreview'
import { EditSectionDrawer } from './EditSectionDrawer'
import { KitchenErrorBoundary } from './KitchenErrorBoundary'
import { BLOCK_TYPES, blockCountBadge, emptyBlock, pascalTag } from './blockTypes'
import { kitchen } from './theme'
import { useDragReorder } from './useDragReorder'
import { useKitchenPatch } from './useKitchenPatch'

interface PageDoc {
  _id: string
  title?: string
  slug?: { current?: string }
  showInMenu?: boolean
  menuOrder?: number
  navLabel?: string
  blocks?: Record<string, any>[]
}

export function PageBuilderView({
  pageId,
  onOpenDemoModalSettings,
  onOpenThemeSettings,
}: {
  pageId: string
  onOpenDemoModalSettings: () => void
  onOpenThemeSettings: () => void
}) {
  const { doc, patch } = useKitchenPatch(pageId, 'page')
  // Previews default to expanded (matching the mockup) — this tracks which
  // blocks have been manually collapsed, not which ones are expanded.
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [editing, setEditing] = useState<string | null>(null)
  const [addMenuOpen, setAddMenuOpen] = useState(false)

  const page = doc as PageDoc | null
  const blocks = page?.blocks ?? []
  const { dragHandlers } = useDragReorder(blocks as { _key: string }[], (next) => patch({ blocks: next }))

  if (!page) return <div style={{ padding: 24, color: kitchen.textFaint }}>Loading…</div>

  function setBlocks(next: Record<string, any>[]) {
    patch({ blocks: next })
  }

  function addBlock(type: string) {
    setBlocks([...blocks, emptyBlock(type)])
    setAddMenuOpen(false)
  }

  function removeBlock(key: string) {
    setBlocks(blocks.filter((b) => b._key !== key))
  }

  function updateBlock(key: string, fields: Record<string, unknown>) {
    setBlocks(blocks.map((b) => (b._key === key ? { ...b, ...fields } : b)))
    setEditing(null)
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '26px 24px 72px' }}>
      <h1 style={{ margin: '0 0 6px', fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>
        {page.title || 'Untitled page'}
      </h1>
      <div style={{ display: 'flex', gap: 14, fontSize: 11, color: kitchen.textMuted, fontFamily: kitchen.fontMono, marginBottom: 22 }}>
        <span>/{page.slug?.current ?? '(no slug yet)'}</span>
        <span>{blocks.length} block(s)</span>
        <span>{page.showInMenu ? 'in top menu' : 'hidden from top menu'}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {blocks.length === 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '34px 20px',
              border: `1px dashed ${kitchen.borderInput}`,
              borderRadius: 10,
              background: '#fff',
              textAlign: 'center',
            }}
          >
            <span style={{ fontFamily: kitchen.fontDisplay, fontSize: 15, fontWeight: 700 }}>No sections yet</span>
            <span style={{ fontSize: 12, color: kitchen.textMuted, maxWidth: 340 }}>
              Add a block below to start building this page.
            </span>
          </div>
        )}

        {blocks.map((block) => {
          const meta = BLOCK_TYPES.find((t) => t.type === block._type)
          const isExpanded = !collapsed.has(block._key)
          const isConditional = block._type === 'statsBandBlock'
          const countBadge = blockCountBadge(block)
          return (
            <div
              key={block._key}
              {...dragHandlers(block._key)}
              style={{ border: `1px solid ${kitchen.borderSoft}`, borderRadius: 10, background: '#fff' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px' }}>
                <span style={{ color: kitchen.borderDashed, fontSize: 13, cursor: 'grab', letterSpacing: '-2px' }}>⠿</span>
                <span style={{ fontSize: 15 }}>{meta?.icon ?? '▢'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{meta?.label ?? block._type}</span>
                    <span style={typeTagStyle()}>{pascalTag(meta?.label ?? block._type)}</span>
                    {isConditional && <span style={conditionalTagStyle()}>Conditional</span>}
                  </div>
                  {meta?.description && (
                    <div style={{ fontSize: 11, color: kitchen.textMuted, marginTop: 2 }}>
                      {isConditional ? 'Hidden unless theme.showResults is on' : meta.description}
                    </div>
                  )}
                </div>
                {countBadge && <span style={{ fontSize: 11, color: kitchen.textFaint, fontFamily: kitchen.fontMono, whiteSpace: 'nowrap' }}>{countBadge}</span>}
                <button type="button" onClick={() => setEditing(block._key)} style={smallBtnStyle()}>
                  Edit
                </button>
                <button type="button" onClick={() => removeBlock(block._key)} title="Remove section" style={smallBtnStyle(true)}>
                  ✕
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCollapsed((prev) => {
                      const next = new Set(prev)
                      if (next.has(block._key)) next.delete(block._key)
                      else next.add(block._key)
                      return next
                    })
                  }
                  style={smallBtnStyle()}
                >
                  {isExpanded ? '▴' : '▾'}
                </button>
              </div>
              {isExpanded && (
                <div style={{ borderTop: `1px solid ${kitchen.borderSoft}`, borderRadius: '0 0 9px 9px', overflow: 'hidden' }}>
                  <KitchenErrorBoundary label="Preview">
                    <LivePreview block={block} />
                  </KitchenErrorBoundary>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {editing &&
        (() => {
          const block = blocks.find((b) => b._key === editing)
          if (!block) return null
          const meta = BLOCK_TYPES.find((t) => t.type === block._type)
          return (
            <EditSectionDrawer
              // Forces a fresh mount per block — without this, switching between
              // blocks reuses the same drawer instance: SimpleBlockEditor's draft
              // state is initialized once and never re-runs for the new block, and
              // once any block trips the error boundary it stays tripped forever
              // afterward, making every subsequent block look broken too.
              key={block._key}
              block={block}
              typeTag={pascalTag(meta?.label ?? block._type)}
              onSave={(fields) => updateBlock(block._key, fields)}
              onClose={() => setEditing(null)}
              onOpenThemeSettings={onOpenThemeSettings}
            />
          )
        })()}

      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={() => setAddMenuOpen((v) => !v)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: `1px solid ${addMenuOpen ? kitchen.accent : kitchen.borderDashed}`,
            borderStyle: addMenuOpen ? 'solid' : 'dashed',
            borderRadius: 9,
            background: '#fff',
            color: addMenuOpen ? kitchen.accent : kitchen.textSubtle,
            fontWeight: 600,
            fontSize: 12.5,
            cursor: 'pointer',
          }}
        >
          + Add block
        </button>
        {addMenuOpen && (
          <div style={{ marginTop: 10 }}>
            <AddBlockPicker onAdd={addBlock} onOpenDemoModalSettings={onOpenDemoModalSettings} />
          </div>
        )}
      </div>
    </div>
  )
}

function typeTagStyle(): React.CSSProperties {
  return {
    fontSize: 10.5,
    fontFamily: kitchen.fontMono,
    padding: '2px 8px',
    borderRadius: 999,
    background: kitchen.surface,
    color: kitchen.textSubtle,
    border: `1px solid ${kitchen.borderSoft}`,
  }
}

function conditionalTagStyle(): React.CSSProperties {
  return {
    fontSize: 10.5,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 999,
    background: '#FCEFD8',
    color: '#9c6a1c',
    border: '1px solid #f0dcb0',
  }
}

function smallBtnStyle(danger = false): React.CSSProperties {
  return {
    flex: '0 0 auto',
    padding: '4px 9px',
    border: `1px solid ${danger ? 'transparent' : kitchen.borderInput}`,
    borderRadius: 6,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 11.5,
    color: danger ? kitchen.textFaint : kitchen.textBody,
  }
}
