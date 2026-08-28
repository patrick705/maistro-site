import { useState } from 'react'
import { useClient } from 'sanity'

import type { KitchenView, SettingsSection } from './KitchenTool'
import { groupPages } from './pageRows'
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
  _id, title, "slug": slug.current, showInMenu, archived, menuOrder, "blockCount": count(blocks)
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

  const pages = groupPages(rawPages ?? []).sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0) || a.title.localeCompare(b.title))
  const activePages = pages.filter((p) => !p.archived)
  const archivedPages = pages.filter((p) => p.archived)

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

  async function addPage() {
    const created = await client.create({
      _type: 'page',
      title: 'Untitled page',
      showInMenu: false,
      blocks: [],
    })
    refetch()
    onSelect({ kind: 'page', id: created._id })
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
          onClick={addPage}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '6px 8px',
            marginBottom: 3,
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: archivedPages.length > 0 ? 6 : 18 }}>
          {activePages.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelect({ kind: 'page', id: p.id })}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'move'
                setDragId(p.id)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                if (overId !== p.id) setOverId(p.id)
              }}
              onDragEnd={() => {
                setDragId(null)
                setOverId(null)
              }}
              onDrop={(e) => {
                e.preventDefault()
                dropPage(p.id)
              }}
              style={{
                ...rowStyle(view?.kind === 'page' && view.id === p.id),
                opacity: dragId === p.id ? 0.45 : 1,
                boxShadow: overId === p.id && dragId !== p.id ? `inset 0 2px 0 ${kitchen.accent}` : 'none',
              }}
            >
              <span style={{ width: 9, textAlign: 'center', fontSize: 11, color: kitchen.borderDashed, cursor: 'grab', letterSpacing: '-2px' }}>⠿</span>
              <span style={{ width: 14, textAlign: 'center', fontSize: 11, color: kitchen.textFaint }}>▤</span>
              <span style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.title}
              </span>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: p.showInMenu ? '#4F9E86' : kitchen.textFaint,
                }}
              />
              <span style={{ flex: '0 0 auto', fontSize: 10, color: kitchen.textFaint, fontFamily: kitchen.fontMono }}>
                {p.blockCount}
              </span>
            </div>
          ))}
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
                    style={{ ...rowStyle(view?.kind === 'page' && view.id === p.id), opacity: 0.55 }}
                  >
                    <span style={{ width: 14, textAlign: 'center', fontSize: 11, color: kitchen.textFaint }}>▤</span>
                    <span style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.title}
                    </span>
                    <span style={{ fontSize: 9.5, fontWeight: 600, color: kitchen.textFaint, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Archived
                    </span>
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
