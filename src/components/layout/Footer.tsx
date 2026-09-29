import { Link } from 'react-router-dom'
import { ArrowUp, Mail } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import BrandMark from './BrandMark'
import { Button } from '@/components/ui/button'
import { BRAND_NAME, LEGAL_ENTITY, LOCATION, CONTACT_EMAIL } from '@/data/site'
import { Separator } from '@/components/ui/separator'

const explore = [
  { to: '/collection', label: 'Collection' },
  { to: '/#about', label: 'About' },
  { to: '/', label: 'Home' }
]

const legal = [
  { to: '/privacy', label: 'Privacy policy' },
  { to: '/terms', label: 'Terms and conditions' },
  { to: '/refund', label: 'Refund policy' },
  { to: '/cookies', label: 'Cookie policy' }
]

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex min-h-11 items-center text-[0.95rem] text-muted no-underline transition-colors active:text-ink hover:text-ink"
    >
      {/* Underline wipes in from the left on hover */}
      <span className="bg-gradient-to-r from-clay to-clay bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
        {children}
      </span>
    </Link>
  )
}

export default function Footer() {
  return (
    <footer id="contact" className="glass relative z-10 border-t border-white/50">
      <div className="container-cy grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[2fr_1.2fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-3">
          <BrandMark />
          <p className="max-w-[30ch] text-[0.95rem] leading-relaxed text-muted">
            New pieces, restocks, and notes from the studio.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2.5">
          <h2 className="mb-1.5 font-display text-[0.85rem] font-semibold uppercase tracking-[0.14em]">Contact</h2>
          <address className="text-[0.95rem] not-italic leading-7 text-muted">
            {BRAND_NAME}
            <br />
            <span className="text-[0.82rem]">by {LEGAL_ENTITY}</span>
            <br />
            {LOCATION}
            <br />
            Philippines
          </address>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex min-h-11 items-center gap-2 text-[0.95rem] text-muted no-underline transition-colors active:text-ink hover:text-ink"
          >
            <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="flex flex-col items-start gap-2.5">
          <h2 className="mb-1.5 font-display text-[0.85rem] font-semibold uppercase tracking-[0.14em]">Explore</h2>
          {explore.map(l => (
            <FooterLink key={l.label} to={l.to}>
              {l.label}
            </FooterLink>
          ))}
        </div>

        <div className="flex flex-col items-start gap-2.5">
          <h2 className="mb-1.5 font-display text-[0.85rem] font-semibold uppercase tracking-[0.14em]">Legal</h2>
          {legal.map(l => (
            <FooterLink key={l.to} to={l.to}>
              {l.label}
            </FooterLink>
          ))}
        </div>
      </div>

      <Separator className="bg-white/50" />

      <div className="py-5 text-[0.85rem] text-muted">
        <div className="container-cy flex items-center justify-between gap-4">
          <span>{new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</span>
          <BackToTop />
        </div>
      </div>
    </footer>
  )
}

function BackToTop() {
  const reduced = useReducedMotion()
  const toTop = () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  return (
    <Button
      variant="glass"
      onClick={toTop}
      aria-label="Back to top"
      className="rounded-pill border border-white/50 px-3"
    >
      <ArrowUp aria-hidden="true" />
    </Button>
  )
}
