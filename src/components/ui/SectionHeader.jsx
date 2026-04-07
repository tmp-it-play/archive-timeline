import PropTypes from 'prop-types'

export default function SectionHeader({ id, eyebrow, title, accentWord, subtitle }) {
  const renderTitle = () => {
    if (!accentWord) return title
    const idx = title.indexOf(accentWord)
    if (idx === -1) return title
    return (
      <>
        {title.slice(0, idx)}
        <span style={{ color: '#d97757' }}>{accentWord}</span>
        {title.slice(idx + accentWord.length)}
      </>
    )
  }

  return (
    <div id={id} className="mb-12 scroll-mt-8">
      {eyebrow && (
        <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: '#d97757' }}>
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: '#f5f0e8' }}>
        {renderTitle()}
      </h2>
      {subtitle && (
        <p className="text-base leading-relaxed max-w-2xl" style={{ color: '#9ca3af' }}>
          {subtitle}
        </p>
      )}
      <div className="mt-6 w-10 h-0.5 rounded-full" style={{ backgroundColor: '#d97757' }} />
    </div>
  )
}

SectionHeader.propTypes = {
  id: PropTypes.string.isRequired,
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  accentWord: PropTypes.string,
  subtitle: PropTypes.string,
}
