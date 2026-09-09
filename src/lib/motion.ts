import type { Transition, Variants } from 'framer-motion'

export const easeOut: Transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] }

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: easeOut }
}

export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } }
}
