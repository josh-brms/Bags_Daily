import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductEditor from './ProductEditor'
import { MAX_PRODUCT_IMAGES, type Product } from '@/lib/products'

/**
 * prepareImage is a thin wrapper over canvas and Image decoding, neither of which
 * exists in jsdom. The re-encoding is not what is under test here — the ordering,
 * the cap, and what reaches onSave are — so it is stubbed at the boundary.
 *
 * The stub names each file after the file it was given, which is what makes a
 * reordering mistake visible in the onSave assertion.
 */
vi.mock('@/lib/admin/imageResize', async importOriginal => {
  const actual = await importOriginal<typeof import('@/lib/admin/imageResize')>()
  return {
    ...actual,
    prepareImage: vi.fn(async (file: File) => ({
      bytes: new Uint8Array([1, 2, 3]),
      width: 800,
      height: 1000,
      filename: `${file.name.replace(/\.[^.]+$/, '')}.jpg`,
      warning: null
    }))
  }
})

const existing: Product = {
  id: '0677e4b2-a718-4164-a98a-9ac63ff05d29',
  name: 'Coach City Tote',
  brand: 'Coach',
  price: 2200,
  images: ['https://cdn.test/a.jpg', 'https://cdn.test/b.jpg'],
  description: 'Structured and soft.',
  isPosted: true
}

const setup = (product: Product | null = null) => {
  const onSave = vi.fn()
  const user = userEvent.setup()
  render(
    <ProductEditor
      product={product}
      busy={false}
      onCancel={vi.fn()}
      onDelete={vi.fn()}
      onSave={onSave}
    />
  )
  return { onSave, user }
}

/** The editor's photo grid, so a button lookup cannot match something else. */
const grid = () => document.querySelectorAll('ul')[0]

/** Gallery order as actually rendered, rather than as labelled. */
const shown = () =>
  within(grid())
    .getAllByRole('listitem')
    .map(li => (li.querySelector('img') as HTMLImageElement).getAttribute('src'))

const fileInput = () => document.querySelector('input[type="file"]') as HTMLInputElement

const photo = (name: string) => new File(['x'], name, { type: 'image/jpeg' })

