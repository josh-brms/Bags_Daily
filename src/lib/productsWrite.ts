/**
 * Writes and image uploads, via the Supabase SDK.
 *
 * Only the admin imports this, and the admin route is lazy-loaded — so the SDK
 * never reaches a visitor who just wants to look at bags. Reads go through
 * productsRead.ts instead, which is plain fetch.
 *
 * Every write is authorised by Row Level Security: these calls are made with the
 * signed-in user's token, and Postgres rejects them if the session is missing.
 * Verified against the live project — an anonymous insert comes back
 * 42501 "new row violates row-level security policy".
 */
import { supabase, configured, BUCKET } from '@/lib/supabase'
import { validateProduct, toProduct, type Product } from './products'

const COLUMNS = 'id,name,brand,price,description,gallery,is_posted,created_at'

type Result<T> = { ok: true; data: T } | { ok: false; error: string }

const unavailable = (): Result<never> => ({
  ok: false,
  error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
})

const message = (e: { message?: string } | null, fallback: string): string =>
  e?.message ? `${fallback} (${e.message})` : fallback

/**
 * The app's field names differ from the column names on three fields, so both
 * shapes are written in one place rather than at each call site.
 */
const toRow = (p: Omit<Product, 'id' | 'isPosted'>) => ({
  name: p.name,
  brand: p.brand,
  price: p.price,
  description: p.description,
  gallery: p.images
})

export async function createProduct(draft: Omit<Product, 'id' | 'isPosted'>): Promise<Result<Product>> {
  const db = supabase()
  if (!db) return unavailable()

  const errors = validateProduct(draft)
  if (errors.length) return { ok: false, error: errors.join('; ') }

  const { data, error } = await db
    .from('products')
    .insert({
      // The id is a uuid and the table's default is not something this app should
      // depend on, so it is generated here. updateProduct matches on the same value.
      id: crypto.randomUUID(),
      ...toRow(draft),
      is_posted: true,
      sort_order: 0
    })
    .select(COLUMNS)
    .single()

  if (error) return { ok: false, error: message(error, 'Could not add that product.') }
  return { ok: true, data: toProduct(data as Record<string, unknown>) }
}

export async function updateProduct(product: Product): Promise<Result<Product>> {
  const db = supabase()
  if (!db) return unavailable()

  const errors = validateProduct(product)
  if (errors.length) return { ok: false, error: errors.join('; ') }

  const { data, error } = await db
    .from('products')
    .update({ ...toRow(product), is_posted: product.isPosted })
    .eq('id', product.id)
    .select(COLUMNS)
    .single()

  if (error) return { ok: false, error: message(error, 'Could not save that product.') }
  return { ok: true, data: toProduct(data as Record<string, unknown>) }
}

export async function deleteProduct(id: string): Promise<Result<string>> {
  const db = supabase()
  if (!db) return unavailable()

  const { error } = await db.from('products').delete().eq('id', id)
  if (error) return { ok: false, error: message(error, 'Could not remove that product.') }
  return { ok: true, data: id }
}

/**
 * Uploads already-resized image bytes and returns the public URL to store on the
 * product. Caller is responsible for resizing first — see admin/imageResize.
 */
export async function uploadProductImage(
  filename: string,
  bytes: Uint8Array
): Promise<Result<string>> {
  const db = supabase()
  if (!db) return unavailable()

  // Timestamp prefix keeps uploads from colliding across sessions.
  const path = `${Date.now()}-${filename}`

  const { error } = await db.storage.from(BUCKET).upload(path, bytes, {
    contentType: 'image/jpeg',
    cacheControl: '31536000',
    upsert: false
  })

  if (error) return { ok: false, error: message(error, 'Could not upload that image.') }

  const { data } = db.storage.from(BUCKET).getPublicUrl(path)
  return { ok: true, data: data.publicUrl }
}

export { configured }
