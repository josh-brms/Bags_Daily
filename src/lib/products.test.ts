import { describe, it, expect } from 'vitest'
import {
  validateProduct,
  toProduct,
  formatPrice,
  MAX_PRODUCT_IMAGES,
  PENDING_PREFIX,
  type Product
} from './products'

const valid: Omit<Product, 'id'> = {
  name: 'Coach City Tote',
  brand: 'Coach',
  price: 2200,
  images: ['https://cdn.test/a.jpg'],
  description: '',
  isPosted: true
}

/** A row shaped exactly like the live table, which is the thing worth protecting. */
const row = (over: Record<string, unknown> = {}) => ({
  id: '0677e4b2-a718-4164-a98a-9ac63ff05d29',
  name: 'Coach Carmen',
  brand: 'Coach',
  price: 1500,
  description: '',
  image_url: 'https://cdn.test/a.jpg',
  is_posted: true,
  sort_order: 0,
  created_at: '2026-08-13T13:33:01.996284+00:00',
  gallery: ['https://cdn.test/a.jpg', 'https://cdn.test/b.jpg'],
  ...over
})

describe('toProduct', () => {
  it('maps the live row shape, uuid id and gallery included', () => {
    const p = toProduct(row())
    expect(p.id).toBe('0677e4b2-a718-4164-a98a-9ac63ff05d29')
    expect(p.images).toEqual(['https://cdn.test/a.jpg', 'https://cdn.test/b.jpg'])
    expect(p.brand).toBe('Coach')
    expect(p.price).toBe(1500)
    expect(p.isPosted).toBe(true)
  })

  it('keeps the id a string, because Number() on a uuid is NaN', () => {
    // This is the bug that broke routing: a numeric id silently produced NaN and
    // every route lookup failed while the grid still rendered.
    expect(Number(toProduct(row()).id)).toBeNaN()
  })

  it('ignores the redundant image_url, which always duplicates gallery[0]', () => {
    const p = toProduct(row({ image_url: 'https://cdn.test/other.jpg' }))
    expect(p.images).toEqual(['https://cdn.test/a.jpg', 'https://cdn.test/b.jpg'])
  })

  it('reads gallery, not a column named images', () => {
    expect(toProduct(row({ images: ['nope.jpg'] })).images).not.toContain('nope.jpg')
  })

  it('yields an empty array rather than undefined when gallery is missing', () => {
    expect(toProduct({ ...row(), gallery: null }).images).toEqual([])
  })

  it('coerces a non-string entry, so a number cannot reach an <img src>', () => {
    expect(toProduct(row({ gallery: [7] })).images).toEqual(['7'])
  })

  it('treats anything other than an explicit false as posted', () => {
    expect(toProduct(row({ is_posted: false })).isPosted).toBe(false)
    expect(toProduct(row({ is_posted: null })).isPosted).toBe(true)
  })
})

describe('validateProduct', () => {
  it('accepts a live-shaped product, empty description and all', () => {
    expect(validateProduct(valid)).toEqual([])
  })

  it('does not require a description, because no product in the catalogue has one', () => {
    expect(validateProduct({ ...valid, description: '' })).toEqual([])
    expect(validateProduct({ ...valid, description: undefined })).toEqual([])
  })

  it('requires a name', () => {
    expect(validateProduct({ ...valid, name: '  ' })).toContain('name is required')
    expect(validateProduct({ ...valid, name: 'x'.repeat(81) })[0]).toMatch(/80 characters/)
  })

  it('accepts a full Storage URL for an image', () => {
    const res = validateProduct({
      ...valid,
      images: ['https://projectref.supabase.co/storage/v1/object/public/product-images/x.jpg']
    })
    expect(res).toEqual([])
  })

  it('accepts any https image URL', () => {
    expect(validateProduct({ ...valid, images: ['https://cdn.example.com/a.jpg'] })).toEqual([])
  })

  it('accepts a large gallery, up to the real ceiling of 38 photos', () => {
    // The cap has to clear the widest product that is already published, or the
    // studio could not save their own catalogue.
    const widest = 38
    expect(widest).toBeLessThan(MAX_PRODUCT_IMAGES)
    const images = Array.from({ length: widest }, (_, i) => `https://cdn.test/${i}.jpg`)
    expect(validateProduct({ ...valid, images })).toEqual([])
  })

  it('rejects an http image URL, since the site is https', () => {
    expect(validateProduct({ ...valid, images: ['http://cdn.example.com/a.jpg'] })[0]).toMatch(
      /image/
    )
  })

  it('rejects a path that tries to escape public/', () => {
    expect(validateProduct({ ...valid, images: ['/etc/passwd'] })[0]).toMatch(/image/)
    expect(validateProduct({ ...valid, images: ['../../secrets.jpg'] })[0]).toMatch(/image/)
  })

  it('requires at least one image, and caps the count', () => {
    expect(validateProduct({ ...valid, images: [] })).toContain('at least one image is required')
    const tooMany = Array.from({ length: MAX_PRODUCT_IMAGES + 1 }, (_, i) => `images/x${i}.jpg`)
    expect(validateProduct({ ...valid, images: tooMany })[0]).toMatch(
      new RegExp(`no more than ${MAX_PRODUCT_IMAGES}`)
    )
  })

  it('accepts a still-pending upload, so a new product saves before it has URLs', () => {
    expect(validateProduct({ ...valid, images: [`${PENDING_PREFIX}carryall.jpg`] })).toEqual([])
  })

  it('rejects a bad URL even when a pending upload sits alongside it', () => {
    expect(
      validateProduct({ ...valid, images: [`${PENDING_PREFIX}a.jpg`, 'http://x.test/a.jpg'] })
    ).toContain('each image must be an uploaded photo or a path like images/x.jpg')
  })

  it('rejects a price that is not a real, non-negative number', () => {
    // e.target.valueAsNumber is NaN when the field is cleared mid-edit, and that
    // must not be silently stored as 0.
    expect(validateProduct({ ...valid, price: NaN })).toContain('price must be a number')
    expect(validateProduct({ ...valid, price: -1 })).toContain('price cannot be negative')
  })

  it('reports every problem at once', () => {
    const errors = validateProduct({ name: '', images: [], price: NaN })
    expect(errors.length).toBe(3)
  })
})

describe('formatPrice', () => {
  it('renders whole pesos, which is how the catalogue stores them', () => {
    expect(formatPrice(1500)).toMatch(/1,?500/)
    expect(formatPrice(0)).toMatch(/0/)
  })
})
