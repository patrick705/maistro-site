import { useDocumentOperation, useEditState } from 'sanity'

import type { KitchenView } from './KitchenTool'
import { kitchen } from './theme'
import { useKitchenPatch } from './useKitchenPatch'

const BREADCRUMB_LABEL: Record<string, string> = {
  page: 'Pages',
  collection: 'Collections',
  doc: 'Collections',
  media: 'Media',
}

const SETTINGS_SECTION_LABEL: Record<string, string> = {
  theme: 'Theme',
  general: 'General',
  navigation: 'Navigation',
  seo: 'SEO defaults',
  demoModal: 'Demo modal',
}

interface PageLikeDoc {
  slug?: { current?: string }
  archived?: boolean
}

function ghostButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '5px 11px',
    border: `1px solid ${kitchen.borderInput}`,
    borderRadius: 7,
    background: '#fff',
    cursor: disabled ? 'not-allowed' : 'pointer',
    font: 'inherit',
    fontSize: 12,
    color: kitchen.textBody,
    opacity: disabled ? 0.5 : 1,
  }
}

function DocPublishControls({ id, type }: { id: string; type: string }) {
  const ops = useDocumentOperation(id, type)
  const editState = useEditState(id, type)
  const { patch } = useKitchenPatch(id, type)

  const hasDraft = Boolean(editState.draft)
  const status = hasDraft ? 'Unpublished changes' : editState.published ? 'Published' : 'Draft'

  const doc = (editState.draft ?? editState.published) as PageLikeDoc | null
  const isPage = type === 'page'
  // The Home page owns the site's root URL and siteSettings is the one
  // singleton every page depends on — unpublishing either would take the
  // whole site (or its theme/nav) down, so both are excluded here.
  const isHomePage = isPage && doc?.slug?.current === 'home'
  const isArchived = isPage && Boolean(doc?.archived)
  const canUnpublish = type !== 'siteSettings' && !isHomePage && ops.unpublish.disabled === false

  function toggleArchive() {
    if (isHomePage) return
    const next = !isArchived
    if (next && !confirm('Archive this page? Its URL will 404 and it drops out of the top menu until restored.')) return
    patch(next ? { archived: true, showInMenu: false } : { archived: false })
  }

  function unpublish() {
    if (!confirm('Take this page offline? Its live URL will 404 until you publish it again.')) return
    ops.unpublish.execute()
  }

  return (
    <>
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 999,
          background: hasDraft ? '#FCEFD8' : '#DFF0E8',
          color: hasDraft ? '#9c6a1c' : '#2f6b52',
        }}
      >
        {status}
      </span>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          type="button"
          disabled={ops.discardChanges.disabled !== false}
          onClick={() => ops.discardChanges.execute()}
          style={ghostButtonStyle(ops.discardChanges.disabled !== false)}
        >
          Discard changes
        </button>
        {canUnpublish && (
          <button type="button" onClick={unpublish} style={ghostButtonStyle(false)}>
            Unpublish
          </button>
        )}
        {isPage && (
          <button
            type="button"
            onClick={toggleArchive}
            disabled={isHomePage}
            title={isHomePage ? 'The Home page can’t be archived — that would take your whole site offline.' : undefined}
            style={{
              ...ghostButtonStyle(isHomePage),
              ...(isArchived ? { borderColor: kitchen.accent, color: kitchen.accent } : {}),
            }}
          >
            {isArchived ? 'Restore' : 'Archive'}
          </button>
        )}
        <button
          type="button"
          disabled={ops.publish.disabled !== false}
          onClick={() => ops.publish.execute()}
          style={{
            padding: '5px 14px',
            border: `1px solid ${kitchen.accent}`,
            borderRadius: 7,
            background: kitchen.accent,
            color: '#fff',
            cursor: ops.publish.disabled ? 'not-allowed' : 'pointer',
            font: 'inherit',
            fontSize: 12,
            fontWeight: 600,
            opacity: ops.publish.disabled ? 0.6 : 1,
          }}
        >
          Publish
        </button>
      </div>
    </>
  )
}

export function TopBar({
  view,
  isMobile,
  onOpenSidebar,
}: {
  view: KitchenView
  isMobile: boolean
  onOpenSidebar: () => void
}) {
  const crumb = view
    ? view.kind === 'settings'
      ? `Site Settings / ${SETTINGS_SECTION_LABEL[view.section]}`
      : BREADCRUMB_LABEL[view.kind]
    : 'Kitchen CMS'
  // Site Settings is a singleton document ('siteSettings') — every section (Theme, General,
  // Navigation, SEO defaults, Demo modal) edits the SAME document, just different fields on it.
  // This was missing entirely, so every settings edit patched a draft with no way to publish it
  // from Kitchen — changes looked like they "did nothing" because the live site only ever reads
  // the published document.
  const docRef =
    view?.kind === 'page'
      ? { id: view.id, type: 'page' }
      : view?.kind === 'doc'
        ? { id: view.id, type: view.type }
        : view?.kind === 'settings'
          ? { id: 'siteSettings', type: 'siteSettings' }
          : null

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 16px',
        height: 47,
        flex: '0 0 47px',
        borderBottom: `1px solid ${kitchen.border}`,
        background: '#fff',
      }}
    >
      {isMobile && (
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open menu"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: kitchen.textBody, padding: 0, lineHeight: 1 }}
        >
          ☰
        </button>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: kitchen.textMuted, fontFamily: kitchen.fontMono, minWidth: 0, overflow: 'hidden' }}>
        {!isMobile && (
          <>
            <span>Kitchen CMS</span>
            <span style={{ color: kitchen.borderDashed }}>/</span>
          </>
        )}
        <span style={{ color: kitchen.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{crumb}</span>
      </div>

      {docRef && <DocPublishControls id={docRef.id} type={docRef.type} />}
    </header>
  )
}
