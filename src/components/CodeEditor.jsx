import { useEffect, useRef, useState } from 'react'
import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { indentWithTab } from '@codemirror/commands'
import { html } from '@codemirror/lang-html'
import { sql } from '@codemirror/lang-sql'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'

const baseTheme = EditorView.theme({
  '&': { fontSize: '13.5px' },
  '.cm-scroller': {
    fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code','Consolas','Courier New',monospace",
    lineHeight: '1.7',
    overflow: 'auto',
  },
  '.cm-focused': { outline: 'none !important' },
  '.cm-editor': { height: '100%' },
  '.cm-scroller::-webkit-scrollbar': { width: '8px', height: '8px' },
  '.cm-scroller::-webkit-scrollbar-track': { background: '#21252b' },
  '.cm-scroller::-webkit-scrollbar-thumb': { background: '#4a4f5a', borderRadius: '4px' },
  '.cm-scroller::-webkit-scrollbar-thumb:hover': { background: '#6a7080' },
})

function getLang(lang) {
  if (lang === 'sql')  return sql()
  if (lang === 'java') return java()
  return html()  // html, jsp 모두 html parser로 처리
}

const LANG_LABEL = { html: 'HTML/JSP', sql: 'SQL', java: 'Java', jsp: 'JSP' }

export default function CodeEditor({
  value,
  onChange,
  language = 'html',
  readOnly = false,
  minHeight = '320px',
}) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      const extensions = [
        basicSetup,
        getLang(language),
        oneDark,
        baseTheme,
        keymap.of([indentWithTab]),
        EditorView.lineWrapping,
        EditorState.readOnly.of(readOnly),
      ]

      if (onChange && !readOnly) {
        extensions.push(
          EditorView.updateListener.of((u) => {
            if (u.docChanged) onChange(u.state.doc.toString())
          })
        )
      }

      const view = new EditorView({
        state: EditorState.create({ doc: value ?? '', extensions }),
        parent: containerRef.current,
      })
      viewRef.current = view

      return () => { view.destroy(); viewRef.current = null }
    } catch (e) {
      console.error('CodeEditor init:', e)
      setHasError(true)
    }
  }, [language, readOnly])

  // readOnly 일 때 외부 value 변경 반영
  useEffect(() => {
    const view = viewRef.current
    if (!view || !readOnly) return
    const cur = view.state.doc.toString()
    if (cur !== value) {
      view.dispatch({ changes: { from: 0, to: cur.length, insert: value ?? '' } })
    }
  }, [value, readOnly])

  const handleCopy = () => {
    const text = viewRef.current?.state.doc.toString() ?? value ?? ''
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  // fallback: 에디터 초기화 실패 시 textarea
  if (hasError) {
    return (
      <div className="rounded-lg overflow-hidden border border-gray-700">
        <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 border-b border-gray-700">
          <span className="text-xs text-gray-400 font-mono">{LANG_LABEL[language] ?? language}</span>
        </div>
        <textarea
          defaultValue={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          style={{ minHeight, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7 }}
          className="w-full p-3 text-gray-100 bg-gray-900 resize-y outline-none"
        />
      </div>
    )
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-700 flex flex-col" style={{ minHeight }}>
      {/* 툴바 */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#21252b] border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono">{LANG_LABEL[language] ?? language}</span>
          {readOnly && (
            <span className="text-xs text-gray-600 border border-gray-700 px-1.5 py-0.5 rounded">
              읽기 전용
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-gray-200 transition-colors px-2 py-0.5 rounded hover:bg-gray-700"
        >
          {copied ? '복사됨 ✓' : '복사'}
        </button>
      </div>

      {/* 에디터 영역 */}
      <div ref={containerRef} className="flex-1 overflow-hidden" style={{ minHeight }} />
    </div>
  )
}
