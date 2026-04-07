import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'

function ChevronIcon({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.25s ease',
        flexShrink: 0,
      }}
    >
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ExpandableCard({ title, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-150 cursor-pointer"
        style={{ background: '#161a1c' }}
        onMouseEnter={e => e.currentTarget.style.background = '#1a1d20'}
        onMouseLeave={e => e.currentTarget.style.background = '#161a1c'}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: '#f5f0e8' }}>{title}</span>
          {badge && badge}
        </div>
        <ChevronIcon open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

ExpandableCard.propTypes = {
  title: PropTypes.string.isRequired,
  badge: PropTypes.node,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
}

ChevronIcon.propTypes = {
  open: PropTypes.bool.isRequired,
}
