import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import ConsentBanner from './ConsentBanner'
import * as analytics from '@/lib/analytics'

const CONSENT_KEY = 'bd-analytics-consent'

beforeEach(() => {
  window.localStorage.clear()
  vi.restoreAllMocks()
})

/**
 * With no provider configured the banner must render nothing at all and make no
 * request — an unconfigured build has to be inert, not subtly broken.
 */
describe('ConsentBanner with analytics disabled', () => {
  it('renders nothing', async () => {
    vi.spyOn(analytics, 'enabled', 'get').mockReturnValue(false)
    render(<ConsentBanner />)
    await new Promise(r => setTimeout(r, 1300))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('never injects the script', async () => {
    vi.spyOn(analytics, 'enabled', 'get').mockReturnValue(false)
    const load = vi.spyOn(analytics, 'loadAnalytics')
    render(<ConsentBanner />)
    await new Promise(r => setTimeout(r, 1300))
    expect(load).not.toHaveBeenCalled()
  })
})

describe('ConsentBanner with analytics enabled', () => {
  it('does not ask again once declined, and never loads the script', async () => {
    window.localStorage.setItem(CONSENT_KEY, 'denied')
    vi.spyOn(analytics, 'enabled', 'get').mockReturnValue(true)
    const load = vi.spyOn(analytics, 'loadAnalytics')
    render(<ConsentBanner />)
    await new Promise(r => setTimeout(r, 1300))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(load).not.toHaveBeenCalled()
  })

  it('loads immediately when consent was already granted', async () => {
    window.localStorage.setItem(CONSENT_KEY, 'granted')
    vi.spyOn(analytics, 'enabled', 'get').mockReturnValue(true)
    const load = vi.spyOn(analytics, 'loadAnalytics')
    render(<ConsentBanner />)
    await waitFor(() => expect(load).toHaveBeenCalled())
  })
})
