import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import AmbientScene from './AmbientScene'

describe('AmbientScene', () => {
  it('renders the static CSS fallback when WebGL is unavailable (jsdom)', () => {
    const { container } = render(<AmbientScene />)
    const fallback = container.querySelector('[data-testid="ambient-fallback"]')
    expect(fallback).toBeInTheDocument()
    expect(container.querySelector('canvas')).toBeNull()
  })
})
