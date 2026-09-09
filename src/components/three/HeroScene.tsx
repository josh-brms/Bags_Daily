import React, { Suspense, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import HeroErrorBoundary from './HeroErrorBoundary'

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

const HeroFallback = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0"
    style={{
      background:
        'radial-gradient(55% 45% at 15% 20%, rgba(244,215,186,0.55), transparent 65%),' +
        'radial-gradient(45% 40% at 85% 75%, rgba(180,105,58,0.16), transparent 60%),' +
        'linear-gradient(180deg, #F5F0EA 0%, #FAF8F6 100%)'
    }}
  />
)

const HeroCanvas = React.lazy(() => import('./HeroCanvas'))

export default function HeroScene() {
  const reduced = useReducedMotion()
  const [supported] = useState(hasWebGL)

  if (reduced || !supported) return <HeroFallback />

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <HeroErrorBoundary fallback={<HeroFallback />}>
        <Suspense fallback={<HeroFallback />}>
          <HeroCanvas />
        </Suspense>
      </HeroErrorBoundary>
    </div>
  )
}
