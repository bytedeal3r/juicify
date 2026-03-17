import { NavLink } from 'react-router-dom'
import { useLibraryStore } from '@/store/library.store'
import { useUIStore } from '@/store/ui.store'

const navItems = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/search', label: 'Search', icon: '⌕' },
  { to: '/library', label: 'Library', icon: '⊟' },
  { to: '/liked', label: 'Liked Songs', icon: '♥' },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, openModal } = useUIStore()
  const { userPlaylists } = useLibraryStore()

  return (
    <aside
      className={`flex flex-col h-full bg-[#0a0a0f] border-r border-white/5 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/5">
        {!sidebarCollapsed && (
          <span className="text-xl font-black">
            <span className="text-white">Juice</span>
            <span className="text-[#bf5fff]">ify</span>
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="w-7 h-7 flex items-center justify-center text-[#606078] hover:text-white transition-colors rounded"
        >
          {sidebarCollapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-[#bf5fff22] text-[#bf5fff]'
                  : 'text-[#a0a0b8] hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="text-base w-5 text-center flex-shrink-0">{icon}</span>
            {!sidebarCollapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {/* Playlists section */}
        {!sidebarCollapsed && (
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[#606078] text-xs uppercase tracking-wider">Playlists</span>
              <button
                onClick={() => openModal('create-playlist')}
                className="text-[#606078] hover:text-[#bf5fff] transition-colors text-lg leading-none"
              >
                +
              </button>
            </div>
            {userPlaylists.map((p) => (
              <NavLink
                key={p.id}
                to={`/playlist/${p.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                    isActive ? 'text-[#bf5fff]' : 'text-[#606078] hover:text-[#a0a0b8]'
                  }`
                }
              >
                <span className="text-xs w-5 text-center">♪</span>
                <span className="truncate">{p.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </aside>
  )
}
