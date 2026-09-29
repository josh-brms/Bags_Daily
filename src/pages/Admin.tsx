import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { toast } from 'sonner'
import { AlertTriangle, LogOut, RefreshCw, Sparkles } from 'lucide-react'
import SignIn from '@/components/admin/SignIn'
import ProductTable from '@/components/admin/ProductTable'
import ProductEditor from '@/components/admin/ProductEditor'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import LogoMark from '@/components/layout/LogoMark'
import { supabase, configured } from '@/lib/supabase'
import { fetchProducts } from '@/lib/productsRead'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
} from '@/lib/productsWrite'
import type { Product } from '@/lib/products'
import { PENDING_PREFIX } from '@/lib/products'
import type { PreparedImage } from '@/lib/admin/imageResize'

type EditorState = { open: false } | { open: true; product: Product | null }

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [reload, setReload] = useState(0)
  const [editor, setEditor] = useState<EditorState>({ open: false })

  // The session is the convenience boundary here. Writes are additionally gated
  // by Row Level Security in Postgres, so this is not the enforcement point.
  // The callback fires asynchronously on a Supabase event, not during the effect.
  useEffect(() => {
    if (!configured) return
    const { data } = supabase()!.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      if (!next) setProducts(null)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!configured || !session) return

    let cancelled = false
    // Await before any setState so this is an external-system sync, not a
    // cascading render.
    void (async () => {
      const res = await fetchProducts()
      if (cancelled) return
      if (res.ok) {
        setProducts(res.data)
        setError(null)
      } else {
        setProducts(null)
        setError(res.error)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [session, reload])

  const signOut = useCallback(async () => {
    await supabase()?.auth.signOut()
    setSession(null)
    setProducts(null)
    setEditor({ open: false })
  }, [])

  const saveProduct = async (
    draft: Omit<Product, 'id'> & { id?: string },
    added: PreparedImage[]
  ) => {
    setBusy(true)
    try {
      // Upload first: the product row needs the resulting URLs, and an orphaned
      // image is far cheaper to clean up than a product with no photos.
      //
      // Sequential, not parallel: a dozen simultaneous resizes on a phone is the
      // difference between a two-second save and a stalled one, and the progress
      // readout is the whole reason to go one at a time.
      const uploaded: string[] = []
      for (const [index, file] of added.entries()) {
        setProgress({ done: index, total: added.length })
        const up = await uploadProductImage(file.filename, file.bytes)
        if (!up.ok) {
          toast.error(`Upload ${index + 1} of ${added.length} failed`, { description: up.error })
          return
        }
        uploaded.push(up.data)
      }
      setProgress(null)

      // Walk the editor's order and swap each pending slot for its real URL, so
      // the gallery on the site is in exactly the order that was arranged here.
      let next = 0
      const images = draft.images.map(entry =>
        entry.startsWith(PENDING_PREFIX) ? uploaded[next++] : entry
      )

      const payload = { ...draft, images }
      const res = draft.id
        ? await updateProduct({ ...payload, id: draft.id })
        : await createProduct(payload)

      if (!res.ok) {
        toast.error('Could not save', { description: res.error })
        return
      }

      setEditor({ open: false })
      setReload(n => n + 1)
      toast.success(draft.id ? 'Product updated' : 'Product added', {
        description: 'It is live on the site right now.'
      })
    } finally {
      setBusy(false)
      setProgress(null)
    }
  }

  const removeProduct = async (product: Product) => {
    setBusy(true)
    try {
      const res = await deleteProduct(product.id)
      if (!res.ok) {
        toast.error('Could not remove', { description: res.error })
        return
      }
      setEditor({ open: false })
      setReload(n => n + 1)
      toast.success('Product removed')
    } finally {
      setBusy(false)
    }
  }

  if (!session) return <SignIn onSignedIn={setSession} />

  return (
    <div className="container-cy py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <LogoMark className="pointer-events-none" />
          <Badge variant="clay">Admin</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="icon"
            onClick={() => setReload(n => n + 1)}
            aria-label="Reload the catalogue"
          >
            <RefreshCw size={16} aria-hidden="true" />
          </Button>
          <Button variant="glass" size="icon" onClick={() => void signOut()} aria-label="Sign out">
            <LogOut size={16} aria-hidden="true" />
          </Button>
        </div>
      </header>

      <Separator className="my-7" />

      <div className="mb-7 grid gap-4 sm:grid-cols-3">
        <Card className="rounded-lg">
          <CardContent className="p-5">
            <p className="text-[0.75rem] uppercase tracking-[0.1em] text-ink/60">Products</p>
            <p className="mt-1.5 font-display text-[1.8rem] font-semibold">
              {products?.length ?? '—'}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardContent className="p-5">
            <p className="text-[0.75rem] uppercase tracking-[0.1em] text-ink/60">Signed in as</p>
            <p className="mt-1.5 truncate text-[0.95rem]">{session.user.email}</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardContent className="p-5">
            <p className="text-[0.75rem] uppercase tracking-[0.1em] text-ink/60">Changes</p>
            <p className="mt-1.5 flex items-center gap-1.5 text-[0.95rem]">
              <Sparkles size={15} className="text-clay" aria-hidden="true" />
              Instant
            </p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="mb-6 rounded-lg">
          <CardContent className="flex items-start gap-3 p-5">
            <AlertTriangle
              size={16}
              strokeWidth={2}
              className="mt-0.5 shrink-0 text-blush-deep"
              aria-hidden="true"
            />
            <p role="alert" className="text-[0.92rem] text-blush-deep">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {products === null && !error ? (
        <p className="py-10 text-center text-ink/70">Loading the catalogue…</p>
      ) : (
        <ProductTable
          products={products ?? []}
          onAdd={() => setEditor({ open: true, product: null })}
          onEdit={product => setEditor({ open: true, product })}
        />
      )}

      <Card className="mt-8 rounded-lg">
        <CardContent className="flex items-start gap-3 p-5">
          <p className="text-[0.85rem] leading-relaxed text-ink/70">
            Products live in Supabase and writes are gated by Row Level Security. Saving is
            instant — the next page load shows the change, with no rebuild.
          </p>
        </CardContent>
      </Card>

      <Sheet open={editor.open} onOpenChange={open => !open && setEditor({ open: false })}>
        <SheetContent side="right" className="w-full max-w-xl">
          <SheetHeader className="sr-only">
            <SheetTitle>Product editor</SheetTitle>
          </SheetHeader>
          {editor.open && (
            <ProductEditor
              product={editor.product}
              busy={busy}
              progress={progress}
              onCancel={() => setEditor({ open: false })}
              onDelete={removeProduct}
              onSave={saveProduct}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
