import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Layers, Palette, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const statement =
  'The collection is a study in warm neutral tones — every piece made to be worn, layered, and lived in. Open any product to see its price, description, and available colours.'

const features = [
  {
    icon: Sparkles,
    title: 'Small batches',
    text: 'Each piece is cut and finished in limited runs, so the collection stays considered.',
    tone: 'clay' as const
  },
  {
    icon: Palette,
    title: 'Warm neutrals',
    text: 'Creams, sands, and clays chosen to pair with each other and with your wardrobe.',
    tone: 'blush' as const
  },
  {
    icon: Layers,
    title: 'Made to layer',
    text: 'Silhouettes designed to be worn alone or stacked through every season.',
    tone: 'lilac' as const
  }
]

const wordVariants: Variants = {
  hidden: { opacity: 0.12, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

const wordsParentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.018 } }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

const cardsParentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
}

export default function AboutSection() {
  const reduced = useReducedMotion()

  return (
    <div className="container-cy">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5 }}
        className="section-title"
      >
        About
      </motion.h2>

      <motion.p
        aria-label={statement}
        variants={wordsParentVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto mt-10 max-w-[54ch] text-center font-display text-[clamp(1.25rem,2.6vw,1.7rem)] font-medium leading-[1.5] tracking-[-0.01em] text-ink"
      >
        {statement.split(' ').map((word, i) => (
          <motion.span key={word + i} variants={wordVariants} className="inline-block">
            {word}
            {' '}
          </motion.span>
        ))}
      </motion.p>

      <motion.ul
        variants={cardsParentVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto mt-14 grid max-w-4xl list-none gap-5 sm:grid-cols-3 md:gap-6"
      >
        {features.map((f, i) => (
          <motion.li key={f.title} variants={cardVariants}>
            <Card className="group h-full rounded-xl hover:-translate-y-1.5 hover:shadow-lift">
              <CardContent className="p-6">
                <motion.span
                  animate={reduced ? undefined : { y: [0, -5, 0] }}
                  transition={{
                    duration: 4 + i * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-pill bg-clay/10 text-clay-deep transition-colors duration-300 group-hover:bg-clay/20"
                >
                  <f.icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </motion.span>
                <Badge variant={f.tone} className="mt-5">
                  {`0${i + 1}`}
                </Badge>
                <h3 className="mt-3 font-display text-[1.05rem] font-semibold tracking-[-0.01em]">
                  {f.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ink/75">{f.text}</p>
              </CardContent>
            </Card>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
