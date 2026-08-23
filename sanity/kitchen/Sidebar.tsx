import { useClient } from 'sanity'

import type { KitchenView, SettingsSection } from './KitchenTool'
import { useLiveQuery } from './useLiveQuery'
import { kitchen } from './theme'

const API_VERSION = '2024-01-01'

interface PageRow {
  _id: string
  title: string
  slug?: string
  showInMenu?: boolean
  blockCount: number
}

const SETTINGS_SECTIONS: { section: SettingsSection; label: string; glyph: string }[] = [
  { section: 'general', label: 'General', glyph: '⚙' },
  { section: 'navigation', label: 'Navigation', glyph: '☰' },
  { section: 'seo', label: 'SEO defaults', glyph: '◱' },
  { section: 'theme', label: 'Theme', glyph: '◐' },
  { section: 'demoModal', label: 'Demo modal', glyph: '🔲' },
]

const PAGES_QUERY = `*[_type == "page" && !(_id in path("drafts.**"))] | order(menuOrder asc, title asc){
  _id, title, "slug": slug.current, showInMenu, "blockCount": count(blocks)
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

export function Sidebar({ view, onSelect }: { view: KitchenView; onSelect: (v: KitchenView) => void }) {
  const client = useClient({ apiVersion: API_VERSION })
  const { data: pages, refetch } = useLiveQuery<PageRow[]>(PAGES_QUERY)
  const { data: counts } = useLiveQuery<{ newsArticle: number; lead: number; media: number }>(COUNTS_QUERY)

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
    <aside
      style={{
        width: 266,
        flex: '0 0 266px',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRight: `1px solid ${kitchen.border}`,
      }}
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
            {pages?.length ?? 0}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 18 }}>
          {(pages ?? []).map((p) => (
            <div key={p._id} onClick={() => onSelect({ kind: 'page', id: p._id })} style={rowStyle(view?.kind === 'page' && view.id === p._id)}>
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
  )
}
