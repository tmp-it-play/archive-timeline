import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar.jsx'
import { useProgress } from '../hooks/useProgress.js'
import { useWrongNotes } from '../hooks/useWrongNotes.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function WrittenQuiz() {
  const { subject } = useParams()
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)
  const [error, setError] = useState(null)

  const { recordAnswer, reset } = useProgress(subject)
  const { addWrongNote } = useWrongNotes()

  useEffect(() => {
    async function loadQuestions() {
      try {
        const data = await import(`../data/written/${subject}.json`)
        setQuestions(shuffle(data.default.questions))
      } catch {
        setError('문제를 불러올 수 없습니다.')
      }
    }
    loadQuestions()
  }, [subject])

  const currentQuestion = questions[currentIndex]

  const handleAnswer = useCallback((index) => {
    if (selectedAnswer !== null) return
    const correct = index === currentQuestion.answer
    setSelectedAnswer(index)
    setIsCorrect(correct)
    setShowExplanation(true)

    recordAnswer(currentQuestion.id, correct)
    setSessionTotal(t => t + 1)
    if (correct) {
      setSessionCorrect(c => c + 1)
    } else {
      addWrongNote(currentQuestion, subject)
    }
  }, [selectedAnswer, currentQuestion, recordAnswer, addWrongNote, subject])

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setIsFinished(true)
    } else {
      setCurrentIndex(i => i + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
      setShowExplanation(false)
    }
  }, [currentIndex, questions.length])

  const handleRestart = () => {
    setQuestions(q => shuffle(q))
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setShowExplanation(false)
    setIsFinished(false)
    setSessionCorrect(0)
    setSessionTotal(0)
    reset()
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-500">{error}</p>
        <Link to="/written" className="text-sm underline mt-4 inline-block">돌아가기</Link>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center text-gray-400 text-sm">
        문제 불러오는 중...
      </div>
    )
  }

  if (isFinished) {
    const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold mb-8">풀이 완료</h2>
        <div className="border border-gray-200 rounded-lg p-10 mb-8 space-y-6">
          <div>
            <div className="text-5xl font-bold mb-2">{accuracy}%</div>
            <div className="text-sm text-gray-400">정답률</div>
          </div>
          <div className="flex justify-center gap-8 text-sm">
            <div>
              <div className="font-bold text-xl text-gray-900">{sessionCorrect}</div>
              <div className="text-gray-400 text-xs mt-0.5">정답</div>
            </div>
            <div className="border-l border-gray-200" />
            <div>
              <div className="font-bold text-xl text-gray-900">{sessionTotal - sessionCorrect}</div>
              <div className="text-gray-400 text-xs mt-0.5">오답</div>
            </div>
            <div className="border-l border-gray-200" />
            <div>
              <div className="font-bold text-xl text-gray-900">{sessionTotal}</div>
              <div className="text-gray-400 text-xs mt-0.5">총 문제</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            다시 풀기
          </button>
          <Link to="/written" className="px-4 py-2 border border-gray-300 text-sm rounded hover:border-gray-900 transition-colors">
            과목 선택
          </Link>
          <Link to="/written/wrong" className="px-4 py-2 border border-gray-300 text-sm rounded hover:border-gray-900 transition-colors">
            오답 노트
          </Link>
        </div>
      </div>
    )
  }

  const q = currentQuestion

  // 선택지 버튼 스타일
  function getOptionStyle(i) {
    if (selectedAnswer === null) {
      return 'border border-gray-200 text-gray-800 hover:border-gray-900 hover:bg-gray-50 cursor-pointer'
    }
    if (i === q.answer) {
      return 'border-2 border-green-600 bg-green-600 text-white'
    }
    if (i === selectedAnswer) {
      return 'border-2 border-red-400 bg-red-50 text-red-400 line-through cursor-default'
    }
    return 'border border-gray-100 text-gray-300 cursor-default'
  }

  function getOptionPrefix(i) {
    if (selectedAnswer === null) return `${i + 1}`
    if (i === q.answer) return '✓'
    if (i === selectedAnswer && i !== q.answer) return '✗'
    return `${i + 1}`
  }

  function getPrefixColor(i) {
    if (selectedAnswer === null) return 'text-gray-400'
    if (i === q.answer) return 'text-white'
    if (i === selectedAnswer) return 'text-red-400'
    return 'text-gray-300'
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* 상단 진행 상황 */}
      <div className="mb-6">
        <Link to="/written" className="text-xs text-gray-400 hover:text-gray-700">← 과목 선택</Link>
        <div className="mt-4">
          <ProgressBar current={currentIndex} total={questions.length} />
        </div>
        <div className="text-xs text-gray-400 mt-2">{currentIndex + 1} / {questions.length} 번째 문제</div>
      </div>

      {/* 정답/오답 피드백 배너 */}
      {selectedAnswer !== null && (
        <div
          className={`mb-5 px-5 py-4 rounded-lg flex items-center gap-3 text-sm font-semibold ${
            isCorrect
              ? 'bg-green-600 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          <span className="text-xl">{isCorrect ? '✓' : '✗'}</span>
          <span className="text-base">
            {isCorrect ? '정답입니다!' : `오답! 정답은 ${q.answer + 1}번입니다.`}
          </span>
          {!isCorrect && (
            <span className="ml-auto text-xs font-normal opacity-80">오답 노트 저장됨</span>
          )}
        </div>
      )}

      {/* 문제 */}
      <div className="mb-6">
        <p className="text-gray-900 font-medium leading-relaxed whitespace-pre-line text-[15px]">
          {q.question}
        </p>
      </div>

      {/* 선택지 */}
      <div className="space-y-2 mb-6">
        {q.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={selectedAnswer !== null}
            className={`w-full text-left px-4 py-3 rounded text-sm transition-all flex items-start gap-3 ${getOptionStyle(i)} disabled:cursor-default`}
          >
            <span className={`font-mono text-xs w-4 shrink-0 mt-0.5 font-bold ${getPrefixColor(i)}`}>
              {getOptionPrefix(i)}
            </span>
            <span>{option}</span>
          </button>
        ))}
      </div>

      {/* 해설 */}
      {showExplanation && (
        <div className={`mb-6 p-4 rounded-lg text-sm leading-relaxed border ${
          isCorrect
            ? 'bg-green-50 border-green-200 text-green-900'
            : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          <div className="font-semibold text-xs mb-2 uppercase tracking-wide opacity-60">해설</div>
          {q.explanation}
        </div>
      )}

      {/* 다음 문제 버튼 */}
      {selectedAnswer !== null && (
        <button
          onClick={handleNext}
          className="w-full py-3 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors font-medium"
        >
          {currentIndex + 1 >= questions.length ? '결과 보기' : '다음 문제 →'}
        </button>
      )}
    </div>
  )
}
