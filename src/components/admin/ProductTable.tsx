import { ImageOff, Images, Pencil, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice, type Product } from '@/lib/products'

interface ProductTableProps {
  products: Product[]
  onAdd: () => void
  onEdit: (product: Product) => void
}

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export default function ProductTable({ products, onAdd, onEdit }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <Card className="rounded-xl">
        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-pill bg-clay/10 text-clay-deep">
            <Plus size={24} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-[1.25rem] font-semibold">No products yet</p>
            <p className="mx-auto mt-2 max-w-[40ch] text-[0.92rem] text-ink/75">
              The site is showing the empty state right now. Add your first piece to publish it.
            </p>
          </div>
          <Button variant="accent" onClick={onAdd}>
            <Plus aria-hidden="true" />
            Add the first product
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.9rem] text-ink/75">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
        <Button variant="accent" onClick={onAdd}>
          <Plus aria-hidden="true" />
          Add product
        </Button>
      </div>

      <ul className="grid list-none gap-3">
        {products.map(p => (
          <li key={p.id}>
            <Card className="rounded-lg">
              <CardContent className="flex items-center gap-4 p-3">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-ink/5">
                  {p.images.length > 0 ? (
                    <img
                      src={asset(p.images[0])}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-muted">
                      <ImageOff size={18} aria-hidden="true" />
                    </span>
                  )}
                  {p.images.length > 1 && (
                    <span className="glass-dark absolute bottom-1 right-1 inline-flex items-center gap-1 rounded-pill px-1.5 py-0.5 text-[0.6rem] font-medium text-cream">
                      <Images size={9} aria-hidden="true" />
                      {p.images.length}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-clay-deep">
                    {p.brand || 'Unbranded'}
                  </p>
                  <p className="mt-0.5 font-display text-[1.05rem] font-semibold">
                    {p.name || 'Untitled'}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="text-[0.88rem] font-semibold text-ink/80">
                      {formatPrice(p.price)}
                    </span>
                    {p.description && (
                      <p className="line-clamp-1 text-[0.82rem] text-ink/70">{p.description}</p>
                    )}
                  </div>
                </div>

                <Button variant="glass" size="icon" onClick={() => onEdit(p)} aria-label={`Edit ${p.name}`}>
                  <Pencil aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
