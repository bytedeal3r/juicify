import { useEffect, useState } from 'react'
import { isInitComplete } from '@/db'

export function useInitStatus() {
  const [initDone, setInitDone] = useState<boolean | null>(null)

  useEffect(() => {
    isInitComplete().then((done) => setInitDone(done))
  }, [])

  return { initDone, setInitDone }
}
