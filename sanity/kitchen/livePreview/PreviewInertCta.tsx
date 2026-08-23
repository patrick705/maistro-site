/** Looks exactly like the real CTA (same class, same CSS) but does nothing — used wherever a real button would open the demo modal or submit a form. */
export function PreviewInertCta({ label, className }: { label: string; className?: string }) {
  return (
    <span className={className} style={{ cursor: 'default', display: 'inline-block' }} title="Preview only — inert here">
      {label}
    </span>
  )
}
