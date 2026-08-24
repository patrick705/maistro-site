import { useCallback } from 'react'
import { useClient, useEditState } from 'sanity'
import type { Patch } from '@sanity/client'

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

  // Shared by `patch` and `rawPatch` below — the only difference is what
  // operation runs against the draft once it's guaranteed to exist.
  const withDraft = useCallback(
    async (build: (p: Patch) => Patch) => {
      const draftId = `drafts.${id}`
      const base = editState.draft ?? editState.published ?? { _type: type }
      await client
        .transaction()
        .createIfNotExists({ ...base, _id: draftId, _type: type })
        .patch(draftId, build)
        .commit({ autoGenerateArrayKeys: true })
    },
    [client, id, type, editState.draft, editState.published],
  )

  const patch = useCallback((fields: Record<string, unknown>) => withDraft((p) => p.set(fields)), [withDraft])

  // For editing one item inside an array field (e.g. a single page block) by
  // its `_key` rather than replacing the whole array from a client-side copy.
  // `patch({blocks: next})` sends the *entire* array as this browser tab last
  // saw it — if that copy is stale (another tab/session changed the document
  // in the meantime), the stale save silently wipes out every block it
  // doesn't know about. A keyed set/insert/unset only ever touches the one
  // item named in the selector, so a stale local copy can no longer delete
  // content it simply hasn't seen yet.
  const rawPatch = useCallback((build: (p: Patch) => Patch) => withDraft(build), [withDraft])

  const doc = editState.draft ?? editState.published ?? null

  return { patch, rawPatch, doc, editState }
}
