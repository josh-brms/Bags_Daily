import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from './ProductCard'
import type { Product } from '@/lib/products'

const product: Product = {
  id: '0677e4b2-a718-4164-a98a-9ac63ff05d29',
  name: 'Test Tote',
  brand: 'Coach',
  price: 2200,
  images: ['images/6q8ePNfC.jpg', 'images/second.jpg', 'images/third.jpg'],
  description: 'A test piece.',
  isPosted: true
}

const renderCard = (p: Product = product) =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ProductCard product={p} />
    </MemoryRouter>
  )

describe('ProductCard', () => {
  it('links to the product page, not straight out to Instagram', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /Test Tote — see photos/i })
    expect(link).toHaveAttribute('href', `/product/${product.id}`)
    // The whole point of the detail page is that the visitor stays on the site.
    expect(link).not.toHaveAttribute('target')
  })

  it('shows the first photo as the cover', () => {
    renderCard()
    expect(screen.getByAltText('Test Tote from the Bags Daily PH collection')).toHaveAttribute(
      'src',
      expect.stringContaining('6q8ePNfC') as unknown as string
    )
  })

  it('shows the brand and the price, which the catalogue stores', () => {
    renderCard()
    expect(screen.getByText('Coach')).toBeInTheDocument()
    expect(screen.getByText(/2,?200/)).toBeInTheDocument()
  })

  it('counts the photos so a gallery is visible from the grid', () => {
    renderCard()
    expect(screen.getByText('3 photos')).toBeInTheDocument()
  })

  it('hides the count for a single-photo product', () => {
    renderCard({ ...product, images: ['images/only.jpg'] })
    expect(screen.queryByText(/photos/)).not.toBeInTheDocument()
  })
})
