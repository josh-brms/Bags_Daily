/**
 * Reading environment variables safely.
 *
 * This exists because a copy-paste from a dashboard or from `.env.example`
 * produced a real, hard-to-diagnose failure: a Supabase key that had been copied
 * with its surrounding `<…>` still attached. Supabase returned "Invalid API
 * key", which points nowhere near the cause.
 *
 * So values are cleaned up on the way in, and obvious example text is rejected
 * outright so it reports as "not configured" rather than as a server error.
 */

const PLACEHOLDER_VALUES = new Set([
  'anon public key',
  'your-domain.example',
  'example.com',
  'your-handle',
  'project-ref',
  'changeme',
  'todo',
  'none'
])

/**
 * Trims, then removes one layer of surrounding angle brackets or matching
 * quotes. Angle brackets are stripped rather than rejected because they are a
 * common dashboard copy-paste artifact — but stripping happens *before* the
 * placeholder check, so genuine example text is still caught afterwards.
 */
export function envValue(raw: string | undefined): string {
  const trimmed = (raw ?? '').trim()
  if (trimmed.length < 2) return ''

  const first = trimmed[0]
  const last = trimmed[trimmed.length - 1]

  if ((first === '<' && last === '>') || (first === '"' && last === '"') || (first === "'" && last === "'")) {
    return trimmed.slice(1, -1).trim()
  }

  return trimmed
}

/** True for example text that was never meant to be a real value. */
export function isPlaceholder(value: string): boolean {
  const v = value.trim().toLowerCase()
  if (!v) return true
  if (v.includes('<') || v.includes('>')) return true
  if (PLACEHOLDER_VALUES.has(v)) return true
  // A path that still contains its example folder has not been filled in.
  return v.includes('your-project') || v.includes('your-repo')
}

/** A value that is present, clean, and not example text. */
export function usableValue(raw: string | undefined): string {
  const value = envValue(raw)
  return isPlaceholder(value) ? '' : value
}
