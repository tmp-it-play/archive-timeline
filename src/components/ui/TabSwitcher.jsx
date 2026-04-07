import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'

export default function TabSwitcher({ tabs, defaultTab }) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id)
  const [direction, setDirection] = useState(1)

  const activeIdx = tabs.findIndex(t => t.id === active)

  const handleSelect = (id) => {
    const newIdx = tabs.findIndex(t => t.id === id)
    setDirection(newIdx > activeIdx ? 1 : -1)
    setActive(id)
  }

  const activeTab = tabs.find(t => t.id === active)

  return (
    <div>
      {/* Tab bar */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-5 overflow-x-auto"
        style={{ background: '#141618', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className="relative flex-shrink-0 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer"
              style={{
                color: isActive ? '#d97757' : '#6b7280',
                background: isActive ? 'rgba(217,119,87,0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(217,119,87,0.25)' : '1px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#9ca3af' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#6b7280' }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div style={{ overflow: 'hidden' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            initial={{ opacity: 0, x: direction * 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -18 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {activeTab?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

TabSwitcher.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
  defaultTab: PropTypes.string,
}
