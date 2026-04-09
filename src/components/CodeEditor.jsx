import { useEffect, useRef, useState } from 'react'
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, dropCursor, Decoration } from '@codemirror/view'
import { EditorState, StateEffect, StateField, RangeSetBuilder } from '@codemirror/state'
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands'
import { indentOnInput, syntaxHighlighting, bracketMatching, foldGutter, foldKeymap } from '@codemirror/language'
import { closeBrackets, closeBracketsKeymap, autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { html } from '@codemirror/lang-html'
import { sql } from '@codemirror/lang-sql'
import { java } from '@codemirror/lang-java'
import { oneDarkTheme, oneDarkHighlightStyle } from '@codemirror/theme-one-dark'

// ── 미리보기 호버 → 에디터 태그 하이라이트 ──────────────────────────
const setHighlightTag = StateEffect.define()

const tagHighlightMark = Decoration.mark({ class: 'cm-preview-hover' })
const cssHighlightMark = Decoration.mark({ class: 'cm-preview-hover-css' })

// index번째 HTML 태그 + 모든 CSS 선택자 하이라이트
function buildTagDecos(doc, tagName, index) {
  if (!tagName) return Decoration.none
  const text = doc.toString()
  const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const htmlMatches = []
  const cssMatches = []

  // 여는 태그: index번째 <tagName
  const openRe = new RegExp(`<${escaped}(?=[\\s>/])`, 'gi')
  let m, count = 0
  while ((m = openRe.exec(text)) !== null) {
    if (count === index) {
      htmlMatches.push([m.index, m.index + 1 + tagName.length])
      break
    }
    count++
  }

  // 닫는 태그: index번째 </tagName
  const closeRe = new RegExp(`<\\/${escaped}(?=[\\s>])`, 'gi')
  count = 0
  while ((m = closeRe.exec(text)) !== null) {
    if (count === index) {
      htmlMatches.push([m.index, m.index + 2 + tagName.length])
      break
    }
    count++
  }

  // CSS 선택자: 모든 occurrence (HTML 태그 컨텍스트 제외)
  const cssRe = new RegExp(`(?<![<\\/a-zA-Z0-9-])(${escaped})(?=[\\s,{:.#>[\\)])`, 'gi')
  while ((m = cssRe.exec(text)) !== null) {
    cssMatches.push([m.index, m.index + tagName.length])
  }

  // HTML과 CSS 범위가 겹치지 않도록 병합 후 정렬
  const allMatches = [
    ...htmlMatches.map(r => ({ range: r, mark: tagHighlightMark })),
    ...cssMatches.map(r => ({ range: r, mark: cssHighlightMark })),
  ].sort((a, b) => a.range[0] - b.range[0])

  const builder = new RangeSetBuilder()
  let prevTo = -1
  for (const { range: [from, to], mark } of allMatches) {
    if (from >= prevTo) {
      builder.add(from, to, mark)
      prevTo = to
    }
  }
  return builder.finish()
}

const highlightTagField = StateField.define({
  create: () => Decoration.none,
  update(deco, tr) {
    deco = deco.map(tr.changes)
    for (const eff of tr.effects) {
      if (eff.is(setHighlightTag)) {
        if (!eff.value) return Decoration.none
        return buildTagDecos(tr.state.doc, eff.value.tag, eff.value.index)
      }
    }
    return deco
  },
  provide: f => EditorView.decorations.from(f),
})

const highlightTagTheme = EditorView.baseTheme({
  '.cm-preview-hover': {
    backgroundColor: 'rgba(255, 200, 0, 0.30)',
    borderRadius: '3px',
    outline: '2px solid rgba(255, 200, 0, 0.9)',
    outlineOffset: '1px',
  },
  '.cm-preview-hover-css': {
    backgroundColor: 'rgba(100, 200, 255, 0.22)',
    borderRadius: '3px',
    outline: '2px solid rgba(100, 200, 255, 0.8)',
    outlineOffset: '1px',
  },
})
// ────────────────────────────────────────────────────────────────────

// 스크롤바·폰트·크기 커스텀
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
  return html()
}

const LANG_LABEL = { html: 'HTML/JSP', sql: 'SQL', java: 'Java', jsp: 'JSP' }

export default function CodeEditor({
  value,
  onChange,
  language = 'html',
  readOnly = false,
  minHeight = '320px',
  extraExtensions = [],
  highlightTag = null,
}) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      const extensions = [
        // 언어
        getLang(language),

        // 테마
        oneDarkTheme,
        syntaxHighlighting(oneDarkHighlightStyle),

        // UI features
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        drawSelection(),
        dropCursor(),
        bracketMatching(),
        foldGutter(),
        history(),
        indentOnInput(),
        closeBrackets(),
        autocompletion({ activateOnTyping: false }),

        // 키맵
        keymap.of([
          indentWithTab,
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
        ]),

        // 커스텀 스타일
        baseTheme,

        // 미리보기 호버 하이라이트
        highlightTagField,
        highlightTagTheme,

        EditorView.lineWrapping,
        EditorState.readOnly.of(readOnly),

        // 외부 주입 확장 (툴팁 등)
        ...extraExtensions,
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
      console.error('CodeEditor init error:', e)
      setHasError(true)
    }
  }, [language, readOnly]) // eslint-disable-line react-hooks/exhaustive-deps

  // 미리보기 호버 태그 → 에디터 하이라이트 + 해당 위치로 스크롤
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    view.dispatch({ effects: setHighlightTag.of(highlightTag) })

  }, [highlightTag])

  // readOnly 모드: 외부 value 변경 반영
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
