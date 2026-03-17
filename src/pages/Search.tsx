import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import { useSearch } from '@/hooks/useSearch'
import { SearchInput } from '@/components/search/SearchInput'
import { FilterBar } from '@/components/search/FilterBar'
import { SongRow } from '@/components/cards/SongRow'
import { Skeleton } from '@/components/ui/Skeleton'

export function Search() {
  const { query, setQuery, category, setCategory, eraName, setEraName, results, loading } =
    useSearch()

  const parentRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: results.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  })

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 space-y-4">
        <h1 className="text-white font-bold text-2xl">Search</h1>
        <SearchInput value={query} onChange={setQuery} />
        <FilterBar
          category={category}
          eraName={eraName}
          onCategory={setCategory}
          onEraName={setEraName}
        />
      </div>

      {loading && (
        <div className="px-6 space-y-2">
          {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
        </div>
      )}

      {!loading && results.length === 0 && (query || category || eraName) && (
        <div className="flex-1 flex items-center justify-center text-[#606078]">
          No results found
        </div>
      )}

      {!loading && results.length === 0 && !query && !category && !eraName && (
        <div className="flex-1 flex items-center justify-center text-[#606078] text-center px-8">
          <div>
            <p className="text-4xl mb-3">⌕</p>
            <p>Search for songs, artists, eras</p>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div ref={parentRef} className="flex-1 overflow-auto px-3 pb-32">
          <div
            style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const song = results[virtualItem.index]
              return (
                <div
                  key={song.id}
                  style={{
                    position: 'absolute',
                    top: virtualItem.start,
                    left: 0,
                    right: 0,
                    height: virtualItem.size,
                  }}
                >
                  <SongRow
                    song={song}
                    index={virtualItem.index}
                    queue={results}
                    source="search"
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
