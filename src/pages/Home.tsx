import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import Hero from '@/components/home/Hero'
import Marquee from '@/components/home/Marquee'
import TotePlayground from '@/components/home/TotePlayground'
import AboutSection from '@/components/home/AboutSection'
import FeaturedCarousel from '@/components/home/FeaturedCarousel'
import EmptyCollection from '@/components/home/EmptyCollection'
import { Button } from '@/components/ui/button'
import { useProducts } from '@/hooks/useProducts'
import { fadeUp } from '@/lib/motion'

export default function Home() {
  const { products, loading, error, unconfigured } = useProducts()
  // An empty catalogue is a legitimate state, not an error.
  const hasProducts = products.length > 0

  return (
    <>
      <Hero products={products} />

      <Marquee />

      {hasProducts && (
        <>
          <FeaturedCarousel products={products} />

          {/* The full grid lives on /collection. Repeating 29 cards here as well
              meant scrolling the same wall of products twice. */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="container-cy pb-24 text-center"
          >
            <p className="text-[0.95rem] text-ink/75">
              {products.length} {products.length === 1 ? 'piece' : 'pieces'} in the collection
            </p>
            <Button variant="accent" asChild className="mt-5 min-h-12 px-6">
              <Link to="/collection">
                Browse everything
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </>
      )}

      {/* A failed fetch and a genuinely empty catalogue need different words:
          one is broken, the other is simply not stocked yet. */}
      {error ? (
        <section className="pb-20">
          <div className="container-cy">
            <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-blush/30 bg-blush/10 px-7 py-9 text-center">
              <AlertTriangle size={22} strokeWidth={2} className="text-blush-deep" aria-hidden="true" />
              <div>
                <h2 className="font-display text-[1.3rem] font-semibold">The collection didn't load</h2>
                <p className="mt-2 text-[0.92rem] text-ink/75">{error}</p>
                <Button variant="glass" asChild className="mt-5">
                  <Link to="/collection">
                    Try the collection page
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        !loading &&
        !hasProducts && <EmptyCollection configured={!unconfigured} />
      )}

      <TotePlayground />

      <section id="about" className="pb-28 pt-16">
        <AboutSection />
      </section>
    </>
  )
}
