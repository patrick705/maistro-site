import { forwardRef, useImperativeHandle, useState } from 'react'

import { ArrayEditor } from './ArrayEditor'
import { ImageUploadField, type SanityImageValue } from './ImageUploadField'
import { VideoUploadField, type SanityFileValue } from './VideoUploadField'
import { portableBodyToText, randomKey, textToPortableBody } from './blockTypes'
import { kitchen } from './theme'
import { useIsMobile } from './useIsMobile'

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

const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 70, resize: 'vertical' }

interface ImageItem {
  _key: string
  image?: SanityImageValue
  caption?: string
}

interface LinkItem {
  _key: string
  platform?: string
  url?: string
}

interface LogoItem {
  _key: string
  name?: string
  logo?: SanityImageValue
  description?: string
  website?: string
}

interface StatBadgeItem {
  _key: string
  value?: string
  label?: string
  variant?: string
}

interface ResultStatItem {
  _key: string
  eyebrow?: string
  prefix?: string
  value?: string
  label?: string
  variant?: string
}

interface IconTileItem {
  _key: string
  icon?: string
  label?: string
}

interface ServiceCardItem {
  _key: string
  icon?: string
  title?: string
  description?: string
  bullets?: string[]
  variant?: string
}

interface ModuleItem {
  _key: string
  icon?: string
  eyebrow?: string
  headline?: string
  body?: string
  bullets?: string[]
  widget?: string
}

interface TestimonialItem {
  _key: string
  quote?: string
  author?: string
  role?: string
  venue?: string
}

interface StatItem {
  _key: string
  value?: string
  label?: string
}

interface KpiTileItem {
  _key: string
  label?: string
  value?: string
  valueVariant?: string
  small?: boolean
  delta?: string
  tone?: string
}

interface DayBarItem {
  _key: string
  day?: string
  forecast?: number
  actual?: number
  actualHighlight?: boolean
}

interface SingleBarItem {
  _key: string
  day?: string
  height?: number
  variant?: string
}

interface ShiftPersonItem {
  _key: string
  name?: string
  role?: string
  color?: string
}

interface ProgressItemItem {
  _key: string
  name?: string
  status?: string
  percent?: number
  color?: string
}

interface RotaRowItem {
  _key: string
  name?: string
  left?: number
  width?: number
  color?: string
}

const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'other', label: 'Other' },
]

const VARIANT_OPTIONS = [
  { value: 'brand', label: 'Brand' },
  { value: 'warm', label: 'Warm' },
  { value: 'pos', label: 'Positive' },
  { value: 'accent', label: 'Accent' },
]

const WIDGET_OPTIONS = [
  { value: 'rota', label: 'Rota' },
  { value: 'stock', label: 'Stock' },
  { value: 'voice', label: 'Voice ordering' },
  { value: 'forecast', label: 'Forecast' },
  { value: 'reports', label: 'Reports' },
]

const KPI_VALUE_VARIANT_OPTIONS = [
  { value: '', label: '(none)' },
  { value: 'brand', label: 'Brand' },
  { value: 'accent', label: 'Accent' },
]

const TONE_OPTIONS = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'pos', label: 'Positive' },
  { value: 'accent', label: 'Accent' },
]

const SINGLE_BAR_VARIANT_OPTIONS = [
  { value: 'soft', label: 'Soft (default)' },
  { value: 'brand', label: 'Brand' },
  { value: 'accent', label: 'Accent' },
]

const PERSON_COLOR_OPTIONS = [
  { value: 'warm', label: 'Warm' },
  { value: 'pos', label: 'Positive' },
  { value: 'brand', label: 'Brand' },
]

const PROGRESS_COLOR_OPTIONS = [
  { value: 'accent', label: 'Accent' },
  { value: 'warm', label: 'Warm' },
  { value: 'pos', label: 'Positive' },
]

const ROTA_COLOR_OPTIONS = [
  { value: 'warm', label: 'Warm' },
  { value: 'pos', label: 'Positive' },
  { value: 'accent', label: 'Accent' },
  { value: 'brand', label: 'Brand' },
]

function Select({ value, onChange, options, flex }: { value: string | undefined; onChange: (v: string) => void; options: { value: string; label: string }[]; flex?: string }) {
  return (
    <select style={{ ...inputStyle, ...(flex ? { flex } : {}) }} value={value ?? options[0]?.value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

function FieldsetHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 -4px' }}>
      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: kitchen.ink }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: kitchen.border }} />
    </div>
  )
}

function KpiTileFields({ item, update }: { item: KpiTileItem; update: (fields: Partial<KpiTileItem>) => void }) {
  const isMobile = useIsMobile()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
        <input style={{ ...inputStyle, flex: 1 }} placeholder="Label" value={item.label ?? ''} onChange={(e) => update({ label: e.target.value })} />
        <input style={{ ...inputStyle, flex: 1 }} placeholder="Value" value={item.value ?? ''} onChange={(e) => update({ value: e.target.value })} />
      </div>
      <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
        <input style={{ ...inputStyle, flex: 1 }} placeholder="Delta / context text" value={item.delta ?? ''} onChange={(e) => update({ delta: e.target.value })} />
        <Select value={item.tone} onChange={(v) => update({ tone: v })} options={TONE_OPTIONS} flex="0 0 110px" />
        <Select value={item.valueVariant ?? ''} onChange={(v) => update({ valueVariant: v || undefined })} options={KPI_VALUE_VARIANT_OPTIONS} flex="0 0 110px" />
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: kitchen.textMuted }}>
        <input type="checkbox" checked={item.small ?? false} onChange={(e) => update({ small: e.target.checked })} />
        Render value in smaller size
      </label>
    </div>
  )
}

