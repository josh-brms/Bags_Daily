import { describe, it, expect } from 'vitest'
import { peso } from './peso'

describe('peso', () => {
  it('formats thousands with the peso sign', () => {
    expect(peso(1000)).toBe('\u20B11,000')
  })

  it('formats sub-thousand prices', () => {
    expect(peso(850)).toBe('\u20B1850')
  })

  it('formats the highest price point', () => {
    expect(peso(1450)).toBe('\u20B11,450')
  })
})
