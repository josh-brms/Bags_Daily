import { motion, type MotionValue } from 'framer-motion'
import type { Colourway } from '@/lib/colourways'

/**
 * Geometry on a 400-unit grid. The body is deliberately taller than it is wide
 * and the handles are tall arcs, so the silhouette reads as a tote rather than
 * collapsing into a basket at small sizes.
 */
const BODY = 'M148 180 H252 Q262 180 263 190 L272 320 Q273 332 261 332 H139 Q127 332 128 320 L137 190 Q138 180 148 180 Z'
const BODY_EDGE = 'M137 190 L128 320 Q127 332 139 332 H261 Q273 332 272 320 L263 190'
const STITCH = 'M148 194 H252 L261 316 Q262 323 255 323 H145 Q138 323 139 316 Z'

interface ToteDrawingProps {
  colourway: Colourway
  /** Lead sparkle tracks the pointer closely. */
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  /** Trailing sparkle follows with softer springs, so the two drift apart. */
  trailX: MotionValue<number>
  trailY: MotionValue<number>
  tiltX: MotionValue<number>
  tiltY: MotionValue<number>
  spin: MotionValue<number>
  drift: MotionValue<number>
  /** Lining scale, raised slightly on hover to suggest the bag opening. */
  liningScale: MotionValue<number>
  /** 0..1 sparkle emphasis, raised on hover. */
  sparkle: MotionValue<number>
  reduced: boolean
}

/**
 * The tote, drawn on a 400-unit grid.
 *
 * Draw order carries the illusion: the lining ellipse goes down FIRST, then the
 * body over it. The body covers the ellipse's lower half, so only the back arc
 * stays visible above the rim and the bag reads as open rather than sealed.
 */
export default function ToteDrawing({
  colourway,
  pointerX,
  pointerY,
  trailX,
  trailY,
  tiltX,
  tiltY,
  spin,
  drift,
  liningScale,
  sparkle,
  reduced
}: ToteDrawingProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="tote-body" x1="0.15" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={colourway.body} />
          {/* Kept near full opacity: fading the body to 0.82 let the cream page
              show through and the bag lost its solidity. */}
          <stop offset="100%" stopColor={colourway.body} stopOpacity="0.94" />
        </linearGradient>
        <radialGradient id="tote-lining" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor={colourway.lining} />
          <stop offset="100%" stopColor={colourway.lining} stopOpacity="0.72" />
        </radialGradient>
      </defs>

      {/* Ground shadow sits OUTSIDE the rotating group — a shadow that spins with
          the object reads as a rendering bug, not a shadow. */}
      <motion.ellipse
        cx="200"
        cy="344"
        rx="92"
        ry="12"
        fill={colourway.accent}
        opacity="0.13"
        style={reduced ? undefined : { rotate: drift, originX: '200px', originY: '344px' }}
      />

      <motion.g
        style={
          reduced
            ? undefined
            : { rotateX: tiltX, rotateY: tiltY, rotate: spin, transformPerspective: 900 }
        }
      >
        <motion.g style={reduced ? undefined : { rotate: drift }}>
          {/* 1. Lining — painted first so the body overlaps its front half. The
              ellipse is taller and sits slightly proud of the rim, so the back arc
              actually reads as an open mouth. */}
          <motion.ellipse
            cx="200"
            cy="172"
            rx="64"
            ry="21"
            fill="url(#tote-lining)"
            style={reduced ? undefined : { scale: liningScale, originX: '200px', originY: '172px' }}
          />
          <ellipse
            cx="200"
            cy="172"
            rx="64"
            ry="21"
            stroke={colourway.accent}
            strokeOpacity="0.3"
            strokeWidth="2"
          />

          {/* 2. Zip across the opening, with a pull tab. */}
          <path
            d="M142 190 H258"
            stroke={colourway.accent}
            strokeOpacity="0.5"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect
            x="244"
            y="184"
            width="9"
            height="13"
            rx="3.5"
            fill={colourway.accent}
            fillOpacity="0.62"
          />

          {/* 3. Body — taller than wide, so it reads as a tote rather than a basket. */}
          <path d={BODY} fill="url(#tote-body)" />

          {/* 4. Gusset — the base panel, a darker step so the bag has depth. */}
          <path
            d="M140 294 H260 L264 322 Q265 330 256 330 H144 Q135 330 136 322 Z"
            fill={colourway.handle}
            fillOpacity="0.3"
          />
          <path
            d={BODY_EDGE}
            stroke={colourway.handle}
            strokeOpacity="0.45"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* 5. Stitching — dashed, inset from the edge. */}
          <path
            d={STITCH}
            stroke={colourway.stitch}
            strokeOpacity="0.6"
            strokeWidth="2"
            strokeDasharray="5 7"
            strokeLinecap="round"
          />

          {/* 6. Handles — tall arcs anchored near the body's edges rather than
              clustered in the middle, which is what stopped it reading as a tote. */}
          <g stroke={colourway.handle} strokeWidth="12" strokeLinecap="round" fill="none">
            <path d="M154 186 C154 92 188 92 188 186" />
            <path d="M212 186 C212 92 246 92 246 186" />
          </g>
          {/* Anchors on the rim, so the handles look stitched on. */}
          <circle cx="154" cy="184" r="6.5" fill={colourway.handle} />
          <circle cx="188" cy="184" r="6.5" fill={colourway.handle} />
          <circle cx="212" cy="184" r="6.5" fill={colourway.handle} />
          <circle cx="246" cy="184" r="6.5" fill={colourway.handle} />
        </motion.g>
      </motion.g>

      {/*
        7. Sparkles sit outside the rotating group so they read as separate marks.
        Position comes only from style MotionValues — adding an `animate` target for
        x/y here would win over style and the pointer tracking would be ignored.
      */}
      <motion.path
        d="M0-15c0 9.75 5.25 15 15 15-9.75 0-15 5.25-15 15 0-9.75-5.25-15-15-15 9.75 0 15-5.25 15-15Z"
        fill={colourway.accent}
        style={
          reduced
            ? undefined
            : { x: pointerX, y: pointerY, scale: sparkle, opacity: sparkle }
        }
      />
      <motion.path
        d="M0-8c0 5.2 2.8 8 8 8-5.2 0-8 2.8-8 8 0-5.2-2.8-8-8-8 5.2 0 8-2.8 8-8Z"
        fill={colourway.accent}
        style={
          reduced
            ? undefined
            : { x: trailX, y: trailY, scale: sparkle, opacity: sparkle }
        }
      />
    </svg>
  )
}
