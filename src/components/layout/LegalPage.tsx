import type { ReactNode } from 'react'

interface LegalPageProps {
  title: string
  children: ReactNode
}

export default function LegalPage({ title, children }: LegalPageProps) {
  return (
    <div className="container-cy py-14">
      <div className="glass glass-ring glass-sheen mx-auto max-w-3xl rounded-lg p-8 md:p-12">
        <h1 className="text-[clamp(1.7rem,3.5vw,2.3rem)] font-semibold tracking-[-0.01em]">{title}</h1>
        <p className="mb-9 mt-2.5 text-[0.9rem] text-ink/70">Last updated: September 9, 2026</p>
        <div className="legal-prose">{children}</div>
      </div>
    </div>
  )
}
