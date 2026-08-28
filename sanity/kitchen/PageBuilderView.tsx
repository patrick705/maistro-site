import { useState } from 'react'
import { useClient } from 'sanity'

import { AddBlockPicker } from './AddBlockPicker'
import { LivePreview } from './livePreview/LivePreview'
import { EditSectionDrawer } from './EditSectionDrawer'
import { PageSeoDrawer } from './PageSeoDrawer'
import { KitchenErrorBoundary } from './KitchenErrorBoundary'
import { BLOCK_TYPES, emptyBlock, pascalTag } from './blockTypes'
import { kitchen } from './theme'
import { useDragReorder } from './useDragReorder'
import { useKitchenPatch } from './useKitchenPatch'
import { RESERVED_SLUGS } from '../schemaTypes/page'

const API_VERSION = '2024-01-01'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function randomPageId() {
  return 'page-' + Math.random().toString(36).slice(2, 10)
}

interface PageDoc {
  _id: string
  title?: string
  slug?: { current?: string }
  showInMenu?: boolean
  menuOrder?: number
  navLabel?: string
  archived?: boolean
  parentId?: string
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
  onNavigateToPage,
  onPageDeleted,
}: {
  pageId: string
  onOpenDemoModalSettings: () => void
  onOpenThemeSettings: () => void
  onNavigateToPage: (id: string) => void
  onPageDeleted: () => void
}) {
  const client = useClient({ apiVersion: API_VERSION })
  const { doc, patch, rawPatch } = useKitchenPatch(pageId, 'page')
  const [hoverBlock, setHoverBlock] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [addMenuOpen, setAddMenuOpen] = useState(false)
  const [seoOpen, setSeoOpen] = useState(false)

  const page = doc as PageDoc | null
  const blocks = page?.blocks ?? []
  // Reordering is the one operation that genuinely needs the whole array (the
  // new order can't be expressed as a single keyed patch) — add/remove/edit
  // below deliberately avoid this, see the comment on `updateBlock`.
  const { dragHandlers } = useDragReorder(blocks as { _key: string }[], (next) => patch({ blocks: next }))

  if (!page) return <div style={{ padding: 24, color: kitchen.textFaint }}>Loading…</div>

  function addBlock(type: string) {
    rawPatch((p) => p.setIfMissing({ blocks: [] }).insert('after', 'blocks[-1]', [emptyBlock(type)]))
    setAddMenuOpen(false)
  }

  // Subpages can't have their own subpages — kept deliberately flat (no
  // collapsible tree in the sidebar) since the earlier attempt at a nested
  // page tree caused a load-hanging bug. New subpages start as a draft.
  async function addSubpage() {
    const id = randomPageId()
    await client.create({
      _id: `drafts.${id}`,
      _type: 'page',
      title: 'Untitled subpage',
      parentId: pageId,
      showInMenu: false,
      blocks: [],
    })
    onNavigateToPage(id)
  }

  // Subpages can't have subpages of their own, so a single non-recursive
  // lookup covers every doc that needs to go with this one.
  async function deletePagePermanently() {
    const subpages = await client.fetch<{ _id: string }[]>(`*[_type == "page" && parentId == $id]{_id}`, { id: pageId })
    const baseIds = new Set<string>([pageId])
    for (const sp of subpages) {
      baseIds.add(sp._id.startsWith('drafts.') ? sp._id.slice('drafts.'.length) : sp._id)
    }
    const tx = client.transaction()
    for (const id of baseIds) tx.delete(id).delete(`drafts.${id}`)
    await tx.commit()
    onPageDeleted()
  }

  function removeBlock(key: string) {
    rawPatch((p) => p.unset([`blocks[_key=="${key}"]`]))
  }

  function updateBlock(key: string, fields: Record<string, unknown>) {
    // Deliberately a keyed set on just this one block, not `patch({ blocks: [...] })`
    // with the whole array re-sent from this tab's local copy — that pattern
    // silently deleted every OTHER block on this page when this tab's copy of
    // `blocks` was stale (e.g. edited in another tab/session in the meantime).
    // A keyed set only ever touches the one block named here.
    const current = blocks.find((b) => b._key === key)
    if (current) {
      rawPatch((p) => p.set({ [`blocks[_key=="${key}"]`]: { ...current, ...fields } }))
    }
    setEditing(null)
  }

  const isHome = page.slug?.current === 'home'
  const isArchived = page.archived === true

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '26px 24px 72px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
        <input
          value={page.title ?? ''}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Untitled page"
          style={{
            flex: '1 1 auto',
            minWidth: 0,
            margin: 0,
            padding: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: kitchen.fontDisplay,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: kitchen.ink,
          }}
        />
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
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: kitchen.textMuted, fontFamily: kitchen.fontMono, marginBottom: 4 }}>
        {isHome ? (
          <span title="The Home page's slug can't change — it would take your root URL offline.">/{page.slug?.current}</span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <span>/</span>
            <input
              value={page.slug?.current ?? ''}
              onChange={(e) => patch({ slug: { _type: 'slug', current: slugify(e.target.value) } })}
              placeholder="page-slug"
              style={{
                width: Math.max(70, ((page.slug?.current ?? 'page-slug').length + 1) * 6.5),
                border: 'none',
                outline: 'none',
                background: 'transparent',
                font: 'inherit',
                fontFamily: kitchen.fontMono,
                fontSize: 11,
                color: page.slug?.current ? kitchen.textMuted : kitchen.textFaint,
              }}
            />
            {!page.slug?.current && page.title && (
              <button
                type="button"
                onClick={() => patch({ slug: { _type: 'slug', current: slugify(page.title!) } })}
                style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: kitchen.accent, font: 'inherit', fontFamily: kitchen.fontMono, fontSize: 11, textDecoration: 'underline' }}
              >
                generate from title
              </button>
            )}
          </span>
        )}
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
      <div style={{ marginBottom: 22 }}>
        {!isHome && page.slug?.current && RESERVED_SLUGS.includes(page.slug.current) && (
          <div style={{ fontSize: 11, color: kitchen.danger, marginTop: 4 }}>
            “/{page.slug.current}” is reserved for an existing page — choose a different slug so this one doesn't collide with it.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }}>
          Sections on this page
        </span>
        <div style={{ flex: 1, height: 1, background: kitchen.border }} />
        {blocks.length > 1 && <span style={{ fontSize: 10.5, color: kitchen.textFaint }}>drag to reorder</span>}
      </div>

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

      {blocks.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 14, background: '#F1EDF9', borderRadius: 16 }}>
          {blocks.map((block, index) => {
            const meta = BLOCK_TYPES.find((t) => t.type === block._type)
            const hovering = hoverBlock === block._key
            return (
              <div
                key={block._key}
                {...dragHandlers(block._key)}
                onMouseEnter={() => setHoverBlock(block._key)}
                onMouseLeave={() => setHoverBlock((v) => (v === block._key ? null : v))}
                style={{
                  position: 'relative',
                  border: `1px solid ${kitchen.borderSoft}`,
                  borderRadius: 14,
                  background: '#fff',
                  boxShadow: '0 2px 10px rgba(58, 42, 102, 0.06)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    left: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    justifyContent: 'flex-end',
                    zIndex: 2,
                    opacity: hovering ? 1 : 0,
                    pointerEvents: hovering ? 'auto' : 'none',
                    transition: 'opacity 120ms ease',
                  }}
                >
                  <span
                    title="Drag to reorder"
                    style={{
                      flex: '0 0 auto',
                      color: '#a9a2bd',
                      fontSize: 13,
                      cursor: 'grab',
                      lineHeight: 1,
                      letterSpacing: '-2px',
                      padding: '3px 4px',
                      background: '#fff',
                      borderRadius: 5,
                      border: `1px solid ${kitchen.borderSoft}`,
                    }}
                  >
                    ⠿
                  </span>
                  <span
                    style={{
                      flex: '0 1 auto',
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: 10.5,
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 5,
                      background: '#fff',
                      border: `1px solid ${kitchen.borderSoft}`,
                      color: kitchen.textBody,
                      marginRight: 'auto',
                    }}
                  >
                    {meta?.label ?? block._type}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBlock(block._key)}
                    title="Remove section"
                    style={{
                      flex: '0 0 auto',
                      width: 22,
                      height: 22,
                      border: `1px solid ${kitchen.borderSoft}`,
                      borderRadius: 5,
                      background: '#fff',
                      cursor: 'pointer',
                      color: kitchen.textMuted,
                      fontSize: 12,
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ cursor: 'pointer' }} onClick={() => setEditing(block._key)}>
                  <KitchenErrorBoundary label="Preview">
                    <LivePreview block={block} isFirst={index === 0} />
                  </KitchenErrorBoundary>
                </div>
              </div>
            )
          })}
        </div>
      )}

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
        <PageSeoDrawer
          seo={page.seo}
          onPatchSeo={(fields) => patch(fields)}
          onClose={() => setSeoOpen(false)}
          pageTitle={page.title || 'Untitled page'}
          isHome={page.slug?.current === 'home'}
          hasParent={Boolean(page.parentId)}
          onAddSubpage={addSubpage}
          onDeletePermanently={deletePagePermanently}
        />
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

