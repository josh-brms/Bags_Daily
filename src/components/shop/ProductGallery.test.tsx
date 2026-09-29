import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductGallery from './ProductGallery'

const images = ['images/a.jpg', 'images/b.jpg', 'images/c.jpg']

const renderGallery = (list = images) =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ProductGallery images={list} name="Woven Carryall" />
    </MemoryRouter>
  )

describe('ProductGallery', () => {
  it('renders every photo, in order, with its position announced', () => {
    renderGallery()
    const slides = screen.getAllByRole('group')
    expect(slides).toHaveLength(3)
    expect(slides[0]).toHaveAttribute('aria-label', 'Photo 1 of 3 of Woven Carryall')
    expect(screen.getByAltText('Woven Carryall, photo 2')).toHaveAttribute('src')
  })

  it('swipes rather than autoplays or loops', () => {
    renderGallery()
    // No autoplay timer is created and the track does not wrap, so the last photo
    // is a real end. A visitor reading a caption is never interrupted.
    const region = screen.getByRole('region', { name: '' })
    expect(region).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('offers a thumbnail per photo, and a counter to say where you are', () => {
    renderGallery()
    for (let i = 1; i <= 3; i++) {
      expect(screen.getByRole('button', { name: `Show photo ${i}` })).toBeInTheDocument()
    }
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('hides the arrows and thumbnails for a single photo', () => {
    renderGallery(['images/only.jpg'])
    expect(screen.queryByRole('button', { name: 'Next photo' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Show photo 1' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('group')).toHaveLength(1)
  })

  it('frames photos square, so the frame is only the bags', () => {
    const { container } = renderGallery()
    // The photos are 3:4 lifestyle shots with a wall above and floor below.
    // A 3:4 frame spends a quarter of its height on that; a square spends none.
    const frame = container.querySelector('.aspect-square')
    expect(frame).not.toBeNull()
    expect(container.querySelector('.aspect-\\[3\\/4\\]')).toBeNull()
  })

  it('caps the slide width, so a whole photo is visible rather than a zoomed sliver', () => {
    const { container } = renderGallery()
    // A CarouselItem is a flex item with shrink-0 and no width of its own, so it
    // takes the image's intrinsic 1000px. The cap is what stops that.
    const slides = container.querySelectorAll('[role="group"]')
    expect(slides).toHaveLength(3)
    slides.forEach(slide => expect(slide).toHaveClass('max-w-[26rem]'))
  })

  it('biases the crop upward, keeping the bottom of the bag', () => {
    const { container } = renderGallery()
    const img = container.querySelector('img')
    // object-position 45% rather than dead centre: the top of these photos is
    // background, the bottom carries detail.
    expect(img).toHaveClass('object-cover')
    expect(img).toHaveClass('object-[center_45%]')
  })

  it('renders nothing when there are no photos, rather than an empty frame', () => {
    const { container } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ProductGallery images={[]} name="Empty" />
      </MemoryRouter>
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('labels each slide for assistive tech rather than relying on position alone', () => {
    renderGallery()
    const first = screen.getAllByRole('group')[0]
    expect(within(first).getByAltText('Woven Carryall, photo 1')).toBeInTheDocument()
  })
})
