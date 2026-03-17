import { useEffect, useRef } from 'react'
import { usePlayerStore } from '@/store/player.store'
import { useHistoryStore } from '@/store/history.store'
import { getFirstStreamUrl } from '@/utils/streamUrl'

// Singleton audio element
const audio = new Audio()
audio.preload = 'auto'

export function useAudio() {
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    playMode,
    currentTime,
    setIsPlaying,
    setIsBuffering,
    setCurrentTime,
    setDuration,
    next,
  } = usePlayerStore()

  const { recordPlay } = useHistoryStore()
  const playStartRef = useRef<number>(0)
  const listenTimerRef = useRef<number>(0)
  const hasRecordedRef = useRef(false)

  // Update audio source when track changes
  useEffect(() => {
    if (!currentTrack) return
    const url = getFirstStreamUrl(currentTrack.fileNames)
    if (!url) return

    console.log('[Audio] Loading:', url)
    audio.src = url
    audio.load()
    hasRecordedRef.current = false
    playStartRef.current = 0
    listenTimerRef.current = 0
  }, [currentTrack?.id])

  // Play/pause
  useEffect(() => {
    if (!currentTrack) return
    if (isPlaying) {
      const p = audio.play()
      if (p) p.catch(() => setIsPlaying(false))
      playStartRef.current = Date.now()
    } else {
      audio.pause()
      if (playStartRef.current > 0) {
        listenTimerRef.current += (Date.now() - playStartRef.current) / 1000
        playStartRef.current = 0
      }
    }
  }, [isPlaying, currentTrack?.id])

  // Volume / mute
  useEffect(() => {
    audio.volume = volume
    audio.muted = isMuted
  }, [volume, isMuted])

  // Seek
  const seekRef = useRef(currentTime)
  useEffect(() => {
    if (Math.abs(audio.currentTime - currentTime) > 1.5) {
      audio.currentTime = currentTime
    }
    seekRef.current = currentTime
  }, [currentTime])

  // Wire up audio events
  useEffect(() => {
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDuration = () => setDuration(audio.duration || 0)
    const onWaiting = () => setIsBuffering(true)
    const onCanPlay = () => setIsBuffering(false)
    const onEnded = () => {
      // Record play if listened 30+ seconds
      if (currentTrack && listenTimerRef.current >= 30 && !hasRecordedRef.current) {
        hasRecordedRef.current = true
        recordPlay(currentTrack.id, listenTimerRef.current)
      }
      next()
    }
    const onError = () => {
      console.error('[Audio] Error:', audio.error?.code, audio.error?.message, audio.src)
      setIsBuffering(false)
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDuration)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDuration)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [currentTrack?.id])

  return audio
}
