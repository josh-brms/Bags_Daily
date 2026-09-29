import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SignIn from '@/components/admin/SignIn'

const noop = () => {}

beforeEach(() => {
  vi.restoreAllMocks()
})

const renderSignIn = () =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SignIn onSignedIn={noop} />
    </MemoryRouter>
  )

describe('Admin sign-in', () => {
  /**
   * With no VITE_SUPABASE_* vars the admin has no database to talk to, so it must
   * explain that rather than render a form that cannot possibly work.
   */
  it('explains the admin is not configured when Supabase is unset', () => {
    renderSignIn()
    expect(screen.getByRole('heading', { name: /Catalogue admin/i })).toBeInTheDocument()
    expect(screen.getByText(/Not configured/i)).toBeInTheDocument()
    expect(screen.getByText(/VITE_SUPABASE_URL/)).toBeInTheDocument()
  })

  it('does not offer a sign-in form it cannot honour', () => {
    renderSignIn()
    expect(screen.queryByLabelText(/Email/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Sign in$/i })).not.toBeInTheDocument()
  })

  it('never asks for a GitHub token any more', () => {
    // The old design put a full GitHub credential in session storage.
    renderSignIn()
    expect(screen.queryByText(/Fine-grained token/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/github_pat/i)).not.toBeInTheDocument()
  })
})

describe('Admin route gating', () => {
  it('is not linked from any public page', async () => {
    const { default: App } = await import('@/App')
    render(
      <MemoryRouter
        initialEntries={['/']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>
    )

    const links = [...document.querySelectorAll('a')].map(a => a.getAttribute('href') ?? '')
    expect(links.filter(h => h.includes('admin'))).toEqual([])
  })
})
