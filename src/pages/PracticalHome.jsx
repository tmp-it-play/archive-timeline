import { Link } from 'react-router-dom'
import { practicalTopics } from '../data/practical/index.js'
import practicalPdfResources from '../data/practical/pdf-resources.js'

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
          화면 구현 과제에 필요한 JSP, Java DAO/DTO, SQL을 예제 흐름과 시각화 중심으로 정리했습니다.
          <br />상단 PDF 자료와 아래 실습 주제를 함께 보면서 구조와 동작을 같이 확인할 수 있습니다.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">PDF 자료</div>
          <div className="text-sm text-gray-500 mt-1">자료를 선택하면 전용 뷰 페이지로 이동해 바로 보고 다운로드할 수 있습니다.</div>
        </div>
        <div className="p-4 grid gap-3 md:grid-cols-2">
          {practicalPdfResources.map((pdf) => (
            <Link
              key={pdf.id}
              to={`/practical/pdf/${pdf.id}`}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 transition-colors hover:border-gray-900 hover:bg-white group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-sm text-gray-900 group-hover:underline">{pdf.title}</div>
                <span className="text-[11px] font-mono rounded px-2 py-0.5 border border-gray-200 text-gray-400">
                  PDF
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2 leading-relaxed">{pdf.description}</div>
              <div className="mt-3 text-xs text-gray-300 font-mono">{pdf.filename}</div>
            </Link>
          ))}
        </div>
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
