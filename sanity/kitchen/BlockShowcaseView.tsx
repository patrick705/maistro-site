import { useMemo, useState } from 'react'
import { useClient } from 'sanity'

import { BLOCK_CATEGORIES, BLOCK_TYPES } from './blockTypes'
import { genericBlockContent } from './blockShowcaseContent'
import { KitchenErrorBoundary } from './KitchenErrorBoundary'
import { LivePreview } from './livePreview/LivePreview'
import { groupPages } from './pageRows'
import { kitchen } from './theme'
import { useLiveQuery } from './useLiveQuery'
import type { KitchenView } from './KitchenTool'

const API_VERSION = '2024-01-01'

const PAGES_QUERY = `*[_type == "page" && archived != true]{_id, title, "slug": slug.current}`

interface RawPageRow {
  _id: string
  title: string
  slug?: string
}

export function BlockShowcaseView({ onSelect }: { onSelect: (v: KitchenView) => void }) {
  const client = useClient({ apiVersion: API_VERSION })
  const { data: rawPages } = useLiveQuery<RawPageRow[]>(PAGES_QUERY)
  const pages = groupPages(rawPages ?? []).sort((a, b) => a.title.localeCompare(b.title))
  const [targetByType, setTargetByType] = useState<Record<string, string>>({})
  const [cloning, setCloning] = useState<string | null>(null)

  // Computed once — each card keeps the same example instance for the life of
  // this view rather than regenerating (and re-keying) on every re-render.
  const items = useMemo(() => BLOCK_TYPES.map((t) => ({ ...t, block: genericBlockContent(t.type) })), [])

  async function cloneIntoPage(type: string) {
    const pageId = targetByType[type]
    if (!pageId) return
    setCloning(type)
    try {
      const draftId = `drafts.${pageId}`
      const [draft, published] = await Promise.all([client.getDocument(draftId), client.getDocument(pageId)])
      const base = draft ?? published ?? { _type: 'page' }
      const newBlock = genericBlockContent(type)
      await client
        .transaction()
        .createIfNotExists({ ...base, _id: draftId, _type: 'page' })
        .patch(draftId, (p) => p.setIfMissing({ blocks: [] }).insert('after', 'blocks[-1]', [newBlock]))
        .commit({ autoGenerateArrayKeys: true })
      onSelect({ kind: 'page', id: pageId })
    } finally {
      setCloning(null)
    }
  }

  const grouped = BLOCK_CATEGORIES.map((category) => ({
    category,
    items: items.filter((i) => i.category === category),
  })).filter((g) => g.items.length > 0)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '26px 24px 72px' }}>
      <h1 style={{ margin: '0 0 5px', fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700 }}>Block Showcase</h1>
      <div style={{ fontSize: 12.5, color: kitchen.textMuted, marginBottom: 26 }}>
        Every block type with generic example content — browse what each one looks like, then clone it straight into a page
        to start from something rather than a blank section.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
        {grouped.map((g) => (
          <div key={g.category}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }}>
                {g.category}
              </span>
              <div style={{ flex: 1, height: 1, background: kitchen.border }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {g.items.map((item) => (
                <div
                  key={item.type}
                  style={{ border: `1px solid ${kitchen.borderSoft}`, borderRadius: 14, background: '#fff', overflow: 'hidden', boxShadow: '0 2px 10px rgba(58, 42, 102, 0.06)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderBottom: `1px solid ${kitchen.borderSoft}` }}>
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                      <span style={{ fontSize: 11, color: kitchen.textMuted }}>{item.description}</span>
                    </div>
                    <div style={{ flex: 1 }} />
                    <select
                      value={targetByType[item.type] ?? ''}
                      onChange={(e) => setTargetByType((prev) => ({ ...prev, [item.type]: e.target.value }))}
                      style={{
                        padding: '6px 8px',
                        border: `1px solid ${kitchen.borderInput}`,
                        borderRadius: 7,
                        background: '#fff',
                        font: 'inherit',
                        fontSize: 11.5,
                        color: kitchen.ink,
                      }}
                    >
                      <option value="">Choose a page…</option>
                      {pages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => cloneIntoPage(item.type)}
                      disabled={!targetByType[item.type] || cloning === item.type}
                      style={{
                        flex: '0 0 auto',
                        padding: '6px 12px',
                        border: `1px solid ${kitchen.accent}`,
                        borderRadius: 7,
                        background: kitchen.accent,
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: 11.5,
                        cursor: targetByType[item.type] ? 'pointer' : 'default',
                        opacity: targetByType[item.type] ? 1 : 0.5,
                      }}
                    >
                      {cloning === item.type ? 'Cloning…' : 'Clone into page'}
                    </button>
                  </div>
                  <div style={{ padding: '14px', background: kitchen.surface, pointerEvents: 'none', userSelect: 'none' }}>
                    <KitchenErrorBoundary label="Preview">
                      <LivePreview block={item.block} isFirst={false} />
                    </KitchenErrorBoundary>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
