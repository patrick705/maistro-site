import { useCallback } from 'react'
import { useClient, useEditState } from 'sanity'

const API_VERSION = '2024-01-01'

/**
 * Patches a document's draft, creating it from the published snapshot first
 * if no draft exists yet. Reads still go through `useEditState`/live queries;
 * this is the one write path the whole Kitchen tool uses, so publish/discard
 * (via useDocumentOperation elsewhere) stay working against the same draft.
 */
export function useKitchenPatch(id: string, type: string) {
  const client = useClient({ apiVersion: API_VERSION })
  const editState = useEditState(id, type)

  const patch = useCallback(
    async (fields: Record<string, unknown>) => {
      const draftId = `drafts.${id}`
      const base = editState.draft ?? editState.published ?? { _type: type }
      await client
        .transaction()
        .createIfNotExists({ ...base, _id: draftId, _type: type })
        .patch(draftId, (p) => p.set(fields))
        .commit({ autoGenerateArrayKeys: true })
    },
    [client, id, type, editState.draft, editState.published],
  )

  const doc = editState.draft ?? editState.published ?? null

  return { patch, doc, editState }
}
