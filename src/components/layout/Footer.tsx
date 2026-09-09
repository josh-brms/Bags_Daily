import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import BrandMark from './BrandMark'

const explore = [
  { to: '/#shop', label: 'Shop' },
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
      className="text-[0.95rem] text-muted no-underline hover:text-ink hover:underline hover:underline-offset-4"
    >
      {children}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer id="contact" className="glass relative z-10 border-t border-white/50">
      <div className="container-cy grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[2fr_1.2fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-2.5">
          <BrandMark />
          <p className="max-w-[30ch] text-[0.95rem] text-muted">
            New pieces, restocks, and notes from the studio.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2.5">
          <h2 className="mb-1.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em]">Contact</h2>
          <address className="text-[0.95rem] not-italic leading-7 text-muted">
            CY Studio
            <br />
            Naga City, Camarines Sur
            <br />
            Philippines
          </address>
          <a
            href="mailto:hello@cy.studio"
            className="inline-flex items-center gap-2 text-[0.95rem] text-muted no-underline hover:text-ink hover:underline hover:underline-offset-4"
          >
            <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
            hello@cy.studio
          </a>
        </div>

        <div className="flex flex-col items-start gap-2.5">
          <h2 className="mb-1.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em]">Explore</h2>
          {explore.map(l => (
            <FooterLink key={l.label} to={l.to}>
              {l.label}
            </FooterLink>
          ))}
        </div>

        <div className="flex flex-col items-start gap-2.5">
          <h2 className="mb-1.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em]">Legal</h2>
          {legal.map(l => (
            <FooterLink key={l.to} to={l.to}>
              {l.label}
            </FooterLink>
          ))}
        </div>
      </div>

      <div className="border-t border-white/50 py-5 text-[0.85rem] text-muted">
        <div className="container-cy">
          {new Date().getFullYear()} CY Studio. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
