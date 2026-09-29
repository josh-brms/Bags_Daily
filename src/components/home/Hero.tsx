import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LOCATION_SHORT } from '@/data/site'
import ProductImage from '@/components/ui/ProductImage'
import type { Product } from '@/lib/products'

/** Deterministic scatter so the layout doesn't reflow between renders. */
const FLOAT_SPECS: { index: number; tilt: number; delay: number; style: React.CSSProperties }[] = [
  { index: 0, delay: 0, tilt: -7, style: { top: '16%', left: '3%', width: 190 } },
  { index: 4, delay: 0.4, tilt: 6, style: { top: '64%', left: '7%', width: 150 } },
  { index: 2, delay: 0.2, tilt: 5, style: { top: '11%', right: '4%', width: 175 } },
  { index: 7, delay: 0.6, tilt: -6, style: { top: '68%', right: '7%', width: 142 } }
]

/** Resolved at render, not module load — an empty catalogue must not throw. */
interface FloatCard {
  spec: (typeof FLOAT_SPECS)[number]
  product: Product
}

const floatingCards = (products: Product[]): FloatCard[] =>
  FLOAT_SPECS.map(spec => ({ spec, product: products[spec.index] })).filter(
    (f): f is FloatCard => Boolean(f.product)
  )

/** Counted live so the copy can't drift as the catalogue changes. */
function countLabel(n: number): string {
  if (n === 0) return 'New pieces landing soon'
  if (n === 1) return 'One piece · One palette'
  return `${n} pieces · One palette`
}

const sparkleDots = [
  { top: '22%', left: '30%', delay: '0s', color: '#B4693A' },
  { top: '18%', left: '72%', delay: '0.9s', color: '#D1939A' },
  { top: '70%', left: '26%', delay: '1.5s', color: '#A38CBC' },
  { top: '76%', left: '68%', delay: '0.4s', color: '#B4693A' },
  { top: '46%', left: '16%', delay: '1.9s', color: '#D1939A' },
  { top: '40%', left: '86%', delay: '1.2s', color: '#A38CBC' }
]

const wordParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } }
}

const wordChild: Variants = {
  hidden: { y: '110%', rotate: 5, opacity: 0 },
  visible: {
    y: '0%',
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
  }
}

const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

/** A glass-framed product image that bobs gently forever. */
function FloatingCard({
  product,
  style,
  tilt,
  delay
}: {
  product: Product
  style: React.CSSProperties
  tilt: number
  delay: number
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.85, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5 + delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={style}
      className="pointer-events-none absolute hidden lg:block"
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -12, 0], rotate: [tilt, tilt + 1.5, tilt] }}
        transition={{ duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay: delay * 2 }}
      >
        <div className="glass glass-ring glass-sheen rounded-xl p-2 shadow-lift">
          <div className="overflow-hidden rounded-lg bg-white/50" style={{ aspectRatio: '3 / 4' }}>
            <ProductImage
              src={product.images[0]}
              alt=""
              sizes="(min-width: 1024px) 13vw, 0px"
              width={600}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Hero({ products }: { products: Product[] }) {
  const reduced = useReducedMotion()

  return (
    <section
      id="home"
      className="relative flex min-h-[92vh] items-center overflow-hidden pb-24 pt-28"
    >
      {/* Animated aurora wash — pure CSS, no JS cost */}
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      {/* Drifting sparkles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {sparkleDots.map(s => (
          <span
            key={`${s.top}-${s.left}`}
            className="sparkle"
            style={{
              top: s.top,
              left: s.left,
              color: s.color,
              animationDelay: s.delay
            }}
          />
        ))}
      </div>

      {/* Floating product frames — omitted entirely while the catalogue is empty. */}
      {floatingCards(products).map(({ spec, product }) => (
        <FloatingCard
          key={product.id}
          product={product}
          delay={spec.delay}
          tilt={spec.tilt}
          style={spec.style}
        />
      ))}

      <motion.div
        variants={wordParent}
        initial="hidden"
        animate="visible"
        className="container-cy relative text-center"
      >
        <motion.span
          variants={rise}
          className="glass glass-ring inline-flex items-center gap-2 rounded-pill px-5 py-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink"
        >
          <Sparkles size={13} strokeWidth={2} className="text-clay" aria-hidden="true" />
          {countLabel(products.length)}
        </motion.span>

        <h1
          aria-label="The Collection"
          className="mx-auto mt-7 flex max-w-[16ch] flex-col items-center overflow-hidden pb-2 font-display text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.03em]"
        >
          {['The', 'Collection'].map((word, i) => (
            <span key={word} className="overflow-hidden">
              <motion.span
                variants={wordChild}
                className={
                  i === 1
                    ? 'inline-block bg-gradient-to-r from-clay via-blush-deep to-lilac-deep bg-clip-text text-transparent'
                    : 'inline-block text-ink'
                }
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          variants={rise}
          className="mx-auto mt-7 max-w-[48ch] text-[1.05rem] leading-relaxed text-ink/80"
        >
          A small, considered collection in warm neutral tones. Every piece opens on Instagram,
          where the colourways and availability live.
        </motion.p>

        <motion.div
          variants={rise}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button variant="accent" asChild>
            <Link to="/collection">Browse the collection</Link>
          </Button>
          <Button variant="glass" asChild>
            <Link to="/#about">About the studio</Link>
          </Button>
        </motion.div>

        <motion.div
          variants={rise}
          className="mt-14 flex flex-wrap items-center justify-center gap-3 text-[0.72rem] uppercase tracking-[0.16em] text-muted"
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-pill bg-clay" />
            Est. 2026
          </span>
          <span className="h-1.5 w-1.5 rounded-pill bg-blush-deep" />
          <span>{LOCATION_SHORT}</span>
          <span className="h-1.5 w-1.5 rounded-pill bg-lilac-deep" />
          <span>Hand-finished</span>
        </motion.div>
      </motion.div>

      <motion.a
        href="#collection"
        aria-label="Scroll to the collection"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="glass glass-ring absolute bottom-7 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-pill text-ink no-underline transition-colors hover:bg-white/70"
      >
        <motion.span
          animate={reduced ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex"
        >
          <ChevronDown size={20} strokeWidth={2} aria-hidden="true" />
        </motion.span>
      </motion.a>
    </section>
  )
}
