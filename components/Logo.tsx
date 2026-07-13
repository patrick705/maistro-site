import styles from './Logo.module.css'

function splitAi(name: string) {
  const idx = name.toLowerCase().indexOf('ai')
  if (idx === -1) return { before: name, ai: '', after: '' }
  return { before: name.slice(0, idx), ai: name.slice(idx, idx + 2), after: name.slice(idx + 2) }
}

export function Logo({ siteName, variant }: { siteName: string; variant: 'header' | 'footer' }) {
  const { before, ai, after } = splitAi(siteName)
  return (
    <span className={variant === 'header' ? styles.header : styles.footer}>
      {before}
      {ai && <span className={variant === 'header' ? styles.aiHeader : styles.aiFooter}>{ai}</span>}
      {after}
    </span>
  )
}
