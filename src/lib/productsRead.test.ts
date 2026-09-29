import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })

/** productsRead reads env at module load, so each case re-imports it fresh. */
async function load(env: Record<string, string | undefined>) {
  vi.resetModules()
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined) vi.stubEnv(k, '')
    else vi.stubEnv(k, v)
  }
  return import('./productsRead')
}

const CONFIGURED = {
  VITE_SUPABASE_URL: 'https://project.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'anon-key'
}

describe('fetchProducts', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('makes no request at all when Supabase is not configured', async () => {
    const { fetchProducts, configured } = await load({
      VITE_SUPABASE_URL: undefined,
      VITE_SUPABASE_ANON_KEY: undefined
    })

    expect(configured).toBe(false)
    const res = await fetchProducts()
    expect(res.ok).toBe(false)
    expect(fetch).not.toHaveBeenCalled()
    if (!res.ok) expect(res.error).toMatch(/VITE_SUPABASE_URL/)
  })

  it('requests the products table with the anon key', async () => {
    const { fetchProducts } = await load(CONFIGURED)
    vi.mocked(fetch).mockResolvedValue(json([]))

    await fetchProducts()

    const [url, init] = vi.mocked(fetch).mock.calls[0]
    expect(String(url)).toContain('/rest/v1/products')
    // The live column names. `gallery` holds the photos and there is no
    // `instagram` column at all.
    expect(String(url)).toContain('select=id,name,brand,price,description,gallery,is_posted,created_at')
    // created_at, not id: id is a uuid so ordering by it is random, and
    // sort_order is 0 on every row.
    expect(String(url)).toContain('order=created_at.asc')
    // Drafts stay in the admin.
    expect(String(url)).toContain('is_posted=eq.true')
    expect((init?.headers as Record<string, string>).apikey).toBe('anon-key')
  })

  it('maps a real row to the Product shape and drops the rest', async () => {
    const { fetchProducts } = await load(CONFIGURED)
    vi.mocked(fetch).mockResolvedValue(
      json([
        {
          id: '0677e4b2-a718-4164-a98a-9ac63ff05d29',
          name: 'Coach Carmen',
          brand: 'Coach',
          price: 1500,
          description: '',
          image_url: 'https://cdn.test/a.jpg',
          is_posted: true,
          sort_order: 0,
          created_at: '2026-08-13T13:33:01.996284+00:00',
          gallery: ['https://cdn.test/a.jpg', 'https://cdn.test/b.jpg']
        }
      ])
    )

    const res = await fetchProducts()
    expect(res.ok).toBe(true)
    if (!res.ok) return

    expect(res.data).toEqual([
      {
        id: '0677e4b2-a718-4164-a98a-9ac63ff05d29',
        name: 'Coach Carmen',
        brand: 'Coach',
        price: 1500,
        description: '',
        images: ['https://cdn.test/a.jpg', 'https://cdn.test/b.jpg'],
        isPosted: true
      }
    ])
    // created_at, image_url and sort_order are read for ordering only.
    expect(res.data[0]).not.toHaveProperty('image_url')
    expect(res.data[0]).not.toHaveProperty('sort_order')
  })

  it('treats an empty table as a valid empty catalogue, not an error', async () => {
    const { fetchProducts } = await load(CONFIGURED)
    vi.mocked(fetch).mockResolvedValue(json([]))

    const res = await fetchProducts()
    expect(res).toEqual({ ok: true, data: [] })
  })

  it('turns a 404 into an actionable hint about the missing table', async () => {
    const { fetchProducts } = await load(CONFIGURED)
    vi.mocked(fetch).mockResolvedValue(json({}, 404))

    const res = await fetchProducts()
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toMatch(/products table was not found/)
  })

  it('names the expected columns on a 400, rather than leaking a Postgres message', async () => {
    // Postgres reports a missing column as 400/42703, which is what a table
    // predating this code looks like. The raw message is unreadable in a browser.
    const { fetchProducts } = await load(CONFIGURED)
    vi.mocked(fetch).mockResolvedValue(
      json({ code: '42703', message: 'column products.gallery does not exist' }, 400)
    )

    const res = await fetchProducts()
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.error).toContain('gallery')
      expect(res.error).not.toMatch(/42703/)
    }
  })

  it('reports a network failure without throwing', async () => {
    const { fetchProducts } = await load(CONFIGURED)
    vi.mocked(fetch).mockRejectedValue(new TypeError('Failed to fetch'))

    const res = await fetchProducts()
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toMatch(/connection/i)
  })

  it('coerces a null body to an empty catalogue', async () => {
    const { fetchProducts } = await load(CONFIGURED)
    vi.mocked(fetch).mockResolvedValue(json(null))

    const res = await fetchProducts()
    expect(res).toEqual({ ok: true, data: [] })
  })
})
