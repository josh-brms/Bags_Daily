import { motion } from 'framer-motion'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '@/components/shop/ProductCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useProducts } from '@/hooks/useProducts'
import { scaleUp, staggerParent } from '@/lib/motion'

/**
 * The whole catalogue on its own page.
 *
 * Home keeps the curated carousel and links here instead of repeating the grid:
 * 29 products, some with nearly forty photos, is a lot of scrolling to ask of a
 * landing page twice.
 */
export default function Collection() {
  const { products, loading, error, unconfigured } = useProducts()

  return (
    <div className="container-cy py-12 md:py-20">
      <motion.div initial="hidden" animate="visible" variants={scaleUp} className="max-w-[52ch]">
        <Badge variant="blush">The collection</Badge>
        <h1 className="mt-4 font-display text-[clamp(2.2rem,6vw,3.4rem)] font-semibold leading-[1.03] tracking-[-0.03em]">
          Every piece, all at once
        </h1>
        <p className="mt-4 text-[1rem] leading-relaxed text-ink/75">
          {loading
            ? 'Loading the catalogue…'
            : `${products.length} ${products.length === 1 ? 'piece' : 'pieces'}, newest last. Open one to see every photo.`}
        </p>
      </motion.div>

      {error && (
        <div
          role="alert"
          className="mt-9 flex items-start gap-3 rounded-2xl border border-blush/30 bg-blush/10 px-6 py-7"
        >
          <AlertTriangle size={20} strokeWidth={2} className="mt-0.5 shrink-0 text-blush-deep" aria-hidden="true" />
          <div>
            <h2 className="font-display text-[1.2rem] font-semibold">The collection didn't load</h2>
            <p className="mt-1.5 text-[0.92rem] text-ink/75">{error}</p>
          </div>
        </div>
      )}

      {loading && !error && (
        <p className="mt-16 flex items-center justify-center gap-2 text-ink/70">
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          Loading the collection…
        </p>
      )}

      {!loading && products.length === 0 && !error && (
        <div className="mt-9 flex flex-col items-start gap-4 rounded-2xl border border-ink/10 bg-white/40 px-6 py-9">
          <h2 className="font-display text-[1.2rem] font-semibold">
            {unconfigured ? 'The catalogue is not connected' : 'Nothing published yet'}
          </h2>
          <p className="text-[0.92rem] text-ink/75">
            {unconfigured
              ? 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then reload.'
              : 'Products appear here as soon as they are posted from the admin.'}
          </p>
          <Button variant="glass" asChild>
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      )}

      {products.length > 0 && (
        <motion.ul
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.02 }}
          className="mt-12 grid list-none grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
        >
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </motion.ul>
      )}
    </div>
  )
}
