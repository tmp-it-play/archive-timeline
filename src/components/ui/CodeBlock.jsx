import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { claudeTheme } from '../../lib/codeTheme'
import PropTypes from 'prop-types'

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="4.5" y="1.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 4.5H3M1.5 4.5V12.5H9.5V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export default function CodeBlock({ code, language = 'bash', filename }) {
  const [copied, copy] = useCopyToClipboard()

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#1a1d1f' }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#161a1c' }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
          </div>
          {filename && (
            <span className="text-xs font-mono ml-2" style={{ color: '#6b7280' }}>
              {filename}
            </span>
          )}
        </div>
        <button
          onClick={() => copy(code)}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-all duration-200 cursor-pointer"
          style={{
            color: copied ? '#86efac' : '#6b7280',
            background: copied ? 'rgba(134,239,172,0.08)' : 'transparent',
            border: `1px solid ${copied ? 'rgba(134,239,172,0.2)' : 'transparent'}`,
          }}
          onMouseEnter={e => { if (!copied) e.currentTarget.style.color = '#9ca3af' }}
          onMouseLeave={e => { if (!copied) e.currentTarget.style.color = '#6b7280' }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span>{copied ? '복사됨' : '복사'}</span>
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={claudeTheme}
          customStyle={{
            margin: 0,
            padding: '1.25rem 1.5rem',
            background: '#1a1d1f',
            fontSize: '13px',
            lineHeight: '1.65',
          }}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

CodeBlock.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string,
  filename: PropTypes.string,
}
