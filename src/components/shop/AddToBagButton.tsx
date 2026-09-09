import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { useBag } from '@/stores/bag'
import { peso } from '@/lib/peso'
import Magnetic from '@/components/layout/Magnetic'
import type { Product } from '@/data/products'

interface AddToBagButtonProps {
  product: Product
  size: string
  color: string
}

export default function AddToBagButton({ product, size, color }: AddToBagButtonProps) {
  const add = useBag(state => state.add)

  const onAdd = () => {
    add(`${product.name} · ${size} · ${color}`)
    toast('Saved to bag (demo)', {
      description: `${product.name} · ${size} · ${color} · ${peso(product.price)}`
    })
  }

  return (
    <div className="w-full">
      <Magnetic className="w-full" strength={4}>
        <motion.button
          type="button"
          onClick={onAdd}
          whileTap={{ scale: 0.98 }}
          className="flex min-h-11 w-full items-center justify-center gap-2.5 rounded-md border border-ink bg-ink px-6 py-3 text-[0.9rem] font-medium tracking-[0.04em] text-cream no-underline transition-colors duration-200 hover:border-[#3d3632] hover:bg-[#3d3632]"
        >
          <ShoppingBag size={18} strokeWidth={2} aria-hidden="true" />
          Add to bag · {peso(product.price)}
        </motion.button>
      </Magnetic>
      <p className="mt-3.5 text-[0.82rem] text-muted">Demo storefront — orders are not processed on this site yet.</p>
    </div>
  )
}
