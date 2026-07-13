/**
 * Shallow-merges a possibly-partial Sanity document over a fully-populated
 * default object, one level deep for the given nested object keys. Lets
 * editors fill in only some fields in the Studio without the rest of the
 * page falling back to blank.
 */
export function mergeDefined<T extends object>(
  base: T,
  patch: Partial<T> | null | undefined,
  nestedKeys: (keyof T)[] = [],
): T {
  if (!patch) return base
  const result: T = { ...base }
  for (const key of Object.keys(patch) as (keyof T)[]) {
    const value = patch[key]
    if (value === undefined || value === null) continue
    if (nestedKeys.includes(key) && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = { ...(base[key] as object), ...(value as object) } as T[keyof T]
    } else {
      result[key] = value as T[keyof T]
    }
  }
  return result
}
