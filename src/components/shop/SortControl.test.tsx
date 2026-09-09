import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SortControl from './SortControl'

describe('SortControl', () => {
  it('renders a labelled group with pressed states', () => {
    render(<SortControl value="featured" onChange={() => {}} />)
    const group = screen.getByRole('group', { name: 'Sort products' })
    expect(group).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Featured' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Sort by price, low to high' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('emits the chosen sort option', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SortControl value="featured" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Sort by price, high to low' }))
    expect(onChange).toHaveBeenCalledWith('price-desc')
  })
})
