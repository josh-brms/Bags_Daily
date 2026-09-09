import { useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import TiltCard from '@/components/shop/TiltCard'
import ProductCard from '@/components/shop/ProductCard'
import SortControl from '@/components/shop/SortControl'
import Marquee from '@/components/home/Marquee'
import ScrollBand from '@/components/home/ScrollBand'
import AboutSection from '@/components/home/AboutSection'
import Magnetic from '@/components/layout/Magnetic'
import { Button } from '@/components/ui/button'
import { PRODUCTS, sceneImage } from '@/data/products'
import { sortProducts, type SortOption } from '@/lib/sort'
import { staggerParent, fadeUp } from '@/lib/motion'

export default function Home() {
  const [sort, setSort] = useState<SortOption>('featured')
  const sorted = useMemo(() => sortProducts(PRODUCTS, sort), [sort])

  return (
    <>
      <Hero />

      <Marquee />

      <section id="shop" className="py-20">
        <div className="container-cy">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="section-title"
          >
            All products
          </motion.h2>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-6 flex flex-col items-center gap-4"
          >
            <SortControl value={sort} onChange={setSort} />
          </motion.div>

          <motion.ul
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="mt-10 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          >
            {sorted.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.ul>
        </div>
      </section>

      <div className="container-cy py-10">
        <ScrollBand />
      </div>

      <section id="about" className="pb-24 pt-16">
        <AboutSection />
      </section>
    </>
  )
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  })
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, 64])

  return (
    <section id="home" ref={ref} className="relative overflow-hidden">
      <motion.div
        style={reduced ? undefined : { opacity, y }}
        className="container-cy relative grid items-center gap-12 pb-20 pt-14 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <motion.div variants={staggerParent} initial="hidden" animate="visible">
          <motion.span
            variants={fadeUp}
            className="glass glass-ring mb-6 inline-flex items-center gap-2 rounded-pill px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-clay" aria-hidden="true" />
            Twelve pieces · One palette
          </motion.span>
          <h1
            aria-label="The Collection"
            className="flex flex-col overflow-hidden pb-1 text-[clamp(2.4rem,5vw,3.6rem)] font-semibold leading-[1.12] tracking-[-0.015em]"
          >
            <span className="overflow-hidden">
              <motion.span
                className="inline-block text-ink"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                The
              </motion.span>
            </span>
            <span className="overflow-hidden">
              <motion.span
                className="inline-block bg-gradient-to-r from-ink via-clay-deep to-clay bg-clip-text text-transparent"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.27, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                Collection
              </motion.span>
            </span>
          </h1>
          <motion.p variants={fadeUp} className="mt-5 max-w-[46ch] text-[1.05rem] text-ink/80">
            Twelve everyday pieces in warm neutral tones. Browse the store, open a piece, and see
            its description, price, and colours.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Button variant="glass" asChild>
                <Link to="/#shop">Browse the collection</Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button variant="ghost" asChild>
                <Link to="/#about">About the studio</Link>
              </Button>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <TiltCard>
            <div className="glass glass-ring glass-sheen relative rounded-lg p-2.5 shadow-[0_24px_64px_rgba(33,29,27,0.16)]">
              <div className="aspect-[4/5] max-h-[560px] w-full overflow-hidden rounded-md bg-white/40">
                <img
                  src={sceneImage.hero}
                  alt="A piece from the CY Studio collection, photographed in warm neutral light"
                  width={1600}
                  height={2000}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="glass-dark absolute bottom-5 left-5 rounded-pill px-4 py-2 text-[0.75rem] font-medium tracking-[0.08em] text-cream">
                Est. 2026 · Naga City
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </motion.div>
    </section>
  )
}