function ProgressItemFields({
  item,
  update,
  options,
}: {
  item: ProgressItemItem
  update: (fields: Partial<ProgressItemItem>) => void
  options: { value: string; label: string }[]
}) {
  const isMobile = useIsMobile()
  return (
    <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
      <input style={{ ...inputStyle, flex: 1 }} placeholder="Name" value={item.name ?? ''} onChange={(e) => update({ name: e.target.value })} />
      <input style={{ ...inputStyle, flex: 1 }} placeholder="Status" value={item.status ?? ''} onChange={(e) => update({ status: e.target.value })} />
      <input
        style={{ ...inputStyle, flex: '0 0 80px' }}
        type="number"
        placeholder="%"
        value={item.percent ?? ''}
        onChange={(e) => update({ percent: Number(e.target.value) })}
      />
      <Select value={item.color} onChange={(v) => update({ color: v })} options={options} flex="0 0 100px" />
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: kitchen.textMuted }}>
        {label}
      </span>
      {children}
    </label>
  )
}

function VariantSelect({ value, onChange }: { value: string | undefined; onChange: (v: string) => void }) {
  return (
    <select style={inputStyle} value={value ?? 'brand'} onChange={(e) => onChange(e.target.value)}>
      {VARIANT_OPTIONS.map((v) => (
        <option key={v.value} value={v.value}>
          {v.label}
        </option>
      ))}
    </select>
  )
}

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

export interface SimpleBlockEditorHandle {
  save: () => void
}

