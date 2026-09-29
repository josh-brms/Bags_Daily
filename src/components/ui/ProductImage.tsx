import { IMAGE_VARIANTS } from '@/data/imageVariants'

interface ProductImageProps {
  /** Repo-relative path, e.g. "images/foo.jpg". */
  src: string
  alt: string
  /** Must describe real rendered widths, or the browser picks the wrong candidate. */
  sizes?: string
  width?: number
  height?: number
  className?: string
  loading?: 'lazy' | 'eager'
}

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

const isRemote = (src: string) => /^https?:\/\//i.test(src)

const srcSet = (variants: { width: number; path: string }[]) =>
  variants.map(v => `${asset(v.path)} ${v.width}w`).join(', ')

/**
 * Emits <picture> with AVIF and WebP sources when variants exist for the image.
 *
 * Handles two kinds of source:
 *  - a full URL (an upload in Supabase Storage) — used as-is, no variants
 *  - a repo path such as "images/x.jpg" — served from public/ with variants
 *
 * An image with no manifest entry (a repo image added after `npm run images` was
 * last run) falls back to a plain <img> rather than pointing at variants that do
 * not exist — the common failure mode of a generated srcset.
 */
export default function ProductImage({
  src,
  alt,
  sizes,
  width,
  height,
  className,
  loading = 'lazy'
}: ProductImageProps) {
  const remote = isRemote(src)
  const entry = remote ? undefined : IMAGE_VARIANTS[src]

  const img = (
    <img
      src={remote ? src : asset(entry?.original ?? src)}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={className}
    />
  )

  if (!entry) return img

  return (
    <picture>
      {entry.avif.length > 0 && (
        <source type="image/avif" srcSet={srcSet(entry.avif)} sizes={sizes} />
      )}
      {entry.webp.length > 0 && (
        <source type="image/webp" srcSet={srcSet(entry.webp)} sizes={sizes} />
      )}
      {img}
    </picture>
  )
}
