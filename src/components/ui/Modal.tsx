import { type ReactNode, useEffect } from 'react'
import { useUIStore } from '@/store/ui.store'

interface Props {
  title: string
  children: ReactNode
}

export function Modal({ title, children }: Props) {
  const { closeModal } = useUIStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
      <div className="relative z-10 bg-[#12121a] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">{title}</h2>
          <button onClick={closeModal} className="text-[#606078] hover:text-white transition-colors">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
