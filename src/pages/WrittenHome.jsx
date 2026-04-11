import { Link } from 'react-router-dom'
import { getProgressSummary } from '../hooks/useProgress.js'
import { writtenSubjects } from '../data/written/index.js'

export default function WrittenHome() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">필기 준비</h1>
        <p className="text-gray-500 text-sm">과정평가형 정보처리산업기사의 필수 능력단위 기준으로 문제를 풀어보세요. 풀이 후 즉시 해설을 확인할 수 있습니다.</p>
      </div>

      <div className="mb-8 rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">출제 구조</div>
          <div className="text-sm text-gray-500 mt-1">과정평가형 정보처리산업기사 외부평가 기준으로 어떤 방식으로 출제되는지 먼저 보고 들어가면 범위를 잡기 쉽습니다.</div>
        </div>
        <div className="p-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">평가 형식</div>
            <div className="text-lg font-bold text-gray-900">객관식 30 + 주관식 10</div>
            <div className="text-xs text-gray-500 mt-2">현재 서비스는 객관식 대비 중심으로 구성했습니다.</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">시험 시간</div>
            <div className="text-lg font-bold text-gray-900">90분</div>
            <div className="text-xs text-gray-500 mt-2">짧은 암기보다 능력단위별 핵심 개념 정리가 중요합니다.</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">출제 기준</div>
            <div className="text-lg font-bold text-gray-900">필수 능력단위 중심</div>
            <div className="text-xs text-gray-500 mt-2">응용SW 기초, 개발환경, 화면구현, SQL, 테스트, 배포까지 골고루 출제됩니다.</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {writtenSubjects.map((subject) => {
          const prog = getProgressSummary(subject.id)
          const percent = subject.total > 0 ? Math.round((prog.total / subject.total) * 100) : 0
          const accuracy = prog.total > 0 ? Math.round((prog.correct / prog.total) * 100) : null

          return (
            <Link
              key={subject.id}
              to={`/written/${subject.id}`}
              className="block border border-gray-200 rounded-lg p-5 hover:border-gray-900 transition-colors group"
            >
              <div className="mb-3">
                <h2 className="font-semibold text-gray-900 text-sm mb-1 group-hover:underline">
                  {subject.label}
                </h2>
                <p className="text-xs text-gray-400">{subject.desc}</p>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{prog.total} / {subject.total} 문제 풀이</span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1">
                  <div
                    className="bg-gray-900 h-1 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {accuracy !== null && (
                <div className="text-xs text-gray-500">
                  정답률 <span className="font-semibold text-gray-900">{accuracy}%</span>
                </div>
              )}
              {accuracy === null && (
                <div className="text-xs text-gray-300">아직 시작하지 않음</div>
              )}
            </Link>
          )
        })}
      </div>

      <Link
        to="/written/wrong"
        className="inline-flex items-center gap-2 border border-gray-900 px-4 py-2 text-sm rounded hover:bg-gray-900 hover:text-white transition-colors"
      >
        오답 노트 보기
      </Link>
    </div>
  )
}
