import { Link } from 'react-router-dom'
import { practicalTopics } from '../data/practical/index.js'

const LANG_BADGE = {
  'html-basic':  'HTML',
  'css':         'CSS',
  'screen-form': 'JSP',
  'screen-list': 'JSP',
  'dao-impl':    'Java',
  'dto-class':   'Java',
  'sql':         'SQL',
}

export default function PracticalHome() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">실기 준비</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          화면 구현 과제에 필요한 JSP, Java DAO/DTO, SQL을 빈칸 채우기 형식으로 실습합니다.
          <br />각 빈칸은 실제 시험과 동일하게 <span className="font-mono text-gray-700 text-xs">( A )</span>, <span className="font-mono text-gray-700 text-xs">( B )</span> 형식입니다.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {practicalTopics.map((topic) => (
          <Link
            key={topic.id}
            to={`/practical/${topic.id}`}
            className="border border-gray-200 rounded-lg p-5 hover:border-gray-900 transition-colors group block"
          >
            <div className="flex items-start justify-between mb-2">
              <h2 className="font-semibold text-gray-900 text-sm group-hover:underline">
                {topic.title}
              </h2>
              <span className="text-xs text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded font-mono shrink-0 ml-2">
                {LANG_BADGE[topic.id]}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
              {topic.description.split('\n')[0]}
            </p>
            <div className="mt-3 text-xs text-gray-300">{topic.lessons.length}개 실습</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
