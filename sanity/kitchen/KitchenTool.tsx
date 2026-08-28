import { useEffect, useState } from 'react'

import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { PageBuilderView } from './PageBuilderView'
import { CollectionListView } from './CollectionListView'
import { NewsCollectionView } from './NewsCollectionView'
import { CollectionDocEditor } from './CollectionDocEditor'
import { MediaLibraryView } from './MediaLibraryView'
import { ThemeSettings } from './settings/Theme'
import { GeneralSettings } from './settings/General'
import { NavigationSettings } from './settings/Navigation'
import { AnalyticsSettings } from './settings/Analytics'
import { SeoDefaultsSettings } from './settings/SeoDefaults'
import { DemoModalSettings } from './settings/DemoModal'
import { PAIRING_FONTS, googleFontsHref, kitchen } from './theme'
import { useLiveQuery } from './useLiveQuery'
import { useIsMobile } from './useIsMobile'

export type SettingsSection = 'theme' | 'general' | 'navigation' | 'analytics' | 'seo' | 'demoModal'

export type KitchenView =
  | { kind: 'page'; id: string }
  | { kind: 'settings'; section: SettingsSection }
  | { kind: 'collection'; type: 'newsArticle' | 'lead' }
  | { kind: 'doc'; type: 'newsArticle'; id: string }
  | { kind: 'media' }
  | null

const DEFAULT_PAGE_QUERY = `*[_type == "page" && !(_id in path("drafts.**"))] | order(menuOrder asc, title asc){_id, "slug": slug.current}`

export function KitchenTool() {
  const [view, setViewRaw] = useState<KitchenView>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useIsMobile()
  const { data: pages } = useLiveQuery<{ _id: string; slug?: string }[]>(DEFAULT_PAGE_QUERY)
  const { data: chrome } = useLiveQuery<{ theme?: { pairing?: string; chromeFont?: boolean } }>(
    `*[_id == "siteSettings"][0]{theme{pairing, chromeFont}}`,
  )
  const chromeFontBody = chrome?.theme?.chromeFont
    ? (PAIRING_FONTS[chrome.theme.pairing ?? 'Bricolage / Space Grotesk'] ?? PAIRING_FONTS['Bricolage / Space Grotesk']).body
    : undefined

  // On mobile the sidebar is an off-canvas panel — close it the moment something is picked,
  // same as any mobile nav drawer. On desktop it's always visible, so this is a no-op there.
  function setView(next: KitchenView) {
    setViewRaw(next)
    if (isMobile) setSidebarOpen(false)
  }

  useEffect(() => {
    if (document.querySelector('link[data-kitchen-fonts]')) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = googleFontsHref
    link.setAttribute('data-kitchen-fonts', '')
    document.head.appendChild(link)
  }, [])

  // Land on the Home page by default instead of a blank "select something" screen —
  // only on first load, and only if the user hasn't already navigated elsewhere.
  useEffect(() => {
    if (view !== null || !pages || pages.length === 0) return
    const home = pages.find((p) => p.slug === 'home') ?? pages[0]
    setView({ kind: 'page', id: home._id })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages])

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        background: kitchen.surface,
        fontSize: 13,
        fontFamily: kitchen.fontBody,
        color: kitchen.ink,
        ...(chromeFontBody ? { ['--kitchen-font-body' as string]: chromeFontBody } : {}),
      }}
    >
      <Sidebar view={view} onSelect={setView} isMobile={isMobile} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar view={view} isMobile={isMobile} onOpenSidebar={() => setSidebarOpen(true)} />

        <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
          {view === null && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: kitchen.textMuted,
              }}
            >
              Select a page, setting, or collection from the sidebar.
            </div>
          )}
          {view?.kind === 'page' && (
            <PageBuilderView
              pageId={view.id}
              onOpenDemoModalSettings={() => setView({ kind: 'settings', section: 'demoModal' })}
              onOpenThemeSettings={() => setView({ kind: 'settings', section: 'theme' })}
            />
          )}
          {view?.kind === 'settings' && view.section === 'theme' && <ThemeSettings />}
          {view?.kind === 'settings' && view.section === 'general' && <GeneralSettings />}
          {view?.kind === 'settings' && view.section === 'navigation' && <NavigationSettings />}
          {view?.kind === 'settings' && view.section === 'analytics' && <AnalyticsSettings />}
          {view?.kind === 'settings' && view.section === 'seo' && <SeoDefaultsSettings />}
          {view?.kind === 'settings' && view.section === 'demoModal' && <DemoModalSettings />}
          {view?.kind === 'collection' && view.type === 'newsArticle' && (
            <NewsCollectionView onEdit={(id) => setView({ kind: 'doc', type: 'newsArticle', id })} />
          )}
          {view?.kind === 'collection' && view.type === 'lead' && <CollectionListView type="lead" />}
          {view?.kind === 'doc' && <CollectionDocEditor id={view.id} onBack={() => setView({ kind: 'collection', type: 'newsArticle' })} />}
          {view?.kind === 'media' && <MediaLibraryView />}
        </div>
      </main>
    </div>
  )
}
