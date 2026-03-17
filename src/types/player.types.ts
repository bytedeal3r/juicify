import type { DBSong } from './db.types'

export type PlayMode = 'normal' | 'shuffle' | 'repeat-one' | 'repeat-all'

export interface PlayerState {
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
}
