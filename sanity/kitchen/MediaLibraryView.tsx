import { useMemo, useState } from 'react'
import { useClient } from 'sanity'

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

interface Usage {
  docLabel: string
  path: string
  hasAlt: boolean
}

const ASSETS_QUERY = `*[_type == "sanity.imageAsset"] | order(_createdAt desc){
  _id, url, originalFilename, size, extension, _createdAt,
  "width": metadata.dimensions.width, "height": metadata.dimensions.height
}`

// Every document type that can hold an image field — kept broad and generic
// (a raw object walk below) rather than hand-listing every block's field
// path, so newly added block types are picked up automatically.
const REFERRING_DOCS_QUERY = `*[_type in ["page", "siteSettings", "newsArticle"] && !(_id in path("drafts.**"))]{...}`

function formatSize(bytes?: number) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function docLabel(doc: Record<string, unknown>): string {
  if (doc._type === 'siteSettings') return 'Site-wide'
  if (typeof doc.title === 'string' && doc.title) return doc.title
  return doc._type === 'page' ? 'Untitled page' : 'Untitled'
}

/** Walks an arbitrary document/value tree looking for `{ asset: { _ref } }` image fields. */
function scanForImageRefs(value: unknown, path: string, onFound: (assetId: string, path: string, hasAlt: boolean) => void) {
  if (!value || typeof value !== 'object') return
  if (Array.isArray(value)) {
    value.forEach((item, i) => scanForImageRefs(item, `${path}[${i}]`, onFound))
    return
  }
  const obj = value as Record<string, unknown>
  const asset = obj.asset as { _ref?: string } | undefined
  if (typeof asset?._ref === 'string') {
    onFound(asset._ref, path, Boolean((obj.alt as string | undefined)?.trim()))
  }
  for (const key of Object.keys(obj)) {
    if (key.startsWith('_') || key === 'asset') continue
    scanForImageRefs(obj[key], path ? `${path}.${key}` : key, onFound)
  }
}

function buildUsageMap(docs: Record<string, unknown>[]): Map<string, Usage[]> {
  const usages = new Map<string, Usage[]>()
  function record(assetId: string, path: string, hasAlt: boolean, label: string) {
    const list = usages.get(assetId) ?? []
    list.push({ docLabel: label, path, hasAlt })
    usages.set(assetId, list)
  }
  for (const doc of docs) {
    const label = docLabel(doc)
    const blocks = doc.blocks as Record<string, unknown>[] | undefined
    if (Array.isArray(blocks)) {
      blocks.forEach((block) => {
        scanForImageRefs(block, String(block._type ?? 'block'), (assetId, path, hasAlt) => record(assetId, path, hasAlt, label))
      })
    }
    const { blocks: _blocks, ...rest } = doc
    scanForImageRefs(rest, '', (assetId, path, hasAlt) => record(assetId, path, hasAlt, label))
  }
  return usages
}

