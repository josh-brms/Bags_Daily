import { create } from 'zustand'

interface BagState {
  count: number
  lastAdded: string | null
  add: (label: string) => void
}

export const useBag = create<BagState>(set => ({
  count: 0,
  lastAdded: null,
  add: label =>
    set(state => ({
      count: state.count + 1,
      lastAdded: label
    }))
}))
