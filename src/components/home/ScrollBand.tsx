import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { sceneImage } from '@/data/products'

export default function ScrollBand() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%'])

  return (
    <section
      ref={ref}
      aria-label="Collection scene"
      className="relative z-10 aspect-[16/7] w-full overflow-hidden rounded-lg max-md:aspect-[16/11]"
    >
      <motion.img
        src={sceneImage.band}
        alt="Pieces from the collection arranged together in the studio"
        width={2000}
        height={875}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={reduced ? undefined : { y, scale: 1.2 }}
      />
      <div className="glass-dark absolute bottom-5 left-5 rounded-pill px-4 py-2 text-[0.75rem] font-medium tracking-[0.08em] text-cream max-md:bottom-4 max-md:left-4">
        In the studio · Naga City
      </div>
    </section>
  )
}
