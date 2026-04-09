import { useEffect, useRef, useState } from 'react'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from '@codemirror/basic-setup'
import { html } from '@codemirror/lang-html'
import { sql } from '@codemirror/lang-sql'
import { java } from '@codemirror/lang-java'

const monochromTheme = EditorView.theme({
  '&': {
    backgroundColor: '#fafafa',
    color: '#111',
    fontSize: '13px',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
    minHeight: '160px',
  },
  '.cm-editor': {
    minHeight: '160px',
  },
  '.cm-scroller': {
    overflow: 'auto',
    minHeight: '160px',
  },
  '.cm-focused': { outline: 'none !important' },
  '.cm-gutters': {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    border: 'none',
    borderRight: '1px solid #e5e7eb',
  },
  '.cm-activeLineGutter': { backgroundColor: '#e9ecef' },
  '.cm-activeLine': { backgroundColor: '#f0f0f0' },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
    backgroundColor: '#d1d5db !important',
  },
  '.cm-cursor': { borderLeftColor: '#111' },
}, { dark: false })

function getLanguageExtension(lang) {
  switch (lang) {
    case 'sql': return sql()
    case 'java': return java()
    case 'html':
    default: return html()
  }
}

export default function CodeEditor({ value, onChange, language = 'html', readOnly = false }) {
  const editorRef = useRef(null)
  const viewRef = useRef(null)
  const [initError, setInitError] = useState(null)

  useEffect(() => {
    if (!editorRef.current) return
    setInitError(null)

    let view
    try {
      const extensions = [
        basicSetup,
        getLanguageExtension(language),
        monochromTheme,
        EditorView.editable.of(!readOnly),
        EditorView.lineWrapping,
      ]

      if (onChange && !readOnly) {
        extensions.push(
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChange(update.state.doc.toString())
            }
          })
        )
      }

      const startState = EditorState.create({
        doc: value || '',
        extensions,
      })

      view = new EditorView({
        state: startState,
        parent: editorRef.current,
      })

      viewRef.current = view
    } catch (e) {
      setInitError(e.message)
    }

    return () => {
      if (view) {
        view.destroy()
      }
      viewRef.current = null
    }
  }, [language, readOnly])

  // readOnly 모드에서 외부 value 변경 반영
  useEffect(() => {
    if (!viewRef.current || !readOnly) return
    const current = viewRef.current.state.doc.toString()
    if (current !== value) {
      viewRef.current.dispatch({
        changes: { from: 0, to: current.length, insert: value || '' },
      })
    }
  }, [value, readOnly])

  if (initError) {
    return (
      <textarea
        defaultValue={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        className="w-full min-h-40 p-3 text-xs font-mono border border-gray-200 rounded bg-gray-50 resize-y outline-none focus:border-gray-400"
      />
    )
  }

  return (
    <div
      ref={editorRef}
      className="rounded border border-gray-200 overflow-hidden min-h-40"
    />
  )
}
