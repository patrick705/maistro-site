import { kitchen } from '../theme'
import { useKitchenPatch } from '../useKitchenPatch'

interface SiteAnalytics {
  gtmId?: string
  gtmOn?: boolean
  ga4Id?: string
  ga4On?: boolean
  metaPixelId?: string
  metaOn?: boolean
  googleAdsId?: string
  adsOn?: boolean
}

interface SiteSettingsDoc {
  _id: string
  analytics?: SiteAnalytics
}

const inputStyle: React.CSSProperties = {
  padding: '8px 10px',
  border: `1px solid ${kitchen.borderInput}`,
  borderRadius: 7,
  background: '#fff',
  font: 'inherit',
  fontFamily: kitchen.fontMono,
  fontSize: 12,
  color: kitchen.ink,
  width: '100%',
}

const PROVIDERS: {
  idKey: keyof SiteAnalytics
  onKey: keyof SiteAnalytics
  label: string
  placeholder: string
}[] = [
  { idKey: 'gtmId', onKey: 'gtmOn', label: 'Google Tag Manager', placeholder: 'GTM-XXXXXXX' },
  { idKey: 'ga4Id', onKey: 'ga4On', label: 'Google Analytics (GA4)', placeholder: 'G-XXXXXXXXXX' },
  { idKey: 'metaPixelId', onKey: 'metaOn', label: 'Meta Pixel', placeholder: '15–16 digit pixel ID' },
  { idKey: 'googleAdsId', onKey: 'adsOn', label: 'Google Ads conversion tracking', placeholder: 'AW-XXXXXXXXX' },
]

export function AnalyticsSettings() {
  const { doc, patch } = useKitchenPatch('siteSettings', 'siteSettings')
  const settings = doc as SiteSettingsDoc | null
  if (!settings) return <div style={{ padding: 24, color: kitchen.textFaint }}>Loading…</div>

  const analytics = settings.analytics ?? {}

  function set(fields: Partial<SiteAnalytics>) {
    patch({ analytics: { ...analytics, ...fields } })
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '26px 24px 72px' }}>
      <h1 style={{ margin: '0 0 5px', fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700 }}>Analytics &amp; Tracking</h1>
      <div style={{ fontSize: 11, color: kitchen.textMuted, fontFamily: kitchen.fontMono, marginBottom: 22 }}>siteSettings.analytics</div>

      <p style={{ margin: '0 0 18px', paddingLeft: 11, borderLeft: `2px solid ${kitchen.borderSoft}`, fontSize: 11.5, lineHeight: 1.55, color: kitchen.textMuted }}>
        Scripts fire on every page unless a page&rsquo;s SEO &amp; metadata panel turns on &ldquo;Override site-wide analytics for
        this page.&rdquo;
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {PROVIDERS.map((p) => {
          const on = Boolean(analytics[p.onKey])
          const value = (analytics[p.idKey] as string | undefined) ?? ''
          return (
            <div
              key={p.idKey}
              style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14, border: `1px solid ${kitchen.borderSoft}`, borderRadius: 10, background: '#fff' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.35 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>{p.label}</span>
                  <span style={{ fontSize: 11, color: kitchen.textMuted }}>
                    {on ? 'Injected in <head> on every page' : 'Off — no script injected'}
                  </span>
                </div>
                <div
                  onClick={() => set({ [p.onKey]: !on } as Partial<SiteAnalytics>)}
                  style={{
                    flex: '0 0 auto',
                    width: 34,
                    height: 19,
                    borderRadius: 20,
                    background: on ? kitchen.accent : kitchen.borderInput,
                    padding: 2,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: on ? 'flex-end' : 'flex-start',
                    transition: 'background 140ms ease',
                  }}
                >
                  <div style={{ width: 15, height: 15, borderRadius: '50%', background: '#fff' }} />
                </div>
              </div>
              <input
                value={value}
                onChange={(e) => set({ [p.idKey]: e.target.value } as Partial<SiteAnalytics>)}
                placeholder={p.placeholder}
                style={inputStyle}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
