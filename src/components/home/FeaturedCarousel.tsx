import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarouselState,
  type CarouselApi
} from '@/components/ui/carousel'
import { Images } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ProductImage from '@/components/ui/ProductImage'
import type { Product } from '@/lib/products'
import { BRAND_NAME } from '@/data/site'

/** Up to six, spread across the range so the band previews the whole collection. */
const featured = (products: Product[]): Product[] => {
  if (products.length === 0) return []
  const step = Math.max(1, Math.floor(products.length / 6))
  return products.filter((_, i) => i % step === 0).slice(0, 6)
}

/** Deliberately under 100% so the next card peeks in and the track has scroll room. */
const SLIDE_BASIS = 'basis-[86%] sm:basis-1/2 lg:basis-[33%]'

export default function FeaturedCarousel({ products }: { products: Product[] }) {
  const items = featured(products)
  const [api, setApi] = useState<CarouselApi>()
  const { selected, snapCount } = useCarouselState(api)

  // Stable instance: recreating the plugin would restart the autoplay timer on every render.
  const autoplay = useMemo(
    () => Autoplay({ delay: 4200, stopOnInteraction: false, stopOnMouseEnter: true }),
    []
  )

  if (items.length === 0) return null

  return (
    <section aria-labelledby="featured-title" className="py-20">
      <div className="container-cy">
        <div className="mb-9 flex flex-col items-center gap-3 text-center">
          <Badge variant="blush">Handpicked</Badge>
          <motion.h2
            id="featured-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            className="font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-semibold tracking-[-0.02em]"
          >
            Start here
          </motion.h2>
          <p className="max-w-[44ch] text-[0.95rem] text-ink/75">
            Six pieces that show the range — soft structure, warm colour, everyday weight.          </p>
        </div>

        <Carousel
          opts={{ align: 'start', loop: true }}
          plugins={[autoplay]}
          setApi={setApi}
          aria-label="Featured products"
        >
          <CarouselContent className="-ml-5 max-md:-ml-4">
            {items.map((p, i) => (
              <CarouselItem key={p.id} className={`max-md:pl-4 pl-5 ${SLIDE_BASIS}`}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                >
                  <Card className="group h-full hover:-translate-y-1.5 hover:shadow-glow">
                    <CardContent className="p-3 pt-3">
                      <Link
                        to={`/product/${p.id}`}
                        className="block no-underline"
                        aria-label={`${p.name} — see photos`}
                      >
                        <div className="relative overflow-hidden rounded-lg bg-white/50">
                          <div className="aspect-[3/4] overflow-hidden">
                            <ProductImage
                              src={p.images[0]}
                              alt={`${p.name} from the ${BRAND_NAME} collection`}
                              sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 86vw"
                              width={800}
                              height={1067}
                              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                            />
                          </div>
                          {p.images.length > 1 && (
                            <span className="glass-dark absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[0.7rem] font-medium tracking-[0.06em] text-cream">
                              <Images size={12} aria-hidden="true" />
                              {p.images.length} photos
                            </span>
                          )}
                        </div>
                        <div className="px-1 pb-1 pt-4">
                          <span className="font-display text-[1.05rem] font-semibold text-ink">
                            {p.name}
                          </span>
                        </div>
                        <p className="px-1 pt-1.5 text-[0.88rem] leading-relaxed text-ink/70">
                          {p.description}
                        </p>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-10 flex items-center justify-center gap-8">
            <CarouselPrevious />
            <CarouselNext />
          </div>

          {snapCount > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-1">
              {Array.from({ length: snapCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === selected}
                  onClick={() => api?.scrollTo(i)}
                  // The dot stays 8px tall so the row reads as a hairline, but
                  // the button is 44x44: an 8x8 target is untappable on a phone.
                  className="grid h-11 w-11 shrink-0 place-items-center"
                >
                  <span
                    aria-hidden="true"
                    className={
                      i === selected
                        ? 'h-2 w-7 rounded-pill bg-clay transition-all duration-300'
                        : 'h-2 w-2 rounded-pill bg-ink/35 transition-all duration-300 hover:bg-ink/60'
                    }
                  />
                </button>
              ))}
            </div>
          )}
        </Carousel>
      </div>
    </section>
  )
}
