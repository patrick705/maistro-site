import { useState } from 'react'

import { useLiveQuery } from './useLiveQuery'
import { kitchen } from './theme'

interface Asset {
  _id: string
  url: string
  originalFilename?: string
  size?: number
  extension?: string
  _createdAt: string
  width?: number
  height?: number
}

const ASSETS_QUERY = `*[_type == "sanity.imageAsset"] | order(_createdAt desc){
  _id, url, originalFilename, size, extension, _createdAt,
  "width": metadata.dimensions.width, "height": metadata.dimensions.height
}`

function formatSize(bytes?: number) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MediaLibraryView() {
  const { data: assets, loading } = useLiveQuery<Asset[]>(ASSETS_QUERY)
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = (assets ?? []).filter((a) =>
    (a.originalFilename ?? '').toLowerCase().includes(search.trim().toLowerCase()),
  )

  async function copyUrl(asset: Asset) {
    try {
      await navigator.clipboard.writeText(asset.url)
      setCopiedId(asset._id)
      setTimeout(() => setCopiedId((id) => (id === asset._id ? null : id)), 1500)
    } catch {
      // Clipboard access can fail (permissions, non-secure context) — no
      // recovery action makes sense here beyond just not showing "Copied".
    }
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '26px 24px 72px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 16 }}>
        <h1 style={{ margin: 0, fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700 }}>Media</h1>
        <input
          type="search"
          placeholder="Search by filename…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '8px 12px',
            border: `1px solid ${kitchen.borderInput}`,
            borderRadius: 8,
            background: '#fff',
            font: 'inherit',
            fontSize: 12.5,
            color: kitchen.ink,
            width: 240,
          }}
        />
      </div>

      <div style={{ fontSize: 11.5, color: kitchen.textMuted, marginBottom: 14 }}>
        {loading ? 'Loading…' : `${filtered.length} of ${assets?.length ?? 0} image${(assets?.length ?? 0) === 1 ? '' : 's'}`}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 12,
        }}
      >
        {filtered.map((asset) => (
          <div
            key={asset._id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${kitchen.borderSoft}`,
              borderRadius: 9,
              background: '#fff',
              overflow: 'hidden',
            }}
          >
            <a href={asset.url} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
              <div
                style={{
                  aspectRatio: '1 / 1',
                  background: `${kitchen.surface} url(${asset.url}?w=300&h=300&fit=crop&auto=format) center / cover no-repeat`,
                }}
              />
            </a>
            <div style={{ padding: '8px 9px', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span
                title={asset.originalFilename}
                style={{ fontSize: 11.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {asset.originalFilename || asset._id}
              </span>
              <span style={{ fontSize: 10, color: kitchen.textFaint, fontFamily: kitchen.fontMono }}>
                {[formatSize(asset.size), asset.width && asset.height ? `${asset.width}×${asset.height}` : null, asset._createdAt.slice(0, 10)]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
              <button type="button" onClick={() => copyUrl(asset)} style={copyBtnStyle()}>
                {copiedId === asset._id ? 'Copied' : 'Copy URL'}
              </button>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', color: kitchen.textFaint, fontSize: 13, padding: 20 }}>
            {search ? 'No images match that search.' : 'No images uploaded yet.'}
          </div>
        )}
      </div>
    </div>
  )
}

function copyBtnStyle(): React.CSSProperties {
  return {
    marginTop: 2,
    padding: '4px 8px',
    border: `1px solid ${kitchen.borderInput}`,
    borderRadius: 6,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 10.5,
    color: kitchen.textBody,
    alignSelf: 'flex-start',
  }
}
