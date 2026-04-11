import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="font-semibold text-gray-900 text-sm tracking-tight">
          NCS IT Study
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              location.pathname === '/'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            홈
          </Link>
          <Link
            to="/written"
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              isActive('/written')
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            필기
          </Link>
          <Link
            to="/practical"
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              isActive('/practical')
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            실기
          </Link>
          <Link
            to="/written/wrong"
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              location.pathname === '/written/wrong'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            오답노트
          </Link>
        </div>
      </div>
    </nav>
  )
}
