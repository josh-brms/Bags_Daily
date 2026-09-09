import type { ReactNode } from 'react'

interface LegalPageProps {
  title: string
  children: ReactNode
}

export default function LegalPage({ title, children }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-14">
      <h1 className="text-[clamp(1.7rem,3.5vw,2.3rem)] font-semibold tracking-[-0.01em]">{title}</h1>
      <p className="mb-9 mt-2.5 text-[0.9rem] text-muted">Last updated: September 9, 2026</p>
      <div className="legal-prose">{children}</div>
    </div>
  )
}
