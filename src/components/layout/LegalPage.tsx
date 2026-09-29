import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface LegalPageProps {
  title: string
  children: ReactNode
}

export default function LegalPage({ title, children }: LegalPageProps) {
  return (
    <div className="container-cy py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="mx-auto max-w-3xl rounded-xl">
          <CardContent className="p-8 md:p-12">
            <h1 className="font-display text-[clamp(1.9rem,3.8vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em]">
              {title}
            </h1>
            <p className="mt-2.5 text-[0.9rem] text-ink/70">Last updated: September 9, 2026</p>
            <Separator className="my-8" />
            <div className="legal-prose">{children}</div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
