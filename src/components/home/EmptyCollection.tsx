import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InstagramGlyph } from '@/components/shop/InstagramLink'
import { INSTAGRAM_URL } from '@/data/site'

/**
 * Shown while the catalogue is empty — which is the normal state until products
 * are added through /admin. Deliberately on-brand rather than an empty grid, so
 * the page reads as designed rather than broken.
 */
interface EmptyCollectionProps {
  /**
   * False when Supabase has not been configured at all. The copy changes so an
   * unfinished setup is not mistaken for a deliberately empty catalogue.
   */
  configured: boolean
}

export default function EmptyCollection({ configured }: EmptyCollectionProps) {
  return (
    <section id="collection" aria-labelledby="empty-title" className="py-20">
      <div className="container-cy">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="relative mx-auto max-w-2xl rounded-2xl">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              {[
                { top: '20%', left: '14%', delay: '0s' },
                { top: '14%', left: '78%', delay: '0.8s' },
                { top: '72%', left: '18%', delay: '1.4s' },
                { top: '78%', left: '74%', delay: '0.4s' }
              ].map(s => (
                <span
                  key={`${s.top}-${s.left}`}
                  className="sparkle"
                  style={{
                    top: s.top,
                    left: s.left,
                    color: '#B4693A',
                    animationDelay: s.delay
                  }}
                />
              ))}
            </div>

            <CardContent className="relative p-10 text-center md:p-14">
              <motion.span
                aria-hidden="true"
                animate={{ y: [0, -8, 0], rotate: [-5, 3, -5] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-pill bg-gradient-to-br from-clay/12 via-blush/20 to-lilac/20 text-clay-deep"
              >
                <Sparkles size={26} strokeWidth={1.5} />
              </motion.span>

              <Badge variant="clay" className="mt-6">
                {configured ? 'Coming soon' : 'Not set up'}
              </Badge>

              <h2
                id="empty-title"
                className="mt-4 font-display text-[clamp(1.5rem,3.4vw,2.2rem)] font-semibold tracking-[-0.02em]"
              >
                {configured
                  ? 'The collection is being restocked'
                  : 'The catalogue is not connected yet'}
              </h2>

              <p className="mx-auto mt-4 max-w-[42ch] leading-relaxed text-ink/75">
                {configured
                  ? 'New pieces land here first. In the meantime, the most recent additions are on Instagram.'
                  : 'Supabase has not been configured for this build, so there is nowhere to load products from. Set the environment variables and add products through the admin page.'}
              </p>

              {configured && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Button variant="accent" asChild>
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                      <InstagramGlyph size={18} />
                      See the latest on Instagram
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
