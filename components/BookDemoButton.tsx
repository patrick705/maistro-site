'use client'

import { useDemoModal } from '@/lib/demo-modal-context'

export function BookDemoButton({
  label,
  className,
  as = 'a',
  href,
}: {
  label: string
  className?: string
  as?: 'a' | 'button'
  href?: string
}) {
  const { open } = useDemoModal()

  if (href) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    )
  }

  if (as === 'button') {
    return (
      <button type="button" className={className} onClick={open}>
        {label}
      </button>
    )
  }

  return (
    <a
      href="#"
      className={className}
      onClick={(e) => {
        e.preventDefault()
        open()
      }}
    >
      {label}
    </a>
  )
}
