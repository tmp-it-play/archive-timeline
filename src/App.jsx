import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import WrittenHome from './pages/WrittenHome.jsx'
import WrittenQuiz from './pages/WrittenQuiz.jsx'
import WrongNotes from './pages/WrongNotes.jsx'
import PracticalHome from './pages/PracticalHome.jsx'
import PracticalLesson from './pages/PracticalLesson.jsx'
import PracticalPdfViewer from './pages/PracticalPdfViewer.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/written" element={<WrittenHome />} />
            <Route path="/written/wrong" element={<WrongNotes />} />
            <Route path="/written/:subject" element={<WrittenQuiz />} />
            <Route path="/practical" element={<PracticalHome />} />
            <Route path="/practical/pdf/:pdfId" element={<PracticalPdfViewer />} />
            <Route path="/practical/:topic" element={<PracticalLesson />} />
          </Routes>
        </main>
        <footer className="border-t border-gray-100 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm text-gray-500">NCS IT Study</div>
              <div className="text-xs text-gray-400 mt-1">Made by snowykte0426</div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <a
                href="https://github.com/snowykte0426/ncs-it-study"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-700 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://github.com/snowykte0426/ncs-it-study/blob/main/LICENSE"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-700 transition-colors"
              >
                MIT License
              </a>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
