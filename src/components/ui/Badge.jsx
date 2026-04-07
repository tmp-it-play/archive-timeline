import PropTypes from 'prop-types'

const variants = {
  default: 'bg-white/8 text-[#9ca3af] border border-white/10',
  orange: 'bg-[rgba(217,119,87,0.12)] text-[#d97757] border border-[rgba(217,119,87,0.3)]',
  blue: 'bg-[rgba(125,211,252,0.1)] text-[#7dd3fc] border border-[rgba(125,211,252,0.2)]',
  green: 'bg-[rgba(134,239,172,0.1)] text-[#86efac] border border-[rgba(134,239,172,0.2)]',
  purple: 'bg-[rgba(167,139,250,0.1)] text-[#a78bfa] border border-[rgba(167,139,250,0.2)]',
}

export default function Badge({ children, variant = 'default' }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-mono px-2 py-0.5 rounded-full ${variants[variant] ?? variants.default}`}
    >
      {children}
    </span>
  )
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'orange', 'blue', 'green', 'purple']),
}
