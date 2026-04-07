import { navItems } from '../../data/navigation'
import PropTypes from 'prop-types'

export default function Sidebar({ activeId, onSelect }) {
  return (
    <aside
      className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-[240px] z-40"
      style={{ borderRight: '1px solid rgba(255,255,255,0.06)', background: '#0b0d0e' }}
    >
      {/* Logo area */}
      <div className="px-6 pt-8 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(217,119,87,0.15)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="#d97757" strokeWidth="1.2" />
              <circle cx="7" cy="7" r="2.5" fill="#d97757" />
            </svg>
          </div>
          <span className="text-sm font-semibold" style={{ color: '#f5f0e8' }}>Claude Code</span>
        </div>
        <p className="text-xs leading-tight" style={{ color: '#d97757', paddingLeft: '34px' }}>하네스 꾸미기</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        <p className="text-[10px] font-mono uppercase tracking-widest px-3 mb-3" style={{ color: '#4b5563' }}>목차</p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = item.id === activeId
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    const el = document.getElementById(item.id)
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    onSelect?.(item.id)
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-all duration-150 cursor-pointer"
                  style={{
                    color: isActive ? '#d97757' : '#6b7280',
                    background: isActive ? 'rgba(217,119,87,0.10)' : 'transparent',
                    borderLeft: isActive ? '2px solid #d97757' : '2px solid transparent',
                    fontWeight: isActive ? 500 : 400,
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = 'transparent' } }}
                >
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-[11px] leading-relaxed" style={{ color: '#4b5563' }}>
          실전 예시: datagsm-server
        </p>
      </div>
    </aside>
  )
}

Sidebar.propTypes = {
  activeId: PropTypes.string,
  onSelect: PropTypes.func,
}
