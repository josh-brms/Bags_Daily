import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ColorPicker from './ColorPicker'
import type { ProductColor } from '@/data/products'

const colors: ProductColor[] = [
  { name: 'Cream', hex: '#f0e0e0' },
  { name: 'Sand', hex: '#d9c2bf' },
  { name: 'Amber', hex: '#f2b45c' }
]

describe('ColorPicker', () => {
  it('renders a radio group with all colour options', () => {
    render(<ColorPicker colors={colors} value="Cream" onChange={() => {}} />)
    const group = screen.getByRole('radiogroup', { name: 'Colour' })
    expect(group).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Cream' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Sand' })).not.toBeChecked()
  })

  it('selects a colour on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ColorPicker colors={colors} value="Cream" onChange={onChange} />)
    await user.click(screen.getByRole('radio', { name: 'Amber' }))
    expect(onChange).toHaveBeenCalledWith('Amber')
  })

  it('supports arrow-key navigation between swatches', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ColorPicker colors={colors} value="Cream" onChange={onChange} />)
    const first = screen.getByRole('radio', { name: 'Cream' })
    first.focus()
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('Sand')
    await user.keyboard('{ArrowLeft}')
    expect(onChange).toHaveBeenCalledWith('Cream')
  })
})
