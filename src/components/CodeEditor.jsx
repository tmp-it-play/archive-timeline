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
const setHighlightTag   = StateEffect.define()
const setHighlightRange = StateEffect.define()

const tagHighlightMark   = Decoration.mark({ class: 'cm-preview-hover' })
const cssLineMark        = Decoration.line({ class: 'cm-preview-hover-css-line' })
const rangeHighlightMark = Decoration.mark({ class: 'cm-preview-jsp-hover' })

// HTML/CSS 주석 범위 수집
function getCommentRanges(text) {
  const ranges = []
  let m
  const htmlRe = /<!--[\s\S]*?-->/g
  while ((m = htmlRe.exec(text)) !== null) ranges.push([m.index, m.index + m[0].length])
  const cssRe = /\/\*[\s\S]*?\*\//g
  while ((m = cssRe.exec(text)) !== null) ranges.push([m.index, m.index + m[0].length])
  return ranges
}

function inAnyRange(pos, ranges) {
  return ranges.some(([s, e]) => pos >= s && pos < e)
}

// CSS 규칙 블록의 줄 번호 범위 수집 (Decoration.line용)
function buildCssLineDecos(doc, tagName, classes = []) {
  if (!tagName) return Decoration.none
  const text = doc.toString()
  const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const commentRanges = getCommentRanges(text)
  // 태그 선택자 또는 클래스 선택자 중 하나라도 매칭되면 해당 규칙 강조
  const tagInSelectorRe = new RegExp(`(?<![a-zA-Z0-9_-])(${escaped})(?![a-zA-Z0-9_-])`)
  const classPatterns = classes.map(cls => {
    const ec = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`\\.${ec}(?![a-zA-Z0-9_-])`)
  })

  const lineFroms = []

  const styleRe = /<style[^>]*>/gi
  let styleTagMatch
  while ((styleTagMatch = styleRe.exec(text)) !== null) {
    const contentStart = styleTagMatch.index + styleTagMatch[0].length
    const closeTag = text.indexOf('</style>', contentStart)
    const styleContent = closeTag === -1 ? text.slice(contentStart) : text.slice(contentStart, closeTag)

    const ruleRe = /([^{}]+)\{([^{}]*)\}/g
    let ruleMatch
    while ((ruleMatch = ruleRe.exec(styleContent)) !== null) {
      const selector = ruleMatch[1]
      const ruleAbsStart = contentStart + ruleMatch.index
      const ruleAbsEnd = ruleAbsStart + ruleMatch[0].length

      if (inAnyRange(ruleAbsStart, commentRanges)) continue

      // 선택자 앞의 공백·주석 건너뛰어 실제 선택자 시작점 계산
      let selectorOffset = 0
      while (selectorOffset < selector.length) {
        const ws = selector.slice(selectorOffset).match(/^\s+/)
        if (ws) { selectorOffset += ws[0].length; continue }
        if (selector.slice(selectorOffset, selectorOffset + 2) === '/*') {
          const end = selector.indexOf('*/', selectorOffset + 2)
          if (end !== -1) { selectorOffset = end + 2; continue }
        }
        break
      }
      const actualFrom = ruleAbsStart + selectorOffset
      const actualTo = ruleAbsEnd - 1 // } 문자 위치

      const selectorText = selector.slice(selectorOffset)
      const matches = tagInSelectorRe.test(selectorText) || classPatterns.some(re => re.test(selectorText))
      if (matches) {
        const startLine = doc.lineAt(actualFrom).number
        const endLine = doc.lineAt(actualTo).number
        for (let ln = startLine; ln <= endLine; ln++) {
          lineFroms.push(doc.line(ln).from)
        }
      }
    }
  }

  lineFroms.sort((a, b) => a - b)
  const builder = new RangeSetBuilder()
  let prev = -1
  for (const pos of lineFroms) {
    if (pos !== prev) { builder.add(pos, pos, cssLineMark); prev = pos }
  }
  return builder.finish()
}

