import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import Loader, {
  hasSeenSplash,
  MAX_SPLASH_MS,
  FONT_CAP_MS,
  EXIT_MS
} from './Loader'
import { markThreePending, markThreeReady, resetLoadSignals } from '@/lib/loadSignals'

const SEEN_KEY = 'bd-splash-seen'
/** Exit fade, then the unmount that follows it. */
const TEARDOWN = EXIT_MS + 500
/** The 4s body-wipe bailout in index.html must stay above the splash cap. */
const BAILOUT_MS = 4000

/** Advances timers and flushes the resulting React state. */
const advance = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

const settled = () => screen.queryByTestId('splash-loader') === null

beforeEach(() => {
  window.sessionStorage.clear()
  resetLoadSignals()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  resetLoadSignals()
})

describe('Loader', () => {
  it('shows on a first visit of the session', () => {
    render(<Loader />)
    expect(screen.getByTestId('splash-loader')).toBeInTheDocument()
  })

  it('does not show again within the same session', () => {
    window.sessionStorage.setItem(SEEN_KEY, '1')
    expect(hasSeenSplash()).toBe(true)
    render(<Loader />)
    expect(screen.queryByTestId('splash-loader')).not.toBeInTheDocument()
  })

  it('records that the splash has been seen', () => {
    render(<Loader />)
    expect(window.sessionStorage.getItem(SEEN_KEY)).toBe('1')
  })

  it('caps below the index.html bailout', () => {
    // The invariant in MAX_SPLASH_MS: content must become visible before the
    // destructive body-wipe can fire, or a JS failure leaves a blank page.
    expect(MAX_SPLASH_MS).toBeLessThan(BAILOUT_MS)
  })

  it('resolves on the cap even when the 3D signal never arrives', () => {
    // Worst case: chunk 404 or an error-boundary trip, so onCreated never fires.
    markThreePending()
    render(<Loader />)

    advance(MAX_SPLASH_MS - 1)
    expect(settled()).toBe(false)

    advance(1 + TEARDOWN)
    expect(settled()).toBe(true)
  })

  it('resolves without waiting out the full cap when no 3D is mounting', () => {
    // Non-shop routes have no canvas and must not sit on the 2.5s cap.
    render(<Loader />)
    // Two steps: the exit timer is only scheduled after React flushes the effect
    // that watches `finished`, which happens when the first act() returns.
    advance(FONT_CAP_MS)
    advance(TEARDOWN)
    expect(settled()).toBe(true)
    expect(FONT_CAP_MS + TEARDOWN).toBeLessThan(MAX_SPLASH_MS)
  })

  it('tears down early when the 3D reports ready', () => {
    markThreePending()
    render(<Loader />)

    act(() => {
      markThreeReady()
    })
    advance(FONT_CAP_MS)
    advance(TEARDOWN)
    expect(settled()).toBe(true)
  })

  it('flips the fill to complete on teardown', () => {
    render(<Loader />)
    expect(screen.getByTestId('splash-progress')).toHaveAttribute('data-state', 'running')

    advance(MAX_SPLASH_MS)
    advance(TEARDOWN)
    expect(screen.queryByTestId('splash-progress')).not.toBeInTheDocument()
  })

  it('is hidden from assistive tech', () => {
    render(<Loader />)
    expect(screen.getByTestId('splash-loader')).toHaveAttribute('aria-hidden', 'true')
  })
})
