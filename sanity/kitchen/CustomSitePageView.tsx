import { useState } from 'react'
import { useClient } from 'sanity'

import { ArrayEditor } from './ArrayEditor'
import { HtmlFileUploadField, type SanityFileValue } from './HtmlFileUploadField'
import { PageSeoDrawer } from './PageSeoDrawer'
import { KitchenErrorBoundary } from './KitchenErrorBoundary'
import { LivePreview } from './livePreview/LivePreview'
import { randomKey } from './blockTypes'
import { kitchen } from './theme'
import { useKitchenPatch } from './useKitchenPatch'
import { randomPageId } from './pageRows'
import { RESERVED_SLUGS } from '../schemaTypes/page'

const API_VERSION = '2024-01-01'
const FIXED_BLOCK_KEY = 'site-embed'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface TextEditItem {
  _key: string
  selector?: string
  text?: string
}

interface SiteBlock {
  _key: string
  _type: 'customHtmlBlock'
  label?: string
  file?: SanityFileValue
  code?: string
  sandboxed?: boolean
  fullWidth?: boolean
  textEdits?: TextEditItem[]
}

interface PageDoc {
  _id: string
  title?: string
  slug?: { current?: string }
  showInMenu?: boolean
  menuOrder?: number
  navLabel?: string
  navStyle?: string
  navTransparentColor?: string
  archived?: boolean
  parentId?: string
  seo?: Record<string, any>
  blocks?: SiteBlock[]
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

const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 140, fontFamily: kitchen.fontMono, fontSize: 11.5, resize: 'vertical' }

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }}>
        {label}
      </span>
      {children}
      {hint && <span style={{ fontSize: 11, color: kitchen.textMuted, fontWeight: 400 }}>{hint}</span>}
    </label>
  )
}

/**
 * A whole imported site (its own HTML/CSS/JS bundle, hosted as static files
 * and embedded via one fixed customHtmlBlock) gets this streamlined editor
 * instead of the general block-builder — there's exactly one block here,
 * always, so there's no "+ Add block" picker, no reordering, no block list.
 * Still a completely ordinary `page` document underneath (see the
 * pageKind marker on the schema), so subpages / nav visibility / archiving /
 * SEO all reuse the exact same machinery as any other page.
 */
