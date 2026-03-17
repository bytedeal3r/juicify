import { create } from 'zustand'

export type InitPhase =
  | 'idle'
  | 'stats'
  | 'songs'
  | 'metadata'
  | 'building'
  | 'writing'
  | 'complete'
  | 'error'

interface InitProgressState {
  phase: InitPhase
  progress: number // 0-100
  message: string
  error: string | null
  setPhase: (phase: InitPhase) => void
  setProgress: (progress: number) => void
  setMessage: (message: string) => void
  setError: (error: string) => void
  reset: () => void
}

export const useInitProgress = create<InitProgressState>((set) => ({
  phase: 'idle',
  progress: 0,
  message: 'Initializing...',
  error: null,
  setPhase: (phase) => set({ phase }),
  setProgress: (progress) => set({ progress }),
  setMessage: (message) => set({ message }),
  setError: (error) => set({ error, phase: 'error' }),
  reset: () => set({ phase: 'idle', progress: 0, message: 'Initializing...', error: null }),
}))
