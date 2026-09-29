import { useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion
} from 'framer-motion'
import ToteDrawing from './ToteDrawing'
import { COLOURWAYS, DEFAULT_COLOURWAY, findColourway } from '@/lib/colourways'

/** Degrees per pixel of horizontal drag. */
const DRAG_RATE = 0.6
/** Spin snaps to multiples of this, which is what makes it feel designed. */
const DETENT = 15
const MAX_SPIN = 45
const MAX_TILT = 10

export default function TotePlayground() {
  const sectionRef = useRef<HTMLElement>(null)
  const toteRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [colourway, setColourway] = useState(DEFAULT_COLOURWAY)
  const [hovering, setHovering] = useState(false)
  const [dragging, setDragging] = useState(false)

  const drag = useRef({ startX: 0, startRot: 0 })

  // Cursor as a -1..1 offset from the centre of the tote.
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const pointerX = useSpring(rawX, { stiffness: 150, damping: 20 })
  const pointerY = useSpring(rawY, { stiffness: 150, damping: 20 })
  // Softer springs so the second sparkle lags and the two drift apart.
  const trailX = useSpring(rawX, { stiffness: 55, damping: 16 })
  const trailY = useSpring(rawY, { stiffness: 55, damping: 16 })

  const tiltX = useSpring(useTransform(rawY, [-1, 1], [MAX_TILT, -MAX_TILT]), {
    stiffness: 180,
    damping: 20
  })
  const tiltY = useSpring(useTransform(rawX, [-1, 1], [-MAX_TILT, MAX_TILT]), {
    stiffness: 180,
    damping: 20
  })

  const rotValue = useMotionValue(0)
  const spin = useSpring(rotValue, { stiffness: 120, damping: 18 })

  const liningScale = useSpring(hovering && !reduced ? 1.08 : 1, { stiffness: 200, damping: 22 })
  const sparkle = useSpring(hovering && !reduced ? 1 : 0.35, { stiffness: 200, damping: 22 })

  // Replaces the old image band's parallax, so the section keeps its scroll depth.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })
  const drift = useTransform(scrollYProgress, [0, 1], [-4, 4])

  const trackPointer = (clientX: number, clientY: number) => {
    const el = toteRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    rawX.set(Math.max(-1, Math.min(1, ((clientX - r.left) / r.width) * 2 - 1)))
    rawY.set(Math.max(-1, Math.min(1, ((clientY - r.top) / r.height) * 2 - 1)))
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return
    setDragging(true)
    drag.current = { startX: e.clientX, startRot: rotValue.get() }
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    trackPointer(e.clientX, e.clientY)
    if (!dragging) return
    const next = drag.current.startRot + (e.clientX - drag.current.startX) * DRAG_RATE
    rotValue.set(Math.max(-MAX_SPIN, Math.min(MAX_SPIN, next)))
  }

  const endDrag = () => {
    if (!dragging) return
    setDragging(false)
    // Snap to the nearest detent so the bag always lands square-ish.
    const snapped = Math.round(rotValue.get() / DETENT) * DETENT
    rotValue.set(Math.max(-MAX_SPIN, Math.min(MAX_SPIN, snapped)))
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="tote-title"
      className="relative z-10 py-20"
    >
      <div className="container-cy">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Copy sits on a soft glass panel. The 3D backdrop is a fixed layer, so
              shapes drift behind this text as the page scrolls — a panel makes
              the copy legible unconditionally rather than hoping nothing lands on it. */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="glass glass-ring rounded-2xl p-7 md:p-9"
          >
            <h2
              id="tote-title"
              className="font-display text-[clamp(1.8rem,4vw,2.7rem)] font-semibold leading-[1.1] tracking-[-0.025em]"
            >
              Warm neutrals
            </h2>
            <p className="mt-4 max-w-[42ch] leading-relaxed text-ink/80">
              Every piece is offered in the same quiet palette, so anything in the collection
              goes with anything else. Give the bag a spin, or try a different tone.
            </p>

            <div
              role="group"
              aria-label="Tote colourway"
              className="mt-8 grid max-w-md grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3"
            >
              {COLOURWAYS.map(c => {
                const active = c.id === colourway.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setColourway(findColourway(c.id))}
                    className={
                      active
                        ? 'flex min-h-11 items-center gap-2.5 rounded-pill border border-ink/25 bg-white/55 px-3.5 shadow-soft'
                        : 'flex min-h-11 items-center gap-2.5 rounded-pill border border-white/55 bg-white/30 px-3.5 transition-colors hover:bg-white/50'
                    }
                  >
                    <span
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 rounded-pill border border-black/10"
                      style={{ backgroundColor: c.body }}
                    />
                    <span className="text-[0.85rem] font-medium text-ink">{c.name}</span>
                  </button>
                )
              })}
            </div>

            <p className="mt-4 text-[0.8rem] text-muted">
              {reduced ? 'Reduced motion is on — pick a tone above.' : 'Drag the bag to spin it.'}
            </p>
          </motion.div>

          {/* Tote */}
          <div className="flex justify-center">
            <motion.div
              ref={toteRef}
              data-testid="tote-playground"
              role="presentation"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={() => {
                endDrag()
                setHovering(false)
                rawX.set(0)
                rawY.set(0)
              }}
              onPointerEnter={() => setHovering(true)}
              /* Only the tote blocks touch gestures, so the page still scrolls. */
              style={{ touchAction: reduced ? 'auto' : 'none' }}
              className={
                reduced
                  ? 'aspect-square w-[min(88vw,440px)]'
                  : 'aspect-square w-[min(88vw,440px)] cursor-grab active:cursor-grabbing'
              }
            >
              <ToteDrawing
                colourway={colourway}
                pointerX={pointerX}
                pointerY={pointerY}
                trailX={trailX}
                trailY={trailY}
                tiltX={tiltX}
                tiltY={tiltY}
                spin={spin}
                drift={drift}
                liningScale={liningScale}
                sparkle={sparkle}
                reduced={Boolean(reduced)}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
