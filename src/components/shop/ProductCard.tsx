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
          className="block overflow-hidden rounded-md border border-line bg-surface no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#c9bcb4] hover:shadow-soft"
        >
          <div className="aspect-[4/5] overflow-hidden bg-line">
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
          <div className="flex items-baseline justify-between gap-3 px-4 py-3.5">
            <span className="text-[0.9rem] font-medium text-ink">{product.name}</span>
            <span className="whitespace-nowrap text-[0.9rem] text-muted">{peso(product.price)}</span>
          </div>
        </Link>
      </TiltCard>
    </motion.li>
  )
}
