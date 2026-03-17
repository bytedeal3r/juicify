import { usePlayerStore } from '@/store/player.store'

export function usePlayer() {
  return usePlayerStore()
}
