import { useNavigate } from 'react-router-dom'
import { useHistoryStore } from '@/store/history.store'
import { GlassCard } from '@/components/ui/GlassCard'

export function WeeklyPlaylist() {
  const { weeklyPlaylist, weeklyTopIds } = useHistoryStore()
  const navigate = useNavigate()

  if (!weeklyPlaylist || weeklyTopIds.length < 3) return null

  return (
    <section>
      <h2 className="text-white font-bold text-lg mb-4">Your Week in Music</h2>
      <GlassCard
        onClick={() => navigate(`/playlist/${weeklyPlaylist.id}`)}
        className="p-4 flex items-center gap-4"
      >
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #bf5fff, #00d4ff)' }}
        >
          <span className="text-2xl">♪</span>
        </div>
        <div>
          <p className="text-white font-semibold">{weeklyPlaylist.name}</p>
          <p className="text-[#606078] text-sm">{weeklyTopIds.length} most played songs this week</p>
        </div>
        <span className="ml-auto text-[#bf5fff]">›</span>
      </GlassCard>
    </section>
  )
}
