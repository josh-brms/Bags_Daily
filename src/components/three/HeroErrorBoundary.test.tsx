import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeroErrorBoundary from './HeroErrorBoundary'

function Throwing(): never {
  throw new Error('boom')
}

describe('HeroErrorBoundary', () => {
  it('renders children when nothing throws', () => {
    render(
      <HeroErrorBoundary fallback={<div>fallback</div>}>
        <div>content</div>
      </HeroErrorBoundary>
    )
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('renders the fallback when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <HeroErrorBoundary fallback={<div>3d unavailable</div>}>
        <Throwing />
      </HeroErrorBoundary>
    )
    expect(screen.getByText('3d unavailable')).toBeInTheDocument()
    spy.mockRestore()
  })
})
