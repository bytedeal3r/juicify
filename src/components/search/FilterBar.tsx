import { useEffect, useState } from 'react'
import { fetchEras } from '@/api/eras'
import { fetchCategories } from '@/api/categories'
import type { ApiCategory, ApiEra } from '@/types/api.types'

interface Props {
  category?: string
  eraName?: string
  onCategory: (c?: string) => void
  onEraName: (e?: string) => void
}

export function FilterBar({ category, eraName, onCategory, onEraName }: Props) {
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [eras, setEras] = useState<ApiEra[]>([])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
    fetchEras().then(setEras).catch(() => {})
  }, [])

  return (
    <div className="flex gap-3 flex-wrap">
      <select
        value={category || ''}
        onChange={(e) => onCategory(e.target.value || undefined)}
        className="bg-[#12121a] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#a0a0b8] focus:outline-none focus:border-[#bf5fff]"
      >
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
      </select>
      <select
        value={eraName || ''}
        onChange={(e) => onEraName(e.target.value || undefined)}
        className="bg-[#12121a] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#a0a0b8] focus:outline-none focus:border-[#bf5fff]"
      >
        <option value="">All Eras</option>
        {eras.map((e) => <option key={e.id} value={e.name}>{e.name}</option>)}
      </select>
      {(category || eraName) && (
        <button
          onClick={() => { onCategory(undefined); onEraName(undefined) }}
          className="text-[#606078] hover:text-white text-sm transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
