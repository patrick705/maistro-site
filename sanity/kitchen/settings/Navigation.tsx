import { ArrayEditor } from '../ArrayEditor'
import { Toggle } from '../Toggle'
import { kitchen } from '../theme'
import { useKitchenPatch } from '../useKitchenPatch'

interface NavItem {
  _key: string
  label?: string
  href?: string
}

interface SiteSettingsDoc {
  _id: string
  navItems?: NavItem[]
  stickyNav?: boolean
  primaryCta?: { label?: string; href?: string }
}

const inputStyle: React.CSSProperties = {
  padding: '7px 9px',
  border: `1px solid ${kitchen.borderInput}`,
  borderRadius: 7,
  background: '#fff',
  font: 'inherit',
  fontSize: 12.5,
  color: kitchen.ink,
  width: '100%',
}

function randomKey() {
  return Math.random().toString(36).slice(2, 10)
}

function sectionLabel(): React.CSSProperties {
  return { fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted, marginBottom: 9, display: 'block' }
}

export function NavigationSettings() {
  const { doc, patch } = useKitchenPatch('siteSettings', 'siteSettings')
  const settings = doc as SiteSettingsDoc | null
  if (!settings) return <div style={{ padding: 24, color: kitchen.textFaint }}>Loading…</div>

  const navItems = settings.navItems ?? []
  const cta = settings.primaryCta ?? {}

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '26px 24px 72px' }}>
      <h1 style={{ margin: '0 0 5px', fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700 }}>Navigation</h1>
      <div style={{ fontSize: 11, color: kitchen.textMuted, fontFamily: kitchen.fontMono, marginBottom: 22 }}>siteSettings.navItems / primaryCta</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <span style={sectionLabel()}>Nav items</span>
          <ArrayEditor
            items={navItems}
            onChange={(next) => patch({ navItems: next })}
            newItem={() => ({ _key: randomKey(), label: 'New link', href: '/' })}
            addLabel="+ Add nav item"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Label" value={item.label ?? ''} onChange={(e) => update({ label: e.target.value })} />
                <input style={{ ...inputStyle, flex: 1 }} placeholder="/path or /#anchor" value={item.href ?? ''} onChange={(e) => update({ href: e.target.value })} />
              </div>
            )}
          />
        </div>

        <div>
          <span style={sectionLabel()}>Primary CTA button</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              placeholder="Button label"
              value={cta.label ?? ''}
              onChange={(e) => patch({ primaryCta: { ...cta, label: e.target.value } })}
            />
            <input
              style={{ ...inputStyle, flex: 1 }}
              placeholder="Link (empty = opens book-a-demo modal)"
              value={cta.href ?? ''}
              onChange={(e) => patch({ primaryCta: { ...cta, href: e.target.value } })}
            />
          </div>
        </div>

        <Toggle
          label="Sticky top nav"
          hint="Stays fixed at the top of the viewport while scrolling"
          value={Boolean(settings.stickyNav)}
          onChange={(v) => patch({ stickyNav: v })}
        />
      </div>
    </div>
  )
}
