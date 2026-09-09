import { useRef, type MouseEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
}

export default function TiltCard({ children, className }: TiltCardProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 160, damping: 20 })
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 160, damping: 20 })

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}
