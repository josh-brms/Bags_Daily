import { useRef, type ReactNode, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
}

export default function Magnetic({ children, className, strength = 8 }: MagneticProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 18 })
  const sy = useSpring(y, { stiffness: 200, damping: 18 })

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * strength * 2)
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * strength * 2)
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className ?? ''}`}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}
