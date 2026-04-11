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
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <main>
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
      </div>
    </BrowserRouter>
  )
}
