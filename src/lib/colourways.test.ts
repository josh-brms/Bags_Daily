import { describe, it, expect } from 'vitest'
import { COLOURWAYS, DEFAULT_COLOURWAY, findColourway, isLight } from './colourways'

const HEX = /^#[0-9A-Fa-f]{6}$/
const PARTS = ['body', 'handle', 'lining', 'stitch', 'accent'] as const

const luminance = (hex: string): number => {
  const n = hex.replace('#', '')
  const r = parseInt(n.slice(0, 2), 16)
  const g = parseInt(n.slice(2, 4), 16)
  const b = parseInt(n.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

describe('COLOURWAYS', () => {
  it('offers the five brand tones', () => {
    expect(COLOURWAYS.map(c => c.id)).toEqual(['clay', 'blush', 'lilac', 'butter', 'sage'])
  })

  it('has unique ids and non-empty names', () => {
    expect(new Set(COLOURWAYS.map(c => c.id)).size).toBe(COLOURWAYS.length)
    for (const c of COLOURWAYS) expect(c.name.trim()).not.toBe('')
  })

  it('defines every recolourable part as a valid hex', () => {
    for (const c of COLOURWAYS) {
      for (const part of PARTS) {
        expect(c[part], `${c.id}.${part}`).toMatch(HEX)
      }
    }
  })

  it('keeps handles darker than the body so they read as separate', () => {
    for (const c of COLOURWAYS) {
      expect(luminance(c.handle), `${c.id} handle should be darker`).toBeLessThan(
        luminance(c.body)
      )
    }
  })

  it('keeps the lining lighter than the body so the opening reads', () => {
    for (const c of COLOURWAYS) {
      expect(luminance(c.lining), `${c.id} lining should be lighter`).toBeGreaterThan(
        luminance(c.body)
      )
    }
  })

  it('uses ink stitching on the one light colourway and cream elsewhere', () => {
    // Butter is the only body light enough that cream stitching would vanish.
    const butter = findColourway('butter')
    expect(butter.stitch.toLowerCase()).toBe('#8a5a3a')

    for (const c of COLOURWAYS.filter(c => c.id !== 'butter')) {
      expect(c.stitch.toLowerCase(), `${c.id} stitch should be cream`).toBe('#faf8f6')
    }
  })
})

describe('findColourway', () => {
  it('returns the requested colourway', () => {
    expect(findColourway('sage').name).toBe('Sage')
  })

  it('falls back to the default for an unknown id', () => {
    expect(findColourway('nope')).toBe(DEFAULT_COLOURWAY)
    expect(findColourway('')).toBe(DEFAULT_COLOURWAY)
  })
})

describe('isLight', () => {
  it('classifies tones so contrast can be chosen automatically', () => {
    expect(isLight('#F2D9A0')).toBe(true)
    expect(isLight('#8A5A3A')).toBe(false)
  })
})
