import { Link } from 'react-router-dom'
import LogoMark from './LogoMark'
import { BRAND_NAME } from '@/data/site'

export default function BrandMark({ className = '' }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`group inline-flex min-h-11 items-center gap-2.5 py-2 text-ink no-underline active:opacity-60 ${className}`}
      aria-label={`${BRAND_NAME} — home`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-gradient-to-br from-clay/12 via-blush/18 to-lilac/18 transition-transform duration-300 group-hover:scale-105">
        <LogoMark className="h-[19px] w-[19px]" />
      </span>
      <span className="font-brand text-[1.05rem] font-semibold uppercase tracking-[0.14em]">
        {BRAND_NAME}
      </span>
    </Link>
  )
}
