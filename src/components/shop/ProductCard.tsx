import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Images } from 'lucide-react'
import TiltCard from './TiltCard'
import ProductImage from '@/components/ui/ProductImage'
import { fadeUp } from '@/lib/motion'
import { formatPrice, type Product } from '@/lib/products'
import { BRAND_NAME } from '@/data/site'

/**
 * The card is the way in to a product's gallery, not a shortcut to Instagram.
 * The Instagram link now lives on the detail page, where there is room to show
 * what the button does.
 */
export default function ProductCard({ product }: { product: Product }) {
  const [cover, ...rest] = product.images
  const extra = rest.length

  return (
    <motion.li layout variants={fadeUp}>
      <TiltCard>
        <Link
          to={`/product/${product.id}`}
          className="glass glass-ring glass-sheen block rounded-xl p-3 no-underline transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-glow"
          aria-label={`${product.name} — see photos`}
        >
          <div className="relative overflow-hidden rounded-lg bg-white/45">
            <div className="aspect-[3/4] overflow-hidden">
              <motion.div
                className="h-full w-full"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductImage
                  src={cover}
                  alt={`${product.name} from the ${BRAND_NAME} collection`}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                  width={800}
                  height={1067}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>

            {extra > 0 && (
              <span className="glass-dark absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[0.7rem] font-medium tracking-[0.06em] text-cream">
                <Images size={12} aria-hidden="true" />
                {extra + 1} photos
              </span>
            )}
          </div>

          <div className="px-1 pb-1 pt-4">
            {product.brand && (
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-clay-deep">
                {product.brand}
              </p>
            )}
            <div className="mt-1 flex items-baseline justify-between gap-3">
              <span className="font-display text-[1rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
                {product.name}
              </span>
              <span className="shrink-0 text-[0.9rem] font-semibold text-ink/80">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>
        </Link>
      </TiltCard>
    </motion.li>
  )
}
