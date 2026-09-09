import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Button, buttonVariants } from './button'

describe('Button', () => {
  it('renders a button with the default variant styles', () => {
    render(<Button>Add to bag</Button>)
    const btn = screen.getByRole('button', { name: 'Add to bag' })
    expect(btn).toHaveClass('bg-ink')
    expect(btn).toHaveClass('text-cream')
  })

  it('applies glass variant classes', () => {
    render(<Button variant="glass">Browse</Button>)
    expect(screen.getByRole('button', { name: 'Browse' })).toHaveClass('glass-strong')
  })

  it('invokes onClick and shows pressed-state readiness (not disabled)', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Press</Button>)
    await user.click(screen.getByRole('button', { name: 'Press' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('supports asChild to render a router link with button styles', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Button asChild>
          <a href="/#shop">Browse the collection</a>
        </Button>
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: 'Browse the collection' })
    expect(link).toHaveAttribute('href', '/#shop')
    expect(link.className).toContain(buttonVariants({ variant: 'glass' }).split(' ')[0])
  })
})
