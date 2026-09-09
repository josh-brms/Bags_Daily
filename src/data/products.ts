export interface ProductColor {
  name: string
  hex: string
}

export interface Product {
  id: number
  name: string
  price: number
  sizes: string[]
  image: string
  colors: ProductColor[]
  description: string
}

const asset = (p: string): string => `${import.meta.env.BASE_URL}${p}`

export const productImage = (p: Product): string => asset(p.image)

export const sceneImage = {
  hero: asset('images/cy64_SPi.jpg'),
  band: asset('images/BatqNRTa.jpg'),
  bandTwo: asset('images/iH_ZprKY.jpg')
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Item 001',
    price: 1000,
    sizes: ['S', 'M', 'L'],
    image: 'images/6q8ePNfC.jpg',
    colors: [
      { name: 'Cream', hex: '#f0e0e0' },
      { name: 'Sand', hex: '#d9c2bf' },
      { name: 'Amber', hex: '#f2b45c' },
      { name: 'Ink', hex: '#2b211f' }
    ],
    description:
      'The first piece of the collection — a soft-toned everyday item designed around warm neutral light, easy to pair with the rest of your wardrobe.'
  },
  {
    id: 2,
    name: 'Item 002',
    price: 1150,
    sizes: ['S', 'M', 'L'],
    image: 'images/1zPG7gUf.jpg',
    colors: [
      { name: 'Cream', hex: '#f0e0e0' },
      { name: 'Sand', hex: '#d9c2bf' },
      { name: 'Amber', hex: '#f2b45c' },
      { name: 'Ink', hex: '#2b211f' }
    ],
    description:
      'A mid-weight essential with a relaxed fit. Breathable, comfortable, and finished with clean seams for a simple silhouette.'
  },
  {
    id: 3,
    name: 'Item 003',
    price: 1300,
    sizes: ['S', 'M', 'L'],
    image: 'images/wx_ojFvg.jpg',
    colors: [
      { name: 'Cream', hex: '#f0e0e0' },
      { name: 'Sand', hex: '#d9c2bf' },
      { name: 'Amber', hex: '#f2b45c' },
      { name: 'Ink', hex: '#2b211f' }
    ],
    description:
      'Made for long days — durable fabric with a subtle texture, and a versatile layering piece that keeps its shape.'
  },
  {
    id: 4,
    name: 'Item 004',
    price: 900,
    sizes: ['S', 'M', 'L'],
    image: 'images/2d4ARPO7.jpg',
    colors: [
      { name: 'Cream', hex: '#f0e0e0' },
      { name: 'Sand', hex: '#d9c2bf' },
      { name: 'Amber', hex: '#f2b45c' },
      { name: 'Ink', hex: '#2b211f' }
    ],
    description:
      'A lighter take on the collection — airy and easy to move in, cut with a gentle drape for warmer days.'
  },
  {
    id: 5,
    name: 'Item 005',
    price: 1450,
    sizes: ['S', 'M', 'L'],
    image: 'images/a63yCS4d.jpg',
    colors: [
      { name: 'Cream', hex: '#f0e0e0' },
      { name: 'Sand', hex: '#d9c2bf' },
      { name: 'Amber', hex: '#f2b45c' },
      { name: 'Ink', hex: '#2b211f' }
    ],
    description:
      'The statement piece of the collection, with structured lines and a richer weight that rewards a closer look.'
  },
  {
    id: 6,
    name: 'Item 006',
    price: 1100,
    sizes: ['S', 'M', 'L'],
    image: 'images/ne7gPXXV.jpg',
    colors: [
      { name: 'Cream', hex: '#f0e0e0' },
      { name: 'Sand', hex: '#d9c2bf' },
      { name: 'Amber', hex: '#f2b45c' },
      { name: 'Ink', hex: '#2b211f' }
    ],
    description:
      'A dependable everyday staple with a soft hand-feel and a straight hem. Simple, considered, and made to be worn often.'
  },
  {
    id: 7,
    name: 'Item 007',
    price: 1250,
    sizes: ['S', 'M', 'L'],
    image: 'images/GAVTNz9i.jpg',
    colors: [
      { name: 'Cream', hex: '#f0e0e0' },
      { name: 'Sand', hex: '#d9c2bf' },
      { name: 'Amber', hex: '#f2b45c' },
      { name: 'Ink', hex: '#2b211f' }
    ],
    description: 'Comfort in a refined cut, balanced to work from morning to evening.'
  },
  {
    id: 8,
    name: 'Item 008',
    price: 950,
    sizes: ['S', 'M', 'L'],
    image: 'images/RvTIVVo4.jpg',
    colors: [
      { name: 'Cream', hex: '#f0e0e0' },
      { name: 'Sand', hex: '#d9c2bf' },
      { name: 'Amber', hex: '#f2b45c' },
      { name: 'Ink', hex: '#2b211f' }
    ],
    description: 'A studio favourite — clean lines, a comfortable fit, and fabric that softens with wear.'
  },
  {
    id: 9,
    name: 'Item 009',
    price: 1500,
    sizes: ['S', 'M', 'L'],
    image: 'images/7zAFpr4L.jpg',
    colors: [
      { name: 'Cream', hex: '#f0e0e0' },
      { name: 'Sand', hex: '#d9c2bf' },
      { name: 'Amber', hex: '#f2b45c' },
      { name: 'Ink', hex: '#2b211f' }
    ],
    description: 'The heaviest construction in the range, with tonal detailing and a considered silhouette.'
  },
  {
    id: 10,
    name: 'Item 010',
    price: 1050,
    sizes: ['S', 'M', 'L'],
    image: 'images/NuaaMhmi.jpg',
    colors: [
      { name: 'Cream', hex: '#f0e0e0' },
      { name: 'Sand', hex: '#d9c2bf' },
      { name: 'Amber', hex: '#f2b45c' },
      { name: 'Ink', hex: '#2b211f' }
    ],
    description:
      'An easy-going piece with a roomy cut and soft finish — the one you reach for without thinking.'
  },
  {
    id: 11,
    name: 'Item 011',
    price: 850,
    sizes: ['S', 'M', 'L'],
    image: 'images/jjLtVscv.jpg',
    colors: [
      { name: 'Cream', hex: '#f0e0e0' },
      { name: 'Sand', hex: '#d9c2bf' },
      { name: 'Amber', hex: '#f2b45c' },
      { name: 'Ink', hex: '#2b211f' }
    ],
    description: 'The entry point to the collection — lightweight, unrestrictive, quietly versatile.'
  },
  {
    id: 12,
    name: 'Item 012',
    price: 1400,
    sizes: ['S', 'M', 'L'],
    image: 'images/yBrcK6xm.jpg',
    colors: [
      { name: 'Cream', hex: '#f0e0e0' },
      { name: 'Sand', hex: '#d9c2bf' },
      { name: 'Amber', hex: '#f2b45c' },
      { name: 'Ink', hex: '#2b211f' }
    ],
    description:
      'A balanced close to the collection — considered proportions, refined detailing, and a finish you can feel.'
  }
]

export const relatedProducts = (product: Product): Product[] => {
  const idx = PRODUCTS.findIndex(p => p.id === product.id)
  return [1, 2, 3].map(offset => PRODUCTS[(idx + offset) % PRODUCTS.length])
}