// index번째 HTML opening/closing 태그 하이라이트
function buildTagDecos(doc, tagName, index) {
  if (!tagName) return Decoration.none
  const text = doc.toString()
  const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const commentRanges = getCommentRanges(text)
  const matches = []

  const openRe = new RegExp(`<${escaped}(?=[\\s>/])`, 'gi')
  let m, count = 0
  while ((m = openRe.exec(text)) !== null) {
    if (inAnyRange(m.index, commentRanges)) continue
    if (count === index) { matches.push([m.index, m.index + 1 + tagName.length]); break }
    count++
  }

  const closeRe = new RegExp(`<\\/${escaped}(?=[\\s>])`, 'gi')
  count = 0
  while ((m = closeRe.exec(text)) !== null) {
    if (inAnyRange(m.index, commentRanges)) continue
    if (count === index) { matches.push([m.index, m.index + 2 + tagName.length]); break }
    count++
  }

  matches.sort((a, b) => a[0] - b[0])
  const builder = new RangeSetBuilder()
  let prevTo = -1
  for (const [from, to] of matches) {
    if (from >= prevTo) { builder.add(from, to, tagHighlightMark); prevTo = to }
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

const cssLineField = StateField.define({
  create: () => ({ tag: null, classes: [], decos: Decoration.none }),
  update(state, tr) {
    let { tag, classes } = state
    let changed = false
    for (const eff of tr.effects) {
      if (eff.is(setHighlightTag)) {
        tag = eff.value?.tag ?? null
        classes = eff.value?.classes ?? []
        changed = true
      }
    }
    if (changed || tr.docChanged) {
      return { tag, classes, decos: tag ? buildCssLineDecos(tr.state.doc, tag, classes) : Decoration.none }
    }
    return state
  },
  provide: f => EditorView.decorations.from(f, s => s.decos),
})

const rangeHighlightField = StateField.define({
  create: () => Decoration.none,
  update(deco, tr) {
    deco = deco.map(tr.changes)
    for (const eff of tr.effects) {
      if (eff.is(setHighlightRange)) {
        if (!eff.value) return Decoration.none
        const { from, to } = eff.value
        const docLen = tr.state.doc.length
        const clampedFrom = Math.max(0, Math.min(from, docLen))
        const clampedTo   = Math.max(clampedFrom, Math.min(to, docLen))
        if (clampedFrom >= clampedTo) return Decoration.none
        const builder = new RangeSetBuilder()
        builder.add(clampedFrom, clampedTo, rangeHighlightMark)
        return builder.finish()
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
  '.cm-preview-hover-css-line': {
    backgroundColor: 'rgba(100, 200, 255, 0.13)',
    borderLeft: '3px solid rgba(100, 200, 255, 0.8)',
  },
  '.cm-preview-jsp-hover': {
    backgroundColor: 'rgba(251, 191, 36, 0.35)',
    borderRadius: '3px',
    outline: '2px solid rgba(251, 191, 36, 0.9)',
    outlineOffset: '1px',
  },
})
// ────────────────────────────────────────────────────────────────────

// ── JSP 블록 타입별 컬러링 ────────────────────────────────────────────
const jspCommentMark   = Decoration.mark({ class: 'cm-jsp-comment' })
const jspDirectiveMark = Decoration.mark({ class: 'cm-jsp-directive' })
const jspExprMark      = Decoration.mark({ class: 'cm-jsp-expr' })
const jspScriptletMark = Decoration.mark({ class: 'cm-jsp-scriptlet' })

function buildJspColorDecos(doc) {
  const text = doc.toString()
  if (!text.includes('<%')) return Decoration.none

  const marks = []
  let m

  // 순서 중요: 더 구체적인 패턴부터 (comment → directive → expr → scriptlet)
  const commentRe   = /<%--[\s\S]*?--%>/g
  const directiveRe = /<%@[\s\S]*?%>/g
  const exprRe      = /<%=[\s\S]*?%>/g
  const scriptletRe = /<%(?![-@=])([\s\S]*?)%>/g

  while ((m = commentRe.exec(text))   !== null) marks.push({ from: m.index, to: m.index + m[0].length, mark: jspCommentMark })
  while ((m = directiveRe.exec(text)) !== null) marks.push({ from: m.index, to: m.index + m[0].length, mark: jspDirectiveMark })
  while ((m = exprRe.exec(text))      !== null) marks.push({ from: m.index, to: m.index + m[0].length, mark: jspExprMark })
  while ((m = scriptletRe.exec(text)) !== null) marks.push({ from: m.index, to: m.index + m[0].length, mark: jspScriptletMark })

  marks.sort((a, b) => a.from - b.from)
  const builder = new RangeSetBuilder()
  let prevTo = -1
  for (const { from, to, mark } of marks) {
    if (from >= prevTo) { builder.add(from, to, mark); prevTo = to }
  }
  return builder.finish()
}

const jspColorField = StateField.define({
  create: (state) => buildJspColorDecos(state.doc),
  update(deco, tr) {
    if (tr.docChanged) return buildJspColorDecos(tr.state.doc)
    return deco.map(tr.changes)
  },
  provide: f => EditorView.decorations.from(f),
})

const jspColorTheme = EditorView.baseTheme({
  '.cm-jsp-comment':   { backgroundColor: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af' },
  '.cm-jsp-directive': { backgroundColor: 'rgba(139, 92, 246, 0.15)' },
  '.cm-jsp-expr':      { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  '.cm-jsp-scriptlet': { backgroundColor: 'rgba(245, 158, 11, 0.12)' },
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
  highlightRange = null,
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
        cssLineField,
        rangeHighlightField,
        highlightTagTheme,

        // JSP 블록 컬러링 (html 언어일 때만 의미 있음, 없으면 Decoration.none 반환)
        ...(language === 'html' ? [jspColorField, jspColorTheme] : []),

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

  // 미리보기 호버 태그 → 에디터 하이라이트
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    view.dispatch({ effects: setHighlightTag.of(highlightTag) })
  }, [highlightTag])

  // 미리보기 JSP 배지 호버 → 에디터 범위 하이라이트
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    view.dispatch({ effects: setHighlightRange.of(highlightRange) })
  }, [highlightRange])

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
