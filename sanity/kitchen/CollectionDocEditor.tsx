import { useState } from 'react'

import { ImageUploadField, type SanityImageValue } from './ImageUploadField'
import { kitchen } from './theme'
import { useKitchenPatch } from './useKitchenPatch'

const CATEGORIES = ['Product', 'Customer', 'Guide', 'Company', 'Playbook']
const VARIANTS: { value: string; label: string }[] = [
  { value: 'brand', label: 'Brand' },
  { value: 'warm', label: 'Warm' },
  { value: 'pos', label: 'Positive' },
  { value: 'accent', label: 'Accent' },
]

function randomKey() {
  return Math.random().toString(36).slice(2, 10)
}

const inputStyle: React.CSSProperties = {
  padding: '9px 11px',
  border: `1px solid ${kitchen.borderInput}`,
  borderRadius: 9,
  background: '#fff',
  font: 'inherit',
  fontSize: 13,
  color: kitchen.ink,
  width: '100%',
}

interface NewsArticleSeo {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImageValue
  noIndex?: boolean
}

interface NewsArticleDoc {
  _id: string
  title?: string
  excerpt?: string
  category?: string
  icon?: string
  variant?: string
  coverImage?: SanityImageValue
  heroImage?: SanityImageValue
  author?: string
  publishedAt?: string
  body?: Record<string, any>[]
  seo?: NewsArticleSeo
}

type BodyItem =
  | { _key: string; kind: 'text'; text: string }
  | { _key: string; kind: 'image'; image?: SanityImageValue }

function toBodyItems(blocks: Record<string, any>[]): BodyItem[] {
  return blocks.map((b) => {
    if (b._type === 'image') {
      return { _key: b._key, kind: 'image', image: { _type: 'image', asset: b.asset, alt: b.alt } }
    }
    return { _key: b._key, kind: 'text', text: ((b.children ?? []) as { text?: string }[]).map((c) => c.text ?? '').join('') }
  })
}

function fromBodyItems(items: BodyItem[]): Record<string, any>[] {
  return items.map((it) =>
    it.kind === 'image'
      ? { _type: 'image', _key: it._key, asset: it.image?.asset, alt: it.image?.alt }
      : { _type: 'block', _key: it._key, style: 'normal', children: [{ _type: 'span', _key: randomKey(), text: it.text }] },
  )
}

