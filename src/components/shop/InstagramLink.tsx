import type { ReactNode } from 'react'
import { INSTAGRAM_URL } from '@/data/site'
import { trackOutboundClick } from '@/lib/analytics'

/**
 * Lucide dropped brand icons in newer versions, and brand glyphs are trademarked
 * anyway, so this is the standard simplified Instagram mark drawn by hand.
 */
export function InstagramGlyph({
  size = 14,
  className
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.2" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  )
}

interface InstagramLinkProps {
  href: string
  /** Product name, used to build the accessible label. */
  name: string
  className?: string
  children: ReactNode
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
}

const isInstagramUrl = (url: string): boolean => {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return host === 'instagram.com' || host === 'instagr.am'
  } catch {
    return false
  }
}

/**
 * The single definition of an outbound product link.
 *
 * External links open in a new tab, so they get `noopener noreferrer` and an
 * explicit "opens in a new tab" for screen readers. A bare card that silently
 * leaves the site is a usability trap, hence the visible Instagram affordance.
 */
export default function InstagramLink({
  href,
  name,
  className,
  children,
  onClick
}: InstagramLinkProps) {
  const safe = isInstagramUrl(href)
  const external = safe ? href : INSTAGRAM_URL

  return (
    <a
      href={external}
      target="_blank"
      rel="noopener noreferrer"
      onClick={event => {
        trackOutboundClick(name, external)
        onClick?.(event)
      }}
      aria-label={`${name} on Instagram (opens in a new tab)`}
      data-testid="instagram-link"
      className={`group/instagram block no-underline ${className ?? ''}`}
    >
      {children}
      {!safe && (
        <span className="sr-only" role="note">
          This product is missing a valid Instagram link.
        </span>
      )}
    </a>
  )
}