/** Inline editor for all block types — scalar fields plus array-of-sub-object fields (images, links, cards). Save is triggered externally via `ref` from the drawer's footer. */
export const SimpleBlockEditor = forwardRef<SimpleBlockEditorHandle, { block: Record<string, any>; onSave: (fields: Record<string, unknown>) => void }>(
  function SimpleBlockEditor({ block, onSave }, ref) {
  const [draft, setDraft] = useState<Record<string, any>>(() => ({
    ...block,
    // `body` is portable-text (an array of blocks) on textBlock/sideBySideBlock, but a plain
    // string on aboutSectionBlock/featuredCaseStudyBlock — portableBodyToText assumes an array
    // and throws (`.map is not a function`) if handed a string, which crashed the editor for
    // the latter two.
    bodyText: Array.isArray(block.body) ? portableBodyToText(block.body) : '',
    slides: block.slides ?? [],
    images: block.images ?? [],
    links: block.links ?? [],
    logos: block.logos ?? [],
    heroStats: block.heroStats ?? [],
    services: block.services ?? [],
    stats: block.stats ?? [],
    channelsItems: block.channelsItems ?? [],
    outcomesItems: block.outcomesItems ?? [],
    modules: block.modules ?? [],
    testimonials: block.testimonials ?? [],
    pipeline: block.pipeline ?? {},
    heroStat: block.heroStat ?? {},
    // dashboardShowcaseBlock nests all of its data one level down, under `showcase`
    // (schema: dashboardShowcaseBlock -> { showcase: dashboardShowcase }) — not flat on the block.
    // Left as whatever the document already has (or {}) rather than pre-filled with empty
    // arrays here, so an untouched `showcase` stays a genuinely empty object for other block
    // types and doesn't get spread onto their saved fields (see isUnrelatedEmptyDefault below).
    showcase: block.showcase ?? {},
  }))

  const isMobile = useIsMobile()

  function set(key: string, value: unknown) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function setPipeline(fields: Record<string, unknown>) {
    setDraft((d) => ({ ...d, pipeline: { ...d.pipeline, ...fields } }))
  }

  function setHeroStat(fields: Record<string, unknown>) {
    setDraft((d) => ({ ...d, heroStat: { ...d.heroStat, ...fields } }))
  }

  function setShowcase(fields: Record<string, unknown>) {
    setDraft((d) => ({ ...d, showcase: { ...d.showcase, ...fields } }))
  }

  function setReportBand(fields: Record<string, unknown>) {
    setShowcase({ reportBand: { ...draft.showcase.reportBand, ...fields } })
  }

  /** True for an array/object this editor defaults to `[]`/`{}` for every block type (so field-set code stays generic) that the real document never had — saving it would bolt an unrelated empty container onto a block that doesn't use it. */
  function isUnrelatedEmptyDefault(key: string, value: unknown) {
    if (key in block) return false
    if (Array.isArray(value)) return value.length === 0
    if (value && typeof value === 'object') return Object.keys(value).length === 0
    return false
  }

  function save() {
    const { bodyText, _type, _key, ...rest } = draft
    // Only convert back to portable-text for the block types that actually store it that way —
    // otherwise this would overwrite aboutSectionBlock/featuredCaseStudyBlock's plain-string
    // `body` with a portable-text array, corrupting the field's real shape on save.
    const withBody = Array.isArray(block.body) ? { ...rest, body: textToPortableBody(bodyText ?? '') } : rest
    const fields = Object.fromEntries(Object.entries(withBody).filter(([k, v]) => !isUnrelatedEmptyDefault(k, v)))
    onSave(fields)
  }

  useImperativeHandle(ref, () => ({ save }))

  const fieldsForType: Record<string, React.ReactNode> = {
    textBlock: (
      <>
        <Field label="Heading">
          <input style={inputStyle} value={draft.heading ?? ''} onChange={(e) => set('heading', e.target.value)} />
        </Field>
        <Field label="Body">
          <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} value={draft.bodyText ?? ''} onChange={(e) => set('bodyText', e.target.value)} />
        </Field>
      </>
    ),
    sideBySideBlock: (
      <>
        <Field label="Heading">
          <input style={inputStyle} value={draft.heading ?? ''} onChange={(e) => set('heading', e.target.value)} />
        </Field>
        <Field label="Image position">
          <select style={inputStyle} value={draft.imagePosition ?? 'left'} onChange={(e) => set('imagePosition', e.target.value)}>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </Field>
        <Field label="Body">
          <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} value={draft.bodyText ?? ''} onChange={(e) => set('bodyText', e.target.value)} />
        </Field>
      </>
    ),
    liveVideoBlock: (
      <>
        <Field label="Title">
          <input style={inputStyle} value={draft.title ?? ''} onChange={(e) => set('title', e.target.value)} />
        </Field>
        <Field label="Live embed URL">
          <input style={inputStyle} value={draft.embedUrl ?? ''} onChange={(e) => set('embedUrl', e.target.value)} placeholder="Leave empty to show the offline state" />
        </Field>
        <Field label="Offline message">
          <input style={inputStyle} value={draft.offlineMessage ?? ''} onChange={(e) => set('offlineMessage', e.target.value)} />
        </Field>
      </>
    ),
    backgroundVideoBlock: (
      <>
        <Field label="Video file">
          <VideoUploadField value={draft.video as SanityFileValue | undefined} onChange={(v) => set('video', v)} />
        </Field>
        <Field label="Poster frame">
          <ImageUploadField value={draft.posterImage} onChange={(v) => set('posterImage', v)} />
        </Field>
        <Field label="Eyebrow">
          <input style={inputStyle} value={draft.eyebrow ?? ''} onChange={(e) => set('eyebrow', e.target.value)} />
        </Field>
        <Field label="Overlay heading">
          <input style={inputStyle} value={draft.heading ?? ''} onChange={(e) => set('heading', e.target.value)} />
        </Field>
        <Field label="Overlay subtext">
          <input style={inputStyle} value={draft.subhead ?? ''} onChange={(e) => set('subhead', e.target.value)} />
        </Field>
        <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
          <Field label="Primary CTA label">
            <input style={inputStyle} value={draft.primaryCta ?? ''} onChange={(e) => set('primaryCta', e.target.value)} />
          </Field>
          <Field label="Secondary CTA label">
            <input style={inputStyle} value={draft.secondaryCta ?? ''} onChange={(e) => set('secondaryCta', e.target.value)} />
          </Field>
        </div>
        <Field label="Section height">
          <select style={inputStyle} value={draft.videoHeight ?? 'Full screen'} onChange={(e) => set('videoHeight', e.target.value)}>
            <option value="Full screen">Full screen</option>
            <option value="Three-quarter">Three-quarter</option>
          </select>
        </Field>
        <Field label="Top menu over the video (off starts the video below a solid nav)">
          <input type="checkbox" checked={draft.menuOverlay ?? true} onChange={(e) => set('menuOverlay', e.target.checked)} />
        </Field>
        <Field label="Text overlay (off puts the copy beneath the video)">
          <input type="checkbox" checked={draft.overlayCopy ?? true} onChange={(e) => set('overlayCopy', e.target.checked)} />
        </Field>
        <Field label="Darken video behind text">
          <input type="checkbox" checked={draft.scrim ?? true} onChange={(e) => set('scrim', e.target.checked)} />
        </Field>
        <Field label="Overlay copy">
          <select style={inputStyle} value={draft.overlayPreset ?? 'Full'} onChange={(e) => set('overlayPreset', e.target.value)}>
            <option value="Full">Full</option>
            <option value="Minimal">Minimal</option>
          </select>
          <span style={{ display: 'block', fontSize: 10.5, lineHeight: 1.45, color: kitchen.textFaint, marginTop: 4 }}>
            Minimal drops the eyebrow, subhead and second CTA
          </span>
        </Field>
        <Field label="Scroll cue">
          <input type="checkbox" checked={draft.scrollCue ?? true} onChange={(e) => set('scrollCue', e.target.checked)} />
        </Field>
        <Field label="Loop continuously">
          <input type="checkbox" checked={draft.loop ?? true} onChange={(e) => set('loop', e.target.checked)} />
        </Field>
        <Field label="Muted (required for autoplay)">
          <input type="checkbox" checked={draft.muted ?? true} onChange={(e) => set('muted', e.target.checked)} />
        </Field>
      </>
    ),
    ctaBannerBlock: (
      <>
        <Field label="Heading">
          <input style={inputStyle} value={draft.heading ?? ''} onChange={(e) => set('heading', e.target.value)} />
        </Field>
        <Field label="Subhead">
          <input style={inputStyle} value={draft.subhead ?? ''} onChange={(e) => set('subhead', e.target.value)} />
        </Field>
        <Field label="Button label">
          <input style={inputStyle} value={draft.buttonLabel ?? ''} onChange={(e) => set('buttonLabel', e.target.value)} />
        </Field>
        <Field label="Button link" >
          <input style={inputStyle} value={draft.buttonHref ?? ''} onChange={(e) => set('buttonHref', e.target.value)} placeholder="Leave empty to open the book-a-demo modal" />
        </Field>
      </>
    ),
    heroCarouselBlock: (
      <>
        <Field label="Eyebrow">
          <input style={inputStyle} value={draft.eyebrow ?? ''} onChange={(e) => set('eyebrow', e.target.value)} />
        </Field>
        <Field label="Overlay heading">
          <input style={inputStyle} value={draft.overlayHeading ?? ''} onChange={(e) => set('overlayHeading', e.target.value)} />
        </Field>
        <Field label="Overlay subtext">
          <input style={inputStyle} value={draft.overlaySubhead ?? ''} onChange={(e) => set('overlaySubhead', e.target.value)} />
        </Field>
        <Field label="Slides">
          <ArrayEditor<ImageItem>
            items={draft.slides}
            onChange={(next) => set('slides', next)}
            newItem={() => ({ _key: randomKey() })}
            addLabel="+ Add slide"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <ImageUploadField value={item.image} onChange={(v) => update({ image: v })} />
                <input style={inputStyle} placeholder="Caption (optional)" value={item.caption ?? ''} onChange={(e) => update({ caption: e.target.value })} />
              </div>
            )}
          />
        </Field>
      </>
    ),
    imageGalleryBlock: (
      <>
        <Field label="Heading">
          <input style={inputStyle} value={draft.heading ?? ''} onChange={(e) => set('heading', e.target.value)} />
        </Field>
        <Field label="Layout">
          <select style={inputStyle} value={draft.layout ?? 'Grid'} onChange={(e) => set('layout', e.target.value)}>
            <option value="Grid">Grid</option>
            <option value="Mosaic">Mosaic</option>
            <option value="Filmstrip">Filmstrip</option>
          </select>
        </Field>
        <Field label="Images">
          <ArrayEditor<ImageItem>
            items={draft.images}
            onChange={(next) => set('images', next)}
            newItem={() => ({ _key: randomKey() })}
            addLabel="+ Add image"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <ImageUploadField value={item.image} onChange={(v) => update({ image: v })} />
                <input style={inputStyle} placeholder="Caption (optional)" value={item.caption ?? ''} onChange={(e) => update({ caption: e.target.value })} />
              </div>
            )}
          />
        </Field>
      </>
    ),
    socialLinksBlock: (
      <>
        <Field label="Heading">
          <input style={inputStyle} value={draft.heading ?? ''} onChange={(e) => set('heading', e.target.value)} />
        </Field>
        <Field label="Links">
          <ArrayEditor<LinkItem>
            items={draft.links}
            onChange={(next) => set('links', next)}
            newItem={() => ({ _key: randomKey(), platform: 'instagram', url: '' })}
            addLabel="+ Add link"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
                <select style={{ ...inputStyle, flex: '0 0 130px' }} value={item.platform ?? 'instagram'} onChange={(e) => update({ platform: e.target.value })}>
                  {PLATFORM_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="https://…" value={item.url ?? ''} onChange={(e) => update({ url: e.target.value })} />
              </div>
            )}
          />
        </Field>
      </>
    ),
    logoStripBlock: (
      <>
        <Field label="Heading">
          <input style={inputStyle} value={draft.heading ?? ''} onChange={(e) => set('heading', e.target.value)} />
        </Field>
        <Field label="Logos">
          <ArrayEditor<LogoItem>
            items={draft.logos}
            onChange={(next) => set('logos', next)}
            newItem={() => ({ _key: randomKey(), name: '' })}
            addLabel="+ Add logo"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <ImageUploadField value={item.logo} onChange={(v) => update({ logo: v })} />
                <input style={inputStyle} placeholder="Client name" value={item.name ?? ''} onChange={(e) => update({ name: e.target.value })} />
                <input style={inputStyle} placeholder="Description (optional)" value={item.description ?? ''} onChange={(e) => update({ description: e.target.value })} />
                <input style={inputStyle} placeholder="Website (optional)" value={item.website ?? ''} onChange={(e) => update({ website: e.target.value })} />
              </div>
            )}
          />
        </Field>
      </>
    ),
    richHeroBlock: (
      <>
        <Field label="Eyebrow">
          <input style={inputStyle} value={draft.eyebrow ?? ''} onChange={(e) => set('eyebrow', e.target.value)} />
        </Field>
        <Field label="Headline (before highlight)">
          <input style={inputStyle} value={draft.headlineBefore ?? ''} onChange={(e) => set('headlineBefore', e.target.value)} />
        </Field>
        <Field label="Headline highlight">
          <input style={inputStyle} value={draft.headlineHighlight ?? ''} onChange={(e) => set('headlineHighlight', e.target.value)} />
        </Field>
        <Field label="Subhead">
          <textarea style={textareaStyle} value={draft.subhead ?? ''} onChange={(e) => set('subhead', e.target.value)} />
        </Field>
        <Field label="Primary CTA label">
          <input style={inputStyle} value={draft.primaryCta ?? ''} onChange={(e) => set('primaryCta', e.target.value)} />
        </Field>
        <Field label="Secondary CTA label">
          <input style={inputStyle} value={draft.secondaryCta ?? ''} onChange={(e) => set('secondaryCta', e.target.value)} />
        </Field>
        <Field label="Secondary CTA link">
          <input style={inputStyle} value={draft.secondaryHref ?? ''} onChange={(e) => set('secondaryHref', e.target.value)} placeholder="#" />
        </Field>
        <Field label="Stat badges">
          <ArrayEditor<StatBadgeItem>
            items={draft.heroStats}
            onChange={(next) => set('heroStats', next)}
            newItem={() => ({ _key: randomKey(), variant: 'brand' })}
            addLabel="+ Add stat"
            max={3}
            renderItem={(item, update) => (
              <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Value" value={item.value ?? ''} onChange={(e) => update({ value: e.target.value })} />
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Label" value={item.label ?? ''} onChange={(e) => update({ label: e.target.value })} />
                <VariantSelect value={item.variant} onChange={(v) => update({ variant: v })} />
              </div>
            )}
          />
        </Field>
      </>
    ),
    simpleHeroBlock: (
      <>
        <Field label="Eyebrow">
          <input style={inputStyle} value={draft.eyebrow ?? ''} onChange={(e) => set('eyebrow', e.target.value)} />
        </Field>
        <Field label="Headline (before highlight)">
          <input style={inputStyle} value={draft.headlineBefore ?? ''} onChange={(e) => set('headlineBefore', e.target.value)} />
        </Field>
        <Field label="Headline highlight">
          <input style={inputStyle} value={draft.headlineHighlight ?? ''} onChange={(e) => set('headlineHighlight', e.target.value)} />
        </Field>
        <Field label="Subhead">
          <textarea style={textareaStyle} value={draft.subhead ?? ''} onChange={(e) => set('subhead', e.target.value)} />
        </Field>
        <Field label="Headline font-size (CSS clamp, optional)">
          <input style={inputStyle} value={draft.headlineClamp ?? ''} onChange={(e) => set('headlineClamp', e.target.value)} placeholder="clamp(40px, 10vw, 80px)" />
        </Field>
      </>
    ),
    aboutSectionBlock: (
      <>
        <Field label="Eyebrow">
          <input style={inputStyle} value={draft.eyebrow ?? ''} onChange={(e) => set('eyebrow', e.target.value)} />
        </Field>
        <Field label="Headline (before highlight)">
          <textarea style={textareaStyle} value={draft.headlineBefore ?? ''} onChange={(e) => set('headlineBefore', e.target.value)} />
        </Field>
        <Field label="Headline highlight">
          <input style={inputStyle} value={draft.headlineHighlight ?? ''} onChange={(e) => set('headlineHighlight', e.target.value)} />
        </Field>
        <Field label="Headline (after highlight)">
          <textarea style={textareaStyle} value={draft.headlineAfter ?? ''} onChange={(e) => set('headlineAfter', e.target.value)} />
        </Field>
        <Field label="Body copy">
          <textarea style={textareaStyle} value={draft.body ?? ''} onChange={(e) => set('body', e.target.value)} />
        </Field>
        <div style={{ padding: 10, border: `1px solid ${kitchen.borderSoft}`, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: kitchen.textMuted }}>Diagram</span>
          <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
            <input style={{ ...inputStyle, flex: '0 0 60px' }} placeholder="Icon" value={draft.pipeline.channelsIcon ?? ''} onChange={(e) => setPipeline({ channelsIcon: e.target.value })} />
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Channels label" value={draft.pipeline.channelsLabel ?? ''} onChange={(e) => setPipeline({ channelsLabel: e.target.value })} />
          </div>
          <textarea
            style={{ ...inputStyle, minHeight: 50 }}
            placeholder="Channel tags, one per line"
            value={(draft.pipeline.channelsTags ?? []).join('\n')}
            onChange={(e) => setPipeline({ channelsTags: linesToArray(e.target.value) })}
          />
          <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
            <input style={{ ...inputStyle, flex: '0 0 60px' }} placeholder="Icon" value={draft.pipeline.menuManagerIcon ?? ''} onChange={(e) => setPipeline({ menuManagerIcon: e.target.value })} />
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Menu Manager title" value={draft.pipeline.menuManagerTitle ?? ''} onChange={(e) => setPipeline({ menuManagerTitle: e.target.value })} />
          </div>
          <input style={inputStyle} placeholder="Menu Manager sub-copy" value={draft.pipeline.menuManagerSub ?? ''} onChange={(e) => setPipeline({ menuManagerSub: e.target.value })} />
          <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
            <input style={{ ...inputStyle, flex: '0 0 60px' }} placeholder="Icon" value={draft.pipeline.maistroIcon ?? ''} onChange={(e) => setPipeline({ maistroIcon: e.target.value })} />
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Maistro title" value={draft.pipeline.maistroTitle ?? ''} onChange={(e) => setPipeline({ maistroTitle: e.target.value })} />
          </div>
          <input style={inputStyle} placeholder="Maistro sub-copy" value={draft.pipeline.maistroSub ?? ''} onChange={(e) => setPipeline({ maistroSub: e.target.value })} />
          <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
            <input style={{ ...inputStyle, flex: '0 0 60px' }} placeholder="Icon" value={draft.pipeline.deliversIcon ?? ''} onChange={(e) => setPipeline({ deliversIcon: e.target.value })} />
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Delivers label" value={draft.pipeline.deliversLabel ?? ''} onChange={(e) => setPipeline({ deliversLabel: e.target.value })} />
          </div>
          <Field label="Outputs">
            <ArrayEditor<IconTileItem>
              items={draft.pipeline.outputs ?? []}
              onChange={(next) => setPipeline({ outputs: next })}
              newItem={() => ({ _key: randomKey() })}
              addLabel="+ Add output"
              renderItem={(item, update) => (
                <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
                  <input style={{ ...inputStyle, flex: '0 0 60px' }} placeholder="Icon" value={item.icon ?? ''} onChange={(e) => update({ icon: e.target.value })} />
                  <input style={{ ...inputStyle, flex: 1 }} placeholder="Label" value={item.label ?? ''} onChange={(e) => update({ label: e.target.value })} />
                </div>
              )}
            />
          </Field>
        </div>
      </>
    ),
    dashboardShowcaseBlock: (
      <>
        <FieldsetHeading>Overview tab</FieldsetHeading>
        <Field label="KPI tiles">
          <ArrayEditor<KpiTileItem>
            items={draft.showcase.overviewKpis ?? []}
            onChange={(next) => setShowcase({ overviewKpis: next })}
            newItem={() => ({ _key: randomKey(), tone: 'neutral' })}
            addLabel="+ Add KPI tile"
            max={4}
            renderItem={(item, update) => <KpiTileFields item={item} update={update} />}
          />
        </Field>
        <Field label="Sales — forecast vs actual (bars)">
          <ArrayEditor<DayBarItem>
            items={draft.showcase.overviewChart ?? []}
            onChange={(next) => setShowcase({ overviewChart: next })}
            newItem={() => ({ _key: randomKey() })}
            addLabel="+ Add day bar"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', gap: 8, alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
                <input style={{ ...inputStyle, flex: '0 0 70px' }} placeholder="Day" value={item.day ?? ''} onChange={(e) => update({ day: e.target.value })} />
                <input style={{ ...inputStyle, flex: 1 }} type="number" placeholder="Forecast (px)" value={item.forecast ?? ''} onChange={(e) => update({ forecast: Number(e.target.value) })} />
                <input style={{ ...inputStyle, flex: 1 }} type="number" placeholder="Actual (px)" value={item.actual ?? ''} onChange={(e) => update({ actual: Number(e.target.value) })} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: kitchen.textMuted, whiteSpace: 'nowrap' }}>
                  <input type="checkbox" checked={item.actualHighlight ?? false} onChange={(e) => update({ actualHighlight: e.target.checked })} />
                  Highlight
                </label>
              </div>
            )}
          />
        </Field>
        <Field label="On shift now">
          <ArrayEditor<ShiftPersonItem>
            items={draft.showcase.onShift ?? []}
            onChange={(next) => setShowcase({ onShift: next })}
            newItem={() => ({ _key: randomKey(), color: 'brand' })}
            addLabel="+ Add person"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Name" value={item.name ?? ''} onChange={(e) => update({ name: e.target.value })} />
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Role / until time" value={item.role ?? ''} onChange={(e) => update({ role: e.target.value })} />
                <Select value={item.color} onChange={(v) => update({ color: v })} options={PERSON_COLOR_OPTIONS} flex="0 0 110px" />
              </div>
            )}
          />
        </Field>
        <Field label="Stock alerts">
          <ArrayEditor<ProgressItemItem>
            items={draft.showcase.stockAlerts ?? []}
            onChange={(next) => setShowcase({ stockAlerts: next })}
            newItem={() => ({ _key: randomKey(), color: 'pos' })}
            addLabel="+ Add alert"
            renderItem={(item, update) => <ProgressItemFields item={item} update={update} options={PROGRESS_COLOR_OPTIONS} />}
          />
        </Field>

        <FieldsetHeading>Forecast tab</FieldsetHeading>
        <Field label="KPI tiles">
          <ArrayEditor<KpiTileItem>
            items={draft.showcase.forecastKpis ?? []}
            onChange={(next) => setShowcase({ forecastKpis: next })}
            newItem={() => ({ _key: randomKey(), tone: 'neutral' })}
            addLabel="+ Add KPI tile"
            max={3}
            renderItem={(item, update) => <KpiTileFields item={item} update={update} />}
          />
        </Field>
        <Field label="Predicted sales bars">
          <ArrayEditor<SingleBarItem>
            items={draft.showcase.forecastChart ?? []}
            onChange={(next) => setShowcase({ forecastChart: next })}
            newItem={() => ({ _key: randomKey(), variant: 'soft' })}
            addLabel="+ Add bar"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
                <input style={{ ...inputStyle, flex: '0 0 70px' }} placeholder="Day" value={item.day ?? ''} onChange={(e) => update({ day: e.target.value })} />
                <input style={{ ...inputStyle, flex: 1 }} type="number" placeholder="Height (px)" value={item.height ?? ''} onChange={(e) => update({ height: Number(e.target.value) })} />
                <Select value={item.variant} onChange={(v) => update({ variant: v })} options={SINGLE_BAR_VARIANT_OPTIONS} flex="0 0 130px" />
              </div>
            )}
          />
        </Field>

        <FieldsetHeading>Staff tab</FieldsetHeading>
        <Field label="KPI tiles">
          <ArrayEditor<KpiTileItem>
            items={draft.showcase.staffKpis ?? []}
            onChange={(next) => setShowcase({ staffKpis: next })}
            newItem={() => ({ _key: randomKey(), tone: 'neutral' })}
            addLabel="+ Add KPI tile"
            max={3}
            renderItem={(item, update) => <KpiTileFields item={item} update={update} />}
          />
        </Field>
        <Field label="Today's rota">
          <ArrayEditor<RotaRowItem>
            items={draft.showcase.rota ?? []}
            onChange={(next) => setShowcase({ rota: next })}
            newItem={() => ({ _key: randomKey(), color: 'brand' })}
            addLabel="+ Add rota row"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Name" value={item.name ?? ''} onChange={(e) => update({ name: e.target.value })} />
                <input style={{ ...inputStyle, flex: '0 0 90px' }} type="number" placeholder="Left %" value={item.left ?? ''} onChange={(e) => update({ left: Number(e.target.value) })} />
                <input style={{ ...inputStyle, flex: '0 0 90px' }} type="number" placeholder="Width %" value={item.width ?? ''} onChange={(e) => update({ width: Number(e.target.value) })} />
                <Select value={item.color} onChange={(v) => update({ color: v })} options={ROTA_COLOR_OPTIONS} flex="0 0 100px" />
              </div>
            )}
          />
        </Field>

        <FieldsetHeading>Stock tab</FieldsetHeading>
        <Field label="KPI tiles">
          <ArrayEditor<KpiTileItem>
            items={draft.showcase.stockKpis ?? []}
            onChange={(next) => setShowcase({ stockKpis: next })}
            newItem={() => ({ _key: randomKey(), tone: 'neutral' })}
            addLabel="+ Add KPI tile"
            max={3}
            renderItem={(item, update) => <KpiTileFields item={item} update={update} />}
          />
        </Field>
        <Field label="Stock levels">
          <ArrayEditor<ProgressItemItem>
            items={draft.showcase.stockLevels ?? []}
            onChange={(next) => setShowcase({ stockLevels: next })}
            newItem={() => ({ _key: randomKey(), color: 'pos' })}
            addLabel="+ Add stock row"
            renderItem={(item, update) => <ProgressItemFields item={item} update={update} options={PROGRESS_COLOR_OPTIONS} />}
          />
        </Field>

        <FieldsetHeading>Reports tab</FieldsetHeading>
        <Field label="KPI tiles">
          <ArrayEditor<KpiTileItem>
            items={draft.showcase.reportsKpis ?? []}
            onChange={(next) => setShowcase({ reportsKpis: next })}
            newItem={() => ({ _key: randomKey(), tone: 'neutral' })}
            addLabel="+ Add KPI tile"
            max={4}
            renderItem={(item, update) => <KpiTileFields item={item} update={update} />}
          />
        </Field>
        <Field label="Report band">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <input style={inputStyle} placeholder="Title" value={draft.showcase.reportBand?.title ?? ''} onChange={(e) => setReportBand({ title: e.target.value })} />
            <input style={inputStyle} placeholder="Subtitle" value={draft.showcase.reportBand?.subtitle ?? ''} onChange={(e) => setReportBand({ subtitle: e.target.value })} />
            <input style={inputStyle} placeholder="Pill label" value={draft.showcase.reportBand?.pill ?? ''} onChange={(e) => setReportBand({ pill: e.target.value })} />
          </div>
        </Field>
      </>
    ),
    servicesGridBlock: (
      <>
        <Field label="Eyebrow">
          <input style={inputStyle} value={draft.eyebrow ?? ''} onChange={(e) => set('eyebrow', e.target.value)} />
        </Field>
        <Field label="Headline">
          <input style={inputStyle} value={draft.headline ?? ''} onChange={(e) => set('headline', e.target.value)} />
        </Field>
        <Field label="Service cards">
          <ArrayEditor<ServiceCardItem>
            items={draft.services}
            onChange={(next) => set('services', next)}
            newItem={() => ({ _key: randomKey(), variant: 'brand' })}
            addLabel="+ Add service"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
                  <input style={{ ...inputStyle, flex: '0 0 60px' }} placeholder="Icon" value={item.icon ?? ''} onChange={(e) => update({ icon: e.target.value })} />
                  <input style={{ ...inputStyle, flex: 1 }} placeholder="Title" value={item.title ?? ''} onChange={(e) => update({ title: e.target.value })} />
                  <VariantSelect value={item.variant} onChange={(v) => update({ variant: v })} />
                </div>
                <textarea style={textareaStyle} placeholder="Description" value={item.description ?? ''} onChange={(e) => update({ description: e.target.value })} />
                <textarea
                  style={{ ...inputStyle, minHeight: 50 }}
                  placeholder="Bullets, one per line"
                  value={(item.bullets ?? []).join('\n')}
                  onChange={(e) => update({ bullets: linesToArray(e.target.value) })}
                />
              </div>
            )}
          />
        </Field>
      </>
    ),
    statsBandBlock: (
      <>
        <Field label="Eyebrow">
          <input style={inputStyle} value={draft.eyebrow ?? ''} onChange={(e) => set('eyebrow', e.target.value)} />
        </Field>
        <Field label="Headline">
          <input style={inputStyle} value={draft.headline ?? ''} onChange={(e) => set('headline', e.target.value)} />
        </Field>
        <Field label="Stats">
          <ArrayEditor<ResultStatItem>
            items={draft.stats}
            onChange={(next) => set('stats', next)}
            newItem={() => ({ _key: randomKey(), variant: 'brand' })}
            addLabel="+ Add stat"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
                  <input style={{ ...inputStyle, flex: 1 }} placeholder="Eyebrow" value={item.eyebrow ?? ''} onChange={(e) => update({ eyebrow: e.target.value })} />
                  <input style={{ ...inputStyle, flex: '0 0 70px' }} placeholder="Prefix" value={item.prefix ?? ''} onChange={(e) => update({ prefix: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
                  <input style={{ ...inputStyle, flex: 1 }} placeholder="Value" value={item.value ?? ''} onChange={(e) => update({ value: e.target.value })} />
                  <input style={{ ...inputStyle, flex: 1 }} placeholder="Label" value={item.label ?? ''} onChange={(e) => update({ label: e.target.value })} />
                  <VariantSelect value={item.variant} onChange={(v) => update({ variant: v })} />
                </div>
              </div>
            )}
          />
        </Field>
      </>
    ),
    contactFormBlock: (
      <>
        <Field label="Headline">
          <input style={inputStyle} value={draft.headline ?? ''} onChange={(e) => set('headline', e.target.value)} />
        </Field>
        <Field label="Subhead">
          <textarea style={textareaStyle} value={draft.subhead ?? ''} onChange={(e) => set('subhead', e.target.value)} />
        </Field>
      </>
    ),
    pipelineStripBlock: (
      <>
        <Field label="Channels column label">
          <input style={inputStyle} value={draft.channelsLabel ?? ''} onChange={(e) => set('channelsLabel', e.target.value)} />
        </Field>
        <Field label="Channel tiles">
          <ArrayEditor<IconTileItem>
            items={draft.channelsItems}
            onChange={(next) => set('channelsItems', next)}
            newItem={() => ({ _key: randomKey() })}
            addLabel="+ Add tile"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
                <input style={{ ...inputStyle, flex: '0 0 60px' }} placeholder="Icon" value={item.icon ?? ''} onChange={(e) => update({ icon: e.target.value })} />
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Label" value={item.label ?? ''} onChange={(e) => update({ label: e.target.value })} />
              </div>
            )}
          />
        </Field>
        <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
          <input style={{ ...inputStyle, flex: '0 0 60px' }} placeholder="Icon" value={draft.menuManagerIcon ?? ''} onChange={(e) => set('menuManagerIcon', e.target.value)} />
          <input style={{ ...inputStyle, flex: 1 }} placeholder="Menu Manager title" value={draft.menuManagerTitle ?? ''} onChange={(e) => set('menuManagerTitle', e.target.value)} />
        </div>
        <input style={inputStyle} placeholder="Menu Manager sub-copy" value={draft.menuManagerSub ?? ''} onChange={(e) => set('menuManagerSub', e.target.value)} />
        <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
          <input style={{ ...inputStyle, flex: '0 0 60px' }} placeholder="Icon" value={draft.maistroIcon ?? ''} onChange={(e) => set('maistroIcon', e.target.value)} />
          <input style={{ ...inputStyle, flex: 1 }} placeholder="Maistro title" value={draft.maistroTitle ?? ''} onChange={(e) => set('maistroTitle', e.target.value)} />
        </div>
        <input style={inputStyle} placeholder="Maistro sub-copy" value={draft.maistroSub ?? ''} onChange={(e) => set('maistroSub', e.target.value)} />
        <Field label="Outcomes column label">
          <input style={inputStyle} value={draft.outcomesLabel ?? ''} onChange={(e) => set('outcomesLabel', e.target.value)} />
        </Field>
        <Field label="Outcome tiles">
          <ArrayEditor<IconTileItem>
            items={draft.outcomesItems}
            onChange={(next) => set('outcomesItems', next)}
            newItem={() => ({ _key: randomKey() })}
            addLabel="+ Add tile"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
                <input style={{ ...inputStyle, flex: '0 0 60px' }} placeholder="Icon" value={item.icon ?? ''} onChange={(e) => update({ icon: e.target.value })} />
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Label" value={item.label ?? ''} onChange={(e) => update({ label: e.target.value })} />
              </div>
            )}
          />
        </Field>
      </>
    ),
    moduleDeepDiveListBlock: (
      <>
        <Field label="Eyebrow">
          <input style={inputStyle} value={draft.eyebrow ?? ''} onChange={(e) => set('eyebrow', e.target.value)} />
        </Field>
        <Field label="Headline">
          <input style={inputStyle} value={draft.headline ?? ''} onChange={(e) => set('headline', e.target.value)} />
        </Field>
        <Field label="Modules">
          <ArrayEditor<ModuleItem>
            items={draft.modules}
            onChange={(next) => set('modules', next)}
            newItem={() => ({ _key: randomKey(), widget: 'rota' })}
            addLabel="+ Add module"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
                  <input style={{ ...inputStyle, flex: '0 0 60px' }} placeholder="Icon" value={item.icon ?? ''} onChange={(e) => update({ icon: e.target.value })} />
                  <input style={{ ...inputStyle, flex: 1 }} placeholder="Eyebrow" value={item.eyebrow ?? ''} onChange={(e) => update({ eyebrow: e.target.value })} />
                  <select style={{ ...inputStyle, flex: '0 0 130px' }} value={item.widget ?? 'rota'} onChange={(e) => update({ widget: e.target.value })}>
                    {WIDGET_OPTIONS.map((w) => (
                      <option key={w.value} value={w.value}>
                        {w.label}
                      </option>
                    ))}
                  </select>
                </div>
                <input style={inputStyle} placeholder="Headline" value={item.headline ?? ''} onChange={(e) => update({ headline: e.target.value })} />
                <textarea style={textareaStyle} placeholder="Body" value={item.body ?? ''} onChange={(e) => update({ body: e.target.value })} />
                <textarea
                  style={{ ...inputStyle, minHeight: 50 }}
                  placeholder="Bullets, one per line"
                  value={(item.bullets ?? []).join('\n')}
                  onChange={(e) => update({ bullets: linesToArray(e.target.value) })}
                />
              </div>
            )}
          />
        </Field>
      </>
    ),
    integrationsBlock: (
      <>
        <Field label="Eyebrow">
          <input style={inputStyle} value={draft.eyebrow ?? ''} onChange={(e) => set('eyebrow', e.target.value)} />
        </Field>
        <Field label="Headline">
          <input style={inputStyle} value={draft.headline ?? ''} onChange={(e) => set('headline', e.target.value)} />
        </Field>
        <Field label="Integration pills (one per line)">
          <textarea
            style={{ ...inputStyle, minHeight: 80 }}
            value={(draft.integrations ?? []).join('\n')}
            onChange={(e) => set('integrations', linesToArray(e.target.value))}
          />
        </Field>
      </>
    ),
    featuredCaseStudyBlock: (
      <>
        <Field label="Eyebrow">
          <input style={inputStyle} value={draft.eyebrow ?? ''} onChange={(e) => set('eyebrow', e.target.value)} />
        </Field>
        <Field label="Headline">
          <input style={inputStyle} value={draft.headline ?? ''} onChange={(e) => set('headline', e.target.value)} />
        </Field>
        <Field label="Body copy">
          <textarea style={textareaStyle} value={draft.body ?? ''} onChange={(e) => set('body', e.target.value)} />
        </Field>
        <Field label="Quote">
          <textarea style={textareaStyle} value={draft.quote ?? ''} onChange={(e) => set('quote', e.target.value)} />
        </Field>
        <Field label="Quote author">
          <input style={inputStyle} value={draft.author ?? ''} onChange={(e) => set('author', e.target.value)} />
        </Field>
        <Field label="Headline stat">
          <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Value" value={draft.heroStat.value ?? ''} onChange={(e) => setHeroStat({ value: e.target.value })} />
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Label" value={draft.heroStat.label ?? ''} onChange={(e) => setHeroStat({ label: e.target.value })} />
          </div>
        </Field>
        <Field label="Supporting stats">
          <ArrayEditor<StatItem>
            items={draft.stats}
            onChange={(next) => set('stats', next)}
            newItem={() => ({ _key: randomKey() })}
            addLabel="+ Add stat"
            max={2}
            renderItem={(item, update) => (
              <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Value" value={item.value ?? ''} onChange={(e) => update({ value: e.target.value })} />
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Label" value={item.label ?? ''} onChange={(e) => update({ label: e.target.value })} />
              </div>
            )}
          />
        </Field>
      </>
    ),
    testimonialGridBlock: (
      <>
        <Field label="Eyebrow">
          <input style={inputStyle} value={draft.eyebrow ?? ''} onChange={(e) => set('eyebrow', e.target.value)} />
        </Field>
        <Field label="Headline">
          <input style={inputStyle} value={draft.headline ?? ''} onChange={(e) => set('headline', e.target.value)} />
        </Field>
        <Field label="Testimonials">
          <ArrayEditor<TestimonialItem>
            items={draft.testimonials}
            onChange={(next) => set('testimonials', next)}
            newItem={() => ({ _key: randomKey() })}
            addLabel="+ Add testimonial"
            renderItem={(item, update) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <textarea style={textareaStyle} placeholder="Quote" value={item.quote ?? ''} onChange={(e) => update({ quote: e.target.value })} />
                <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
                  <input style={{ ...inputStyle, flex: 1 }} placeholder="Author" value={item.author ?? ''} onChange={(e) => update({ author: e.target.value })} />
                  <input style={{ ...inputStyle, flex: 1 }} placeholder="Role (optional)" value={item.role ?? ''} onChange={(e) => update({ role: e.target.value })} />
                  <input style={{ ...inputStyle, flex: 1 }} placeholder="Venue" value={item.venue ?? ''} onChange={(e) => update({ venue: e.target.value })} />
                </div>
              </div>
            )}
          />
        </Field>
      </>
    ),
    newsGridBlock: (
      <div style={{ fontSize: 12, color: kitchen.textFaint }}>
        Nothing to configure — this block automatically shows every published News Article.
      </div>
    ),
  }

  const fields = fieldsForType[block._type]
  if (!fields) return null

  return <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14 }}>{fields}</div>
  },
)

/** Block types with nothing to configure — the drawer hides its Save button for these. */
export function isReadOnlyBlockType(type: string) {
  return type === 'newsGridBlock'
}
