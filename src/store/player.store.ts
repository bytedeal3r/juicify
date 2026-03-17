import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DBSong } from '@/types/db.types'
import type { PlayMode } from '@/types/player.types'

interface PlayerStore {
  currentTrack: DBSong | null
  queue: DBSong[]
  queueIndex: number
  queueSource: string | null
  isPlaying: boolean
  isBuffering: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playMode: PlayMode
  isQueueOpen: boolean
  isFullscreen: boolean

  play: (track: DBSong, queue?: DBSong[], source?: string) => void
  playAlbum: (songs: DBSong[], startIndex: number, source: string) => void
  playPlaylist: (songs: DBSong[], startIndex: number, source: string) => void
  pause: () => void
  resume: () => void
  next: () => void
  prev: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  setPlayMode: (mode: PlayMode) => void
  addToQueue: (track: DBSong) => void
  playNext: (track: DBSong) => void
  clearQueue: () => void
  removeFromQueue: (index: number) => void
  reorderQueue: (from: number, to: number) => void
  setIsPlaying: (playing: boolean) => void
  setIsBuffering: (buffering: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  toggleQueue: () => void
  toggleFullscreen: () => void
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      queue: [],
      queueIndex: -1,
      queueSource: null,
      isPlaying: false,
      isBuffering: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isMuted: false,
      playMode: 'normal',
      isQueueOpen: false,
      isFullscreen: false,

      play: (track, queue, source) => {
        const q = queue || [track]
        const idx = q.findIndex((s) => s.id === track.id)
        set({
          currentTrack: track,
          queue: q,
          queueIndex: idx >= 0 ? idx : 0,
          queueSource: source || null,
          isPlaying: true,
          currentTime: 0,
        })
      },

      playAlbum: (songs, startIndex, source) => {
        const { playMode } = get()
        let q = [...songs]
        if (playMode === 'shuffle') {
          q = [...songs]
          for (let i = q.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[q[i], q[j]] = [q[j], q[i]]
          }
        }
        set({
          currentTrack: q[startIndex] || q[0],
          queue: q,
          queueIndex: startIndex,
          queueSource: source,
          isPlaying: true,
          currentTime: 0,
        })
      },

      playPlaylist: (songs, startIndex, source) => {
        const { playAlbum } = get()
        playAlbum(songs, startIndex, source)
      },

      pause: () => set({ isPlaying: false }),
      resume: () => set({ isPlaying: true }),

      next: () => {
        const { queue, queueIndex, playMode } = get()
        if (!queue.length) return
        let nextIdx: number
        if (playMode === 'repeat-one') {
          nextIdx = queueIndex
        } else if (playMode === 'shuffle') {
          nextIdx = Math.floor(Math.random() * queue.length)
        } else {
          nextIdx = queueIndex + 1
          if (nextIdx >= queue.length) {
            if (playMode === 'repeat-all') nextIdx = 0
            else return set({ isPlaying: false })
          }
        }
        set({ currentTrack: queue[nextIdx], queueIndex: nextIdx, currentTime: 0 })
      },

      prev: () => {
        const { queue, queueIndex, currentTime } = get()
        if (currentTime > 3) {
          // restart current track
          set({ currentTime: 0 })
          return
        }
        const prevIdx = Math.max(0, queueIndex - 1)
        set({ currentTrack: queue[prevIdx], queueIndex: prevIdx, currentTime: 0 })
      },

      seek: (time) => set({ currentTime: time }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
      setPlayMode: (mode) => set({ playMode: mode }),

      addToQueue: (track) =>
        set((s) => ({ queue: [...s.queue, track] })),

      playNext: (track) =>
        set((s) => {
          const insertAt = s.queueIndex + 1
          const q = [...s.queue]
          q.splice(insertAt, 0, track)
          return { queue: q }
        }),

      clearQueue: () =>
        set((s) => {
          const current = s.queue[s.queueIndex]
          return { queue: current ? [current] : [], queueIndex: 0 }
        }),

      removeFromQueue: (index) =>
        set((s) => {
          const q = [...s.queue]
          q.splice(index, 1)
          const newIdx = index < s.queueIndex ? s.queueIndex - 1 : s.queueIndex
          return { queue: q, queueIndex: Math.max(0, newIdx) }
        }),

      reorderQueue: (from, to) =>
        set((s) => {
          const q = [...s.queue]
          const [item] = q.splice(from, 1)
          q.splice(to, 0, item)
          return { queue: q }
        }),

      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setIsBuffering: (buffering) => set({ isBuffering: buffering }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      toggleQueue: () => set((s) => ({ isQueueOpen: !s.isQueueOpen })),
      toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
    }),
    {
      name: 'player-persist',
      partialize: (s) => ({ volume: s.volume, isMuted: s.isMuted, playMode: s.playMode }),
    }
  )
)
