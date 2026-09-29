import { forwardRef, type ElementRef, type ComponentPropsWithoutRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2.5 whitespace-nowrap rounded-pill text-[0.9rem] tracking-[0.04em] no-underline transition-[background-color,border-color,box-shadow,color,text-decoration-color,scale] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cream active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 [&_svg]:h-[18px] [&_svg]:w-[18px] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'border border-ink bg-ink px-6 py-3 font-medium text-cream shadow-soft hover:border-ink-hover hover:bg-ink-hover hover:shadow-lift',
        glass:
          'glass-strong glass-ring glass-sheen px-6 py-3 font-semibold text-ink hover:bg-white/75 hover:shadow-lift',
        accent:
          'border border-transparent bg-gradient-to-r from-clay via-blush to-lilac px-7 py-3.5 font-semibold text-ink shadow-glow hover:shadow-lift hover:brightness-[1.04]',
        ghost:
          'px-5 py-3 font-medium text-ink underline decoration-clay/60 decoration-2 underline-offset-8 hover:decoration-clay'
      },
      size: {
        default: '',
        sm: 'min-h-10 px-5 py-2.5 text-[0.85rem]',
        icon: 'h-11 w-11 min-h-11 p-0'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<ElementRef<'button'>, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp ref={ref} className={cn(buttonVariants({ variant, className }))} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
