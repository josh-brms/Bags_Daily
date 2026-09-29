import * as React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type UseEmblaCarouselType = ReturnType<typeof useEmblaCarousel>
type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: CarouselApi
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) throw new Error('useCarousel must be used within a <Carousel />')
  return context
}

type CarouselState = {
  canScrollPrev: boolean
  canScrollNext: boolean
  selected: number
  snapCount: number
}

const IDLE: CarouselState = {
  canScrollPrev: false,
  canScrollNext: false,
  selected: 0,
  snapCount: 0
}

/**
 * Reads live state off the embla instance.
 *
 * embla emits its `init` event from a setTimeout, and the instance only reaches
 * React a render later, so subscribing in an effect always misses that first
 * emission. useSyncExternalStore reads the snapshot during render instead, which
 * is both race-free and avoids a setState-in-effect.
 */
export function useCarouselState(api: CarouselApi | undefined): CarouselState {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      if (!api) return () => {}
      const events = ['reInit', 'select', 'slidesInView'] as const
      events.forEach(e => api.on(e, onStoreChange))
      return () => events.forEach(e => api.off(e, onStoreChange))
    },
    [api]
  )

  // getSnapshot must be referentially stable between real changes, so memoise on a key.
  const cache = React.useRef<{ key: string; value: CarouselState }>({ key: '', value: IDLE })

  const getSnapshot = React.useCallback(() => {
    if (!api) return IDLE
    const canScrollPrev = api.canScrollPrev()
    const canScrollNext = api.canScrollNext()
    const selected = api.selectedScrollSnap()
    const snapCount = api.scrollSnapList().length
    const key = `${canScrollPrev}${canScrollNext}${selected}${snapCount}`
    if (cache.current.key !== key) {
      cache.current = {
        key,
        value: { canScrollPrev, canScrollNext, selected, snapCount }
      }
    }
    return cache.current.value
  }, [api])

  return React.useSyncExternalStore(subscribe, getSnapshot, () => IDLE)
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      { ...opts, axis: orientation === 'horizontal' ? 'x' : 'y' },
      plugins
    )
    const { canScrollPrev, canScrollNext } = useCarouselState(api)

    const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api])
    const scrollNext = React.useCallback(() => api?.scrollNext(), [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (api && setApi) setApi(api)
    }, [api, setApi])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api as CarouselApi,
          opts,
          orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = 'Carousel'

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = 'CarouselContent'

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel()

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(
          'min-w-0 shrink-0 grow-0',
          orientation === 'horizontal' ? 'pl-4' : 'pt-4',
          className
        )}
        {...props}
      />
    )
  }
)
CarouselItem.displayName = 'CarouselItem'

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'default', size = 'icon', ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute h-11 w-11 rounded-pill',
        orientation === 'horizontal'
          ? 'left-2 top-1/2 -translate-y-1/2'
          : 'top-2 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft aria-hidden="true" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = 'CarouselPrevious'

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'default', size = 'icon', ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute h-11 w-11 rounded-pill',
        orientation === 'horizontal'
          ? 'right-2 top-1/2 -translate-y-1/2'
          : 'bottom-2 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight aria-hidden="true" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = 'CarouselNext'

export type { CarouselApi }
export {
  type CarouselProps,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
}
