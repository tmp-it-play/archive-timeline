import { Link } from 'react-router-dom'
import { getProgressSummary } from '../hooks/useProgress.js'

const SUBJECTS = [
  { id: 'subject1', label: '정보시스템 기반 기술', total: 25, desc: '운영체제, 네트워크, 보안, 클라우드' },
  { id: 'subject2', label: '프로그래밍 언어 활용', total: 25, desc: 'Java, Python, 자료구조, 알고리즘' },
  { id: 'subject3', label: '데이터베이스 활용', total: 25, desc: 'SQL, 정규화, 트랜잭션, NoSQL' },
]

export default function WrittenHome() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">필기 준비</h1>
        <p className="text-gray-500 text-sm">과목을 선택하여 4지선다 문제를 풀어보세요. 풀이 후 즉시 해설을 확인할 수 있습니다.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {SUBJECTS.map((subject) => {
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
