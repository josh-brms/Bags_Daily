import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Marquee from './Marquee'

describe('Marquee', () => {
  it('renders decorative ticker content hidden from assistive tech', () => {
    const { container } = render(<Marquee />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.textContent).toContain('The Collection')
    expect(container.textContent).toContain('Naga City')
    expect(container.querySelectorAll('.marquee-track > div').length).toBe(2)
  })
})
