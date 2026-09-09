import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </MemoryRouter>
  )
}

describe('App routes', () => {
  it('renders the home page with hero and product grid', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: /The Collection/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /View Item \d+/ }).length).toBe(12)
  })

  it('renders a product detail page', () => {
    renderAt('/product/3')
    expect(screen.getByRole('heading', { level: 1, name: 'Item 003' })).toBeInTheDocument()
    expect(screen.getAllByText('₱1,300').length).toBeGreaterThan(0)
  })

  it('renders the not-found state for an invalid product id', () => {
    renderAt('/product/999')
    expect(screen.getByRole('heading', { name: 'Product not found' })).toBeInTheDocument()
  })

  it('renders legal pages', () => {
    renderAt('/privacy')
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument()
  })

  it('renders the 404 page for unknown routes', () => {
    renderAt('/nope')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('renders the footer with legal links on every page', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Refund policy' })).toBeInTheDocument()
  })
})
