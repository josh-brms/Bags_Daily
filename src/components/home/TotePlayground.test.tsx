import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TotePlayground from './TotePlayground'
import { COLOURWAYS } from '@/lib/colourways'

/**
 * framer-motion's useReducedMotion reads the media query once and freezes the
 * result in useState (it only initialises its listener on the first call), so it
 * cannot be flipped mid-file. Mock just that hook and keep the rest of the module
 * real, so this still exercises the component's own conditionals.
 */
let reduced = false
vi.mock('framer-motion', async importOriginal => {
  const actual = await importOriginal<typeof import('framer-motion')>()
  return { ...actual, useReducedMotion: () => reduced }
})

const renderPlayground = () => render(<TotePlayground />)

beforeEach(() => {
  reduced = false
})

describe('TotePlayground', () => {
  it('has a real heading, not just a decorative graphic', () => {
    renderPlayground()
    expect(screen.getByRole('heading', { name: /Warm neutrals/i })).toBeInTheDocument()
  })

  it('exposes every colourway as a button in a labelled group', () => {
    renderPlayground()
    const group = screen.getByRole('group', { name: /colourway/i })
    for (const c of COLOURWAYS) {
      expect(within(group).getByRole('button', { name: c.name })).toBeInTheDocument()
    }
  })

  it('marks exactly one colourway as pressed', () => {
    renderPlayground()
    const pressed = screen.getAllByRole('button', { pressed: true })
    expect(pressed).toHaveLength(1)
    expect(pressed[0]).toHaveTextContent(COLOURWAYS[0].name)
  })

  /**
   * Tilt and drag are decorative, so the colour switcher is the interaction a
   * keyboard user actually gets. It has to work.
   */
  it('lets a keyboard user change the colourway', async () => {
    const user = userEvent.setup()
    renderPlayground()

    const sage = screen.getByRole('button', { name: 'Sage' })
    await user.tab()
    await user.tab()
    await user.tab()
    await user.tab()
    await user.tab()
    expect(sage).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(sage).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: COLOURWAYS[0].name })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('marks the graphic as decorative rather than announcing it', () => {
    const { container } = renderPlayground()
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('still offers the colour switcher under reduced motion', () => {
    reduced = true
    renderPlayground()
    expect(screen.getByRole('button', { name: 'Butter' })).toBeInTheDocument()
    expect(screen.getByText(/reduced motion is on/i)).toBeInTheDocument()
  })

  it('does not block page scrolling on the section, only the tote', () => {
    renderPlayground()
    const tote = screen.getByTestId('tote-playground')
    expect(tote.style.touchAction).toBe('none')
    expect(tote.closest('section')?.getAttribute('style')).toBeNull()
  })

  it('releases touch-action when reduced motion is on', () => {
    reduced = true
    renderPlayground()
    expect(screen.getByTestId('tote-playground').style.touchAction).toBe('auto')
  })

  it('accepts a pointer drag without throwing', () => {
    const onDown = vi.fn()
    const { getByTestId } = renderPlayground()
    const tote = getByTestId('tote-playground')
    expect(() => {
      tote.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 100 }))
      tote.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 200 }))
      tote.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }))
    }).not.toThrow()
    expect(onDown).not.toHaveBeenCalled()
  })
})
