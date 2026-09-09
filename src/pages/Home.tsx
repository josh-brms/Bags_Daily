import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import HeroScene from '@/components/three/HeroScene'
import TiltCard from '@/components/shop/TiltCard'
import ProductCard from '@/components/shop/ProductCard'
import Magnetic from '@/components/layout/Magnetic'
import { PRODUCTS, sceneImage } from '@/data/products'
import { staggerParent, fadeUp } from '@/lib/motion'

const headlineWords = ['The', 'Collection']

export default function Home() {
  return (
    <>
      <section id="home" className="relative overflow-hidden">
        <HeroScene />

        <div className="container-cy relative grid items-center gap-12 pb-20 pt-14 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div variants={staggerParent} initial="hidden" animate="visible">
            <h1
              aria-label="The Collection"
              className="flex flex-col overflow-hidden text-[clamp(2.1rem,4.5vw,3.2rem)] font-semibold leading-[1.15] tracking-[-0.01em]"
            >
              {headlineWords.map((word, i) => (
                <span key={word} className="overflow-hidden pb-1">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.15 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-[46ch] text-[1.05rem] text-muted"
            >
              Twelve everyday pieces in warm neutral tones. Browse the store, open a piece, and see
              its description, price, and colours.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <Magnetic>
                <Link
                  to="/#shop"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-ink bg-ink px-6 py-3 text-[0.9rem] font-medium tracking-[0.04em] text-cream no-underline transition-colors hover:border-[#3d3632] hover:bg-[#3d3632]"
                >
                  Browse the collection
                </Link>
              </Magnetic>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <TiltCard>
              <div className="aspect-[4/5] max-h-[560px] w-full overflow-hidden rounded-md bg-line/60 shadow-soft">
                <img
                  src={sceneImage.hero}
                  alt="A piece from the CY Studio collection, photographed in warm neutral light"
                  width={1600}
                  height={2000}
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                />
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

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
          <motion.ul
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-11 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          >
            {PRODUCTS.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.ul>
        </div>
      </section>

      <section aria-label="Collection scene" className="aspect-[16/7] w-full overflow-hidden bg-line max-md:aspect-[16/10]">
        <img
          src={sceneImage.band}
          alt="Pieces from the collection arranged together in the studio"
          width={2000}
          height={875}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </section>

      <section id="about" className="pb-24 pt-20">
        <div className="container-cy">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="section-title"
          >
            About
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mt-8 max-w-[60ch] text-center text-[1.05rem] text-muted"
          >
            The collection is a study in warm neutral tones — every piece made to be worn, layered,
            and lived in. Open any product to see its price, description, and available colours.
          </motion.p>
        </div>
      </section>
    </>
  )
}
