import { useEffect, useState } from 'react'
import { useClient } from 'sanity'

import type { KitchenView, SettingsSection } from './KitchenTool'
import { groupPages, randomPageId } from './pageRows'
import { useLiveQuery } from './useLiveQuery'
import { kitchen } from './theme'

const API_VERSION = '2024-01-01'

interface RawPageRow {
  _id: string
  title: string
  slug?: string
  showInMenu?: boolean
  archived?: boolean
  menuOrder?: number
  parentId?: string
  blockCount: number
}

const SETTINGS_SECTIONS: { section: SettingsSection; label: string; glyph: string }[] = [
  { section: 'general', label: 'General', glyph: '⚙' },
  { section: 'navigation', label: 'Navigation', glyph: '☰' },
  { section: 'theme', label: 'Theme', glyph: '◐' },
  { section: 'analytics', label: 'Analytics & Tracking', glyph: '◉' },
  { section: 'seo', label: 'SEO defaults', glyph: '◱' },
  { section: 'demoModal', label: 'Demo modal', glyph: '🔲' },
]

const PAGES_QUERY = `*[_type == "page"]{
  _id, title, "slug": slug.current, showInMenu, archived, menuOrder, parentId, "blockCount": count(blocks)
}`

const COUNTS_QUERY = `{
  "newsArticle": count(*[_type == "newsArticle"]),
  "lead": count(*[_type == "lead"]),
  "media": count(*[_type == "sanity.imageAsset"])
}`

function rowStyle(active: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 8px',
    borderRadius: 7,
    cursor: 'pointer',
    background: active ? kitchen.surface : 'transparent',
    color: active ? kitchen.accent : kitchen.textBody,
  }
}

function sectionLabelStyle(): React.CSSProperties {
  return {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.09em',
    textTransform: 'uppercase',
    color: kitchen.textMuted,
  }
}

