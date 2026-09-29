import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Product from './Product'
import { useProducts } from '@/hooks/useProducts'
import type { Product as ProductShape } from '@/lib/products'

vi.mock('@/hooks/useProducts')

const mocked = vi.mocked(useProducts)

const tote: ProductShape = {
  id: '0677e4b2-a718-4164-a98a-9ac63ff05d29',
  name: 'Woven Carryall',
  brand: 'Coach',
  price: 2200,
  images: ['images/a.jpg', 'images/b.jpg', 'images/c.jpg'],
  description: 'Structured, soft, and lighter than it looks.',
  isPosted: true
}

const state = (over: Partial<ReturnType<typeof useProducts>> = {}) =>
  ({
    products: [tote],
    loading: false,
    error: null,
    unconfigured: false,
    reload: vi.fn(),
    ...over
  }) as ReturnType<typeof useProducts>

const renderAt = (id: string, over: Partial<ReturnType<typeof useProducts>> = {}) => {
  mocked.mockReturnValue(state(over))
  return render(
    <MemoryRouter initialEntries={[`/product/${id}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/product/:id" element={<Product />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('product detail page', () => {
  it('shows the whole gallery, the name, and the description', () => {
    renderAt(tote.id)

    expect(screen.getByRole('heading', { level: 1, name: 'Woven Carryall' })).toBeInTheDocument()
    expect(screen.getByText('Structured, soft, and lighter than it looks.')).toBeInTheDocument()
    expect(screen.getByAltText('Woven Carryall, photo 1')).toBeInTheDocument()
    expect(screen.getByAltText('Woven Carryall, photo 3')).toBeInTheDocument()
    expect(screen.getByText('3 photos')).toBeInTheDocument()
  })

  it('shows the brand and price', () => {
    renderAt(tote.id)
    expect(screen.getByText('Coach')).toBeInTheDocument()
    expect(screen.getByText(/2,?200/)).toBeInTheDocument()
  })

  it('sends the visitor to the Instagram profile, since no column holds a per-product post', () => {
    renderAt(tote.id)
    const cta = screen.getByRole('link', { name: /Woven Carryall on Instagram/i })
    expect(cta).toHaveAttribute('href', 'https://www.instagram.com/bags_daily.ph/')
    // Only the Instagram button leaves the site; everything else is a route.
    expect(screen.getAllByRole('link').filter(a => a.getAttribute('target'))).toHaveLength(1)
  })

  it('omits the description paragraph when it is empty, as on every live product', () => {
    const { container } = renderAt(tote.id, {
      products: [{ ...tote, description: '' }]
    })
    expect(container.textContent).not.toContain('Structured, soft')
    // The gallery and the CTA still render.
    expect(screen.getByAltText('Woven Carryall, photo 1')).toBeInTheDocument()
  })

  it('titles the tab after the product, so a shared link is identifiable', () => {
    renderAt(tote.id)
    expect(document.title).toBe('Woven Carryall — Bags Daily PH')
  })

  it('waits for the catalogue before deciding the product is missing', () => {
    renderAt(tote.id, { loading: true, products: [] })
    expect(screen.getByText(/loading the collection/i)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })

  it('shows the 404 page for an id that is not in the catalogue', () => {
    renderAt('999')
    expect(screen.getByRole('heading', { level: 1, name: /lost in the racks/i })).toBeInTheDocument()
  })

  it('offers a way back when the catalogue itself could not be read', () => {
    renderAt(tote.id, { products: [], error: 'Could not reach the catalogue. Check your connection.' })
    expect(screen.getByRole('alert')).toHaveTextContent('Could not reach the catalogue')
    expect(screen.getByRole('link', { name: /back to the collection/i })).toBeInTheDocument()
  })

  it('renders a single-photo product without a gallery counter', () => {
    renderAt(tote.id, { products: [{ ...tote, images: ['images/a.jpg'] }] })
    expect(screen.getByText('1 photo')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next photo' })).not.toBeInTheDocument()
  })
})
