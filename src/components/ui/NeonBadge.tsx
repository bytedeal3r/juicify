type Color = 'purple' | 'blue' | 'green' | 'red'

const colorMap: Record<Color, { bg: string; text: string; shadow: string }> = {
  purple: { bg: '#bf5fff22', text: '#bf5fff', shadow: '#bf5fff44' },
  blue: { bg: '#00d4ff22', text: '#00d4ff', shadow: '#00d4ff44' },
  green: { bg: '#00ff8822', text: '#00ff88', shadow: '#00ff8844' },
  red: { bg: '#ff444422', text: '#ff4444', shadow: '#ff444444' },
}

export function NeonBadge({ label, color = 'purple' }: { label: string; color?: Color }) {
  const c = colorMap[color]
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: c.bg, color: c.text, boxShadow: `0 0 8px ${c.shadow}` }}
    >
      {label}
    </span>
  )
}
