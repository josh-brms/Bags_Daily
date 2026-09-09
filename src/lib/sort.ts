import type { Product } from '@/data/products'

export type SortOption = 'featured' | 'price-asc' | 'price-desc'

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const copy = [...products]
  if (sort === 'price-asc') return copy.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return copy.sort((a, b) => b.price - a.price)
  return copy
}
