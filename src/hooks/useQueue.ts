import { usePlayerStore } from '@/store/player.store'

export function useQueue() {
  const { queue, queueIndex, addToQueue, removeFromQueue, reorderQueue, toggleQueue, isQueueOpen } =
    usePlayerStore()
  return { queue, queueIndex, addToQueue, removeFromQueue, reorderQueue, toggleQueue, isQueueOpen }
}
