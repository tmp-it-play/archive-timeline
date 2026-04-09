import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWrongNotes } from '../hooks/useWrongNotes.js'

const SUBJECT_LABELS = {
  subject1: '정보시스템 기반 기술',
  subject2: '프로그래밍 언어 활용',
  subject3: '데이터베이스 활용',
}

export default function WrongNotes() {
  const { notes, removeWrongNote, clearAll } = useWrongNotes()
  const [expanded, setExpanded] = useState({})

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  if (notes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-sm mb-6">오답 노트가 비어있습니다.</p>
        <Link to="/written" className="text-sm border border-gray-900 px-4 py-2 rounded hover:bg-gray-900 hover:text-white transition-colors">
          문제 풀러 가기
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">오답 노트</h1>
          <p className="text-sm text-gray-400">총 {notes.length}개의 틀린 문제</p>
        </div>
        <button
          onClick={() => { if (confirm('오답 노트를 전부 삭제할까요?')) clearAll() }}
          className="text-xs text-gray-400 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded transition-colors"
        >
          전체 삭제
        </button>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-start gap-3 p-4">
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">{SUBJECT_LABELS[note.subjectId] || note.subjectId}</div>
                <p className="text-sm text-gray-900 whitespace-pre-line leading-relaxed">{note.question}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 mt-0.5">
                <button
                  onClick={() => toggle(note.id)}
                  className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 px-2.5 py-1 rounded transition-colors"
                >
                  {expanded[note.id] ? '접기' : '해설'}
                </button>
                <button
                  onClick={() => removeWrongNote(note.id)}
                  className="text-xs text-gray-400 hover:text-gray-900 border border-gray-200 px-2.5 py-1 rounded transition-colors"
                >
                  ✓
                </button>
              </div>
            </div>

            {/* 선택지 */}
            <div className="px-4 pb-3 space-y-1">
              {note.options.map((opt, i) => (
                <div
                  key={i}
                  className={`text-xs px-3 py-1.5 rounded ${
                    i === note.answer
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-400'
                  }`}
                >
                  <span className="font-mono mr-1">{i + 1}.</span> {opt}
                </div>
              ))}
            </div>

            {/* 해설 */}
            {expanded[note.id] && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">해설</div>
                <p className="text-sm text-gray-700 leading-relaxed">{note.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link to="/written" className="text-sm text-gray-500 hover:text-gray-900 underline">
          ← 필기 과목으로
        </Link>
      </div>
    </div>
  )
}
