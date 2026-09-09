import { useEffect } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import Lenis from 'lenis'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/layout/CustomCursor'
import AmbientScene from '@/components/three/AmbientScene'
import Home from '@/pages/Home'
import Product from '@/pages/Product'
import Privacy from '@/pages/legal/Privacy'
import Terms from '@/pages/legal/Terms'
import Refund from '@/pages/legal/Refund'
import Cookies from '@/pages/legal/Cookies'
import NotFound from '@/pages/NotFound'
import { pageTransition } from '@/lib/motion'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ autoRaf: true })
    return () => lenis.destroy()
  }, [])

  const location = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      <ScrollManager />
      <CustomCursor />
      <AmbientScene />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />

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
            <Route path="/product/:id" element={<Product />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      <div className="relative z-10">
        <Footer />
      </div>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
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
