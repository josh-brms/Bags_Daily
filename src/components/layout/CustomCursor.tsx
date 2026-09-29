import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

export default function CustomCursor() {
  const reduced = useReducedMotion()
  const [finePointer] = useState(() => window.matchMedia('(pointer: fine)').matches)
  const [hovering, setHovering] = useState(false)

  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const ringX = useSpring(dotX, { stiffness: 250, damping: 22 })
  const ringY = useSpring(dotY, { stiffness: 250, damping: 22 })
  // Lags behind the ring so the glow trails the pointer.
  const glowX = useSpring(dotX, { stiffness: 60, damping: 20 })
  const glowY = useSpring(dotY, { stiffness: 60, damping: 20 })

  const enabled = finePointer && !reduced

  useEffect(() => {
    if (!enabled) return
    const move = (e: MouseEvent) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      setHovering(Boolean(target?.closest('a, button')))
    }
    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', over, { passive: true })
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
    }
  }, [enabled, dotX, dotY])

  if (!enabled) return null

  return (
    <>
      {/* Soft trailing glow, so the cursor reads as a light source rather than a dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[89] rounded-full"
        style={{ x: glowX, y: glowY, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: hovering ? 96 : 64, height: hovering ? 96 : 64, opacity: hovering ? 0.28 : 0.16 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(232,180,184,0.85) 0%, rgba(196,177,212,0.35) 45%, transparent 70%)'
          }}
        />
      </motion.div>
      <motion.div
        className="cursor-dot h-1.5 w-1.5 bg-white"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="cursor-ring border border-white/80"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: hovering ? 44 : 32, height: hovering ? 44 : 32, opacity: hovering ? 0.9 : 0.6 }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