export function MediaLibraryView() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const { data: assets, loading, refetch } = useLiveQuery<Asset[]>(ASSETS_QUERY)
  const { data: referringDocs } = useLiveQuery<Record<string, unknown>[]>(REFERRING_DOCS_QUERY)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'All' | 'Unused'>('All')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const usageMap = useMemo(() => buildUsageMap(referringDocs ?? []), [referringDocs])

  const bySearch = (assets ?? []).filter((a) => (a.originalFilename ?? '').toLowerCase().includes(search.trim().toLowerCase()))
  const filtered = bySearch.filter((a) => (filter === 'Unused' ? !(usageMap.get(a._id)?.length) : true))
  const unusedCount = bySearch.filter((a) => !(usageMap.get(a._id)?.length)).length

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

  async function removeAsset(asset: Asset) {
    const uses = usageMap.get(asset._id) ?? []
    if (uses.length) return
    if (!confirm(`Delete "${asset.originalFilename ?? asset._id}" permanently? It isn't referenced anywhere, so nothing else will break.`)) return
    await client.delete(asset._id)
    refetch()
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '26px 24px 72px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 16, flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700 }}>Media</h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', border: `1px solid ${kitchen.borderInput}`, borderRadius: 7, overflow: 'hidden', background: '#fff' }}>
            {(['All', 'Unused'] as const).map((f, i) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                style={{
                  padding: '5px 12px',
                  border: 'none',
                  borderLeft: i ? `1px solid ${kitchen.borderInput}` : 'none',
                  cursor: 'pointer',
                  font: 'inherit',
                  fontSize: 11.5,
                  fontWeight: 600,
                  background: filter === f ? kitchen.accent : '#fff',
                  color: filter === f ? '#fff' : kitchen.textSubtle,
                }}
              >
                {f === 'Unused' ? `Unused (${unusedCount})` : 'All'}
              </button>
            ))}
          </div>
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
      </div>

      <div style={{ fontSize: 11.5, color: kitchen.textMuted, marginBottom: 14 }}>
        {loading ? 'Loading…' : `${filtered.length} of ${assets?.length ?? 0} image${(assets?.length ?? 0) === 1 ? '' : 's'}`}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(212px, 1fr))', gap: 12 }}>
        {filtered.map((asset) => {
          const uses = usageMap.get(asset._id) ?? []
          return (
            <div key={asset._id} style={{ display: 'flex', flexDirection: 'column', border: `1px solid ${kitchen.borderSoft}`, borderRadius: 9, background: '#fff', overflow: 'hidden' }}>
              <a href={asset.url} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
                <div style={{ aspectRatio: '1 / 1', background: `${kitchen.surface} url(${asset.url}?w=300&h=300&fit=crop&auto=format) center / cover no-repeat` }} />
              </a>
              <div style={{ padding: '8px 9px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 0 }}>
                  <span title={asset.originalFilename} style={{ flex: '1 1 auto', minWidth: 0, fontSize: 11.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {asset.originalFilename || asset._id}
                  </span>
                  <span style={{ flex: '0 0 auto', fontSize: 9.5, color: kitchen.textFaint, fontFamily: kitchen.fontMono }}>{formatSize(asset.size)}</span>
                </div>
                <span style={{ fontSize: 10, color: kitchen.textFaint, fontFamily: kitchen.fontMono }}>
                  {[asset.width && asset.height ? `${asset.width}×${asset.height}` : null, asset._createdAt.slice(0, 10)].filter(Boolean).join(' · ')}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {uses.length ? (
                    uses.map((u, i) => (
                      <span key={i} style={{ fontSize: 9.5, fontFamily: kitchen.fontMono, color: u.hasAlt ? kitchen.textMuted : '#9c6a1c' }}>
                        {u.docLabel} · {u.path}
                        {!u.hasAlt && ' · no alt text'}
                      </span>
                    ))
                  ) : (
                    <span
                      style={{
                        alignSelf: 'flex-start',
                        fontSize: 9.5,
                        fontFamily: kitchen.fontMono,
                        padding: '1px 5px',
                        borderRadius: 4,
                        border: `1px solid ${kitchen.borderSoft}`,
                        background: kitchen.surface,
                        color: kitchen.textFaint,
                      }}
                    >
                      not referenced
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 5 }}>
                  <button type="button" onClick={() => copyUrl(asset)} style={smallBtnStyle()}>
                    {copiedId === asset._id ? 'Copied' : 'Copy URL'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAsset(asset)}
                    disabled={uses.length > 0}
                    title={uses.length ? `In use by ${uses.length} field${uses.length === 1 ? '' : 's'} — remove those references first` : undefined}
                    style={uses.length ? disabledDeleteBtnStyle() : deleteBtnStyle()}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {!loading && filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', color: kitchen.textFaint, fontSize: 13, padding: 20 }}>
            {search ? 'No images match that search.' : filter === 'Unused' ? 'Every asset is referenced by a field.' : 'No images uploaded yet.'}
          </div>
        )}
      </div>
    </div>
  )
}

function smallBtnStyle(): React.CSSProperties {
  return { flex: 1, padding: '4px 8px', border: `1px solid ${kitchen.borderInput}`, borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 10.5, color: kitchen.textBody }
}

function deleteBtnStyle(): React.CSSProperties {
  return { flex: 1, padding: '4px 8px', border: '1px solid #e6cfd0', borderRadius: 6, background: '#fff', cursor: 'pointer', font: 'inherit', fontSize: 11, fontWeight: 600, color: '#a4413f' }
}

function disabledDeleteBtnStyle(): React.CSSProperties {
  return { flex: 1, padding: '4px 8px', border: `1px solid ${kitchen.borderSoft}`, borderRadius: 6, background: kitchen.surface, cursor: 'not-allowed', font: 'inherit', fontSize: 11, color: kitchen.textFaint }
}
