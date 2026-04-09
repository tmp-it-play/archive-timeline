import { useState, useCallback } from 'react'

const STORAGE_KEY = 'wrongNotes'

function loadNotes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function useWrongNotes() {
  const [notes, setNotes] = useState(loadNotes)

  const addWrongNote = useCallback((question, subjectId) => {
    setNotes(prev => {
      if (prev.find(n => n.id === question.id)) return prev
      const next = [...prev, { ...question, subjectId }]
      saveNotes(next)
      return next
    })
  }, [])

  const removeWrongNote = useCallback((questionId) => {
    setNotes(prev => {
      const next = prev.filter(n => n.id !== questionId)
      saveNotes(next)
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    saveNotes([])
    setNotes([])
  }, [])

  return { notes, addWrongNote, removeWrongNote, clearAll }
}

export function getWrongNoteCount() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored).length : 0
  } catch {
    return 0
  }
}
