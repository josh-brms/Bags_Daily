import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, Home, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

/** Deterministic scatter so the sparkles don't reshuffle on re-render. */
const sparks = [
  { top: '18%', left: '20%', delay: '0s', color: '#B4693A' },
  { top: '12%', left: '70%', delay: '0.7s', color: '#D1939A' },
  { top: '64%', left: '14%', delay: '1.3s', color: '#A38CBC' },
  { top: '70%', left: '78%', delay: '0.3s', color: '#B4693A' }
]

export default function NotFound() {
  return (
    <div className="container-cy py-20">
      <Card className="relative mx-auto max-w-xl overflow-visible rounded-2xl">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {sparks.map(s => (
            <span
              key={`${s.top}-${s.left}`}
              className="sparkle"
              style={{ top: s.top, left: s.left, color: s.color, animationDelay: s.delay }}
            />
          ))}
        </div>

        <CardContent className="relative p-10 text-center md:p-14">
          <motion.span
            aria-hidden="true"
            animate={{ y: [0, -10, 0], rotate: [-6, 4, -6] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-pill bg-gradient-to-br from-clay/15 via-blush/20 to-lilac/20 text-clay-deep"
          >
            <Briefcase size={34} strokeWidth={1.5} />
          </motion.span>

          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 bg-gradient-to-r from-clay via-blush-deep to-lilac-deep bg-clip-text font-display text-[clamp(3.5rem,12vw,5.5rem)] font-semibold leading-none tracking-[-0.04em] text-transparent"
          >
            404
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-5 font-display text-[1.6rem] font-semibold tracking-[-0.02em]"
          >
            This one's lost in the racks
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.33, duration: 0.5 }}
            className="mx-auto mt-3 max-w-[38ch] leading-relaxed text-ink/80"
          >
            The page you're looking for isn't in the collection. Let's get you back to the good
            stuff.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.41, duration: 0.5 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Button variant="accent" asChild>
              <Link to="/">
                <Home aria-hidden="true" />
                Back to home
              </Link>
            </Button>
            <Button variant="glass" asChild>
              <Link to="/collection">
                <Sparkles aria-hidden="true" />
                Browse the collection
              </Link>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}
