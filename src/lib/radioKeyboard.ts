import type { KeyboardEvent } from 'react'

const NAV_KEYS = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']

export function selectOnArrow(onChange: (value: string) => void) {
  return (e: KeyboardEvent<HTMLDivElement>) => {
    if (!NAV_KEYS.includes(e.key)) return
    window.setTimeout(() => {
      const active = document.activeElement as HTMLElement | null
      const value = active?.getAttribute('value') ?? active?.getAttribute('aria-label')
      if (value) onChange(value)
    }, 0)
  }
}
