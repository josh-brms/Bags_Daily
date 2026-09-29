import { useCallback, useEffect, useState } from 'react'
import { fetchProducts, configured } from '@/lib/productsRead'
import type { Product } from '@/lib/products'

export interface ProductsState {
  products: Product[]
  loading: boolean
  error: string | null
  /** True when Supabase is not configured at all, as opposed to a failed fetch. */
  unconfigured: boolean
  reload: () => void
}

/**
 * Loads the catalogue from Supabase.
 *
 * An empty catalogue is a legitimate state, not an error, so an empty array and
 * a failure are reported separately — otherwise the page cannot tell "nothing
 * published yet" from "the database is down".
 */
export function useProducts(): ProductsState {
  // When Supabase is absent there is nothing to wait for, so the initial state
  // is decided during initialisation rather than by an effect.
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(configured)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    if (!configured) return

    let cancelled = false
    // Await first so no setState lands synchronously in the effect body.
    void (async () => {
      const res = await fetchProducts()
      if (cancelled) return
      if (res.ok) {
        setProducts(res.data)
        setError(null)
      } else {
        setProducts([])
        setError(res.error)
      }
      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [nonce])

  const reload = useCallback(() => setNonce(n => n + 1), [])

  return { products, loading, error, unconfigured: !configured, reload }
}
