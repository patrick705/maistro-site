import { useEffect, useState } from 'react'

import { ImageUploadField, type SanityImageValue } from './ImageUploadField'
import { kitchen } from './theme'

interface AnalyticsOverride {
  gtmId?: string
  ga4Id?: string
  metaPixelId?: string
  googleAdsId?: string
}

interface PageSeo {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImageValue
  noIndex?: boolean
  analyticsOverride?: boolean
  analytics?: AnalyticsOverride
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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }}>
        {label}
      </span>
      {children}
      {hint && <span style={{ fontSize: 11, color: kitchen.textMuted }}>{hint}</span>}
    </label>
  )
}

/** Per-page SEO & metadata — falls back to Site Settings → SEO defaults on the live site when any of these are left empty. */
export function PageSeoDrawer({
  seo,
  onPatchSeo,
  onClose,
  pageTitle,
  isHome,
  hasParent,
  onAddSubpage,
  onDeletePermanently,
  navLabel,
  onPatchNavLabel,
}: {
  seo: PageSeo | undefined
  onPatchSeo: (fields: Record<string, unknown>) => void
  onClose: () => void
  pageTitle: string
  isHome: boolean
  hasParent: boolean
  onAddSubpage: () => Promise<void>
  onDeletePermanently: () => Promise<void>
  navLabel?: string
  onPatchNavLabel: (value: string) => void
}) {
  const s = seo ?? {}
  const [addingSubpage, setAddingSubpage] = useState(false)
  const [deleteArmed, setDeleteArmed] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // A stray second click much later shouldn't confirm a delete armed from an
  // earlier, forgotten click.
  useEffect(() => {
    if (!deleteArmed) return
    const t = setTimeout(() => setDeleteArmed(false), 4000)
    return () => clearTimeout(t)
  }, [deleteArmed])

  function patch(fields: Partial<PageSeo>) {
    onPatchSeo({ seo: { ...s, ...fields } })
  }

  async function handleAddSubpage() {
    setAddingSubpage(true)
    try {
      await onAddSubpage()
      onClose()
    } finally {
      setAddingSubpage(false)
    }
  }

  function handleDeleteClick() {
    if (!deleteArmed) {
      setDeleteArmed(true)
      return
    }
    setDeleting(true)
    onDeletePermanently().catch(() => {
      setDeleting(false)
      setDeleteArmed(false)
    })
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 47,
        right: 0,
        bottom: 0,
        width: 440,
        maxWidth: '100%',
        background: '#fff',
        borderLeft: `1px solid ${kitchen.borderSoft}`,
        boxShadow: '-8px 0 24px rgba(58,42,102,0.12)',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: `1px solid ${kitchen.border}` }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }}>
          SEO &amp; metadata
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 15, color: kitchen.textFaint, lineHeight: 1 }}
        >
          ✕
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontSize: 11, color: kitchen.textMuted }}>
          Leave any of these empty to fall back to the sitewide SEO defaults.
        </div>

        <Field label="Meta title">
          <input style={inputStyle} value={s.metaTitle ?? ''} onChange={(e) => patch({ metaTitle: e.target.value })} />
        </Field>

        <Field label="Meta description">
          <textarea
            style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
            value={s.metaDescription ?? ''}
            onChange={(e) => patch({ metaDescription: e.target.value })}
          />
        </Field>

        <Field label="Social share image">
          <ImageUploadField value={s.ogImage} onChange={(v) => patch({ ogImage: v })} />
        </Field>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: kitchen.textBody }}>
          <input type="checkbox" checked={s.noIndex ?? false} onChange={(e) => patch({ noIndex: e.target.checked })} />
          Hide from search engines
        </label>

        <Field label="Top-menu label" hint="Falls back to the page title if left empty.">
          <input style={inputStyle} value={navLabel ?? ''} onChange={(e) => onPatchNavLabel(e.target.value)} />
        </Field>

        <div style={{ borderTop: `1px solid ${kitchen.border}`, paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: kitchen.textBody }}>
            <input
              type="checkbox"
              checked={s.analyticsOverride ?? false}
              onChange={(e) => patch({ analyticsOverride: e.target.checked })}
              style={{ marginTop: 2 }}
            />
            <span>
              Override site-wide analytics for this page
              <div style={{ fontSize: 11, color: kitchen.textMuted, fontWeight: 400 }}>
                Off inherits GTM / GA4 / Meta Pixel / Google Ads from Site settings → Analytics & Tracking.
              </div>
            </span>
          </label>

          {s.analyticsOverride && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Field label="GTM container (override)">
                <input
                  style={inputStyle}
                  placeholder="GTM-XXXXXXX"
                  value={s.analytics?.gtmId ?? ''}
                  onChange={(e) => patch({ analytics: { ...s.analytics, gtmId: e.target.value } })}
                />
              </Field>
              <Field label="GA4 measurement ID (override)">
                <input
                  style={inputStyle}
                  placeholder="G-XXXXXXXXXX"
                  value={s.analytics?.ga4Id ?? ''}
                  onChange={(e) => patch({ analytics: { ...s.analytics, ga4Id: e.target.value } })}
                />
              </Field>
              <Field label="Meta Pixel ID (override)">
                <input
                  style={inputStyle}
                  placeholder="15–16 digit pixel ID"
                  value={s.analytics?.metaPixelId ?? ''}
                  onChange={(e) => patch({ analytics: { ...s.analytics, metaPixelId: e.target.value } })}
                />
              </Field>
              <Field label="Google Ads conversion ID (override)">
                <input
                  style={inputStyle}
                  placeholder="AW-XXXXXXXXX"
                  value={s.analytics?.googleAdsId ?? ''}
                  onChange={(e) => patch({ analytics: { ...s.analytics, googleAdsId: e.target.value } })}
                />
              </Field>
            </div>
          )}
        </div>

        {!hasParent && (
          <div style={{ borderTop: `1px solid ${kitchen.border}`, paddingTop: 18 }}>
            <button
              type="button"
              onClick={handleAddSubpage}
              disabled={addingSubpage}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px dashed ${kitchen.borderDashed}`,
                borderRadius: 9,
                background: 'transparent',
                color: kitchen.textSubtle,
                fontWeight: 600,
                fontSize: 12.5,
                cursor: addingSubpage ? 'default' : 'pointer',
                opacity: addingSubpage ? 0.6 : 1,
              }}
            >
              {addingSubpage ? 'Creating…' : `+ Add subpage under ${pageTitle}`}
            </button>
          </div>
        )}

        <div style={{ borderTop: `1px solid ${kitchen.border}`, paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textFaint }}>
            Danger zone
          </span>
          {isHome ? (
            <span style={{ fontSize: 11.5, color: kitchen.textMuted }}>Home is protected and can&rsquo;t be deleted.</span>
          ) : (
            <>
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={deleting}
                style={{
                  padding: '9px 14px',
                  border: `1px solid ${kitchen.danger}`,
                  borderRadius: 8,
                  background: deleteArmed ? kitchen.danger : '#fff',
                  color: deleteArmed ? '#fff' : kitchen.danger,
                  fontWeight: 600,
                  fontSize: 12.5,
                  cursor: deleting ? 'default' : 'pointer',
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? 'Deleting…' : deleteArmed ? "Click again to confirm — can't be undone" : 'Delete page permanently'}
              </button>
              <span style={{ fontSize: 11, color: kitchen.textMuted }}>Also deletes any of its subpages.</span>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 16px', borderTop: `1px solid ${kitchen.border}` }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '7px 16px',
            border: `1px solid ${kitchen.accent}`,
            borderRadius: 8,
            background: kitchen.accent,
            color: '#fff',
            fontWeight: 600,
            fontSize: 12.5,
            cursor: 'pointer',
          }}
        >
          Done
        </button>
      </div>
    </div>
  )
}