export function CustomSitePageView({
  pageId,
  onNavigateToPage,
  onPageDeleted,
}: {
  pageId: string
  onNavigateToPage: (id: string) => void
  onPageDeleted: () => void
}) {
  const client = useClient({ apiVersion: API_VERSION })
  const { doc, patch, rawPatch, error } = useKitchenPatch(pageId, 'page')
  const [seoOpen, setSeoOpen] = useState(false)
  const page = doc as PageDoc | null

  // Mirrors PageBuilderView's addSubpage/deletePagePermanently — subpages of
  // a custom site page are also customSite pages, so they land in the same
  // Custom Sites section rather than the regular Pages tree.
  async function addSubpage() {
    const id = randomPageId()
    await client.create({
      _id: `drafts.${id}`,
      _type: 'page',
      title: 'Untitled custom site',
      parentId: pageId,
      showInMenu: false,
      blocks: [],
      pageKind: 'customSite',
    })
    onNavigateToPage(id)
  }

  async function deletePagePermanently() {
    const subpages = await client.fetch<{ _id: string }[]>(`*[_type == "page" && parentId == $id]{_id}`, { id: pageId })
    const baseIds = new Set<string>([pageId])
    for (const sp of subpages) {
      baseIds.add(sp._id.startsWith('drafts.') ? sp._id.slice('drafts.'.length) : sp._id)
    }
    const tx = client.transaction()
    for (const id of baseIds) tx.delete(id).delete(`drafts.${id}`)
    await tx.commit()
    onPageDeleted()
  }

  if (!page) return <div style={{ padding: 24, color: kitchen.textFaint }}>Loading…</div>

  const block: SiteBlock = page.blocks?.find((b) => b._key === FIXED_BLOCK_KEY) ?? {
    _key: FIXED_BLOCK_KEY,
    _type: 'customHtmlBlock',
    sandboxed: false,
    fullWidth: true,
  }
  const hasBlock = Boolean(page.blocks?.some((b) => b._key === FIXED_BLOCK_KEY))

  function ensureBlockThen(fields: Partial<SiteBlock>) {
    if (hasBlock) {
      rawPatch((p) => p.set({ [`blocks[_key=="${FIXED_BLOCK_KEY}"]`]: { ...block, ...fields } }))
    } else {
      rawPatch((p) => p.setIfMissing({ blocks: [] }).insert('after', 'blocks[-1]', [{ ...block, ...fields }]))
    }
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '26px 24px 72px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
        <input
          value={page.title ?? ''}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Untitled custom site"
          style={{
            flex: '1 1 auto',
            minWidth: 0,
            margin: 0,
            padding: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: kitchen.fontDisplay,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: kitchen.ink,
          }}
        />
        <button
          type="button"
          onClick={() => setSeoOpen(true)}
          style={{
            padding: '6px 12px',
            border: `1px solid ${kitchen.borderInput}`,
            borderRadius: 7,
            background: '#fff',
            color: kitchen.textBody,
            fontWeight: 600,
            fontSize: 11.5,
            cursor: 'pointer',
            flex: '0 0 auto',
          }}
        >
          SEO &amp; metadata
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: kitchen.textMuted, fontFamily: kitchen.fontMono, marginBottom: 4 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <span>/</span>
          <input
            value={page.slug?.current ?? ''}
            onChange={(e) => patch({ slug: { _type: 'slug', current: slugify(e.target.value) } })}
            placeholder="site-slug"
            style={{
              width: Math.max(70, ((page.slug?.current ?? 'site-slug').length + 1) * 6.5),
              border: 'none',
              outline: 'none',
              background: 'transparent',
              font: 'inherit',
              fontFamily: kitchen.fontMono,
              fontSize: 11,
              color: page.slug?.current ? kitchen.textMuted : kitchen.textFaint,
            }}
          />
          {!page.slug?.current && page.title && (
            <button
              type="button"
              onClick={() => patch({ slug: { _type: 'slug', current: slugify(page.title!) } })}
              style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: kitchen.accent, font: 'inherit', fontFamily: kitchen.fontMono, fontSize: 11, textDecoration: 'underline' }}
            >
              generate from title
            </button>
          )}
        </span>
        <button
          type="button"
          onClick={() => patch({ showInMenu: !page.showInMenu })}
          title="Click to toggle whether this page appears in the site's top navigation"
          style={{
            font: 'inherit',
            fontFamily: kitchen.fontMono,
            fontSize: 11,
            padding: 0,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: page.showInMenu ? '#2f6b52' : kitchen.textMuted,
            textDecoration: 'underline',
            textDecorationStyle: 'dotted',
            textUnderlineOffset: 2,
          }}
        >
          {page.showInMenu ? 'in top menu' : 'hidden from top menu'}
        </button>
        {page.archived && <span style={{ color: '#9c6a1c', fontWeight: 700 }}>archived</span>}
      </div>

      {page.slug?.current && RESERVED_SLUGS.includes(page.slug.current) && (
        <div style={{ fontSize: 11, color: kitchen.danger, marginBottom: 12 }}>
          “/{page.slug.current}” is reserved for an existing page — choose a different slug so this one doesn't collide with it.
        </div>
      )}

      {error && (
        <div style={{ marginBottom: 12, padding: '8px 11px', border: `1px solid ${kitchen.danger}`, borderRadius: 8, background: '#FDECEC', fontSize: 12, color: kitchen.danger }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <KitchenErrorBoundary label="Live preview">
          <div style={{ marginBottom: 18, border: `1px dashed ${kitchen.borderDashed}`, borderRadius: 10, overflow: 'hidden' }}>
            <LivePreview block={block} isFirst />
          </div>
        </KitchenErrorBoundary>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Internal label">
            <input
              style={inputStyle}
              value={block.label ?? ''}
              onChange={(e) => ensureBlockThen({ label: e.target.value })}
              placeholder="Shown in the builder only, not on the page"
            />
          </Field>

          <Field label="HTML file">
            <HtmlFileUploadField value={block.file} onChange={(v) => ensureBlockThen({ file: v })} />
          </Field>

          <Field label="Or paste HTML directly">
            <textarea
              style={textareaStyle}
              value={block.code ?? ''}
              onChange={(e) => ensureBlockThen({ code: e.target.value })}
              placeholder="<iframe src=&quot;/your-site-folder/index.html&quot; ...></iframe>"
            />
          </Field>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: kitchen.textBody }}>
            <input
              type="checkbox"
              checked={block.sandboxed ?? false}
              onChange={(e) => ensureBlockThen({ sandboxed: e.target.checked })}
              style={{ marginTop: 2 }}
            />
            <span>
              Render in a sandboxed iframe
              <div style={{ fontSize: 11, color: kitchen.textMuted, fontWeight: 400 }}>
                Off allows scripts to run directly in the page — only for trusted sources (our own hosted static site files).
              </div>
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: kitchen.textBody }}>
            <input type="checkbox" checked={block.fullWidth ?? true} onChange={(e) => ensureBlockThen({ fullWidth: e.target.checked })} />
            Full width (ignore page margins)
          </label>

          <Field
            label="Text edits"
            hint="Change copy inside the embed by CSS selector, without touching its code — e.g. selector #contactTitle, or .hero-title-meet."
          >
            <ArrayEditor
              items={block.textEdits ?? []}
              onChange={(next) => ensureBlockThen({ textEdits: next })}
              newItem={() => ({ _key: randomKey(), selector: '', text: '' })}
              addLabel="+ Add text edit"
              renderItem={(item, update) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input
                    style={{ ...inputStyle, fontFamily: kitchen.fontMono, fontSize: 11.5 }}
                    placeholder="CSS selector, e.g. #contactTitle"
                    value={item.selector ?? ''}
                    onChange={(e) => update({ selector: e.target.value })}
                  />
                  <textarea
                    style={{ ...inputStyle, minHeight: 50, resize: 'vertical' }}
                    placeholder="New text"
                    value={item.text ?? ''}
                    onChange={(e) => update({ text: e.target.value })}
                  />
                </div>
              )}
            />
          </Field>
        </div>
      </div>

      {seoOpen && (
        <PageSeoDrawer
          seo={page.seo}
          onPatchSeo={(fields) => patch(fields)}
          onClose={() => setSeoOpen(false)}
          pageTitle={page.title || 'Untitled custom site'}
          isHome={false}
          hasParent={Boolean(page.parentId)}
          onAddSubpage={addSubpage}
          onDeletePermanently={deletePagePermanently}
          navLabel={page.navLabel}
          onPatchNavLabel={(value) => patch({ navLabel: value })}
          navStyle={page.navStyle}
          onPatchNavStyle={(value) => patch({ navStyle: value })}
          navTransparentColor={page.navTransparentColor}
          onPatchNavTransparentColor={(value) => patch({ navTransparentColor: value })}
          title={page.title}
          onPatchTitle={(value) => patch({ title: value })}
        />
      )}
    </div>
  )
}
