import { useEffect } from 'react'
import { useInitProgress } from '@/init/InitProgressStore'
import { runInitPipeline } from '@/init/InitController'

interface Props {
  onComplete: () => void
}

export function InitScreen({ onComplete }: Props) {
  const { phase, progress, message, error, setPhase, setProgress, setMessage, setError } =
    useInitProgress()

  useEffect(() => {
    runInitPipeline((phase, progress, message) => {
      setPhase(phase)
      setProgress(progress)
      setMessage(message)
    })
      .then(() => {
        setTimeout(onComplete, 800)
      })
      .catch((err) => {
        setError(err.message || 'Initialization failed')
      })
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a0f] z-50">
      {/* Logo */}
      <div className="mb-12 text-center">
        <h1 className="text-6xl font-black tracking-tight">
          <span className="text-white">Juice</span>
          <span className="text-[#bf5fff]">ify</span>
        </h1>
        <p className="text-[#606078] mt-2 text-sm tracking-widest uppercase">
          Juice WRLD Music Player
        </p>
      </div>

      {/* Progress container */}
      <div className="w-80 space-y-4">
        {/* Progress bar */}
        <div className="h-1 w-full bg-[#1a1a28] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: error
                ? '#ff4444'
                : phase === 'complete'
                ? '#00ff88'
                : 'linear-gradient(90deg, #bf5fff, #00d4ff)',
              boxShadow: error ? '0 0 10px #ff444466' : '0 0 10px #bf5fff66',
            }}
          />
        </div>

        {/* Message */}
        <div className="text-center">
          {error ? (
            <div className="space-y-3">
              <p className="text-[#ff4444] text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#bf5fff22] border border-[#bf5fff44] text-[#bf5fff] text-sm rounded-lg hover:bg-[#bf5fff33] transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <p className="text-[#a0a0b8] text-sm">{message}</p>
              <p className="text-[#606078] text-xs mt-1">{progress}%</p>
            </>
          )}
        </div>

        {/* Phase indicators */}
        <div className="flex justify-between px-1">
          {(['stats', 'songs', 'building', 'writing', 'complete'] as const).map((p) => {
            const phaseOrder = ['stats', 'songs', 'metadata', 'building', 'writing', 'complete']
            const isDone = phaseOrder.indexOf(phase) > phaseOrder.indexOf(p)
            const isActive = phase === p
            return (
              <div
                key={p}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-[#bf5fff] scale-150'
                    : isDone
                    ? 'bg-[#00ff88]'
                    : 'bg-[#606078]'
                }`}
              />
            )
          })}
        </div>
      </div>

      <p className="mt-16 text-[#606078] text-xs">
        Building your offline music library...
      </p>
    </div>
  )
}
