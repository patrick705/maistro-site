'use client'

import { useDemoModal } from '@/lib/demo-modal-context'

export function BookDemoButton({
  label,
  className,
  as = 'a',
}: {
  label: string
  className?: string
  as?: 'a' | 'button'
}) {
  const { open } = useDemoModal()

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
