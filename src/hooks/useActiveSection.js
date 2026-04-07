import { useState, useEffect } from 'react'

export function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    const observers = []
    const visibleSections = new Map()

    const callback = (entries) => {
      entries.forEach((entry) => {
        visibleSections.set(entry.target.id, entry.isIntersecting)
      })

      // Find the topmost visible section
      for (const id of sectionIds) {
        if (visibleSections.get(id)) {
          setActiveId(id)
          break
        }
      }
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '-10% 0px -60% 0px',
      threshold: 0,
    })

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        observer.observe(el)
        observers.push(observer)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [sectionIds])

  return activeId
}
