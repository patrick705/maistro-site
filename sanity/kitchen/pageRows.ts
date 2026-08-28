export function randomPageId() {
  return 'page-' + Math.random().toString(36).slice(2, 10)
}

/**
 * A page can exist as a published doc, a draft-only doc (never published), or
 * both at once (a published page with pending edits) — Sanity returns up to
 * two rows per page in that last case. Groups down to one row per page,
 * preferring the published copy for display and as the write target, so a
 * toggle/reorder/patch affects what's actually live rather than an
 * unpublished draft. Shared by the Sidebar's page list and Settings →
 * Navigation's page list.
 */
export function groupPages<T extends { _id: string }>(rows: T[]): (Omit<T, '_id'> & { id: string; isDraft: boolean })[] {
  const byBase = new Map<string, { published?: T; draft?: T }>()
  for (const row of rows) {
    const isDraft = row._id.startsWith('drafts.')
    const baseId = isDraft ? row._id.slice('drafts.'.length) : row._id
    const entry = byBase.get(baseId) ?? {}
    if (isDraft) entry.draft = row
    else entry.published = row
    byBase.set(baseId, entry)
  }
  return Array.from(byBase.values()).map(({ published, draft }) => {
    const src = (published ?? draft)!
    const { _id: _omit, ...rest } = src
    return { ...rest, id: (published ?? draft)!._id, isDraft: !published }
  })
}
