import { type ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function GlassCard({ children, className = '', onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`bg-white/[0.04] backdrop-blur-md border border-white/5 rounded-xl ${
        onClick ? 'cursor-pointer hover:bg-white/[0.07] transition-colors' : ''
      } ${className}`}
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' }}
    >
      {children}
    </div>
  )
}
