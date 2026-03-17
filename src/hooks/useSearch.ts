import { useState, useEffect, useCallback } from 'react'
import { searchSongs } from '@/db/songs'
import type { DBSong } from '@/types/db.types'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | undefined>()
  const [eraName, setEraName] = useState<string | undefined>()
  const [results, setResults] = useState<DBSong[]>([])
  const [loading, setLoading] = useState(false)

  const doSearch = useCallback(async () => {
    if (!query && !category && !eraName) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await searchSongs(query, { category, eraName })
      setResults(res.slice(0, 200))
    } finally {
      setLoading(false)
    }
  }, [query, category, eraName])

  useEffect(() => {
    const t = setTimeout(doSearch, 300)
    return () => clearTimeout(t)
  }, [doSearch])

  return { query, setQuery, category, setCategory, eraName, setEraName, results, loading }
}
