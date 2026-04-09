import { Link } from 'react-router-dom'
import { practicalTopics } from '../data/practical/index.js'

const ICONS = {
  html: 'HTML',
  css: 'CSS',
  jsp: 'JSP',
  'dao-dto': 'DAO',
  sql: 'SQL',
  servlet: 'WEB',
}

export default function PracticalHome() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">실기 준비</h1>
        <p className="text-gray-500 text-sm">
          JSP/Java 화면 구현 과제에서 필요한 핵심 개념을 학습하고 직접 코드를 작성해보세요.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {practicalTopics.map((topic) => (
          <Link
            key={topic.id}
            to={`/practical/${topic.id}`}
            className="border border-gray-200 rounded-lg p-5 hover:border-gray-900 transition-colors group block"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center text-xs font-mono font-bold text-gray-500 shrink-0 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
                {ICONS[topic.id] || topic.id.toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-sm mb-1 group-hover:underline">
                  {topic.title}
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed">{topic.description.slice(0, 60)}...</p>
                <p className="text-xs text-gray-300 mt-2">{topic.lessons.length}개 실습</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 p-5 border border-gray-100 rounded-lg bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">과제 구조 안내</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          과정평가형 정보처리산업기사 실기는 이클립스 + Tomcat 환경에서 JSP/Java로
          회원관리, 성적관리 등의 서비스를 구현하는 화면 구현 과제입니다.
          DAO → DTO → JSP → Action JSP 구조를 반드시 이해하세요.
        </p>
      </div>
    </div>
  )
}
