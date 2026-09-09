import { ArrowDown, ArrowUp, Sparkles } from 'lucide-react'
import type { SortOption } from '@/lib/sort'
import { cn } from '@/lib/utils'

const options: { value: SortOption; label: string; icon?: 'up' | 'down' }[] = [
  { value: 'featured', label: 'Featured', icon: undefined },
  { value: 'price-asc', label: 'Price', icon: 'up' },
  { value: 'price-desc', label: 'Price', icon: 'down' }
]

interface SortControlProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export default function SortControl({ value, onChange }: SortControlProps) {
  return (
    <div
      role="group"
      aria-label="Sort products"
      className="glass glass-ring inline-flex items-center gap-1 rounded-pill p-1.5"
    >
      {options.map(o => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            aria-label={
              o.icon === 'up' ? 'Sort by price, low to high' : o.icon === 'down' ? 'Sort by price, high to low' : o.label
            }
            onClick={() => onChange(o.value)}
            className={cn(
              'inline-flex min-h-9 items-center gap-1.5 rounded-pill px-4 text-[0.8rem] font-medium transition-colors duration-200',
              active ? 'bg-ink text-cream' : 'text-ink hover:bg-white/60'
            )}
          >
            {o.icon === undefined && <Sparkles size={14} strokeWidth={2} aria-hidden="true" />}
            {o.label}
            {o.icon === 'up' && <ArrowUp size={14} strokeWidth={2} aria-hidden="true" />}
            {o.icon === 'down' && <ArrowDown size={14} strokeWidth={2} aria-hidden="true" />}
          </button>
        )
      })}
    </div>
  )
}
