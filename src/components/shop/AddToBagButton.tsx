import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { useBag } from '@/stores/bag'
import { peso } from '@/lib/peso'
import Magnetic from '@/components/layout/Magnetic'
import { Button } from '@/components/ui/button'
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
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button variant="default" onClick={onAdd} className="w-full">
            <ShoppingBag aria-hidden="true" />
            Add to bag · {peso(product.price)}
          </Button>
        </motion.div>
      </Magnetic>
      <p className="mt-3.5 text-[0.82rem] text-muted">Demo storefront — orders are not processed on this site yet.</p>
    </div>
  )
}
