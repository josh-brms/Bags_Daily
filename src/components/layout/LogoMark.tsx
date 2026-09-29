interface LogoMarkProps {
  className?: string
  /** Sparkles read as noise below ~18px, so the favicon drops it. */
  withSparkle?: boolean
  strokeWidth?: number
}

/**
 * The Bags Daily PH mark: a tapered tote with two arc handles and a 4-point sparkle.
 *
 * Drawn on a 24 grid so it holds proportion at every size. The bag is stroked and
 * the sparkle is filled — that contrast is what keeps it legible at 16px.
 */
export default function LogoMark({
  className = '',
  withSparkle = true,
  strokeWidth = 1.8
}: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Handles, above the body's top edge at y=9.5 */}
        <path d="M7.5 9.5C7.5 5.5 11 5.5 11 9.5" />
        <path d="M13 9.5C13 5.5 16.5 5.5 16.5 9.5" />
        {/* Body — narrower at the top, flaring toward the base */}
        <path d="M6 9.5h12a1.6 1.6 0 0 1 1.6 1.8l-.6 6.9a2 2 0 0 1-2 1.8H7a2 2 0 0 1-2-1.8l-.6-6.9A1.6 1.6 0 0 1 6 9.5Z" />
      </g>
      {withSparkle && (
        <path
          fill="currentColor"
          d="M20.5 2.4c0 1.17.63 1.8 1.8 1.8-1.17 0-1.8.63-1.8 1.8 0-1.17-.63-1.8-1.8-1.8 1.17 0 1.8-.63 1.8-1.8Z"
        />
      )}
    </svg>
  )
}
