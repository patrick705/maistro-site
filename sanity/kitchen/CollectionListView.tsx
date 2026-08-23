import { useClient } from 'sanity'

import { useLiveQuery } from './useLiveQuery'
import { kitchen } from './theme'

interface Row {
  _id: string
  name?: string
  email?: string
  submittedAt?: string
}

const LEADS_QUERY = `*[_type == "lead" && !(_id in path("drafts.**"))] | order(submittedAt desc){_id, name, email, submittedAt}`

export function CollectionListView({ type }: { type: 'lead' }) {
  const client = useClient({ apiVersion: '2024-01-01' })
  const { data: rows, refetch } = useLiveQuery<Row[]>(LEADS_QUERY)

  async function remove(id: string) {
    if (!confirm('Delete this document? This cannot be undone.')) return
    await client.delete(id)
    await client.delete(`drafts.${id}`).catch(() => {})
    refetch()
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '26px 24px 72px' }}>
      <h1 style={{ margin: '0 0 18px', fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700 }}>Leads</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {(rows ?? []).map((row) => (
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
                {row.name || 'Untitled'}
              </span>
              <span style={{ fontSize: 11.5, color: kitchen.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {row.email}
              </span>
            </div>
            <span style={{ fontSize: 10.5, color: kitchen.textFaint, fontFamily: kitchen.fontMono }}>
              {(row.submittedAt || '').slice(0, 10)}
            </span>
            <button type="button" onClick={() => remove(row._id)} style={rowBtnStyle(true)}>
              Delete
            </button>
          </div>
        ))}
        {rows?.length === 0 && <div style={{ color: kitchen.textFaint, fontSize: 13, padding: 20 }}>Nothing here yet.</div>}
      </div>
    </div>
  )
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
