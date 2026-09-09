import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from './ProductCard'
import { PRODUCTS } from '@/data/products'

describe('ProductCard', () => {
  it('renders name, price, image, and an accessible link label', () => {
    const product = PRODUCTS[0]
    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: `View ${product.name}, ₱${product.price.toLocaleString('en-PH')}` })
    expect(link).toHaveAttribute('href', `/product/${product.id}`)
    expect(screen.getByText(product.name)).toBeInTheDocument()
    expect(screen.getByAltText(`${product.name} from the CY Studio collection`)).toHaveAttribute('src')
  })
})
