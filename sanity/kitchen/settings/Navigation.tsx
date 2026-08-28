import { useState } from 'react'
import { useClient } from 'sanity'

import { ArrayEditor } from '../ArrayEditor'
import { groupPages } from '../pageRows'
import { Toggle } from '../Toggle'
import { kitchen } from '../theme'
import { useKitchenPatch } from '../useKitchenPatch'
import { useLiveQuery } from '../useLiveQuery'

const API_VERSION = '2024-01-01'

interface NavItem {
  _key: string
  label?: string
  href?: string
}

interface SiteSettingsDoc {
  _id: string
  navItems?: NavItem[]
  stickyNav?: boolean
  primaryCta?: { label?: string; href?: string }
}

interface RawPageRow {
  _id: string
  title?: string
  slug?: string
  showInMenu?: boolean
  archived?: boolean
  menuOrder?: number
}

interface PageRow {
  id: string
  title: string
  slug: string
  showInMenu: boolean
  archived: boolean
  menuOrder: number
  status: 'Published' | 'Draft'
}

const PAGES_QUERY = `*[_type == "page"]{
  _id, title, "slug": slug.current, showInMenu, archived, menuOrder
}`

function toPageRows(rows: RawPageRow[]): PageRow[] {
  return groupPages(rows).map((p) => ({
    id: p.id,
    title: p.title || 'Untitled page',
    slug: p.slug ?? '',
    showInMenu: Boolean(p.showInMenu),
    archived: Boolean(p.archived),
    menuOrder: p.menuOrder ?? 0,
    status: p.isDraft ? 'Draft' : 'Published',
  }))
}

const inputStyle: React.CSSProperties = {
  padding: '7px 9px',
  border: `1px solid ${kitchen.borderInput}`,
  borderRadius: 7,
  background: '#fff',
  font: 'inherit',
  fontSize: 12.5,
  color: kitchen.ink,
  width: '100%',
}

function randomKey() {
  return Math.random().toString(36).slice(2, 10)
}

function sectionLabel(): React.CSSProperties {
  return { fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted, marginBottom: 9, display: 'block' }
}

