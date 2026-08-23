import { useRef } from 'react'

/**
 * Native HTML5 drag-and-drop reorder for a flat list, keyed by `_key`.
 * Shared by the page-block stack and every array-of-sub-object field editor.
 */
export function useDragReorder<T extends { _key: string }>(items: T[], setItems: (next: T[]) => void) {
  const dragKey = useRef<string | null>(null)

  function dragHandlers(key: string) {
    return {
      draggable: true,
      onDragStart: () => {
        dragKey.current = key
      },
      onDragOver: (e: React.DragEvent) => e.preventDefault(),
      onDrop: () => {
        const from = dragKey.current
        if (!from || from === key) return
        const next = [...items]
        const fromIdx = next.findIndex((i) => i._key === from)
        const toIdx = next.findIndex((i) => i._key === key)
        if (fromIdx === -1 || toIdx === -1) return
        const [moved] = next.splice(fromIdx, 1)
        next.splice(toIdx, 0, moved)
        setItems(next)
        dragKey.current = null
      },
    }
  }

  return { dragHandlers }
}
