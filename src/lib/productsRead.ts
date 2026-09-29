/**
 * Read access to the catalogue over Supabase's REST endpoint (PostgREST).
 *
 * Why not just use the Supabase SDK for this? Because the storefront only reads,
 * and the SDK is ~58 KB gzipped — a quarter of the main bundle — for every
 * visitor who will never sign in or write. A plain fetch costs a few hundred
 * bytes. The SDK is still used for auth, writes and uploads, but only the admin
 * loads it (see productsWrite.ts, which is pulled in lazily).
 *
 * The anon key here is public by design. Reads are permitted to anonymous callers
 * by Row Level Security, so this request is exactly what an unauthenticated
 * visitor is entitled to.
 */
import { toProduct, type Product } from './products'
import { usableValue } from './env'

const URL = usableValue(import.meta.env.VITE_SUPABASE_URL)
const ANON_KEY = usableValue(import.meta.env.VITE_SUPABASE_ANON_KEY)

export const configured = Boolean(URL && ANON_KEY)

const COLUMNS = 'id,name,brand,price,description,gallery,is_posted,created_at'

/**
 * `is_posted=eq.true` keeps drafts out of the storefront, and `created_at` is the
 * only usable sort key: `id` is a uuid, so ordering by it is effectively random,
 * and `sort_order` is 0 on every row.
 */
const QUERY = `select=${COLUMNS}&is_posted=eq.true&order=created_at.asc`

export async function fetchProducts(): Promise<
  { ok: true; data: Product[] } | { ok: false; error: string }
> {
  if (!configured) {
    return {
      ok: false,
      error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    }
  }

  try {
    const res = await fetch(`${URL}/rest/v1/products?${QUERY}`, {
      headers: {
        apikey: ANON_KEY as string,
        Authorization: `Bearer ${ANON_KEY}`,
        Accept: 'application/json'
      }
    })

    if (!res.ok) {
      return {
        ok: false,
        error:
          res.status === 404
            ? 'The products table was not found.'
            : // Postgres reports a missing column as a 400, and the usual cause is
              // a table that predates this code. Naming the expected columns turns
              // a blank page into an actionable message.
              res.status === 400
              ? `The products table does not match what the site expects. It needs: ${COLUMNS.replace(
                  /created_at$/,
                  ''
                )}. Check the table in Supabase.`
              : `Could not load the catalogue (${res.status}).`
      }
    }

    const rows = (await res.json()) as Array<Record<string, unknown>> | null

    return {
      ok: true,
      // A null body is not an error; it just means nothing is published yet.
      data: (rows ?? []).map(toProduct)
    }
  } catch {
    return { ok: false, error: 'Could not reach the catalogue. Check your connection.' }
  }
}
