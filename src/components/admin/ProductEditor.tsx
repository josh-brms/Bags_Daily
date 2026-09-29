import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AlertTriangle, ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2, X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import ProductImage from '@/components/ui/ProductImage'
import { validateProduct, MAX_PRODUCT_IMAGES, PENDING_PREFIX } from '@/lib/products'
import { prepareImage, slugify, type PreparedImage } from '@/lib/admin/imageResize'
import type { Product } from '@/lib/products'

interface ProductEditorProps {
  /** null when adding. */
  product: Product | null
  busy: boolean
  /** Upload progress while the parent is writing, so the button can say more than "Saving…". */
  progress?: { done: number; total: number } | null
  onCancel: () => void
  onDelete: (product: Product) => void
  /**
   * The second argument is the newly added files, in the order they appear in
   * `product.images`. The parent uploads them and substitutes the real URLs.
   */
  onSave: (product: Omit<Product, 'id'> & { id?: string }, added: PreparedImage[]) => void
}

const empty = (): Omit<Product, 'id'> => ({
  name: '',
  brand: '',
  price: 0,
  images: [],
  description: '',
  isPosted: true
})

export default function ProductEditor({
  product,
  busy,
  progress,
  onCancel,
  onDelete,
  onSave
}: ProductEditorProps) {
  const [draft, setDraft] = useState<Omit<Product, 'id'> & { id?: string }>(
    product ? { ...product } : empty()
  )
  /** Prepared files keyed by their `pending:<filename>` entry. */
  const [pending, setPending] = useState<Map<string, PreparedImage>>(new Map())
  /** Object URLs for the pending thumbnails, keyed the same way. */
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const [imageError, setImageError] = useState<string | null>(null)
  const [resizing, setResizing] = useState(false)
  const [pasted, setPasted] = useState('')

  const errors = useMemo(() => validateProduct(draft), [draft])
  const valid = errors.length === 0
  const full = draft.images.length >= MAX_PRODUCT_IMAGES

  // Object URLs live for the lifetime of the editor. One is released the moment a
  // photo is removed; the rest are released together on unmount, tracked through a
  // ref so the cleanup effect does not have to re-run on every change.
  const live = useRef<string[]>([])
  useEffect(() => {
    live.current = Object.values(previews)
  }, [previews])
  useEffect(
    () => () => {
      live.current.forEach(URL.revokeObjectURL)
    },
    []
  )

  const set = <K extends keyof (typeof draft)>(key: K, value: (typeof draft)[K]) =>
    setDraft(d => ({ ...d, [key]: value }))

  /** Swaps neighbours, keeping the list an ordered array. */
  const move = (index: number, by: number) =>
    setDraft(d => {
      const to = index + by
      if (to < 0 || to >= d.images.length) return d
      const images = [...d.images]
      ;[images[index], images[to]] = [images[to], images[index]]
      return { ...d, images }
    })

  const remove = (index: number) =>
    setDraft(d => {
      const entry = d.images[index]
      if (entry?.startsWith(PENDING_PREFIX)) {
        setPending(p => {
          const next = new Map(p)
          next.delete(entry)
          return next
        })
        const url = previews[entry]
        if (url) {
          URL.revokeObjectURL(url)
          setPreviews(p => {
            const next = { ...p }
            delete next[entry]
            return next
          })
        }
      }
      return { ...d, images: d.images.filter((_, i) => i !== index) }
    })

  const onFiles = async (files: FileList | null) => {
    const list = Array.from(files ?? [])
    if (list.length === 0) return
    setImageError(null)
    setResizing(true)
    try {
      const room = MAX_PRODUCT_IMAGES - draft.images.length
      if (list.length > room) {
        setImageError(
          `Only ${room} more ${room === 1 ? 'photo fits' : 'photos fit'} — ${MAX_PRODUCT_IMAGES} per product.`
        )
      }

      const prepared = await Promise.all(
        list.slice(0, room).map(file => prepareImage(file, slugify(draft.name || file.name)))
      )

      const entries: string[] = []
      const files_ = new Map(pending)
      const previews_: Record<string, string> = { ...previews }
      for (const p of prepared) {
        const entry = `${PENDING_PREFIX}${p.filename}`
        // Same filename twice in one product would collapse the key, so
        // disambiguate and keep the thumbnail 1:1 with the entry.
        const unique = entries.includes(entry) || files_.has(entry)
          ? `${entry}${entries.length}`
          : entry
        files_.set(unique, p)
        const url = URL.createObjectURL(new Blob([p.bytes]))
        previews_[unique] = url
        entries.push(unique)
      }

      setPending(files_)
      setPreviews(previews_)
      setDraft(d => ({ ...d, images: [...d.images, ...entries] }))
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Could not read those images.')
    } finally {
      setResizing(false)
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!valid) return
    onSave(
      draft,
      draft.images.map(entry => pending.get(entry)).filter((p): p is PreparedImage => !!p)
    )
  }

  return (
    <form onSubmit={submit} className="flex h-full flex-col">
      <header className="pr-10">
        <Badge variant={product ? 'lilac' : 'blush'}>{product ? 'Editing' : 'New product'}</Badge>
        <h2 className="mt-3 font-display text-[1.6rem] font-semibold tracking-[-0.02em]">
          {product ? product.name || 'Untitled' : 'Add a piece'}
        </h2>
        <p className="mt-2 text-[0.9rem] text-ink/70">
          The first photo is the cover in the grid. A description is optional.
        </p>
      </header>

      <Separator className="my-6" />

      <div className="flex-1 space-y-5 overflow-y-auto pr-1">
        <label className="flex flex-col gap-1.5">
          <span className="text-[0.78rem] uppercase tracking-[0.1em] text-ink/70">Name</span>
          <input
            value={draft.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Coach City Tote"
            className="glass glass-ring min-h-11 rounded-pill px-4 text-[0.95rem] outline-none focus-visible:ring-2 focus-visible:ring-ink"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[0.78rem] uppercase tracking-[0.1em] text-ink/70">Brand</span>
            <input
              value={draft.brand}
              onChange={e => set('brand', e.target.value)}
              placeholder="Coach"
              className="glass glass-ring min-h-11 rounded-pill px-4 text-[0.95rem] outline-none focus-visible:ring-2 focus-visible:ring-ink"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.78rem] uppercase tracking-[0.1em] text-ink/70">Price (₱)</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={draft.price}
              onChange={e => set('price', e.target.valueAsNumber)}
              placeholder="0"
              className="glass glass-ring min-h-11 rounded-pill px-4 text-[0.95rem] outline-none focus-visible:ring-2 focus-visible:ring-ink"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[0.78rem] uppercase tracking-[0.1em] text-ink/70">
            Description
          </span>
          <textarea
            value={draft.description}
            onChange={e => set('description', e.target.value)}
            rows={3}
            placeholder="What makes this piece worth a second look?"
            className="glass glass-ring rounded-lg px-4 py-3 text-[0.95rem] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ink"
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[0.78rem] uppercase tracking-[0.1em] text-ink/70">Photos</span>
            <span className="text-[0.75rem] text-muted">
              {draft.images.length} / {MAX_PRODUCT_IMAGES}
            </span>
          </div>

          <label
            className={`glass glass-ring flex min-h-11 items-center justify-center gap-2.5 rounded-pill px-4 text-[0.9rem] transition-colors ${
              full
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:bg-white/60'
            }`}
          >
            {resizing ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <ImagePlus size={16} aria-hidden="true" />
            )}
            {resizing
              ? 'Resizing…'
              : full
                ? `That is the ${MAX_PRODUCT_IMAGES}-photo maximum`
                : 'Add photos'}
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={full || resizing}
              className="sr-only"
              onChange={e => {
                void onFiles(e.target.files)
                e.target.value = ''
              }}
            />
          </label>

          {imageError && (
            <p role="alert" className="text-[0.8rem] text-blush-deep">
              {imageError}
            </p>
          )}

          {draft.images.length > 0 && (
            <ul className="mt-1 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {draft.images.map((entry, i) => {
                const isPending = entry.startsWith(PENDING_PREFIX)
                const file = isPending ? pending.get(entry) : undefined
                const src = isPending ? (previews[entry] ?? '') : entry
                return (
                  <li key={`${entry}-${i}`} className="relative">
                    <div className="overflow-hidden rounded-lg border border-white/50 bg-white/45">
                      <div className="aspect-[3/4]">
                        <ProductImage
                          src={src}
                          alt={`Photo ${i + 1}`}
                          width={200}
                          height={267}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    <span className="absolute left-1.5 top-1.5 rounded-pill bg-ink/70 px-2 py-0.5 text-[0.65rem] font-medium text-cream">
                      {i === 0 ? 'Cover' : i + 1}
                    </span>

                    <div className="absolute right-1.5 top-1.5 flex gap-1">
                      <button
                        type="button"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        aria-label={`Move photo ${i + 1} earlier`}
                        className="glass-dark rounded-pill p-1 text-cream disabled:opacity-30"
                      >
                        <ArrowUp size={11} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, 1)}
                        disabled={i === draft.images.length - 1}
                        aria-label={`Move photo ${i + 1} later`}
                        className="glass-dark rounded-pill p-1 text-cream disabled:opacity-30"
                      >
                        <ArrowDown size={11} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(i)}
                        aria-label={`Remove photo ${i + 1}`}
                        className="glass-dark rounded-pill p-1 text-cream"
                      >
                        <X size={11} aria-hidden="true" />
                      </button>
                    </div>

                    {file?.warning && (
                      <p className="mt-1 flex items-start gap-1 text-[0.7rem] text-blush-deep">
                        <AlertTriangle
                          size={11}
                          strokeWidth={2}
                          className="mt-0.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="line-clamp-2">{file.warning}</span>
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          )}

          {pending.size > 0 && (
            <p className="text-[0.78rem] text-muted">
              {pending.size} new {pending.size === 1 ? 'photo' : 'photos'} will upload when you
              save.
            </p>
          )}

          <div className="flex gap-2">
            <input
              value={pasted}
              onChange={e => setPasted(e.target.value)}
              onKeyDown={e => {
                // Enter would otherwise submit the whole product form.
                if (e.key !== 'Enter') return
                e.preventDefault()
                if (pasted.trim() && !full) set('images', [...draft.images, pasted.trim()])
                setPasted('')
              }}
              placeholder="…or paste a path like images/photo.jpg"
              spellCheck={false}
              aria-label="Add a photo by path or URL"
              className="glass glass-ring min-h-10 flex-1 rounded-pill px-4 font-mono text-[0.8rem] outline-none focus-visible:ring-2 focus-visible:ring-ink"
            />
            <Button
              type="button"
              variant="glass"
              size="sm"
              disabled={!pasted.trim() || full}
              onClick={() => {
                if (pasted.trim()) set('images', [...draft.images, pasted.trim()])
                setPasted('')
              }}
            >
              Add
            </Button>
          </div>
        </div>

        {errors.length > 0 && (
          <ul className="space-y-1 rounded-lg bg-blush/15 px-4 py-3 text-[0.82rem] text-blush-deep">
            {errors.map(e => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-between gap-3">
        {product ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => product && onDelete(product)}
            className="text-blush-deep"
            disabled={busy}
          >
            <Trash2 aria-hidden="true" />
            Delete
          </Button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          <Button type="button" variant="glass" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" variant="accent" disabled={!valid || busy}>
            {busy && progress ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <Upload aria-hidden="true" />
            )}
            {busy
              ? progress
                ? `Uploading ${Math.min(progress.done + 1, progress.total)} of ${progress.total}…`
                : 'Saving…'
              : 'Save product'}
          </Button>
        </div>
      </div>
    </form>
  )
}
