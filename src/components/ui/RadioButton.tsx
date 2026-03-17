import { useState } from 'react'
import { Radio, Loader2 } from 'lucide-react'
import { fetchRadioSongs } from '@/api/radio'
import { mapApiSongToDBSong } from '@/init/AlbumBuilder'
import { usePlayerStore } from '@/store/player.store'

interface Props {
  variant?: 'default' | 'card'
}

export function RadioButton({ variant = 'default' }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { playAlbum } = usePlayerStore()

  const handlePlay = async () => {
    if (loading) return
    setLoading(true)
    setError(false)
    try {
      const apiSongs = await fetchRadioSongs()
      const songs = apiSongs.map(mapApiSongToDBSong).filter((s) => s.fileNames.length > 0)
      if (songs.length === 0) { setError(true); return }
      playAlbum(songs, 0, 'radio')
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'card') {
    return (
      <button
        onClick={handlePlay}
        disabled={loading}
        className="w-full flex items-center gap-4 p-4 rounded-2xl border border-white/10 hover:border-[#bf5fff]/40 hover:bg-[#bf5fff08] transition-all group"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#bf5fff] to-[#00d4ff] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
          {loading ? <Loader2 size={20} className="text-white animate-spin" /> : <Radio size={20} className="text-white" />}
        </div>
        <div className="text-left">
          <p className="text-white font-semibold text-sm">Play Radio</p>
          <p className="text-[#606078] text-xs">{error ? 'Failed — try again' : 'Random mix of songs'}</p>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={handlePlay}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all bg-white/10 hover:bg-white/15 text-white disabled:opacity-60"
    >
      {loading
        ? <Loader2 size={15} className="animate-spin" />
        : <Radio size={15} />
      }
      {error ? 'Try Again' : 'Play Radio'}
    </button>
  )
}
