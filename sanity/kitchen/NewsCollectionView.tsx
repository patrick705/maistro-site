import { useState } from 'react'
import { useClient } from 'sanity'

import { useLiveQuery } from './useLiveQuery'
import { kitchen } from './theme'

interface Row {
  _id: string
  title?: string
  category?: string
  excerpt?: string
  publishedAt?: string
  archived?: boolean
}

const NEWS_QUERY = `*[_type == "newsArticle" && !(_id in path("drafts.**"))] | order(publishedAt desc){
  _id, title, category, excerpt, publishedAt, archived
}`

type Tab = 'active' | 'archived'

export function NewsCollectionView({ onEdit }: { onEdit: (id: string) => void }) {
  const client = useClient({ apiVersion: '2024-01-01' })
  const { data: rows, refetch } = useLiveQuery<Row[]>(NEWS_QUERY)
  const [tab, setTab] = useState<Tab>('active')

  const filtered = (rows ?? []).filter((r) => (tab === 'archived' ? Boolean(r.archived) : !r.archived))
  const activeCount = (rows ?? []).filter((r) => !r.archived).length
  const archivedCount = (rows ?? []).filter((r) => r.archived).length

  async function addStory() {
    const created = await client.create({
      _type: 'newsArticle',
      title: 'Untitled story',
      category: 'Product',
      icon: '📰',
      variant: 'brand',
      publishedAt: new Date().toISOString(),
      // Created archived so an incomplete story never appears on the public
      // News grid until someone finishes it and explicitly restores it.
      archived: true,
    })
    refetch()
    onEdit(created._id)
  }

  async function setArchived(id: string, archived: boolean) {
    await client.patch(id).set({ archived }).commit().catch(() => {})
    await client.patch(`drafts.${id}`).set({ archived }).commit().catch(() => {})
    refetch()
  }

  async function remove(id: string) {
    if (!confirm('Delete this story? This cannot be undone.')) return
    await client.delete(id)
    await client.delete(`drafts.${id}`).catch(() => {})
    refetch()
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '26px 24px 72px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700 }}>News Articles</h1>
        <button type="button" onClick={addStory} style={newButtonStyle()}>
          + New news story
        </button>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: `1px solid ${kitchen.border}` }}>
        <TabButton label="Active" count={activeCount} active={tab === 'active'} onClick={() => setTab('active')} />
        <TabButton label="Archived" count={archivedCount} active={tab === 'archived'} onClick={() => setTab('archived')} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {filtered.map((row) => (
          <div
            key={row._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              border: `1px solid ${kitchen.borderSoft}`,
              borderRadius: 9,
              background: '#fff',
            }}
          >
            <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {row.title || 'Untitled'}
              </span>
              <span style={{ fontSize: 11.5, color: kitchen.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {row.excerpt || row.category}
              </span>
            </div>
            <span style={{ fontSize: 10.5, color: kitchen.textFaint, fontFamily: kitchen.fontMono }}>
              {(row.publishedAt || '').slice(0, 10)}
            </span>
            <button type="button" onClick={() => onEdit(row._id)} style={rowBtnStyle()}>
              Edit
            </button>
            <button type="button" onClick={() => setArchived(row._id, !row.archived)} style={rowBtnStyle()}>
              {row.archived ? 'Restore' : 'Archive'}
            </button>
            <button type="button" onClick={() => remove(row._id)} style={rowBtnStyle(true)}>
              Delete
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ color: kitchen.textFaint, fontSize: 13, padding: 20 }}>
            {tab === 'archived' ? 'No archived stories.' : 'No active stories yet.'}
          </div>
        )}
      </div>
    </div>
  )
}

function TabButton({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 4px',
        marginBottom: -1,
        border: 'none',
        borderBottom: `2px solid ${active ? kitchen.accent : 'transparent'}`,
        background: 'transparent',
        cursor: 'pointer',
        font: 'inherit',
        fontSize: 13,
        fontWeight: 600,
        color: active ? kitchen.ink : kitchen.textMuted,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {label}
      <span
        style={{
          fontSize: 10.5,
          fontFamily: kitchen.fontMono,
          color: active ? kitchen.accent : kitchen.textFaint,
          background: active ? '#EFEAFA' : kitchen.surface,
          borderRadius: 999,
          padding: '1px 7px',
        }}
      >
        {count}
      </span>
    </button>
  )
}

function newButtonStyle(): React.CSSProperties {
  return {
    padding: '7px 13px',
    border: `1px solid ${kitchen.accent}`,
    borderRadius: 7,
    background: kitchen.accent,
    color: '#fff',
    cursor: 'pointer',
    font: 'inherit',
    fontSize: 12.5,
    fontWeight: 600,
  }
}

function rowBtnStyle(danger = false): React.CSSProperties {
  return {
    padding: '5px 11px',
    border: `1px solid ${danger ? kitchen.danger : kitchen.borderInput}`,
    borderRadius: 7,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 11.5,
    color: danger ? kitchen.danger : kitchen.textBody,
  }
}
