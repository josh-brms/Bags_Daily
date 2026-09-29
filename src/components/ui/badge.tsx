import { forwardRef, type ElementRef, type ComponentPropsWithoutRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.14em] transition-colors',
  {
    variants: {
      variant: {
        glass: 'border-white/60 bg-white/45 text-ink backdrop-blur-md',
        dark: 'border-white/16 bg-ink/72 text-cream backdrop-blur-md',
        clay: 'border-transparent bg-clay/12 text-clay-deep',
        blush: 'border-transparent bg-blush/25 text-blush-deep',
        lilac: 'border-transparent bg-lilac/25 text-lilac-deep'
      }
    },
    defaultVariants: { variant: 'glass' }
  }
)

export interface BadgeProps
  extends ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<ElementRef<'span'>, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
