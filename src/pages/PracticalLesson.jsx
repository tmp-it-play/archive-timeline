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
  const lang = lesson.language ?? (lesson.type === 'html' ? 'html' : 'sql')

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
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-6">
        <Link to="/practical" className="text-xs text-gray-400 hover:text-gray-700">← 실기 주제 목록</Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">{topic.title}</h1>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{topic.description}</p>
      </div>

      {/* 레슨 탭 */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {topic.lessons.map((l, i) => (
          <button
            key={l.id}
            onClick={() => handleTabChange(i)}
            className={`px-3 py-2 text-xs whitespace-nowrap border-b-2 transition-colors ${
              i === activeLesson
                ? 'border-gray-900 text-gray-900 font-semibold'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {i + 1}. {l.title}
          </button>
        ))}
      </div>

      {/* 메인 그리드 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 좌측: 설명 패널 */}
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold text-gray-900 text-sm mb-3">{lesson.title}</h2>
            <div className="text-sm text-gray-700 leading-loose whitespace-pre-line bg-gray-50 border border-gray-200 rounded-lg p-4">
              {lesson.description}
            </div>
          </div>

          {/* 모범 답안 (좌측 하단) */}
          {showSolution && (
            <div>
              <div className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">모범 답안</div>
              <CodeEditor
                key={`solution-${lesson.id}`}
                value={lesson.solution}
                language={lang}
                readOnly={true}
              />
            </div>
          )}
        </div>

        {/* 우측: 에디터 패널 */}
        <div className="space-y-3">
          {/* 에디터 헤더 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">코드 편집</span>
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 px-2.5 py-1 rounded transition-colors"
            >
              초기화
            </button>
          </div>

          {/* 코드 에디터 */}
          <CodeEditor
            key={`editor-${lesson.id}`}
            value={currentCode}
            onChange={handleCodeChange}
            language={lang}
          />

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            {lesson.type === 'html' && (
              <button
                onClick={handlePreview}
                className="flex-1 py-2.5 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                미리보기 실행
              </button>
            )}
            <button
              onClick={() => setShowSolution(s => !s)}
              className="flex-1 py-2.5 border border-gray-300 text-sm rounded hover:border-gray-900 transition-colors"
            >
              {showSolution ? '답안 숨기기' : '정답 확인'}
            </button>
          </div>

          {/* HTML 프리뷰 결과 */}
          {lesson.type === 'html' && showPreview && previewCode && (
            <HtmlPreview code={previewCode} />
          )}

          {/* 코드/SQL 타입: 나란히 비교 */}
          {lesson.type === 'code' && showSolution && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide">
                내 코드 vs 모범 답안
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1.5">내 코드</div>
                  <pre className="text-xs bg-gray-50 border border-gray-200 rounded p-2.5 overflow-auto max-h-52 whitespace-pre-wrap font-mono text-gray-700 leading-relaxed">
                    {currentCode}
                  </pre>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1.5">모범 답안</div>
                  <pre className="text-xs bg-gray-50 border border-gray-200 rounded p-2.5 overflow-auto max-h-52 whitespace-pre-wrap font-mono text-gray-700 leading-relaxed">
                    {lesson.solution}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 이전/다음 내비게이션 */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
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
