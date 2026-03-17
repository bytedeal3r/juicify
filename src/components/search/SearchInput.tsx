interface Props {
  value: string
  onChange: (v: string) => void
}

export function SearchInput({ value, onChange }: Props) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#606078]">⌕</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search songs, artists..."
        className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-[#606078] focus:outline-none focus:border-[#bf5fff] transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#606078] hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  )
}
