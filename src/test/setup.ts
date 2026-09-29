import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

if (!('IntersectionObserver' in window)) {
  class IOStub {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  ;(window as unknown as Record<string, unknown>).IntersectionObserver = IOStub
}

if (!('ResizeObserver' in window)) {
  class ROStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  ;(window as unknown as Record<string, unknown>).ResizeObserver = ROStub
}

/**
 * Controllable matchMedia. `useReducedMotion()` reads the media query directly —
 * MotionConfig's `reducedMotion` prop does not change what the hook returns — so
 * tests need to be able to flip the query itself.
 */
let reducedMotionQueries = false

export const setReducedMotion = (value: boolean): void => {
  reducedMotionQueries = value
}

window.matchMedia = ((query: string) => ({
  get matches() {
    return query.includes('prefers-reduced-motion') ? reducedMotionQueries : false
  },
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false
})) as unknown as typeof window.matchMedia

/**
 * Tests must never depend on a developer's local `.env.local`, and must never
 * reach the network. Optional integrations are cleared here so the suite is
 * deterministic on every machine; individual tests opt back in with
 * `vi.stubEnv` plus `vi.resetModules()`.
 */
const OPTIONAL_ENV = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_INSTAGRAM_URL',
  'VITE_ANALYTICS_URL',
  'VITE_ANALYTICS_DOMAIN'
] as const

for (const key of OPTIONAL_ENV) {
  ;(import.meta.env as Record<string, string>)[key] = ''
}

window.scrollTo = (() => {}) as typeof window.scrollTo

/**
 * jsdom has no object URLs. The admin builds one per pending photo for its
 * thumbnail, and jsdom has no Blob-to-image pipeline behind it either, so the
 * stub is the honest stand-in: a stable, unique string per Blob.
 */
let blobCount = 0
URL.createObjectURL = vi.fn(() => `blob:mock/${++blobCount}`) as typeof URL.createObjectURL
URL.revokeObjectURL = vi.fn() as typeof URL.revokeObjectURL
