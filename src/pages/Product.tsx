import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import ProductGallery from '@/components/shop/ProductGallery'
import InstagramLink from '@/components/shop/InstagramLink'
import { Button } from '@/components/ui/button'
import { useProducts } from '@/hooks/useProducts'
import { fadeUp } from '@/lib/motion'
import { formatPrice } from '@/lib/products'
import { BRAND_NAME, INSTAGRAM_URL } from '@/data/site'
import NotFound from './NotFound'

export default function Product() {
  const { id } = useParams<{ id: string }>()
  const { products, loading, error } = useProducts()

  // The id is a uuid, so it is compared as a string. Number(id) would be NaN and
  // the product would never be found.
  const product = useMemo(() => products.find(p => p.id === id), [products, id])

  // The gallery is the page's whole point, so a stale tab title left over from
  // the collection is worse than no title at all.
  useEffect(() => {
    document.title = product
      ? `${product.name} — ${BRAND_NAME}`
      : `${BRAND_NAME} — The Collection`
  }, [product])

  if (loading) {
    return (
      <div className="container-cy flex items-center justify-center gap-2 py-32 text-ink/70">
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        Loading the collection…
      </div>
    )
  }

  if (!product) {
    // A bad id and a failed fetch are the same experience to a visitor: nothing
    // to look at. The 404 page explains where to go next.
    if (error) {
      return (
        <div className="container-cy py-32 text-center">
          <p role="alert" className="text-ink/80">
            {error}
          </p>
          <Button variant="glass" asChild className="mt-6">
            <Link to="/collection">
              <ArrowLeft aria-hidden="true" />
              Back to the collection
            </Link>
          </Button>
        </div>
      )
    }
    return <NotFound />
  }

  return (
    <div className="container-cy py-10 md:py-16">
      <Button variant="ghost" asChild className="-ml-3">
        <Link to="/collection">
          <ArrowLeft aria-hidden="true" />
          All pieces
        </Link>
      </Button>

      <div className="mt-7 grid gap-10 lg:grid-cols-[26rem_1fr] lg:gap-12">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <ProductGallery images={product.images} name={product.name} priority />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col justify-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-clay-deep"
          >
            {product.brand}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-3 font-display text-[clamp(2rem,5vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink"
          >
            {product.name}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-4 text-[1.5rem] font-semibold text-ink">
            {formatPrice(product.price)}
          </motion.p>

          {/* Every product in the catalogue has an empty description, so the
              paragraph is omitted rather than leaving a gap in the layout. */}
          {product.description && (
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-[46ch] text-[1rem] leading-relaxed text-ink/80"
            >
              {product.description}
            </motion.p>
          )}

          <motion.p variants={fadeUp} className="mt-4 text-[0.8rem] text-muted">
            {product.images.length} {product.images.length === 1 ? 'photo' : 'photos'}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9">
            <InstagramLink href={INSTAGRAM_URL} name={product.name}>
              <Button variant="accent" className="w-full min-h-12 px-6 sm:w-auto">
                Ask about this on Instagram
              </Button>
            </InstagramLink>
            <p className="mt-3 text-[0.8rem] text-muted">
              Availability and shipping are confirmed on Instagram.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
