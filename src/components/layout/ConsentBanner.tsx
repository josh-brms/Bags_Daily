import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { enabled, getConsent, loadAnalytics, setConsent } from '@/lib/analytics'

/**
 * Consent banner for page-view analytics.
 *
 * Renders nothing at all when no provider is configured, so an unconfigured
 * build stays completely inert. Accept and Decline are given equal visual weight
 * on purpose — a "decline" styled as a link to a confirmation page is a consent
 * pattern that does not hold up under scrutiny.
 */
export default function ConsentBanner() {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return
    // A stored "granted" means we can load immediately; a stored "denied" means
    // we never ask again.
    if (getConsent() === 'granted') {
      loadAnalytics()
      return
    }
    if (getConsent() === 'denied') return

    // Let the page settle before interrupting.
    const id = window.setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(id)
  }, [])

  if (!enabled || !visible) return null

  const decide = (value: 'granted' | 'denied') => {
    setConsent(value)
    setVisible(false)
    if (value === 'granted') loadAnalytics()
  }

  return (
    <motion.div
      role="dialog"
      aria-label="Analytics consent"
      aria-live="polite"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-[80] flex justify-center px-4 pb-5"
    >
      <div className="glass-strong glass-ring flex w-full max-w-2xl flex-col gap-4 rounded-2xl p-5 shadow-lift sm:flex-row sm:items-center">
        <p className="text-[0.88rem] leading-relaxed text-ink/80">
          We use privacy-friendly, cookieless analytics to count visits. Nothing is loaded
          until you accept, and declining changes nothing about the site.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="glass" size="sm" onClick={() => decide('denied')}>
            Decline
          </Button>
          <Button variant="accent" size="sm" onClick={() => decide('granted')}>
            Accept
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
