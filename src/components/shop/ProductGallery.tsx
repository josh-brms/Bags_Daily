import { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi
} from '@/components/ui/carousel'
import ProductImage from '@/components/ui/ProductImage'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  /** Used for the alt text and the accessible name of each slide. */
  name: string
  /** True for the first slide of a page load, so the cover is not lazy. */
  priority?: boolean
}

/**
 * A product's photos as a swipeable strip.
 *
 * No autoplay and no loop, on purpose: a carousel that moves on its own fights
 * a visitor trying to read the caption, and a loop never signals that there is
 * an end. Embla's defaults already match, so neither is configured.
 *
 * The catalogue is small, so a detail page simply reads the whole list and finds
 * its product — no separate per-product fetch, and no second cache to keep in sync.
 */
export default function ProductGallery({ images, name, priority = false }: ProductGalleryProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [index, setIndex] = useState(0)
  const many = images.length > 1

  // Track the leading visible photo, not the scroll snap. Several photos fit on a
  // desktop screen, so snap 1 of 1 is photo 1 of 6 and the old number was wrong
  // there too — this reads the slide itself.
  useEffect(() => {
    if (!api) return
    const sync = () => setIndex(api.slidesInView()[0] ?? 0)
    sync()
    api.on('reInit', sync)
    api.on('select', sync)
    return () => {
      api.off('reInit', sync)
      api.off('select', sync)
    }
  }, [api])

  if (images.length === 0) return null

  return (
    <div>
      <Carousel opts={{ align: 'start', loop: false }} setApi={setApi} className="group/gallery">
        <CarouselContent>
          {images.map((src, i) => (
            <CarouselItem
              key={src}
              // A slide is a flex item with shrink-0, so without a width it sizes
              // to the image's intrinsic 1000px and you see a zoomed sliver of one
              // photo. Capping it means a whole photo is visible, with the next
              // one peeking, at any viewport.
              className="w-full max-w-[26rem]"
              aria-label={`Photo ${i + 1} of ${images.length} of ${name}`}
            >
              <div className="glass glass-ring overflow-hidden rounded-2xl p-3">
                {/*
                  Square, because the photos are shot on a surface with a wall
                  above: a 3:4 frame spends a quarter of its height on floor and
                  ceiling, and a square crop leaves only the bags.

                  The vertical focal point sits slightly above centre for the same
                  reason — the top of these frames is background, while the
                  bottom carries detail like an embossed logo, so biasing up keeps
                  it. Measured against real catalogue photos, not guessed.
                */}
                <div className="aspect-square overflow-hidden rounded-xl bg-white/45">
                  <ProductImage
                    src={src}
                    alt={`${name}, photo ${i + 1}`}
                    sizes="(min-width: 1024px) 46vw, 92vw"
                    width={1000}
                    height={1000}
                    loading={priority || i === 0 ? 'eager' : 'lazy'}
                    className="h-full w-full object-cover object-[center_45%]"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {many && (
          <>
            <CarouselPrevious
              className="glass-dark left-4 border-0 opacity-0 transition-opacity group-hover/gallery:opacity-100 focus-visible:opacity-100"
              aria-label="Previous photo"
            />
            <CarouselNext
              className="glass-dark right-4 border-0 opacity-0 transition-opacity group-hover/gallery:opacity-100 focus-visible:opacity-100"
              aria-label="Next photo"
            />
            <p
              aria-live="polite"
              className="glass-dark absolute bottom-4 left-1/2 -translate-x-1/2 rounded-pill px-3 py-1.5 text-[0.72rem] font-medium tracking-[0.08em] text-cream"
            >
              {index + 1} / {images.length}
            </p>
          </>
        )}
      </Carousel>

      {many && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => api?.scrollTo(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  'overflow-hidden rounded-lg border-2 transition-colors',
                  i === index ? 'border-clay' : 'border-transparent hover:border-clay/40'
                )}
              >
                <ProductImage
                  src={src}
                  alt=""
                  width={80}
                  height={80}
                  className="h-20 w-20 object-cover object-[center_45%]"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
