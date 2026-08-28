import { kitchen } from '../theme'

/** Shown in place of a gallery/banner block that has no tiles or images yet — those components correctly render nothing on the live site when empty, which otherwise makes a freshly-added block look like the click did nothing. */
export function PreviewEmptyBlock({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '34px 20px',
        textAlign: 'center',
        color: kitchen.textMuted,
        fontSize: 12.5,
        background: kitchen.surface,
      }}
    >
      {label}
    </div>
  )
}
