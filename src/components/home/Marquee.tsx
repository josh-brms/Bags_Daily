/* Non-numeric on purpose: a hardcoded count would go stale the moment the
   catalogue changes, and this band scrolls past too fast to read precisely. */
const items = [
  'The Collection',
  'Est. 2026',
  'Legazpi',
  'Small batch',
  'Warm neutrals',
  'Hand-finished'
]

const dotColors = ['#B4693A', '#D1939A', '#A38CBC', '#8A5A3A', '#D9A5A9', '#7E6A9E']

function MarqueeContent() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={item} className="flex items-center">
          <span className="px-7 font-display text-[0.82rem] font-medium uppercase tracking-[0.22em] text-ink">
            {item}
          </span>
          <span
            className="h-1.5 w-1.5 rounded-pill"
            style={{ backgroundColor: dotColors[i % dotColors.length] }}
            aria-hidden="true"
          />
        </span>
      ))}
    </div>
  )
}

export default function Marquee() {
  return (
    <div
      className="marquee glass glass-ring relative z-10 overflow-hidden border-x-0 py-5"
      aria-hidden="true"
      /* Mask the edges so items dissolve in and out instead of clipping hard. */
      style={{
        maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)'
      }}
    >
      <div className="marquee-track flex w-max">
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  )
}
