export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-white/5 rounded animate-pulse ${className}`}
    />
  )
}
