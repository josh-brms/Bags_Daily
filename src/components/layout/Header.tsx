import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import BrandMark from './BrandMark'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/#shop', label: 'Shop', end: false },
  { to: '/#about', label: 'About', end: false },
  { to: '/#contact', label: 'Contact', end: false }
]

export default function Header() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [lastLocation, setLastLocation] = useState(location)
  const closeRef = useRef<HTMLButtonElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  if (lastLocation !== location) {
    setLastLocation(location)
    setOpen(false)
  }

  useEffect(() => {
    if (open) {
      closeRef.current?.focus()
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false)
          toggleRef.current?.focus()
        }
      }
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-white/50">
      <div className="container-cy flex min-h-[68px] items-center justify-between gap-6">
        <BrandMark />

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links.map(l =>
            l.end ? (
              <NavLink
                key={l.to}
                to={l.to}
                end
                className={({ isActive }) =>
                  cn(
                    'relative py-1.5 text-[0.85rem] font-medium uppercase tracking-[0.08em] text-ink no-underline',
                    !isActive && 'hover:underline hover:decoration-clay hover:underline-offset-4'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-0 -bottom-px h-px bg-clay"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ) : (
              <Link
                key={l.to}
                to={l.to}
                className="py-1.5 text-[0.85rem] font-medium uppercase tracking-[0.08em] text-ink no-underline hover:underline hover:decoration-clay hover:underline-offset-4"
              >
                {l.label}
              </Link>
            )
          )}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center text-ink md:hidden"
        >
          <Menu size={24} strokeWidth={2} aria-hidden="true" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-cream/55 backdrop-blur-2xl md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
            >
              <button
                ref={closeRef}
                type="button"
                aria-label="Close menu"
                onClick={() => {
                  setOpen(false)
                  toggleRef.current?.focus()
                }}
                className="absolute right-3.5 top-3.5 flex h-11 w-11 items-center justify-center text-ink"
              >
                <X size={24} strokeWidth={2} aria-hidden="true" />
              </button>
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.3, ease: 'easeOut' }}
                >
                  <Link
                    to={l.to}
                    className="text-[1.15rem] uppercase tracking-[0.14em] text-ink no-underline"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