export function CollectionDocEditor({ id, onBack }: { id: string; onBack: () => void }) {
  const { doc, patch } = useKitchenPatch(id, 'newsArticle')
  const article = doc as NewsArticleDoc | null
  const [bodyOverride, setBodyOverride] = useState<BodyItem[] | null>(null)

  if (!article) return <div style={{ padding: 24, color: kitchen.textFaint }}>Loading…</div>

  const body = bodyOverride ?? toBodyItems(article.body ?? [])
  const seo = article.seo ?? {}

  function saveBody(next: BodyItem[]) {
    setBodyOverride(next)
    patch({ body: fromBodyItems(next) })
  }

  function patchSeo(fields: Partial<NewsArticleSeo>) {
    patch({ seo: { ...seo, ...fields } })
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '22px 24px 72px' }}>
      <button
        type="button"
        onClick={onBack}
        style={{ marginBottom: 18, padding: '4px 10px', border: `1px solid ${kitchen.borderInput}`, borderRadius: 7, background: '#fff', cursor: 'pointer', fontSize: 11.5, color: kitchen.textBody }}
      >
        ← News Articles
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span style={labelStyle()}>Title</span>
          <input
            style={{ ...inputStyle, fontFamily: kitchen.fontDisplay, fontSize: 21, fontWeight: 700 }}
            value={article.title ?? ''}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span style={labelStyle()}>Excerpt · shown on the News grid</span>
          <textarea
            style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
            value={article.excerpt ?? ''}
            onChange={(e) => patch({ excerpt: e.target.value })}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span style={labelStyle()}>Cover image · shown on the News grid tile (falls back to the icon below if left empty)</span>
          <ImageUploadField value={article.coverImage} onChange={(v) => patch({ coverImage: v })} width={140} height={90} />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span style={labelStyle()}>Hero image · shown at the top when the article is opened</span>
          <ImageUploadField value={article.heroImage} onChange={(v) => patch({ heroImage: v })} width={140} height={90} />
        </label>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={labelStyle()}>Author</span>
            <input style={{ ...inputStyle, width: 180 }} value={article.author ?? ''} onChange={(e) => patch({ author: e.target.value })} />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={labelStyle()}>Category</span>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {CATEGORIES.map((c) => (
                <button key={c} type="button" onClick={() => patch({ category: c })} style={chipStyle(article.category === c)}>
                  {c}
                </button>
              ))}
            </div>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={labelStyle()}>Colour</span>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {VARIANTS.map((v) => (
                <button key={v.value} type="button" onClick={() => patch({ variant: v.value })} style={chipStyle(article.variant === v.value)}>
                  {v.label}
                </button>
              ))}
            </div>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={labelStyle()}>Icon (emoji)</span>
            <input style={{ ...inputStyle, width: 70 }} value={article.icon ?? ''} onChange={(e) => patch({ icon: e.target.value })} />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={labelStyle()}>Published at</span>
            <input
              type="date"
              style={{ ...inputStyle, width: 150 }}
              value={(article.publishedAt ?? '').slice(0, 10)}
              onChange={(e) => patch({ publishedAt: new Date(e.target.value).toISOString() })}
            />
          </label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={labelStyle()}>Article body</span>
            <div style={{ flex: 1, height: 1, background: kitchen.border }} />
          </div>
          {body.map((item, i) => (
            <div key={item._key} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 11px', border: `1px solid ${kitchen.borderSoft}`, borderRadius: 9, background: '#fff' }}>
              <span style={{ color: kitchen.borderDashed, fontSize: 13, letterSpacing: '-2px', paddingTop: 4 }}>⠿</span>
              {item.kind === 'text' ? (
                <textarea
                  style={{ flex: 1, border: 'none', outline: 'none', resize: 'vertical', font: 'inherit', fontSize: 13, lineHeight: 1.6, background: 'transparent' }}
                  rows={3}
                  value={item.text}
                  onChange={(e) => {
                    const next = body.map((b, j) => (j === i ? { ...b, text: e.target.value } : b))
                    saveBody(next)
                  }}
                />
              ) : (
                <div style={{ flex: 1 }}>
                  <ImageUploadField
                    value={item.image}
                    onChange={(v) => {
                      const next = body.map((b, j) => (j === i ? { ...b, image: v } : b))
                      saveBody(next)
                    }}
                    width={140}
                    height={90}
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => saveBody(body.filter((_, j) => j !== i))}
                title="Delete block"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: kitchen.textFaint, fontSize: 13 }}
              >
                ✕
              </button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => saveBody([...body, { _key: randomKey(), kind: 'text', text: '' }])}
              style={{ alignSelf: 'flex-start', padding: '6px 11px', border: `1px dashed ${kitchen.borderDashed}`, borderRadius: 7, background: '#fff', cursor: 'pointer', fontSize: 11.5, fontWeight: 600, color: kitchen.textSubtle }}
            >
              + Paragraph
            </button>
            <button
              type="button"
              onClick={() => saveBody([...body, { _key: randomKey(), kind: 'image' }])}
              style={{ alignSelf: 'flex-start', padding: '6px 11px', border: `1px dashed ${kitchen.borderDashed}`, borderRadius: 7, background: '#fff', cursor: 'pointer', fontSize: 11.5, fontWeight: 600, color: kitchen.textSubtle }}
            >
              + Image
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: `1px solid ${kitchen.border}`, paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={labelStyle()}>SEO &amp; metadata</span>
            <div style={{ flex: 1, height: 1, background: kitchen.border }} />
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={labelStyle()}>Meta title</span>
            <input style={inputStyle} value={seo.metaTitle ?? ''} onChange={(e) => patchSeo({ metaTitle: e.target.value })} />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={labelStyle()}>Meta description</span>
            <textarea
              style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
              value={seo.metaDescription ?? ''}
              onChange={(e) => patchSeo({ metaDescription: e.target.value })}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={labelStyle()}>Social share image</span>
            <ImageUploadField value={seo.ogImage} onChange={(v) => patchSeo({ ogImage: v })} />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: kitchen.textBody }}>
            <input type="checkbox" checked={seo.noIndex ?? false} onChange={(e) => patchSeo({ noIndex: e.target.checked })} />
            Hide from search engines
          </label>
        </div>
      </div>
    </div>
  )
}

function labelStyle(): React.CSSProperties {
  return { fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    padding: '4px 10px',
    border: `1px solid ${active ? kitchen.accent : kitchen.borderInput}`,
    borderRadius: 999,
    background: active ? kitchen.accent : '#fff',
    color: active ? '#fff' : kitchen.textBody,
    fontSize: 11.5,
    cursor: 'pointer',
  }
}
