/**
 * The palette the tote can be switched between.
 *
 * Every colourway supplies four parts so the drawing can recolour independently
 * rather than tinting one flat shape. All values reuse tokens already defined in
 * tailwind.config.ts — no new colours are introduced.
 */
export interface Colourway {
  id: string
  name: string
  /** Main bag body. */
  body: string
  /** Handles and trim: always a darker step of the body, so they read as separate. */
  handle: string
  /** The inside of the bag, seen through the opening. */
  lining: string
  /**
   * Stitching. Ink rather than cream on the lightest colourway, where cream
   * stitching would disappear against the body.
   */
  stitch: string
  /** Sparkle and small accents. */
  accent: string
}

export const COLOURWAYS: Colourway[] = [
  {
    id: 'clay',
    name: 'Clay',
    body: '#B4693A',
    handle: '#8A5A3A',
    lining: '#F2D9A0',
    stitch: '#FAF8F6',
    accent: '#8A5A3A'
  },
  {
    id: 'blush',
    name: 'Blush',
    body: '#E8B4B8',
    handle: '#D1939A',
    lining: '#FBF3EC',
    stitch: '#FAF8F6',
    accent: '#B4693A'
  },
  {
    id: 'lilac',
    name: 'Lilac',
    body: '#C4B1D4',
    handle: '#A38CBC',
    lining: '#F6F1FA',
    stitch: '#FAF8F6',
    accent: '#8A5A3A'
  },
  {
    id: 'butter',
    name: 'Butter',
    body: '#F2D9A0',
    handle: '#D9B871',
    lining: '#FBF7EE',
    // The one light body: cream stitching would vanish here.
    stitch: '#8A5A3A',
    accent: '#B4693A'
  },
  {
    id: 'sage',
    name: 'Sage',
    body: '#B7D4C4',
    handle: '#8FB3A0',
    lining: '#F2F8F4',
    stitch: '#FAF8F6',
    accent: '#8A5A3A'
  }
]

export const DEFAULT_COLOURWAY = COLOURWAYS[0]

export const findColourway = (id: string): Colourway =>
  COLOURWAYS.find(c => c.id === id) ?? DEFAULT_COLOURWAY

/** Perceived luminance, used to pick a readable contrast colour automatically. */
export const isLight = (hex: string): boolean => {
  const n = hex.replace('#', '')
  const r = parseInt(n.slice(0, 2), 16)
  const g = parseInt(n.slice(2, 4), 16)
  const b = parseInt(n.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.68
}
