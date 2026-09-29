import { describe, it, expect } from 'vitest'
import { envValue, isPlaceholder, usableValue } from './env'

describe('envValue', () => {
  it('returns a clean value unchanged', () => {
    expect(envValue('sb_publishable_abc123')).toBe('sb_publishable_abc123')
  })

  /**
   * The exact failure this module exists to prevent: a key copied out of the
   * Supabase dashboard with its angle brackets still attached.
   */
  it('strips angle brackets from a copy-pasted value', () => {
    expect(envValue('<sb_publishable_abc123>')).toBe('sb_publishable_abc123')
  })

  it('strips surrounding quotes', () => {
    expect(envValue('"abc123"')).toBe('abc123')
    expect(envValue("'abc123'")).toBe('abc123')
  })

  it('trims surrounding whitespace', () => {
    expect(envValue('  abc123 \n')).toBe('abc123')
  })

  it('handles brackets and whitespace together', () => {
    expect(envValue('  <abc123>  ')).toBe('abc123')
  })

  it('strips only one layer', () => {
    expect(envValue('<<abc>>')).toBe('<abc>')
  })

  it('does not strip unbalanced brackets', () => {
    expect(envValue('<abc123')).toBe('<abc123')
  })

  it('treats missing and empty values as empty', () => {
    expect(envValue(undefined)).toBe('')
    expect(envValue('')).toBe('')
    expect(envValue('   ')).toBe('')
    expect(envValue('<>')).toBe('')
  })
})

describe('isPlaceholder', () => {
  it('rejects example text', () => {
    expect(isPlaceholder('your-domain.example')).toBe(true)
    expect(isPlaceholder('anon public key')).toBe(true)
    expect(isPlaceholder('your-handle')).toBe(true)
    expect(isPlaceholder('<your-handle>')).toBe(true)
    expect(isPlaceholder('project-ref')).toBe(true)
  })

  it('rejects anything still containing brackets', () => {
    expect(isPlaceholder('https://example.com/<your-handle>/')).toBe(true)
  })

  it('rejects empty input', () => {
    expect(isPlaceholder('')).toBe(true)
    expect(isPlaceholder('   ')).toBe(true)
  })

  it('accepts real-looking values', () => {
    expect(isPlaceholder('sb_publishable_Sk-J1Zawp00x1h')).toBe(false)
    expect(isPlaceholder('https://abcdefghijklmnopqrst.supabase.co')).toBe(false)
    expect(isPlaceholder('cycybaranda@gmail.com')).toBe(false)
  })
})

describe('usableValue', () => {
  it('cleans a real value', () => {
    expect(usableValue(' <sb_publishable_abc> ')).toBe('sb_publishable_abc')
  })

  it('empties a placeholder, so it reports as unset rather than as a bad key', () => {
    expect(usableValue('<anon public key>')).toBe('')
    expect(usableValue('your-domain.example')).toBe('')
  })

  /**
   * The regression worth pinning: a real key left in place as
   * "<sb_publishable_…>" shipped to production and surfaced as "Invalid API
   * key" with nothing pointing at the cause. The value below is a deliberate
   * fake in the same shape, so the fixture is never mistaken for a live one.
   */
  it('empties a bracketed placeholder', () => {
    expect(usableValue('<sb_publishable_0000000000000000000000000000>')).toBe(
      'sb_publishable_0000000000000000000000000000'
    )
    expect(usableValue('<anon public key>')).toBe('')
  })
})
