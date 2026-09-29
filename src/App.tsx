import { Suspense, lazy, useEffect, useRef } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import Lenis from 'lenis'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/layout/CustomCursor'
import ScrollProgress from '@/components/layout/ScrollProgress'
import AppErrorBoundary from '@/components/layout/AppErrorBoundary'
import ConsentBanner from '@/components/layout/ConsentBanner'
import Loader from '@/components/layout/Loader'
import AmbientScene from '@/components/three/AmbientScene'
import Home from '@/pages/Home'
import Product from '@/pages/Product'
import Collection from '@/pages/Collection'
import Privacy from '@/pages/legal/Privacy'
import Terms from '@/pages/legal/Terms'
import Refund from '@/pages/legal/Refund'
import Cookies from '@/pages/legal/Cookies'
import NotFound from '@/pages/NotFound'
import { pageTransition } from '@/lib/motion'

// The admin is the only consumer of the Supabase SDK. Lazy-loading it keeps the
// client library out of the bundle a normal visitor downloads.
const Admin = lazy(() => import('@/pages/Admin'))

/**
 * Owns the Lenis instance and routes all scrolling through it.
 *
 * Lenis lives in a ref rather than state: it is created once and never needs to
 * trigger a re-render. Declared before the scroll effect so it exists by the time
 * a hash navigation fires on first paint.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ autoRaf: true })
    lenisRef.current = lenis
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    const lenis = lenisRef.current

    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        // Must go through Lenis. Native scrollIntoView bypasses it, which snaps the
        // scroll position and then fights Lenis's own animation.
        if (lenis) lenis.scrollTo(el, { offset: -90 })
        else el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }

    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function App() {
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      <ScrollManager />
      <CustomCursor />
      <ScrollProgress />
      <AmbientScene />
      {/* Must render after AmbientScene so its effect marks the 3D pending first. */}
      <Loader />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />

      <AppErrorBoundary>
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            id="main"
            key={location.pathname}
            variants={pageTransition}
            initial="initial"
            animate="enter"
            exit="exit"
            className="relative z-10"
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route
              path="/admin"
              element={
                <Suspense fallback={<div className="container-cy py-20 text-center text-ink/70">Loading…</div>}>
                  <Admin />
                </Suspense>
              }
            />
              <Route path="/collection" element={<Collection />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.main>
        </AnimatePresence>
      </AppErrorBoundary>

      <div className="relative z-10">
        <Footer />
      </div>
      <ConsentBanner />
      <Toaster
        position="bottom-center"
        toastOptions={{          style: {
            background: 'rgba(33, 29, 27, 0.72)',
            backdropFilter: 'blur(16px) saturate(140%)',
            WebkitBackdropFilter: 'blur(16px) saturate(140%)',
            color: '#FAF8F6',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0 8px 32px rgba(33, 29, 27, 0.18)'
          }
        }}
      />
    </MotionConfig>
  )
}
