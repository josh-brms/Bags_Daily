import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import LogoMark from './LogoMark'
import { BRAND_NAME } from '@/data/site'
import {
  isThreePending,
  isThreeReady,
  subscribeToLoadSignals
} from '@/lib/loadSignals'

/**
 * Absolute ceiling on the splash. MUST stay below the 4s body-wipe bailout in
 * index.html — content has to become visible before that destructive fallback
 * can fire, or a JS failure leaves a permanently blank page.
 */
export const MAX_SPLASH_MS = 2500
export const FONT_CAP_MS = 1000
export const THREE_CAP_MS = 1800
export const EXIT_MS = 340
const UNMOUNT_MS = 450

const SEEN_KEY = 'bd-splash-seen'

export const hasSeenSplash = (): boolean => {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export const markSplashSeen = (): void => {
  try {
    window.sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* private mode — splash just shows again next load */
  }
}

/**
 * Drives the splash progress. Every gate is independently time-capped so that a
 * signal that never fires (chunk 404, no WebGL, error boundary tripped) resolves
 * the splash rather than hanging it. See MAX_SPLASH_MS for the invariant.
 *
 * The bar eases toward 90% and snaps to 100% on completion. That is deliberate:
 * a dynamic import() exposes no byte-level progress, so this is a smoothed
 * indicator and not a real percentage.
 */
function useSplashProgress(active: boolean, reduced: boolean) {
  const [finished, setFinished] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (!active) return

    const pending = new Set<string>()
    const timers: number[] = []
    const cleanups: (() => void)[] = []
    let settled = false

    const settle = () => {
      if (settled) return
      settled = true
      timers.forEach(clearTimeout)
      cleanups.forEach(fn => fn())
      // `finished` starts the CSS opacity fade; the single timer then unmounts.
      // Driving both from here keeps the teardown free of effect chaining.
      setFinished(true)
      timers.push(
        window.setTimeout(() => setGone(true), reduced ? 0 : EXIT_MS + UNMOUNT_MS)
      )
    }

    /** Registers a gate with its own cap; returns the "it arrived" handler. */
    const gate = (name: string, cap: number) => {
      pending.add(name)
      timers.push(
        window.setTimeout(() => {
          pending.delete(name)
          if (pending.size === 0) settle()
        }, cap)
      )
      return () => {
        if (settled) return
        pending.delete(name)
        if (pending.size === 0) settle()
      }
    }

    // No images are awaited: on a populated catalogue they sit below the fold and
    // are lazy-loaded, so waiting would only add dead time to the splash.
    const fontsArrived = gate('fonts', FONT_CAP_MS)
    // `ready` is absent on browsers without the CSS Font Loading API, so this
    // must be a separate reference — `document.fonts?.ready.then(...)` would throw.
    const fontsReady: Promise<unknown> | undefined = document.fonts?.ready
    if (fontsReady) {
      fontsReady.then(fontsArrived, fontsArrived)
    }

    // Only a gate when a canvas is genuinely mounting. Once the 3D is gated to
    // the homepage, non-shop routes must not wait on a signal that never fires.
    if (isThreePending()) {
      const threeArrived = gate('three', THREE_CAP_MS)
      cleanups.push(
        subscribeToLoadSignals(() => {
          if (isThreeReady()) threeArrived()
        })
      )
    }

    timers.push(window.setTimeout(settle, MAX_SPLASH_MS))

    return () => {
      timers.forEach(clearTimeout)
      cleanups.forEach(fn => fn())
    }
  }, [active, reduced])

  return { finished, gone }
}

export default function Loader() {
  const reduced = useReducedMotion()
  const [active] = useState(() => !hasSeenSplash())
  const { finished, gone } = useSplashProgress(active, Boolean(reduced))

  useEffect(() => {
    if (!active) return
    markSplashSeen()
  }, [active])

  if (!active || gone) return null

  return (
    <div
      data-testid="splash-loader"
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream transition-opacity duration-300"
      style={{ opacity: finished ? 0 : 1, pointerEvents: finished ? 'none' : undefined }}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 10, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center"
      >
        <motion.span
          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-clay/12 via-blush/20 to-lilac/20 text-clay-deep"
          initial={reduced ? false : { scale: 0.8, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          <LogoMark className="h-11 w-11" strokeWidth={1.6} />
        </motion.span>

        <motion.p
          className="mt-6 font-brand text-[0.95rem] font-semibold uppercase tracking-[0.34em] text-ink"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {BRAND_NAME}
        </motion.p>
      </motion.div>

      <div
        className="mt-9 h-[3px] w-40 overflow-hidden rounded-pill bg-ink/10 max-sm:w-28"
        role="presentation"
      >
        {/* A dynamic import() exposes no byte-level progress, so this fill is a
            smoothed indicator, not a real percentage. See splash-fill in index.css. */}
        <div
          data-testid="splash-progress"
          data-state={finished ? 'complete' : 'running'}
          className="h-full rounded-pill bg-gradient-to-r from-clay via-blush to-lilac"
          style={
            finished
              ? { width: '100%', transition: 'width 200ms ease-out' }
              : { animation: `splash-fill ${MAX_SPLASH_MS}ms ease-out forwards` }
          }
        />
      </div>
    </div>
  )
}
