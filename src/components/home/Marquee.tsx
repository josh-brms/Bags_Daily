const items = ['The Collection', 'Est. 2026', 'Naga City', 'Twelve pieces', 'Warm neutrals']

function MarqueeContent() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map(item => (
        <span key={item} className="flex items-center">
          <span className="px-6 text-[0.78rem] font-medium uppercase tracking-[0.22em] text-ink">
            {item}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-clay" aria-hidden="true" />
        </span>
      ))}
    </div>
  )
}

export default function Marquee() {
  return (
    <div className="marquee glass glass-ring relative z-10 overflow-hidden border-x-0 py-4" aria-hidden="true">
      <div className="marquee-track flex w-max">
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  )
}
