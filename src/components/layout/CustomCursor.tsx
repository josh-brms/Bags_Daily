import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

export default function CustomCursor() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)

  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const ringX = useSpring(dotX, { stiffness: 250, damping: 22 })
  const ringY = useSpring(dotY, { stiffness: 250, damping: 22 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    setEnabled(fine && !reduced)
  }, [reduced])

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
