import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ColorPicker from '@/components/shop/ColorPicker'
import SizePicker from '@/components/shop/SizePicker'
import AddToBagButton from '@/components/shop/AddToBagButton'
import ProductCard from '@/components/shop/ProductCard'
import { PRODUCTS, productImage, relatedProducts } from '@/data/products'
import { peso } from '@/lib/peso'

export default function Product() {
  const { id } = useParams<{ id: string }>()
  const product = PRODUCTS.find(p => p.id === Number.parseInt(id ?? '', 10))

  if (!product) {
    return (
      <div className="container-cy py-24 text-center">
        <h1 className="text-[1.7rem] font-semibold">Product not found</h1>
        <p className="mb-8 mt-3 text-muted">This piece isn't in the collection.</p>
        <Link
          to="/#shop"
          className="inline-flex min-h-11 items-center rounded-md border border-ink bg-ink px-6 py-3 text-[0.9rem] font-medium text-cream no-underline transition-colors hover:border-[#3d3632] hover:bg-[#3d3632]"
        >
          Back to shop
        </Link>
      </div>
    )
  }

  return <ProductDetail key={product.id} productId={product.id} />
}

function ProductDetail({ productId }: { productId: number }) {
  const product = PRODUCTS.find(p => p.id === productId)!
  const [color, setColor] = useState(product.colors[0].name)
  const [size, setSize] = useState(product.sizes[0])
  const related = relatedProducts(product)

  return (
    <div className="container-cy pb-20">
      <Link
        to="/#shop"
        className="mb-7 mt-7 inline-flex items-center gap-2 text-[0.85rem] font-medium uppercase tracking-[0.08em] text-muted no-underline hover:text-ink"
      >
        <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
        Back to shop
      </Link>

      <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="aspect-[4/5] overflow-hidden rounded-md bg-line">
          <img
            src={productImage(product)}
            alt={`${product.name} from the CY Studio collection`}
            width={1600}
            height={2000}
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="lg:sticky lg:top-24">
          <span className="inline-block rounded-pill border border-line px-3 py-1 text-[0.72rem] uppercase tracking-[0.14em] text-muted">
            The Collection
          </span>
          <h1 className="mt-4 text-[clamp(1.7rem,3vw,2.2rem)] font-semibold tracking-[-0.01em]">
            {product.name}
          </h1>
          <p className="mt-2 text-[1.35rem] font-semibold">{peso(product.price)}</p>
          <p className="mb-8 mt-5 text-muted">{product.description}</p>

          <div className="mb-7">
            <p className="mb-3 text-[0.78rem] uppercase tracking-[0.1em] text-muted">
              Colour — <span className="font-semibold text-ink">{color}</span>
            </p>
            <ColorPicker colors={product.colors} value={color} onChange={setColor} />
          </div>

          <div className="mb-7">
            <p className="mb-3 text-[0.78rem] uppercase tracking-[0.1em] text-muted">
              Size — <span className="font-semibold text-ink">{size}</span>
            </p>
            <SizePicker sizes={product.sizes} value={size} onChange={setSize} />
          </div>

          <AddToBagButton product={product} size={size} color={color} />
        </div>
      </div>

      <section aria-labelledby="related-title" className="mt-20">
        <h2 id="related-title" className="section-title">
          You may also like
        </h2>
        <ul className="mt-11 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {related.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ul>
      </section>
    </div>
  )
}
