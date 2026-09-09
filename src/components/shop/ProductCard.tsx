import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import TiltCard from './TiltCard'
import { fadeUp } from '@/lib/motion'
import { productImage, type Product } from '@/data/products'
import { peso } from '@/lib/peso'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.li variants={fadeUp}>
      <TiltCard>
        <Link
          to={`/product/${product.id}`}
          aria-label={`View ${product.name}, ${peso(product.price)}`}
          className="glass glass-ring glass-sheen block rounded-lg p-2.5 no-underline transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(33,29,27,0.14)]"
        >
          <div className="aspect-[4/5] overflow-hidden rounded-md bg-white/40">
            <motion.img
              src={productImage(product)}
              alt={`${product.name} from the CY Studio collection`}
              width={800}
              height={1000}
              loading="lazy"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="flex items-baseline justify-between gap-3 px-2 pb-1.5 pt-3">
            <span className="text-[0.9rem] font-medium text-ink">{product.name}</span>
            <span className="whitespace-nowrap text-[0.9rem] font-semibold text-ink">{peso(product.price)}</span>
          </div>
        </Link>
      </TiltCard>
    </motion.li>
  )
}
