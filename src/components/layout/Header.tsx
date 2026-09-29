import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import BrandMark from './BrandMark'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { LOCATION_SHORT } from '@/data/site'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/collection', label: 'Collection', end: false },
  { to: '/#about', label: 'About', end: false },
  { to: '/#contact', label: 'Contact', end: false }
]

export default function Header() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [lastLocation, setLastLocation] = useState(location)

  if (lastLocation !== location) {
    setLastLocation(location)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="glass-strong sticky top-0 z-50 rounded-none border-x-0 border-b border-t-0 border-white/50">
      <div className="container-cy flex min-h-[72px] items-center justify-between gap-6">
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
                    'group relative flex min-h-11 items-center py-1.5 text-[0.85rem] font-medium uppercase tracking-[0.08em] text-ink no-underline active:opacity-60',
                    !isActive && 'hover:text-ink-hover'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-0 -bottom-px h-0.5 rounded-pill bg-gradient-to-r from-clay via-blush to-lilac"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ) : (
              <Link
                key={l.to}
                to={l.to}
                className="group relative flex min-h-11 items-center py-1.5 text-[0.85rem] font-medium uppercase tracking-[0.08em] text-ink no-underline active:opacity-60 hover:text-ink-hover"
              >
                {l.label}
                {/* Underline wipes in from the left on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 rounded-pill bg-gradient-to-r from-clay via-blush to-lilac transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </Link>
            )
          )}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="glass glass-ring flex h-11 w-11 items-center justify-center rounded-pill text-ink transition-colors hover:bg-white/70 md:hidden"
            >
              <Menu size={22} strokeWidth={2} aria-hidden="true" />
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="md:hidden">
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
            </SheetHeader>

            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.32, ease: 'easeOut' }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center rounded-pill px-4 font-display text-[1.25rem] text-ink no-underline transition-colors hover:bg-white/45 active:opacity-60"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <p className="mt-auto pt-8 text-[0.78rem] uppercase tracking-[0.16em] text-muted">
              Est. 2026 · {LOCATION_SHORT}
            </p>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
