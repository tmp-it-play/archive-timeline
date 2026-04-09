export default function HtmlPreview({ code }) {
  return (
    <div className="border border-gray-200 rounded bg-white">
      <div className="px-3 py-1.5 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
        </div>
        <span className="text-xs text-gray-400">미리보기</span>
      </div>
      <iframe
        srcDoc={code}
        title="HTML Preview"
        className="w-full min-h-48 border-0"
        sandbox="allow-scripts"
      />
    </div>
  )
}
