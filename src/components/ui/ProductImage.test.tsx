import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ProductImage from './ProductImage'
import { IMAGE_VARIANTS } from '@/data/imageVariants'

const known = Object.keys(IMAGE_VARIANTS)[0]
const unknown = 'images/not-generated.jpg'

describe('ProductImage', () => {
  it('emits avif and webp sources for a generated image', () => {
    const { container } = render(<ProductImage src={known} alt="A bag" />)
    const types = [...container.querySelectorAll('source')].map(s => s.getAttribute('type'))
    expect(types).toContain('image/avif')
    expect(types).toContain('image/webp')
  })

  it('describes candidates with width descriptors', () => {
    const { container } = render(<ProductImage src={known} alt="A bag" />)
    const avif = container.querySelector('source[type="image/avif"]')
    expect(avif?.getAttribute('srcset')).toMatch(/\d+w/)
  })

  it('passes sizes through so the browser can pick a candidate', () => {
    const { container } = render(
      <ProductImage src={known} alt="A bag" sizes="(min-width: 1024px) 30vw" />
    )
    expect(container.querySelector('source')?.getAttribute('sizes')).toBe('(min-width: 1024px) 30vw')
  })

  it('falls back to a plain img for an image with no generated variants', () => {
    // This is the failure mode of a generated srcset: a new upload has no variants
    // and must not point at files that do not exist.
    const { container } = render(<ProductImage src={unknown} alt="A bag" />)
    expect(container.querySelector('picture')).toBeNull()
    expect(container.querySelector('img')?.getAttribute('src')).toContain('not-generated.jpg')
  })

  it('always renders the alt text', () => {
    const { container } = render(<ProductImage src={known} alt="A woven carryall" />)
    expect(container.querySelector('img')?.getAttribute('alt')).toBe('A woven carryall')
  })
})