/** Fills in the text fields so the form can reach a valid state. */
const fillText = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/^name/i), 'Coach City Tote')
  await user.type(screen.getByLabelText(/^brand/i), 'Coach')
  await user.clear(screen.getByLabelText(/price/i))
  await user.type(screen.getByLabelText(/price/i), '2200')
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ProductEditor photos', () => {
  it('starts a new product with no photos and refuses to save until there is one', async () => {
    const { user, onSave } = setup()
    expect(screen.getByText(`0 / ${MAX_PRODUCT_IMAGES}`)).toBeInTheDocument()

    const save = screen.getByRole('button', { name: /save product/i })
    expect(save).toBeDisabled()

    await fillText(user)
    expect(save).toBeDisabled()

    await user.upload(fileInput(), photo('new.jpg'))
    expect(save).toBeEnabled()

    await user.click(save)
    expect(onSave).toHaveBeenCalledOnce()
  })

  it('accepts several photos at once and counts them', async () => {
    const { user } = setup()
    await user.upload(fileInput(), [photo('one.jpg'), photo('two.jpg'), photo('three.jpg')])

    expect(screen.getByText(`3 / ${MAX_PRODUCT_IMAGES}`)).toBeInTheDocument()
    expect(screen.getByText('Cover')).toBeInTheDocument()
    expect(screen.getByText(/3 new photos will upload when you save/)).toBeInTheDocument()
  })

  it('refuses more than the maximum and says how many fit', async () => {
    const { user } = setup()
    const tooMany = Array.from(
      { length: MAX_PRODUCT_IMAGES + 3 },
      (_, i) => photo(`p${i}.jpg`)
    )
    await user.upload(fileInput(), tooMany)

    expect(screen.getByRole('alert')).toHaveTextContent(
      `Only ${MAX_PRODUCT_IMAGES} more photos fit`
    )
    expect(
      screen.getByText(`${MAX_PRODUCT_IMAGES} / ${MAX_PRODUCT_IMAGES}`)
    ).toBeInTheDocument()
  })

  it('swaps neighbours, so the cover can be changed', async () => {
    const { user } = setup(existing)
    expect(shown()).toEqual(['https://cdn.test/a.jpg', 'https://cdn.test/b.jpg'])

    await user.click(within(grid()).getByRole('button', { name: 'Move photo 2 earlier' }))
    expect(shown()).toEqual(['https://cdn.test/b.jpg', 'https://cdn.test/a.jpg'])

    await user.click(within(grid()).getByRole('button', { name: 'Move photo 1 later' }))
    expect(shown()).toEqual(['https://cdn.test/a.jpg', 'https://cdn.test/b.jpg'])
  })

  it('cannot move the cover earlier or the last photo later', () => {
    setup(existing)
    expect(within(grid()).getByRole('button', { name: 'Move photo 1 earlier' })).toBeDisabled()
    expect(within(grid()).getByRole('button', { name: 'Move photo 2 later' })).toBeDisabled()
  })

  it('removes a photo', async () => {
    const { user, onSave } = setup(existing)

    await user.click(within(grid()).getByRole('button', { name: 'Remove photo 1' }))
    expect(screen.getByText(`1 / ${MAX_PRODUCT_IMAGES}`)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /save product/i }))
    expect(onSave.mock.calls[0][0].images).toEqual(['https://cdn.test/b.jpg'])
  })

  it('hands the parent the new files in the order they appear on the product', async () => {
    const { user, onSave } = setup(existing)

    await user.upload(fileInput(), [photo('one.jpg'), photo('two.jpg')])
    // The same filename twice must stay two distinct entries, or one would
    // collapse the other's key and only one would upload.
    await user.upload(fileInput(), photo('one.jpg'))

    // Move the second new photo ahead of the first, then read what came out.
    await user.click(within(grid()).getByRole('button', { name: 'Move photo 4 earlier' }))
    await user.click(screen.getByRole('button', { name: /save product/i }))

    const [draft, added] = onSave.mock.calls[0]
    expect(draft.images).toHaveLength(5)
    // two.jpg moved up, so it must be handed over first — otherwise the parent
    // would substitute the wrong URL into that slot and the gallery would swap.
    expect(added.map((f: { filename: string }) => f.filename)).toEqual([
      'two.jpg',
      'one.jpg',
      'one.jpg'
    ])
    // The two same-named files still occupy distinct slots.
    expect(new Set(draft.images).size).toBe(5)
  })

  it('adds a photo from a pasted path, which is how repo images are used', async () => {
    const { user, onSave } = setup()
    await user.type(screen.getByLabelText(/add a photo by path or url/i), 'images/photo.jpg{Enter}')
    expect(screen.getByText(`1 / ${MAX_PRODUCT_IMAGES}`)).toBeInTheDocument()

    await fillText(user)
    await user.click(screen.getByRole('button', { name: /save product/i }))

    const [draft, added] = onSave.mock.calls[0]
    expect(draft.images).toEqual(['images/photo.jpg'])
    expect(added).toEqual([])
  })

  it('lets a product save with an empty description, as every live product has', async () => {
    const { user, onSave } = setup()
    await user.upload(fileInput(), photo('one.jpg'))
    await fillText(user)
    await user.click(screen.getByRole('button', { name: /save product/i }))

    expect(onSave.mock.calls[0][0].description).toBe('')
  })

  it('reports upload progress instead of a bare "Saving…"', () => {
    const onSave = vi.fn()
    const props = { product: existing, onCancel: vi.fn(), onDelete: vi.fn(), onSave }
    const { rerender } = render(<ProductEditor {...props} busy progress={{ done: 2, total: 6 }} />)
    expect(screen.getByRole('button', { name: /uploading 3 of 6/i })).toBeInTheDocument()

    rerender(<ProductEditor {...props} busy progress={null} />)
    expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument()
  })
})
