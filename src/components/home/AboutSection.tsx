import { motion, type Variants } from 'framer-motion'
import { Layers, Palette, Sparkles } from 'lucide-react'

const statement =
  'The collection is a study in warm neutral tones — every piece made to be worn, layered, and lived in. Open any product to see its price, description, and available colours.'

const features = [
  {
    icon: Sparkles,
    title: 'Small batches',
    text: 'Each piece is cut and finished in limited runs, so the collection stays considered.'
  },
  {
    icon: Palette,
    title: 'Warm neutrals',
    text: 'Creams, sands, and clays chosen to pair with each other and with your wardrobe.'
  },
  {
    icon: Layers,
    title: 'Made to layer',
    text: 'Silhouettes designed to be worn alone or stacked through every season.'
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
        className="mx-auto mt-10 max-w-[54ch] text-center text-[clamp(1.15rem,2.4vw,1.5rem)] font-medium leading-[1.55] text-ink"
      >
        {statement.split(' ').map((word, i) => (
          <motion.span key={word + i} variants={wordVariants} className="inline-block">
            {word}
            {'\u00A0'}
          </motion.span>
        ))}
      </motion.p>

      <motion.ul
        variants={cardsParentVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto mt-14 grid max-w-4xl list-none gap-4 sm:grid-cols-3 md:gap-6"
      >
        {features.map(f => (
          <motion.li key={f.title} variants={cardVariants}>
            <div className="glass glass-ring glass-sheen h-full rounded-lg p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-clay/10 text-clay-deep">
                <f.icon size={22} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[0.95rem] font-semibold tracking-[0.02em]">{f.title}</h3>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-ink/75">{f.text}</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
