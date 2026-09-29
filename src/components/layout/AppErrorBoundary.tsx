import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import LogoMark from '@/components/layout/LogoMark'

interface Props {
  children: ReactNode
}

interface State {
  failed: boolean
  detail: string
}

/**
 * Catches render errors anywhere in the route tree.
 *
 * The 3D canvas has its own boundary (HeroErrorBoundary) because a WebGL failure
 * should degrade, not blank the page. This one is the last resort for a genuine
 * crash in Home, Admin, or a legal page.
 */
export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { failed: false, detail: '' }

  static getDerivedStateFromError(error: unknown): State {
    return {
      failed: true,
      detail: error instanceof Error ? error.message : 'Unexpected error.'
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Kept for visibility during development; a production build strips it.
    console.error('Unhandled render error', error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <div className="container-cy flex min-h-[70vh] items-center justify-center py-16">
        <Card className="w-full max-w-lg rounded-2xl">
          <CardContent className="p-9 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-pill bg-clay/10 text-clay-deep">
              <LogoMark className="h-7 w-7" />
            </span>
            <h1 className="mt-6 font-display text-[1.7rem] font-semibold tracking-[-0.02em]">
              Something went wrong
            </h1>
            <p className="mt-3 leading-relaxed text-ink/75">
              This page failed to render. Reloading usually fixes it.
            </p>
            <p className="mt-4 break-words rounded-lg bg-ink/5 px-4 py-2.5 font-mono text-[0.78rem] text-muted">
              {this.state.detail}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button variant="accent" onClick={() => window.location.reload()}>
                Reload the page
              </Button>
              <Button variant="glass" onClick={() => window.location.assign('/')}>
                Back to the collection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}
