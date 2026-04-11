import { Link, useParams } from 'react-router-dom'
import practicalPdfResources from '../data/practical/pdf-resources.js'

export default function PracticalPdfViewer() {
  const { pdfId } = useParams()
  const pdf = practicalPdfResources.find((item) => item.id === pdfId)

  if (!pdf) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-4">
          <Link to="/practical" className="text-xs text-gray-400 hover:text-gray-700">
            ← 실기 준비로 돌아가기
          </Link>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <div className="text-sm text-gray-500">PDF 자료를 찾을 수 없습니다.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-5">
        <Link to="/practical" className="text-xs text-gray-400 hover:text-gray-700">
          ← 실기 준비로 돌아가기
        </Link>
        <div className="flex items-start justify-between gap-4 mt-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pdf.title}</h1>
            <p className="text-sm text-gray-500 mt-2">{pdf.description}</p>
            <div className="text-xs font-mono text-gray-400 mt-2">{pdf.filename}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={pdf.path}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
            >
              새 탭에서 보기
            </a>
            <a
              href={pdf.path}
              download={pdf.filename}
              className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-700 transition-colors"
            >
              다운로드
            </a>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <iframe
          src={pdf.path}
          title={pdf.title}
          className="w-full"
          style={{ height: 'calc(100vh - 220px)', minHeight: '820px', border: 'none', display: 'block' }}
        />
      </div>
    </div>
  )
}
