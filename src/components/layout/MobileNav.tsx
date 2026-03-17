import { NavLink } from 'react-router-dom'
import { Home, Search, Library, Heart } from 'lucide-react'

const navItems = [
  { to: '/',        label: 'Home',    Icon: Home    },
  { to: '/search',  label: 'Search',  Icon: Search  },
  { to: '/library', label: 'Library', Icon: Library },
  { to: '/liked',   label: 'Liked',   Icon: Heart   },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#111119]/95 backdrop-blur-md border-t border-white/5 flex md:hidden">
      {navItems.map(({ to, label, Icon }) => (
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
          <Icon size={20} />
          <span className="text-[10px] mt-1">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
