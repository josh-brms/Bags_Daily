import { Link } from 'react-router-dom'

export default function BrandMark({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex min-h-11 items-center gap-3 py-2 text-ink no-underline active:opacity-60 ${className}`} aria-label="CY Studio — home">
      <svg
        className="h-[30px] w-[30px] shrink-0"
        viewBox="0 0 36 36"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="18" cy="18" r="15.5" strokeWidth={1.5} />
        <path d="M11.5 10.5 L18 19 L24.5 10.5" />
        <path d="M18 19 V26" />
      </svg>
      <span className="text-[0.9rem] font-semibold uppercase tracking-[0.22em]">CY Studio</span>
    </Link>
  )
}
