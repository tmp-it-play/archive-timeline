import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTopicById } from '../data/practical/index.js'
import CodeEditor from '../components/CodeEditor.jsx'
import { hoverTooltip } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'

// CodeMirror 에디터에서 태그명 호버 시 툴팁 표시
function makeTagHoverTooltip(annotations) {
  const map = {}
  annotations.forEach(a => { map[a.tag] = a })

  return hoverTooltip((view, pos) => {
    const node = syntaxTree(view.state).resolveInner(pos, -1)
    if (node.name !== 'TagName') return null

    const tagName = view.state.sliceDoc(node.from, node.to)
    const ann = map[tagName] ?? map[tagName.toLowerCase()]
    if (!ann) return null

    return {
      pos: node.from,
      end: node.to,
      above: true,
      create() {
        const dom = document.createElement('div')
        dom.style.cssText = [
          'padding:6px 12px',
          'background:#1a1d23',
          'border-radius:6px',
          `border-left:3px solid ${ann.color}`,
          'white-space:nowrap',
          'box-shadow:0 4px 16px rgba(0,0,0,0.5)',
          'font-size:12px',
          'line-height:1.5',
          'pointer-events:none',
        ].join(';')
        dom.innerHTML =
          `<code style="color:${ann.color};font-weight:bold;font-family:monospace;">&lt;${ann.label}&gt;</code>` +
          `<span style="color:#9ca3af;font-family:sans-serif;margin-left:8px;">${ann.description}</span>`
        return { dom }
      },
    }
  })
}

