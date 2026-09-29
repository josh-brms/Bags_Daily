/**
 * Client-side image preparation for admin uploads.
 *
 * Uploads go straight into git, where they are permanent and never garbage
 * collected, so resizing in the browser is not an optimisation — it is what
 * keeps a 6 MB phone photo from being committed forever. No server needed:
 * canvas does the work.
 */

/**
 * Cards and galleries render at aspect-[3/4], because that is what the catalogue
 * actually holds: the existing photos are 960x1280. Resizing new uploads to
 * anything else guarantees they get cropped on the way to the screen.
 */
export const TARGET_ASPECT = 3 / 4
export const MAX_EDGE = 1600
export const QUALITY = 0.82

export interface PreparedImage {
  bytes: Uint8Array
  width: number
  height: number
  filename: string
  /** Set when the aspect ratio will be cropped in the card grid. */
  warning: string | null
}

const readAsImageBitmap = (file: Blob): Promise<ImageBitmap | HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('That file could not be read as an image.'))
    }
    img.src = url
  })

export async function prepareImage(file: File, slug: string): Promise<PreparedImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('That file is not an image.')
  }

  const img = await readAsImageBitmap(file)
  const sw = 'naturalWidth' in img ? img.naturalWidth : img.width
  const sh = 'naturalHeight' in img ? img.naturalHeight : img.height

  if (!sw || !sh) throw new Error('That image has no readable dimensions.')

  const scale = Math.min(1, MAX_EDGE / Math.max(sw, sh))
  const width = Math.round(sw * scale)
  const height = Math.round(sh * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('This browser cannot resize images.')

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)
  if ('close' in img && typeof img.close === 'function') img.close()

  const blob = await new Promise<Blob | null>(resolve =>
    canvas.toBlob(resolve, 'image/jpeg', QUALITY)
  )
  if (!blob) throw new Error('Could not re-encode that image.')

  const ratio = width / height
  const drift = Math.abs(ratio - TARGET_ASPECT) / TARGET_ASPECT
  const warning =
    drift > 0.02
      ? `Aspect ratio is ${ratio.toFixed(2)}:1 but photos render at 3:4 (0.75) — this will be cropped.`
      : null

  return {
    bytes: new Uint8Array(await blob.arrayBuffer()),
    width,
    height,
    filename: `${slug || 'product'}.jpg`,
    warning
  }
}

/** Slug for the uploaded filename, so stored images stay readable. */
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

export const formatBytes = (n: number): string =>
  n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1048576).toFixed(1)} MB`
