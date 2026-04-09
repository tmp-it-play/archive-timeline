import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTopicById } from '../data/practical/index.js'
import CodeEditor from '../components/CodeEditor.jsx'
import HtmlPreview from '../components/HtmlPreview.jsx'

export default function PracticalLesson() {
  const { topic: topicId } = useParams()
  const topic = getTopicById(topicId)

  const [activeLesson, setActiveLesson] = useState(0)
  const [codes, setCodes] = useState(() => {
    if (!topic) return {}
    return Object.fromEntries(topic.lessons.map(l => [l.id, l.starterCode]))
  })
  const [previewCode, setPreviewCode] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [descOpen, setDescOpen] = useState(true)

  if (!topic) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-400 text-sm mb-4">주제를 찾을 수 없습니다.</p>
        <Link to="/practical" className="text-sm border border-gray-900 px-4 py-2 rounded hover:bg-gray-900 hover:text-white transition-colors">
          돌아가기
        </Link>
      </div>
    )
  }

  const lesson = topic.lessons[activeLesson]
  const currentCode = codes[lesson.id] ?? lesson.starterCode
  const lang = lesson.language ?? (lesson.type === 'html' ? 'html' : 'java')
  const isHtml = lesson.type === 'html'

  const handleCodeChange = (val) => {
    setCodes(prev => ({ ...prev, [lesson.id]: val }))
  }

  const handlePreview = () => {
    setPreviewCode(currentCode)
    setShowPreview(true)
  }

  const handleReset = () => {
    setCodes(prev => ({ ...prev, [lesson.id]: lesson.starterCode }))
    setPreviewCode('')
    setShowPreview(false)
    setShowSolution(false)
  }

  const handleTabChange = (i) => {
    setActiveLesson(i)
    setShowPreview(false)
    setShowSolution(false)
    setPreviewCode('')
    setDescOpen(true)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="mb-4">
        <Link to="/practical" className="text-xs text-gray-400 hover:text-gray-700">← 실기 주제 목록</Link>
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

      {/* 요구사항 / 설명 (접기 가능) */}
      <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setDescOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-left hover:bg-gray-100 transition-colors"
        >
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            📋 요구사항 / 설명
          </span>
          <span className="text-gray-400 text-sm">{descOpen ? '▲' : '▼'}</span>
        </button>
        {descOpen && (
          <div className="px-4 py-4 text-sm text-gray-700 leading-loose whitespace-pre-line bg-white">
            {lesson.description}
          </div>
        )}
      </div>

      {/* 코드 에디터 (메인 영역) */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">코드 편집</span>
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

      {/* 액션 버튼 */}
      <div className="flex gap-2 mb-4">
        {isHtml && (
          <button
            onClick={handlePreview}
            className="px-4 py-2.5 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors font-medium"
          >
            미리보기 실행
          </button>
        )}
        <button
          onClick={() => setShowSolution(s => !s)}
          className="px-4 py-2.5 border border-gray-300 text-sm rounded hover:border-gray-900 transition-colors"
        >
          {showSolution ? '답안 숨기기' : '정답 확인'}
        </button>
      </div>

      {/* HTML 미리보기 */}
      {isHtml && showPreview && previewCode && (
        <div className="mb-4">
          <HtmlPreview code={previewCode} />
        </div>
      )}

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
            minHeight="320px"
          />
        </div>
      )}

      {/* 코드 타입: 내 코드 vs 답안 나란히 보기 */}
      {!isHtml && showSolution && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500 mb-1.5 font-medium">내 코드</div>
            <pre className="text-xs bg-gray-900 text-gray-200 rounded-lg p-4 overflow-auto max-h-64 whitespace-pre-wrap font-mono leading-relaxed border border-gray-700">
              {currentCode}
            </pre>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1.5 font-medium">모범 답안</div>
            <pre className="text-xs bg-gray-900 text-gray-200 rounded-lg p-4 overflow-auto max-h-64 whitespace-pre-wrap font-mono leading-relaxed border border-gray-700">
              {lesson.solution}
            </pre>
          </div>
        </div>
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
        <span className="text-xs text-gray-300">{activeLesson + 1} / {topic.lessons.length}</span>
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
