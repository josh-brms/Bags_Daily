import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PRODUCTS, relatedProducts } from './products'

const publicDir = join(__dirname, '../../public')

describe('PRODUCTS', () => {
  it('has exactly 12 products with unique ids', () => {
    expect(PRODUCTS).toHaveLength(12)
    const ids = PRODUCTS.map(p => p.id)
    expect(new Set(ids).size).toBe(12)
  })

  it('every product image exists in public/', () => {
    for (const p of PRODUCTS) {
      expect(() => readFileSync(join(publicDir, p.image))).not.toThrow()
    }
  })

  it('prices are valid Philippine peso amounts', () => {
    for (const p of PRODUCTS) {
      expect(p.price).toBeGreaterThanOrEqual(850)
      expect(p.price).toBeLessThanOrEqual(1500)
      expect(Number.isInteger(p.price)).toBe(true)
    }
  })

  it('every product has S/M/L sizes and 4 colours', () => {
    for (const p of PRODUCTS) {
      expect(p.sizes).toEqual(['S', 'M', 'L'])
      expect(p.colors).toHaveLength(4)
    }
  })

  it('descriptions avoid unverifiable claims', () => {
    for (const p of PRODUCTS) {
      expect(p.description.toLowerCase()).not.toMatch(/last for years|guaranteed|lifetime/)
    }
  })
})

describe('relatedProducts', () => {
  it('returns 3 distinct products that differ from the given one', () => {
    const related = relatedProducts(PRODUCTS[0])
    expect(related).toHaveLength(3)
    expect(related.map(p => p.id)).not.toContain(PRODUCTS[0].id)
    expect(new Set(related.map(p => p.id)).size).toBe(3)
  })
})