function PagesList() {
  const client = useClient({ apiVersion: API_VERSION })
  const { data: rawPages, refetch } = useLiveQuery<RawPageRow[]>(PAGES_QUERY)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  const pages = toPageRows(rawPages ?? []).sort((a, b) => a.menuOrder - b.menuOrder || a.title.localeCompare(b.title))

  async function toggleInMenu(row: PageRow) {
    await client.patch(row.id).set({ showInMenu: !row.showInMenu }).commit()
    refetch()
  }

  async function drop(targetId: string) {
    const fromId = dragId
    setDragId(null)
    setOverId(null)
    if (!fromId || fromId === targetId) return
    const list = pages.slice()
    const fromIndex = list.findIndex((p) => p.id === fromId)
    if (fromIndex < 0) return
    const [moved] = list.splice(fromIndex, 1)
    const toIndex = list.findIndex((p) => p.id === targetId)
    list.splice(toIndex < 0 ? list.length : toIndex, 0, moved)
    await Promise.all(list.map((p, i) => client.patch(p.id).set({ menuOrder: i + 1 }).commit()))
    refetch()
  }

  return (
    <div>
      <span style={sectionLabel()}>Pages</span>
      <p style={{ margin: '0 0 10px', fontSize: 11, color: kitchen.textMuted, lineHeight: 1.5 }}>
        Every page on the site, including drafts. Drag to reorder the top menu; the toggle controls whether it appears there
        at all.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {pages.map((p) => {
          const statusColors = p.archived
            ? { fg: kitchen.textMuted, bg: kitchen.surface, bd: kitchen.borderSoft, label: 'Archived' }
            : p.status === 'Published'
              ? { fg: '#2f6b52', bg: '#eefaf2', bd: '#cfe8d8', label: 'Published' }
              : { fg: '#9c6a1c', bg: '#fdf5e5', bd: '#f0dcb0', label: 'Draft' }
          return (
            <div
              key={p.id}
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
                drop(p.id)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 11px',
                border: `1px solid ${kitchen.borderSoft}`,
                borderRadius: 9,
                background: '#fff',
                opacity: dragId === p.id ? 0.45 : 1,
                boxShadow: overId === p.id && dragId !== p.id ? `inset 0 2px 0 ${kitchen.accent}` : 'none',
              }}
            >
              <span style={{ flex: '0 0 auto', width: 9, textAlign: 'center', fontSize: 11, color: kitchen.borderDashed, cursor: 'grab', letterSpacing: '-2px' }}>
                ⠿
              </span>
              <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: p.archived ? kitchen.textFaint : kitchen.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.title}
                </span>
                <span style={{ fontSize: 10.5, color: kitchen.textMuted, fontFamily: kitchen.fontMono }}>/{p.slug}</span>
              </div>
              <span
                style={{
                  flex: '0 0 auto',
                  fontSize: 9.5,
                  fontFamily: kitchen.fontMono,
                  padding: '1px 6px',
                  borderRadius: 4,
                  border: `1px solid ${statusColors.bd}`,
                  background: statusColors.bg,
                  color: statusColors.fg,
                }}
              >
                {statusColors.label}
              </span>
              <div
                onClick={() => toggleInMenu(p)}
                style={{
                  flex: '0 0 auto',
                  width: 34,
                  height: 19,
                  borderRadius: 20,
                  background: p.showInMenu ? kitchen.accent : kitchen.borderInput,
                  padding: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: p.showInMenu ? 'flex-end' : 'flex-start',
                  transition: 'background 140ms ease',
                }}
              >
                <div style={{ width: 15, height: 15, borderRadius: '50%', background: '#fff' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function NavigationSettings() {
  const { doc, patch } = useKitchenPatch('siteSettings', 'siteSettings')
  const settings = doc as SiteSettingsDoc | null
  if (!settings) return <div style={{ padding: 24, color: kitchen.textFaint }}>Loading…</div>

  const navItems = settings.navItems ?? []
  const cta = settings.primaryCta ?? {}

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '26px 24px 72px' }}>
      <h1 style={{ margin: '0 0 5px', fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700 }}>Navigation</h1>
      <div style={{ fontSize: 11, color: kitchen.textMuted, fontFamily: kitchen.fontMono, marginBottom: 22 }}>siteSettings.navItems / primaryCta</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <PagesList />

        <div>
          <span style={sectionLabel()}>Nav items</span>
          <ArrayEditor
            items={navItems}
            onChange={(next) => patch({ navItems: next })}
            newItem={() => ({ _key: randomKey(), label: 'New link', href: '/' })}
            addLabel="+ Add nav item"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Label" value={item.label ?? ''} onChange={(e) => update({ label: e.target.value })} />
                <input style={{ ...inputStyle, flex: 1 }} placeholder="/path or /#anchor" value={item.href ?? ''} onChange={(e) => update({ href: e.target.value })} />
              </div>
            )}
          />
        </div>

        <div>
          <span style={sectionLabel()}>Primary CTA button</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              placeholder="Button label"
              value={cta.label ?? ''}
              onChange={(e) => patch({ primaryCta: { ...cta, label: e.target.value } })}
            />
            <input
              style={{ ...inputStyle, flex: 1 }}
              placeholder="Link (empty = opens book-a-demo modal)"
              value={cta.href ?? ''}
              onChange={(e) => patch({ primaryCta: { ...cta, href: e.target.value } })}
            />
          </div>
        </div>

        <Toggle
          label="Sticky top nav"
          hint="Stays fixed at the top of the viewport while scrolling"
          value={Boolean(settings.stickyNav)}
          onChange={(v) => patch({ stickyNav: v })}
        />
      </div>
    </div>
  )
}
