import { useEffect } from 'react'
import { useHistoryStore } from '@/store/history.store'

export function useHistory() {
  const store = useHistoryStore()

  useEffect(() => {
    store.loadRecent()
  }, [])

  return store
}
