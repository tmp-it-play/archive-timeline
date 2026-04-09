import { useEffect, useRef, useState } from 'react'
import { EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter, keymap } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, indentUnit } from '@codemirror/language'
import { html } from '@codemirror/lang-html'
import { sql } from '@codemirror/lang-sql'
import { java } from '@codemirror/lang-java'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'

// 밝은 모노크롬 테마 — 실제 IDE 느낌
const editorTheme = EditorView.theme({
  '&': {
    fontSize: '13.5px',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'Courier New', monospace",
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    height: '100%',
  },
  '.cm-scroller': {
    overflow: 'auto',
    lineHeight: '1.7',
    minHeight: '320px',
  },
  '.cm-content': {
    padding: '12px 0',
    caretColor: '#aeafad',
  },
  '.cm-focused': { outline: 'none !important' },
  // 줄 번호
  '.cm-gutters': {
    backgroundColor: '#1e1e1e',
    color: '#858585',
    border: 'none',
    borderRight: '1px solid #333',
    paddingRight: '8px',
    minWidth: '42px',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 8px 0 16px',
    minWidth: '32px',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#2a2d2e',
    color: '#c6c6c6',
  },
  // 현재 줄
  '.cm-activeLine': { backgroundColor: '#2a2d2e' },
  // 선택 영역
  '.cm-selectionBackground': { backgroundColor: '#264f78 !important' },
  '&.cm-focused .cm-selectionBackground': { backgroundColor: '#264f78' },
  '.cm-cursor': {
    borderLeftColor: '#aeafad',
    borderLeftWidth: '2px',
  },
  // 괄호 매칭
  '.cm-matchingBracket': {
    backgroundColor: '#0d3a58',
    outline: '1px solid #888',
  },
  // 폴드 버튼
  '.cm-foldGutter': { width: '16px' },
  // 선택 일치 강조
  '.cm-selectionMatch': { backgroundColor: '#3a3d41' },
  // 스크롤바
  '.cm-scroller::-webkit-scrollbar': { width: '8px', height: '8px' },
  '.cm-scroller::-webkit-scrollbar-track': { background: '#1e1e1e' },
  '.cm-scroller::-webkit-scrollbar-thumb': { background: '#555', borderRadius: '4px' },
  '.cm-scroller::-webkit-scrollbar-thumb:hover': { background: '#777' },
}, { dark: true })

// VS Code Dark+ 스타일 하이라이팅
import { HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'

const vscodeDarkHighlight = HighlightStyle.define([
  { tag: tags.keyword,              color: '#569cd6', fontWeight: 'bold' },
  { tag: tags.controlKeyword,       color: '#c586c0', fontWeight: 'bold' },
  { tag: tags.definitionKeyword,    color: '#569cd6', fontWeight: 'bold' },
  { tag: tags.modifier,             color: '#569cd6' },
  { tag: tags.operatorKeyword,      color: '#569cd6' },
  { tag: tags.string,               color: '#ce9178' },
  { tag: tags.special(tags.string), color: '#d16969' },
  { tag: tags.number,               color: '#b5cea8' },
  { tag: tags.bool,                 color: '#569cd6' },
  { tag: tags.null,                 color: '#569cd6' },
  { tag: tags.comment,              color: '#6a9955', fontStyle: 'italic' },
  { tag: tags.lineComment,          color: '#6a9955', fontStyle: 'italic' },
  { tag: tags.blockComment,         color: '#6a9955', fontStyle: 'italic' },
  { tag: tags.typeName,             color: '#4ec9b0' },
  { tag: tags.className,            color: '#4ec9b0', fontWeight: 'bold' },
  { tag: tags.function(tags.variableName), color: '#dcdcaa' },
  { tag: tags.function(tags.propertyName), color: '#dcdcaa' },
  { tag: tags.definition(tags.function(tags.variableName)), color: '#dcdcaa' },
  { tag: tags.variableName,         color: '#9cdcfe' },
  { tag: tags.propertyName,         color: '#9cdcfe' },
  { tag: tags.attributeName,        color: '#9cdcfe' },
  { tag: tags.attributeValue,       color: '#ce9178' },
  { tag: tags.operator,             color: '#d4d4d4' },
  { tag: tags.punctuation,          color: '#d4d4d4' },
  { tag: tags.bracket,              color: '#d4d4d4' },
  { tag: tags.tagName,              color: '#569cd6' },
  { tag: tags.angleBracket,         color: '#808080' },
  { tag: tags.meta,                 color: '#d4d4d4' },
  { tag: tags.atom,                 color: '#569cd6' },
])

function getLanguageExtension(lang) {
  switch (lang) {
    case 'sql':  return sql()
    case 'java': return java()
    case 'html':
    default:     return html()
  }
}

const readOnlyCompartment = new Compartment()

export default function CodeEditor({ value, onChange, language = 'html', readOnly = false, minHeight = '320px' }) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)
  const [initError, setInitError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    setInitError(null)

    let view
    try {
      const extensions = [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        highlightSelectionMatches(),
        syntaxHighlighting(vscodeDarkHighlight),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        foldGutter(),
        indentUnit.of('    '),
        keymap.of([
          indentWithTab,
          ...defaultKeymap,
          ...historyKeymap,
          ...closeBracketsKeymap,
          ...searchKeymap,
        ]),
        getLanguageExtension(language),
        editorTheme,
        readOnlyCompartment.of(EditorState.readOnly.of(readOnly)),
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
        parent: containerRef.current,
      })

      viewRef.current = view
    } catch (e) {
      console.error('CodeEditor init error:', e)
      setInitError(e.message)
    }

    return () => {
      if (view) view.destroy()
      viewRef.current = null
    }
  }, [language])

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

  const handleCopy = () => {
    const text = viewRef.current?.state.doc.toString() ?? value ?? ''
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const LANG_LABEL = { html: 'HTML/JSP', sql: 'SQL', java: 'Java' }

  if (initError) {
    return (
      <div className="rounded-lg overflow-hidden border border-gray-700">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-xs text-gray-400 font-mono">{LANG_LABEL[language] || language}</span>
        </div>
        <textarea
          defaultValue={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          style={{ minHeight, fontFamily: 'monospace', fontSize: 13 }}
          className="w-full p-3 text-gray-100 bg-gray-900 resize-y outline-none"
        />
      </div>
    )
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-700 flex flex-col">
      {/* 툴바 */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono">{LANG_LABEL[language] || language.toUpperCase()}</span>
          {readOnly && (
            <span className="text-xs text-gray-600 border border-gray-700 px-1.5 py-0.5 rounded">읽기 전용</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-gray-200 transition-colors px-2 py-0.5 rounded hover:bg-gray-700"
        >
          {copied ? '복사됨 ✓' : '복사'}
        </button>
      </div>

      {/* 에디터 */}
      <div
        ref={containerRef}
        style={{ minHeight }}
        className="flex-1 overflow-hidden"
      />
    </div>
  )
}
