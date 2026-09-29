import { describe, it, expect } from 'vitest'
import { TARGET_ASPECT } from './imageResize'

/**
 * The catalogue's real photo shape, measured from the live project: 28 of 29
 * products are shot 960x1280, with a single 1038x1280 outlier. These are the
 * dimensions, not an assumption — if the studio starts uploading a different
 * shape, this is the test that should be updated alongside the frames.
 */
const DOMINANT = { width: 960, height: 1280 }
const OUTLIER = { width: 1038, height: 1280 }

const ratio = (d: { width: number; height: number }) => d.width / d.height
/** How much of the photo's height a 3:4 frame cuts off, top and bottom combined. */
const croppedFraction = (d: { width: number; height: number }) =>
  ratio(d) < TARGET_ASPECT ? 1 - ratio(d) / TARGET_ASPECT : 0

describe('TARGET_ASPECT', () => {
  it('is the ratio the real photos already are', () => {
    expect(TARGET_ASPECT).toBeCloseTo(ratio(DOMINANT), 3)
  })

  it('does not crop the dominant photo shape at all', () => {
    expect(croppedFraction(DOMINANT)).toBe(0)
  })

  it('barely touches the one 4:5 outlier', () => {
    // The alternative — framing at 4:5 — cuts 6.7% off every photo in the
    // catalogue to accommodate a single product.
    expect(croppedFraction(OUTLIER)).toBeLessThan(0.05)
  })
})
