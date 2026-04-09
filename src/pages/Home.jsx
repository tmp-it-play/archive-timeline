import { Link } from 'react-router-dom'
import { getWrongNoteCount } from '../hooks/useWrongNotes.js'
import { getProgressSummary } from '../hooks/useProgress.js'

const SUBJECTS = ['subject1', 'subject2', 'subject3']

export default function Home() {
  const totalSeen = SUBJECTS.reduce((sum, id) => sum + getProgressSummary(id).total, 0)
  const totalCorrect = SUBJECTS.reduce((sum, id) => sum + getProgressSummary(id).correct, 0)
  const wrongCount = getWrongNoteCount()
  const accuracy = totalSeen > 0 ? Math.round((totalCorrect / totalSeen) * 100) : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-14">
      {/* 헤더 */}
      <div className="mb-14">
        <div className="text-xs text-gray-400 mb-3 tracking-widest uppercase">NCS IT Study</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
          과정평가형<br />정보처리산업기사 대비
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
          필기 4지선다 문제 풀이와 JSP/Java 화면 구현 실기 실습을 함께 준비하세요.
        </p>
      </div>

      {/* 통계 */}
      {totalSeen > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-12 p-5 border border-gray-100 rounded-lg bg-gray-50">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalSeen}</div>
            <div className="text-xs text-gray-400 mt-1">풀이한 문제</div>
          </div>
          <div className="text-center border-x border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{accuracy !== null ? `${accuracy}%` : '-'}</div>
            <div className="text-xs text-gray-400 mt-1">전체 정답률</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{wrongCount}</div>
            <div className="text-xs text-gray-400 mt-1">오답 노트</div>
          </div>
        </div>
      )}

      {/* 메인 카드 */}
      <div className="grid md:grid-cols-2 gap-5 mb-10">
        {/* 필기 카드 */}
        <Link
          to="/written"
          className="block border border-gray-200 rounded-lg p-7 hover:border-gray-900 transition-colors group"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center text-xs font-mono font-bold text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              PBT
            </div>
            <span className="text-xs text-gray-300 group-hover:text-gray-500 transition-colors">→</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:underline">필기 준비</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            정보시스템 기반 기술, 프로그래밍 언어 활용, 데이터베이스 활용 — 3개 과목 75문제
          </p>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>· 4지선다 즉시 피드백</li>
            <li>· 틀리면 자동으로 오답 노트 저장</li>
            <li>· 과목별 진행률 추적</li>
          </ul>
        </Link>

        {/* 실기 카드 */}
        <Link
          to="/practical"
          className="block border border-gray-200 rounded-lg p-7 hover:border-gray-900 transition-colors group"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center text-xs font-mono font-bold text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
              JSP
            </div>
            <span className="text-xs text-gray-300 group-hover:text-gray-500 transition-colors">→</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:underline">실기 준비</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            JSP/Java 화면 구현 과제에 필요한 핵심 기술 — HTML, CSS, JSP, DAO/DTO, SQL, 서블릿
          </p>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>· 코드 에디터 직접 작성</li>
            <li>· HTML 실시간 프리뷰</li>
            <li>· 모범 답안 비교</li>
          </ul>
        </Link>
      </div>

      {/* 오답 노트 바로가기 */}
      {wrongCount > 0 && (
        <Link
          to="/written/wrong"
          className="flex items-center justify-between border border-gray-200 rounded-lg px-5 py-4 hover:border-gray-900 transition-colors group"
        >
          <div>
            <div className="text-sm font-semibold text-gray-900">오답 노트</div>
            <div className="text-xs text-gray-400 mt-0.5">{wrongCount}개의 틀린 문제를 다시 확인하세요</div>
          </div>
          <span className="text-xs text-gray-300 group-hover:text-gray-700 transition-colors">→</span>
        </Link>
      )}

      {/* 하단 안내 */}
      <div className="mt-14 pt-6 border-t border-gray-100 text-xs text-gray-300">
        과정평가형 정보처리산업기사 · 필기 + 실기 통합 학습
      </div>
    </div>
  )
}
