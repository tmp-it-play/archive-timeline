import { useState, useCallback } from 'react'

export function useProgress(subjectId) {
  const key = `progress_${subjectId}`

  const load = () => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : { total: 0, correct: 0, seen: [] }
    } catch {
      return { total: 0, correct: 0, seen: [] }
    }
  }

  const [progress, setProgress] = useState(load)

  const recordAnswer = useCallback((questionId, isCorrect) => {
    setProgress(prev => {
      const alreadySeen = prev.seen.includes(questionId)
      const next = {
        total: alreadySeen ? prev.total : prev.total + 1,
        correct: alreadySeen ? prev.correct : prev.correct + (isCorrect ? 1 : 0),
        seen: alreadySeen ? prev.seen : [...prev.seen, questionId],
      }
      localStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }, [key])

  const reset = useCallback(() => {
    const initial = { total: 0, correct: 0, seen: [] }
    localStorage.setItem(key, JSON.stringify(initial))
    setProgress(initial)
  }, [key])

  return { progress, recordAnswer, reset }
}

export function getProgressSummary(subjectId) {
  try {
    const stored = localStorage.getItem(`progress_${subjectId}`)
    return stored ? JSON.parse(stored) : { total: 0, correct: 0, seen: [] }
  } catch {
    return { total: 0, correct: 0, seen: [] }
  }
}