export function Sidebar({
  view,
  onSelect,
  isMobile,
  isOpen,
  onClose,
}: {
  view: KitchenView
  onSelect: (v: KitchenView) => void
  isMobile: boolean
  isOpen: boolean
  onClose: () => void
}) {
  const client = useClient({ apiVersion: API_VERSION })
  const { data: rawPages, refetch } = useLiveQuery<RawPageRow[]>(PAGES_QUERY)
  const { data: counts } = useLiveQuery<{ newsArticle: number; lead: number; media: number }>(COUNTS_QUERY)
  const [showArchived, setShowArchived] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [addPageOpen, setAddPageOpen] = useState(false)
  const [addPageKind, setAddPageKind] = useState<'top' | 'sub'>('top')
  const [addPageParent, setAddPageParent] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [hoverRowId, setHoverRowId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  // A stray second click much later shouldn't confirm a delete armed from an
  // earlier, forgotten click.
  useEffect(() => {
    if (!confirmDeleteId) return
    const t = setTimeout(() => setConfirmDeleteId(null), 4000)
    return () => clearTimeout(t)
  }, [confirmDeleteId])

  const pages = groupPages(rawPages ?? []).sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0) || a.title.localeCompare(b.title))
  const activePages = pages.filter((p) => !p.archived)
  const archivedPages = pages.filter((p) => p.archived)
  const topLevelPages = activePages.filter((p) => !p.parentId)

  // Subpages can't have subpages of their own, so this is at most one level
  // deep — no recursive tree-building needed.
  const childrenByParent = new Map<string, typeof activePages>()
  for (const p of activePages) {
    if (!p.parentId) continue
    const list = childrenByParent.get(p.parentId) ?? []
    list.push(p)
    childrenByParent.set(p.parentId, list)
  }

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function addSubpageUnder(parentId: string) {
    const id = randomPageId()
    await client.create({
      _id: `drafts.${id}`,
      _type: 'page',
      title: 'Untitled subpage',
      parentId,
      showInMenu: false,
      blocks: [],
    })
    setExpandedIds((prev) => new Set(prev).add(parentId))
    refetch()
    onSelect({ kind: 'page', id })
  }

  async function promoteToMain(id: string) {
    await client.patch(id).unset(['parentId']).commit()
    refetch()
  }

  async function deletePageRow(p: { id: string; title: string }) {
    if (confirmDeleteId !== p.id) {
      setConfirmDeleteId(p.id)
      return
    }
    setConfirmDeleteId(null)
    const kids = childrenByParent.get(p.id) ?? []
    const baseIds = new Set<string>()
    for (const raw of [p.id, ...kids.map((k) => k.id)]) {
      baseIds.add(raw.startsWith('drafts.') ? raw.slice('drafts.'.length) : raw)
    }
    const tx = client.transaction()
    for (const base of baseIds) tx.delete(base).delete(`drafts.${base}`)
    await tx.commit()
    if (view?.kind === 'page' && (view.id === p.id || kids.some((k) => k.id === view.id))) {
      const home = pages.find((x) => x.slug === 'home')
      onSelect(home ? { kind: 'page', id: home.id } : null)
    }
    refetch()
  }

  // Reordering is a structural/organizational change (like a palette's "default for new
  // sites" flag) rather than page content, so it writes straight to the published
  // documents instead of going through drafts — a drag-to-reorder gesture shouldn't leave
  // you needing to publish half a dozen pages just to see the new order take effect.
  async function dropPage(targetId: string) {
    const fromId = dragId
    setDragId(null)
    setOverId(null)
    if (!fromId || fromId === targetId) return
    const list = activePages.slice()
    const fromIndex = list.findIndex((p) => p.id === fromId)
    if (fromIndex < 0) return
    const [moved] = list.splice(fromIndex, 1)
    const toIndex = list.findIndex((p) => p.id === targetId)
    list.splice(toIndex < 0 ? list.length : toIndex, 0, moved)
    await Promise.all(list.map((p, i) => client.patch(p.id).set({ menuOrder: i + 1 }).commit()))
    refetch()
  }

  async function confirmAddPage() {
    if (addPageKind === 'sub') {
      if (!addPageParent) return
      const id = randomPageId()
      await client.create({
        _id: `drafts.${id}`,
        _type: 'page',
        title: 'Untitled subpage',
        parentId: addPageParent,
        showInMenu: false,
        blocks: [],
      })
      refetch()
      onSelect({ kind: 'page', id })
    } else {
      const created = await client.create({
        _type: 'page',
        title: 'Untitled page',
        showInMenu: false,
        blocks: [],
      })
      refetch()
      onSelect({ kind: 'page', id: created._id })
    }
    setAddPageOpen(false)
    setAddPageKind('top')
    setAddPageParent(null)
  }

  function pageRow(p: (typeof activePages)[number], { isChild }: { isChild: boolean }) {
    const isSubpage = Boolean(p.parentId)
    const isHome = p.slug === 'home'
    const children = childrenByParent.get(p.id) ?? []
    const expanded = expandedIds.has(p.id)
    const hovering = hoverRowId === p.id
    return (
      <div key={p.id}>
        <div
          onClick={() => onSelect({ kind: 'page', id: p.id })}
          onMouseEnter={() => setHoverRowId(p.id)}
          onMouseLeave={() => setHoverRowId((v) => (v === p.id ? null : v))}
          draggable={!isChild}
          onDragStart={(e) => {
            if (isChild) return
            e.dataTransfer.effectAllowed = 'move'
            setDragId(p.id)
          }}
          onDragOver={(e) => {
            if (isChild) return
            e.preventDefault()
            if (overId !== p.id) setOverId(p.id)
          }}
          onDragEnd={() => {
            setDragId(null)
            setOverId(null)
          }}
          onDrop={(e) => {
            if (isChild) return
            e.preventDefault()
            dropPage(p.id)
          }}
          style={{
            ...rowStyle(view?.kind === 'page' && view.id === p.id),
            paddingLeft: isChild ? 30 : 8,
            opacity: dragId === p.id ? 0.45 : 1,
            boxShadow: overId === p.id && dragId !== p.id ? `inset 0 2px 0 ${kitchen.accent}` : 'none',
          }}
        >
          {!isChild && children.length > 0 ? (
            <span
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(p.id)
              }}
              style={{ width: 9, textAlign: 'center', fontSize: 9, color: kitchen.textFaint, cursor: 'pointer' }}
            >
              {expanded ? '▾' : '▸'}
            </span>
          ) : (
            <span style={{ width: 9, textAlign: 'center', fontSize: 11, color: kitchen.borderDashed, cursor: isChild ? 'default' : 'grab', letterSpacing: '-2px' }}>
              {isChild ? '' : '⠿'}
            </span>
          )}
          <span style={{ width: 14, textAlign: 'center', fontSize: 11, color: kitchen.textFaint }}>▤</span>
          <span style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {p.title}
          </span>
          {hovering ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {!isSubpage && (
                <span
                  title="Add subpage"
                  onClick={(e) => {
                    e.stopPropagation()
                    addSubpageUnder(p.id)
                  }}
                  style={{ width: 19, height: 19, borderRadius: 5, display: 'grid', placeItems: 'center', fontSize: 12, color: kitchen.accent, cursor: 'pointer' }}
                >
                  +
                </span>
              )}
              {isSubpage && (
                <span
                  title="Make this a main page"
                  onClick={(e) => {
                    e.stopPropagation()
                    promoteToMain(p.id)
                  }}
                  style={{ width: 19, height: 19, borderRadius: 5, display: 'grid', placeItems: 'center', fontSize: 10, color: kitchen.accent, cursor: 'pointer' }}
                >
                  ⇧
                </span>
              )}
              {!isHome && (
                <span
                  title={confirmDeleteId === p.id ? 'Click again to delete' : 'Delete'}
                  onClick={(e) => {
                    e.stopPropagation()
                    deletePageRow(p)
                  }}
                  style={{
                    width: 19,
                    height: 19,
                    borderRadius: 5,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 10,
                    cursor: 'pointer',
                    background: confirmDeleteId === p.id ? kitchen.danger : 'transparent',
                    color: confirmDeleteId === p.id ? '#fff' : kitchen.textFaint,
                  }}
                >
                  ✕
                </span>
              )}
            </div>
          ) : (
            <>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.showInMenu ? '#4F9E86' : kitchen.textFaint }} />
              <span style={{ flex: '0 0 auto', fontSize: 10, color: kitchen.textFaint, fontFamily: kitchen.fontMono }}>{p.blockCount}</span>
            </>
          )}
        </div>
        {!isChild &&
          expanded &&
          children
            .slice()
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((child) => pageRow(child, { isChild: true }))}
      </div>
    )
  }

  return (
    <>
      {isMobile && isOpen && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(20,14,36,0.35)', zIndex: 29 }}
        />
      )}
      <aside
      style={
        isMobile
          ? {
              position: 'fixed',
              top: 0,
              bottom: 0,
              left: isOpen ? 0 : '-85vw',
              width: '85vw',
              maxWidth: 320,
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              background: '#fff',
              borderRight: `1px solid ${kitchen.border}`,
              transition: 'left 0.2s ease',
              boxShadow: isOpen ? '8px 0 24px rgba(58,42,102,0.18)' : 'none',
            }
          : {
              width: 266,
              flex: '0 0 266px',
              display: 'flex',
              flexDirection: 'column',
              background: '#fff',
              borderRight: `1px solid ${kitchen.border}`,
            }
      }
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          padding: '13px 14px',
          borderBottom: `1px solid ${kitchen.border}`,
        }}
      >
        <div
          style={{
            width: 25,
            height: 25,
            borderRadius: 7,
            background: kitchen.ink,
            color: kitchen.warm,
            display: 'grid',
            placeItems: 'center',
            fontFamily: kitchen.fontDisplay,
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          M
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
          <span style={{ fontFamily: kitchen.fontDisplay, fontWeight: 700, fontSize: 13.5, letterSpacing: '-0.01em' }}>
            Maistro<span style={{ color: kitchen.accent }}> Site</span>
          </span>
          <span style={{ fontSize: 10, color: kitchen.textMuted, fontFamily: kitchen.fontMono }}>
            maistro-site · main
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 6px 5px' }}>
          <span style={sectionLabelStyle()}>Pages</span>
          <span style={{ fontSize: 10, color: kitchen.textFaint, fontFamily: kitchen.fontMono }}>
            {activePages.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setAddPageOpen((v) => !v)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '6px 8px',
            marginBottom: addPageOpen ? 6 : 3,
            border: `1px dashed ${kitchen.borderDashed}`,
            borderRadius: 7,
            background: 'transparent',
            cursor: 'pointer',
            font: 'inherit',
            fontSize: 12.5,
            color: kitchen.textSubtle,
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }}>+</span>
          <span>Add new page</span>
        </button>

        {addPageOpen && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: 8,
              marginBottom: 8,
              border: `1px solid ${kitchen.borderInput}`,
              borderRadius: 9,
              background: '#faf8fd',
            }}
          >
            <div style={{ display: 'flex', border: `1px solid ${kitchen.borderInput}`, borderRadius: 7, overflow: 'hidden', background: '#fff' }}>
              {(['top', 'sub'] as const).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => {
                    setAddPageKind(kind)
                    setAddPageParent(null)
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    border: 'none',
                    cursor: 'pointer',
                    font: 'inherit',
                    fontSize: 11.5,
                    fontWeight: 600,
                    background: addPageKind === kind ? '#EEE9F8' : '#fff',
                    color: addPageKind === kind ? kitchen.accent : kitchen.textBody,
                  }}
                >
                  {kind === 'top' ? 'Top-level' : 'Subpage'}
                </button>
              ))}
            </div>

            {addPageKind === 'sub' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10.5, color: kitchen.textMuted }}>Subpage of</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 140, overflowY: 'auto' }}>
                  {topLevelPages.length === 0 && (
                    <span style={{ fontSize: 11, color: kitchen.textFaint, padding: '4px 6px' }}>No top-level pages yet.</span>
                  )}
                  {topLevelPages.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setAddPageParent(p.id)}
                      style={{
                        textAlign: 'left',
                        padding: '6px 8px',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        font: 'inherit',
                        fontSize: 11.5,
                        background: addPageParent === p.id ? '#EEE9F8' : 'transparent',
                        color: addPageParent === p.id ? kitchen.accent : kitchen.textBody,
                      }}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={confirmAddPage}
              disabled={addPageKind === 'sub' && !addPageParent}
              style={{
                padding: '6px 10px',
                border: `1px solid ${kitchen.accent}`,
                borderRadius: 7,
                background: kitchen.accent,
                color: '#fff',
                cursor: addPageKind === 'sub' && !addPageParent ? 'default' : 'pointer',
                opacity: addPageKind === 'sub' && !addPageParent ? 0.5 : 1,
                font: 'inherit',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {addPageKind === 'sub' ? (addPageParent ? 'Create subpage' : 'Choose a parent') : 'Create page'}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: archivedPages.length > 0 ? 6 : 18 }}>
          {topLevelPages.map((p) => pageRow(p, { isChild: false }))}
        </div>

        {archivedPages.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <button
              type="button"
              onClick={() => setShowArchived((v) => !v)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px 6px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                font: 'inherit',
                fontSize: 11,
                color: kitchen.textFaint,
              }}
            >
              <span>{showArchived ? '▾' : '▸'} {archivedPages.length} archived</span>
            </button>
            {showArchived && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {archivedPages.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelect({ kind: 'page', id: p.id })}
                    onMouseEnter={() => setHoverRowId(p.id)}
                    onMouseLeave={() => setHoverRowId((v) => (v === p.id ? null : v))}
                    style={{ ...rowStyle(view?.kind === 'page' && view.id === p.id), opacity: 0.55 }}
                  >
                    <span style={{ width: 14, textAlign: 'center', fontSize: 11, color: kitchen.textFaint }}>▤</span>
                    <span style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.title}
                    </span>
                    {hoverRowId === p.id ? (
                      <span
                        title={confirmDeleteId === p.id ? 'Click again to delete' : 'Delete'}
                        onClick={(e) => {
                          e.stopPropagation()
                          deletePageRow(p)
                        }}
                        style={{
                          width: 19,
                          height: 19,
                          borderRadius: 5,
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 10,
                          cursor: 'pointer',
                          background: confirmDeleteId === p.id ? kitchen.danger : 'transparent',
                          color: confirmDeleteId === p.id ? '#fff' : kitchen.textFaint,
                        }}
                      >
                        ✕
                      </span>
                    ) : (
                      <span style={{ fontSize: 9.5, fontWeight: 600, color: kitchen.textFaint, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Archived
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ padding: '6px 6px 5px' }}>
          <span style={sectionLabelStyle()}>Site settings</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 18 }}>
          {SETTINGS_SECTIONS.map((s) => (
            <div
              key={s.section}
              onClick={() => onSelect({ kind: 'settings', section: s.section })}
              style={rowStyle(view?.kind === 'settings' && view.section === s.section)}
            >
              <span style={{ width: 14, textAlign: 'center', fontSize: 11, color: kitchen.textFaint }}>{s.glyph}</span>
              <span style={{ flex: 1 }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '6px 6px 5px' }}>
          <span style={sectionLabelStyle()}>Collections</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <div
            onClick={() => onSelect({ kind: 'collection', type: 'newsArticle' })}
            style={rowStyle(view?.kind === 'collection' && view.type === 'newsArticle')}
          >
            <span style={{ width: 14, textAlign: 'center', fontSize: 11, color: kitchen.textFaint }}>▥</span>
            <span style={{ flex: 1 }}>News Articles</span>
            <span style={{ fontSize: 10, color: kitchen.textFaint, fontFamily: kitchen.fontMono }}>
              {counts?.newsArticle ?? 0}
            </span>
          </div>
          <div
            onClick={() => onSelect({ kind: 'collection', type: 'lead' })}
            style={rowStyle(view?.kind === 'collection' && view.type === 'lead')}
          >
            <span style={{ width: 14, textAlign: 'center', fontSize: 11, color: kitchen.textFaint }}>◎</span>
            <span style={{ flex: 1 }}>Leads</span>
            <span style={{ fontSize: 10, color: kitchen.textFaint, fontFamily: kitchen.fontMono }}>
              {counts?.lead ?? 0}
            </span>
          </div>
          <div onClick={() => onSelect({ kind: 'media' })} style={rowStyle(view?.kind === 'media')}>
            <span style={{ width: 14, textAlign: 'center', fontSize: 11, color: kitchen.textFaint }}>▧</span>
            <span style={{ flex: 1 }}>Media</span>
            <span style={{ fontSize: 10, color: kitchen.textFaint, fontFamily: kitchen.fontMono }}>
              {counts?.media ?? 0}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 12px',
          borderTop: `1px solid ${kitchen.border}`,
        }}
      >
        <a
          href="/studio/structure"
          style={{
            fontSize: 11,
            color: kitchen.textMuted,
            textDecoration: 'underline',
          }}
        >
          Default Studio view →
        </a>
      </div>
      </aside>
    </>
  )
}
