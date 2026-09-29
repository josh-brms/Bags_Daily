import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderAt(path: string) {
  return render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </MemoryRouter>
  )
}

describe('App routes', () => {
  it('renders the home page with the hero', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: /The Collection/i })).toBeInTheDocument()
  })

  it('explains the catalogue is not connected when Supabase is unset', () => {
    // The test environment has no VITE_SUPABASE_* vars, so the unconfigured path
    // is the one under test. A configured-but-empty catalogue says something else.
    renderAt('/')
    expect(
      screen.getByRole('heading', { name: /catalogue is not connected yet/i })
    ).toBeInTheDocument()
  })

  it('still renders the hero and about section with no catalogue', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: /The Collection/i })).toBeInTheDocument()
    // The tote section has an h2 "Warm neutrals"; AboutSection has an h3 of the
    // same name, so scope to level 2.
    expect(screen.getByRole('heading', { level: 2, name: 'Warm neutrals' })).toBeInTheDocument()
  })

  it('never renders a price anywhere — nothing is sold here', () => {
    renderAt('/')
    expect(screen.queryByText(/₱/)).not.toBeInTheDocument()
    expect(screen.queryByText(/add to bag/i)).not.toBeInTheDocument()
  })

  it('brands the header as Bags Daily PH', () => {
    renderAt('/')
    // The wordmark also appears in the footer, so scope to the banner.
    const header = within(screen.getByRole('banner'))
    expect(header.getByRole('link', { name: /Bags Daily PH — home/i })).toBeInTheDocument()
  })

  it('renders legal pages', () => {
    renderAt('/privacy')
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument()
  })

  it('renders the 404 page for unknown routes', () => {
    renderAt('/nope')
    expect(
      screen.getByRole('heading', { level: 1, name: /This one's lost in the racks/i })
    ).toBeInTheDocument()
  })

  it('the deleted product route now 404s', () => {
    renderAt('/product/3')
    expect(
      screen.getByRole('heading', { level: 1, name: /This one's lost in the racks/i })
    ).toBeInTheDocument()
  })

  it('renders the footer with legal links on every page', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Refund policy' })).toBeInTheDocument()
  })
})
