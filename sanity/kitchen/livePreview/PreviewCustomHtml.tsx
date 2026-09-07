import { kitchen } from '../theme'

interface CustomHtmlPreviewBlock {
  label?: string
  file?: { url?: string }
  code?: string
}

/**
 * Deliberately not a real render — arbitrary uploaded/pasted HTML (embeds,
 * scripts) has no business executing inside the Studio's own admin page.
 * Shows just enough to identify which embed this is.
 */
export function PreviewCustomHtml({ block }: { block: CustomHtmlPreviewBlock }) {
  const source = block.file?.url ? 'Uploaded file' : block.code ? 'Pasted code' : 'No content yet'
  return (
    <div
      style={{
        padding: '18px 16px',
        border: `1px dashed ${kitchen.borderDashed}`,
        borderRadius: 10,
        background: kitchen.surface,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }}>
        Custom HTML block
      </span>
      <span style={{ fontFamily: kitchen.fontMono, fontSize: 13, color: kitchen.ink }}>
        {'</> '}
        {block.label || 'Untitled embed'}
      </span>
      <span style={{ fontSize: 11, color: kitchen.textMuted }}>
        {source} — renders on the live page only, no editor preview.
      </span>
    </div>
  )
}
