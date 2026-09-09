import { describe, it, expect } from 'vitest'
import { sortProducts } from './sort'
import { PRODUCTS } from '@/data/products'

describe('sortProducts', () => {
  it('featured preserves the collection order', () => {
    const result = sortProducts(PRODUCTS, 'featured')
    expect(result.map(p => p.id)).toEqual(PRODUCTS.map(p => p.id))
  })

  it('price-asc orders from cheapest', () => {
    const result = sortProducts(PRODUCTS, 'price-asc')
    for (let i = 1; i < result.length; i++) {
      expect(result[i].price).toBeGreaterThanOrEqual(result[i - 1].price)
    }
  })

  it('price-desc orders from most expensive', () => {
    const result = sortProducts(PRODUCTS, 'price-desc')
    for (let i = 1; i < result.length; i++) {
      expect(result[i].price).toBeLessThanOrEqual(result[i - 1].price)
    }
  })

  it('never mutates the source array', () => {
    const before = PRODUCTS.map(p => p.id).join()
    sortProducts(PRODUCTS, 'price-asc')
    expect(PRODUCTS.map(p => p.id).join()).toBe(before)
  })
})