// iframe에 주입할 HTML — 호버 시에만 아웃라인 + 하단 정보 바 표시
function buildAnnotatedHtml(code, annotations = []) {
  const annJson = JSON.stringify(annotations)

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { box-sizing: border-box; }
body {
  font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
  padding: 16px;
  padding-bottom: 52px;
  font-size: 14px;
  margin: 0;
  line-height: 1.6;
}
#__info {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  padding: 7px 14px;
  background: #111827;
  color: #f9fafb;
  font-size: 12px;
  font-family: monospace;
  display: none;
  border-top: 3px solid #374151;
  z-index: 9999;
  transition: opacity 0.1s;
}
</style>
</head>
<body>
${code}
<div id="__info"></div>
<script>
(function(){
  var anns = ${annJson};
  var map = {};
  anns.forEach(function(a){ map[a.tag.toUpperCase()] = a; });
  var bar = document.getElementById('__info');
  var cur = null;

  function clearCur() {
    if (cur) {
      cur.style.outline = '';
      cur.style.outlineOffset = '';
      cur = null;
      bar.style.display = 'none';
      window.parent.postMessage({ type: 'previewLeave' }, '*');
    }
  }

  document.addEventListener('mouseover', function(e) {
    var el = e.target;
    while (el && el.tagName && el.tagName !== 'BODY') {
      if (el.id === '__info') { clearCur(); return; }
      var a = map[el.tagName];
      if (a) {
        if (cur && cur !== el) {
          cur.style.outline = '';
          cur.style.outlineOffset = '';
        }
        cur = el;
        el.style.outline = '2px solid ' + a.color;
        el.style.outlineOffset = '2px';
        bar.style.display = 'block';
        bar.style.borderTopColor = a.color;
        bar.innerHTML =
          '<span style="color:' + a.color + ';font-weight:bold;">&lt;' + a.label + '&gt;</span>' +
          '&ensp;<span style="color:#d1d5db;">' + a.description + '</span>';
        var siblings = document.querySelectorAll(el.tagName.toLowerCase());
        var idx = Array.prototype.indexOf.call(siblings, el);
        var classes = Array.prototype.slice.call(el.classList);
        window.parent.postMessage({ type: 'previewHover', tag: a.tag, index: idx, classes: classes }, '*');
        return;
      }
      el = el.parentElement;
    }
    clearCur();
  });

  document.addEventListener('mouseleave', function() {
    clearCur();
    window.parent.postMessage({ type: 'previewLeave' }, '*');
  });
})();
<\/script>
</body>
</html>`
}

export default function PracticalLesson() {
  const { topic: topicId } = useParams()
  const topic = getTopicById(topicId)

  const [activeLesson, setActiveLesson] = useState(0)
  const [codes, setCodes] = useState(() => {
    if (!topic) return {}
    return Object.fromEntries(topic.lessons.map(l => [l.id, l.starterCode]))
  })
  const [showSolution, setShowSolution] = useState(false)
  const [descOpen, setDescOpen] = useState(true)

  // live-html 전용: 디바운스된 미리보기 HTML
  const [liveHtml, setLiveHtml] = useState('')
  const debounceRef = useRef(null)

  // 미리보기 → 에디터 하이라이트 연동
  const [previewHoveredTag, setPreviewHoveredTag] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data !== 'object') return
      if (e.data.type === 'previewHover') setPreviewHoveredTag({ tag: e.data.tag ?? null, index: e.data.index ?? 0, classes: e.data.classes ?? [] })
      else if (e.data.type === 'previewLeave') setPreviewHoveredTag(null)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  if (!topic) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-400 text-sm mb-4">주제를 찾을 수 없습니다.</p>
        <Link
          to="/practical"
          className="text-sm border border-gray-900 px-4 py-2 rounded hover:bg-gray-900 hover:text-white transition-colors"
        >
          돌아가기
        </Link>
      </div>
    )
  }

  const lesson = topic.lessons[activeLesson]
  const currentCode = codes[lesson.id] ?? lesson.starterCode
  const isLiveHtml = lesson.type === 'live-html'
  const isCode = !isLiveHtml
  const lang = lesson.language ?? (isLiveHtml ? 'html' : 'java')

  // live-html 전용: 에디터 태그 호버 툴팁
  const tagTooltipExt = useMemo(() => {
    if (!isLiveHtml || !lesson.annotations?.length) return []
    return [makeTagHoverTooltip(lesson.annotations)]
  }, [lesson.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // live-html: 코드 변경 시 300ms 디바운스 후 iframe 업데이트
  useEffect(() => {
    if (!isLiveHtml) return
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setLiveHtml(buildAnnotatedHtml(currentCode, lesson.annotations ?? []))
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [currentCode, lesson.id, isLiveHtml])

  // 탭 변경 시 즉시 미리보기 초기화
  const handleTabChange = (i) => {
    setActiveLesson(i)
    setShowSolution(false)
    setDescOpen(true)
    const nextLesson = topic.lessons[i]
    const nextCode = codes[nextLesson.id] ?? nextLesson.starterCode
    if (nextLesson.type === 'live-html') {
      setLiveHtml(buildAnnotatedHtml(nextCode, nextLesson.annotations ?? []))
    }
  }

  const handleCodeChange = (val) => {
    setCodes(prev => ({ ...prev, [lesson.id]: val }))
  }

  const handleReset = () => {
    setCodes(prev => ({ ...prev, [lesson.id]: lesson.starterCode }))
    setShowSolution(false)
    if (isLiveHtml) {
      setLiveHtml(buildAnnotatedHtml(lesson.starterCode, lesson.annotations ?? []))
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="mb-4">
        <Link to="/practical" className="text-xs text-gray-400 hover:text-gray-700">
          ← 실기 주제 목록
        </Link>
        <div className="flex items-baseline gap-3 mt-2">
          <h1 className="text-lg font-bold text-gray-900">{topic.title}</h1>
          <span className="text-xs text-gray-400">{topic.lessons.length}개 실습</span>
        </div>
      </div>

      {/* 레슨 탭 */}
      <div className="flex gap-0 mb-5 border-b border-gray-200 overflow-x-auto">
        {topic.lessons.map((l, i) => (
          <button
            key={l.id}
            onClick={() => handleTabChange(i)}
            className={`px-4 py-2.5 text-xs whitespace-nowrap border-b-2 transition-colors -mb-px ${
              i === activeLesson
                ? 'border-gray-900 text-gray-900 font-semibold bg-white'
                : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {i + 1}. {l.title}
          </button>
        ))}
      </div>

      {/* 요구사항 / 설명 */}
      <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setDescOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-left hover:bg-gray-100 transition-colors"
        >
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            설명 / 요구사항
          </span>
          <span className="text-gray-400 text-sm">{descOpen ? '▲' : '▼'}</span>
        </button>
        {descOpen && (
          <div className="px-4 py-4 text-sm text-gray-700 leading-loose whitespace-pre-line bg-white">
            {lesson.description}
          </div>
        )}
      </div>

      {/* ── live-html: 분할 레이아웃 ── */}
      {isLiveHtml && (
        <>
          {/* 에디터 + 미리보기 분할 */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* 왼쪽: 에디터 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  코드 편집
                </span>
                <button
                  onClick={handleReset}
                  className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 px-2.5 py-1 rounded transition-colors"
                >
                  초기화
                </button>
              </div>
              <CodeEditor
                key={`editor-${lesson.id}`}
                value={currentCode}
                onChange={handleCodeChange}
                language={lang}
                minHeight="460px"
                extraExtensions={tagTooltipExt}
                highlightTag={previewHoveredTag}
              />
            </div>

            {/* 오른쪽: 실시간 미리보기 */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  실시간 미리보기
                </span>
                <span className="text-xs text-gray-300">— 입력하면 즉시 반영</span>
              </div>
              <div
                className="rounded-lg overflow-hidden border border-gray-200 flex-1"
                style={{ minHeight: '460px' }}
              >
                <iframe
                  srcDoc={liveHtml}
                  className="w-full h-full"
                  style={{ minHeight: '460px', border: 'none' }}
                  sandbox="allow-scripts"
                  title="live-preview"
                />
              </div>
            </div>
          </div>

          {/* 태그 범례 — 색상 칩 */}
          {lesson.annotations?.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400 shrink-0">
                미리보기에서 마우스를 올리면 태그 정보가 표시됩니다
              </span>
              {lesson.annotations.map(ann => (
                <span
                  key={ann.tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border"
                  style={{
                    borderColor: ann.color,
                    color: ann.color,
                    background: ann.color + '14',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: ann.color }}
                  />
                  &lt;{ann.label}&gt;
                </span>
              ))}
            </div>
          )}

          {/* 모범 답안 버튼 */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowSolution(s => !s)}
              className="px-4 py-2 border border-gray-300 text-sm rounded hover:border-gray-900 transition-colors"
            >
              {showSolution ? '답안 숨기기' : '모범 답안 보기'}
            </button>
          </div>

          {/* 모범 답안 */}
          {showSolution && (
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                모범 답안
              </div>
              <CodeEditor
                key={`solution-${lesson.id}`}
                value={lesson.solution}
                language={lang}
                readOnly={true}
                minHeight="280px"
              />
            </div>
          )}
        </>
      )}

      {/* ── code / fill-in-blank 타입 ── */}
      {isCode && (
        <>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                코드 편집
              </span>
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 px-2.5 py-1 rounded transition-colors"
              >
                초기화
              </button>
            </div>
            <CodeEditor
              key={`editor-${lesson.id}`}
              value={currentCode}
              onChange={handleCodeChange}
              language={lang}
              minHeight="380px"
            />
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowSolution(s => !s)}
              className="px-4 py-2.5 border border-gray-300 text-sm rounded hover:border-gray-900 transition-colors"
            >
              {showSolution ? '답안 숨기기' : '정답 확인'}
            </button>
          </div>

          {showSolution && (
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500 mb-1.5 font-medium">내 코드</div>
                <pre className="text-xs bg-gray-900 text-gray-200 rounded-lg p-4 overflow-auto max-h-72 whitespace-pre-wrap font-mono leading-relaxed border border-gray-700">
                  {currentCode}
                </pre>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1.5 font-medium">모범 답안</div>
                <pre className="text-xs bg-gray-900 text-gray-200 rounded-lg p-4 overflow-auto max-h-72 whitespace-pre-wrap font-mono leading-relaxed border border-gray-700">
                  {lesson.solution}
                </pre>
              </div>
            </div>
          )}
        </>
      )}

      {/* 이전/다음 */}
      <div className="pt-5 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={() => handleTabChange(Math.max(0, activeLesson - 1))}
          disabled={activeLesson === 0}
          className="text-sm text-gray-500 hover:text-gray-900 disabled:text-gray-200 transition-colors"
        >
          ← 이전 실습
        </button>
        <span className="text-xs text-gray-300">
          {activeLesson + 1} / {topic.lessons.length}
        </span>
        <button
          onClick={() => handleTabChange(Math.min(topic.lessons.length - 1, activeLesson + 1))}
          disabled={activeLesson === topic.lessons.length - 1}
          className="text-sm text-gray-500 hover:text-gray-900 disabled:text-gray-200 transition-colors"
        >
          다음 실습 →
        </button>
      </div>
    </div>
  )
}
