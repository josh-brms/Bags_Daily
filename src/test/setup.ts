import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
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

if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  })) as unknown as typeof window.matchMedia
}

window.scrollTo = (() => {}) as typeof window.scrollTo
