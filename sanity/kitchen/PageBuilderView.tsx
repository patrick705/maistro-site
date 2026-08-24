import { useState } from 'react'

import { AddBlockPicker } from './AddBlockPicker'
import { LivePreview } from './livePreview/LivePreview'
import { EditSectionDrawer } from './EditSectionDrawer'
import { PageSeoDrawer } from './PageSeoDrawer'
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
  archived?: boolean
  seo?: Record<string, any>
  blocks?: Record<string, any>[]
  _updatedAt?: string
}

function relativeTime(iso: string | undefined): string | null {
  if (!iso) return null
  const diffMs = Date.now() - new Date(iso).getTime()
  const min = Math.round(diffMs / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min} min ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr} hr ago`
  const day = Math.round(hr / 24)
  return `${day} day${day === 1 ? '' : 's'} ago`
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
  const [seoOpen, setSeoOpen] = useState(false)

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

  const isHome = page.slug?.current === 'home'
  const isArchived = page.archived === true
  const pageTitle = page.title || 'this page'

  function toggleArchived() {
    if (isHome) return
    const next = !isArchived
    if (next && !confirm(`Archive "${pageTitle}"? Once published, its URL will 404 and it drops out of the top menu. You can restore it any time from here.`)) {
      return
    }
    patch({ archived: next })
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '26px 24px 72px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
        <h1 style={{ margin: 0, fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>
          {page.title || 'Untitled page'}
        </h1>
        <div style={{ display: 'flex', gap: 8, flex: '0 0 auto' }}>
          <button
            type="button"
            onClick={() => setSeoOpen(true)}
            style={{
              padding: '6px 12px',
              border: `1px solid ${kitchen.borderInput}`,
              borderRadius: 7,
              background: '#fff',
              color: kitchen.textBody,
              fontWeight: 600,
              fontSize: 11.5,
              cursor: 'pointer',
            }}
          >
            SEO &amp; metadata
          </button>
          <button
            type="button"
            onClick={toggleArchived}
            disabled={isHome}
            title={isHome ? 'The Home page can’t be archived — that would take your whole site offline.' : undefined}
            style={{
              padding: '6px 12px',
              border: `1px solid ${isArchived ? kitchen.accent : kitchen.borderInput}`,
              borderRadius: 7,
              background: isArchived ? kitchen.accent : '#fff',
              color: isHome ? kitchen.textFaint : isArchived ? '#fff' : kitchen.textBody,
              fontWeight: 600,
              fontSize: 11.5,
              cursor: isHome ? 'not-allowed' : 'pointer',
              opacity: isHome ? 0.5 : 1,
            }}
          >
            {isArchived ? 'Restore page' : 'Archive page'}
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 14, fontSize: 11, color: kitchen.textMuted, fontFamily: kitchen.fontMono, marginBottom: 22 }}>
        <span>/{page.slug?.current ?? '(no slug yet)'}</span>
        <span>{blocks.length} block(s)</span>
        <button
          type="button"
          onClick={() => patch({ showInMenu: !page.showInMenu })}
          title="Click to toggle whether this page appears in the site's top navigation"
          style={{
            font: 'inherit',
            fontFamily: kitchen.fontMono,
            fontSize: 11,
            padding: 0,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: page.showInMenu ? '#2f6b52' : kitchen.textMuted,
            textDecoration: 'underline',
            textDecorationStyle: 'dotted',
            textUnderlineOffset: 2,
          }}
        >
          {page.showInMenu ? 'in top menu' : 'hidden from top menu'}
        </button>
        {relativeTime(page._updatedAt) && <span>edited {relativeTime(page._updatedAt)}</span>}
        {isArchived && <span style={{ color: '#9c6a1c', fontWeight: 700 }}>archived</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }}>
          Sections on this page
        </span>
        <div style={{ flex: 1, height: 1, background: kitchen.border }} />
        {blocks.length > 1 && <span style={{ fontSize: 10.5, color: kitchen.textFaint }}>drag to reorder</span>}
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

      {seoOpen && (
        <PageSeoDrawer seo={page.seo} onPatchSeo={(fields) => patch(fields)} onClose={() => setSeoOpen(false)} />
      )}

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
