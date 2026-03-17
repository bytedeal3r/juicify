import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/search', label: 'Search', icon: '⌕' },
  { to: '/library', label: 'Library', icon: '⊟' },
  { to: '/liked', label: 'Liked', icon: '♥' },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#111119]/95 backdrop-blur-md border-t border-white/5 flex md:hidden">
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-3 transition-colors ${
              isActive ? 'text-[#bf5fff]' : 'text-[#606078]'
            }`
          }
        >
          <span className="text-xl">{icon}</span>
          <span className="text-[10px]">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
