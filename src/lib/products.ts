/**
 * The Product shape and its validation rules.
 *
 * This mirrors the live `products` table, which was created outside this repo and
 * looks like this:
 *
 *   id          uuid primary key
 *   name        text
 *   brand       text
 *   price       numeric
 *   description text        (empty on every row today)
 *   image_url   text        (always equal to gallery[0] — a redundant cover)
 *   gallery     text[]      the photos, in order; up to 38 on a single product
 *   is_posted   boolean     (true on every row today)
 *   sort_order  integer     (0 on every row today, so ordering is by created_at)
 *   created_at  timestamptz
 *
 * Two consequences worth knowing before editing this file:
 *  - `id` is a uuid, not a sequence. `Number(row.id)` is NaN, which silently
 *    breaks routing and React keys.
 *  - there is no `instagram` column, so the site's only call to action is the
 *    profile URL in data/site.ts rather than a per-product post.
 *
 * Deliberately dependency-free: the storefront imports this, and so does the
 * admin. Keeping the Supabase SDK out of this module is what stops ~58 KB
 * gzipped of client library reaching every visitor — reads go through
 * productsRead.ts (plain fetch) and writes through productsWrite.ts (SDK, loaded
 * lazily on /admin only).
 */

export interface Product {
  id: string
  name: string
  brand: string
  price: number
  description: string
  /** Photos in display order. Never empty — every live row has at least 4. */
  images: string[]
  /** False means drafted in the admin and hidden from the storefront. */
  isPosted: boolean
}

/**
 * Ceiling on photos per product.
 *
 * 40 rather than a rounder number because the real ceiling in the data is 38:
 * anything lower would reject products the studio has already published.
 */
export const MAX_PRODUCT_IMAGES = 40

/**
 * How the admin spells an image it has read and re-encoded but not yet uploaded.
 *
 * It is stripped on submit and never reaches the database. validateProduct skips
 * it so a brand-new product is valid before its first upload has landed, which
 * means the editor can validate exactly the array it is about to send.
 */
export const PENDING_PREFIX = 'pending:'

const isPending = (value: unknown): boolean =>
  typeof value === 'string' && value.startsWith(PENDING_PREFIX)

/** Either a Supabase Storage URL or a repo path under public/images. */
const isImageSource = (value: string): boolean =>
  /^images\/.+\.(jpg|jpeg|png|webp|avif)$/i.test(value) || /^https:\/\/.+/.test(value)

/** Whole pesos read better than ₱1,500.00 on a product grid. */
const pesos = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0
})

export const formatPrice = (value: number): string => pesos.format(value)

/**
 * Narrows a database row to the shape the UI expects, discarding extras.
 *
 * Shared by the REST read path and the SDK write path so the two cannot drift.
 * Every field is coerced rather than trusted: `gallery` arrives as whatever
 * PostgREST decided to send for a text[] column, and one null there would
 * otherwise take down the whole grid.
 */
export function toProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    brand: String(row.brand ?? ''),
    price: Number(row.price ?? 0),
    description: String(row.description ?? ''),
    images: Array.isArray(row.gallery) ? row.gallery.map(String) : [],
    isPosted: row.is_posted !== false
  }
}

/** Returns human-readable problems; an empty array means valid. */
export function validateProduct(input: Partial<Product>): string[] {
  const errors: string[] = []

  if (typeof input.name !== 'string' || input.name.trim() === '') errors.push('name is required')
  else if (input.name.trim().length > 80) errors.push('name must be 80 characters or fewer')

  // The description is deliberately optional. Every one of the 29 live products
  // has an empty one, so requiring it would mean the studio cannot edit a
  // product at all until they wrote copy for all of them.
  if (input.description && input.description.length > 500) {
    errors.push('description must be 500 characters or fewer')
  }

  if (typeof input.price !== 'number' || !Number.isFinite(input.price)) {
    errors.push('price must be a number')
  } else if (input.price < 0) {
    errors.push('price cannot be negative')
  }

  const images = input.images ?? []
  if (images.length === 0) errors.push('at least one image is required')
  else if (images.length > MAX_PRODUCT_IMAGES) {
    errors.push(`no more than ${MAX_PRODUCT_IMAGES} images`)
  } else if (
    // Counted, but not shape-checked: a pending file is one this browser has
    // already decoded, so it is known-good by construction.
    !images.filter(img => !isPending(img)).every(img => typeof img === 'string' && isImageSource(img))
  ) {
    errors.push('each image must be an uploaded photo or a path like images/x.jpg')
  }

  return errors
}
