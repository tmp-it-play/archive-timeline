import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { navItems } from '../../data/navigation'
import PropTypes from 'prop-types'

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2.5 5h13M2.5 9h13M2.5 13h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function MobileNav({ activeId }) {
  const [open, setOpen] = useState(false)

  const handleSelect = (id) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(false)
  }

  return (
    <>
      {/* Top bar */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-14"
        style={{ background: 'rgba(11,13,14,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(217,119,87,0.15)' }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="#d97757" strokeWidth="1.2" />
              <circle cx="7" cy="7" r="2.5" fill="#d97757" />
            </svg>
          </div>
          <span className="text-sm font-semibold" style={{ color: '#f5f0e8' }}>Claude Code 하네스 꾸미기</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg cursor-pointer"
          style={{ color: '#9ca3af' }}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-64 z-50 pt-16 pb-8 px-4"
              style={{ background: '#0f1113', borderRight: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-[10px] font-mono uppercase tracking-widest px-3 mb-3" style={{ color: '#4b5563' }}>목차</p>
              <ul className="space-y-0.5">
                {navItems.map((item) => {
                  const isActive = item.id === activeId
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleSelect(item.id)}
                        className="w-full px-3 py-2.5 rounded-lg text-sm text-left cursor-pointer"
                        style={{
                          color: isActive ? '#d97757' : '#9ca3af',
                          background: isActive ? 'rgba(217,119,87,0.10)' : 'transparent',
                          borderLeft: isActive ? '2px solid #d97757' : '2px solid transparent',
                        }}
                      >
                        {item.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

MobileNav.propTypes = {
  activeId: PropTypes.string,
}
