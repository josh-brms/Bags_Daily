/**
 * Load-readiness signals shared between the splash loader and the 3D scene.
 *
 * A module-level store rather than React context: the producer (AmbientScene) is
 * lazily imported and the consumer (Loader) must be able to read state before any
 * component tree has mounted.
 */

type Listener = () => void

let threePending = false
let threeReady = false
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach(l => l())
}

export function markThreePending() {
  if (threePending) return
  threePending = true
  emit()
}

export function markThreeReady() {
  if (threeReady) return
  threeReady = true
  emit()
}

export const isThreePending = () => threePending
export const isThreeReady = () => threeReady

export function subscribeToLoadSignals(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Test-only. */
export function resetLoadSignals() {
  threePending = false
  threeReady = false
  listeners.clear()
}
