import type { KitchenView } from './KitchenTool'
import { kitchen } from './theme'
import { useLiveQuery } from './useLiveQuery'

interface HtmlBlockRow {
  _key: string
  label?: string
}

interface PageRow {
  _id: string
  title: string
  slug?: string
  htmlBlocks: HtmlBlockRow[]
}

const QUERY = `*[_type == "page" && !(_id in path("drafts.**")) && count(blocks[_type == "customHtmlBlock"]) > 0]
  | order(title asc){
    _id, title, "slug": slug.current,
    "htmlBlocks": blocks[_type == "customHtmlBlock"]{_key, label}
  }`

/**
 * A flat, page-scoped index of every Custom HTML block across the site, by
 * name — added after multiple differently-named embeds piling up across
 * Home, Home 3, Product, Product 2 and Hello made it easy to lose track of
 * which widget lived where. Block Showcase answers "what can I add"; this
 * answers "what's already out there and on which page."
 */
export function CustomHtmlIndexView({ onSelect }: { onSelect: (v: KitchenView) => void }) {
  const { data: pages, loading } = useLiveQuery<PageRow[]>(QUERY)
  const total = (pages ?? []).reduce((sum, p) => sum + p.htmlBlocks.length, 0)

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '26px 24px 72px' }}>
      <h1 style={{ margin: '0 0 5px', fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700 }}>Custom HTML</h1>
      <div style={{ fontSize: 11, color: kitchen.textMuted, fontFamily: kitchen.fontMono, marginBottom: 22 }}>
        {loading ? 'Loading…' : `${total} block${total === 1 ? '' : 's'} across ${pages?.length ?? 0} page${pages?.length === 1 ? '' : 's'}`}
      </div>

      {!loading && total === 0 && (
        <div style={{ color: kitchen.textFaint, fontSize: 13, padding: '8px 2px' }}>
          No Custom HTML blocks on any page yet — add one from a page&rsquo;s &ldquo;+ Add block&rdquo; menu, or clone an
          example from Block Showcase.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(pages ?? []).map((page) =>
          page.htmlBlocks.map((block) => (
            <button
              key={block._key}
              type="button"
              onClick={() => onSelect({ kind: 'page', id: page._id })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                border: `1px solid ${kitchen.borderSoft}`,
                borderRadius: 10,
                background: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                font: 'inherit',
              }}
            >
              <span
                style={{
                  flex: '0 0 auto',
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: 'grid',
                  placeItems: 'center',
                  background: kitchen.surface,
                  fontSize: 13,
                  fontFamily: kitchen.fontMono,
                }}
              >
                {'</>'}
              </span>
              <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: kitchen.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {block.label || 'Untitled embed'}
                </div>
                <div style={{ fontSize: 11.5, color: kitchen.textMuted, fontFamily: kitchen.fontMono }}>
                  {page.title}
                  {page.slug ? ` · /${page.slug}` : ' · no slug yet'}
                </div>
              </div>
              <span style={{ flex: '0 0 auto', fontSize: 11, color: kitchen.textFaint }}>Open →</span>
            </button>
          )),
        )}
      </div>
    </div>
  )
}
