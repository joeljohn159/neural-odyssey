import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface ProgressState {
  completedSections: string[]
  completedInteractives: string[]
  timeSpent: Record<string, number>
  streak: number
  lastVisit: string | null
  currentChapter: number
  currentSection: number
}

interface ProgressContextType extends ProgressState {
  markSectionComplete: (id: string) => void
  toggleSectionComplete: (id: string) => void
  markInteractiveComplete: (id: string) => void
  addTimeSpent: (chapterId: string, seconds: number) => void
  isSectionComplete: (id: string) => boolean
  isInteractiveComplete: (id: string) => boolean
  getChapterProgress: (chapterIndex: number, totalSections: number) => number
  overallProgress: number
  totalTimeMinutes: number
  setCurrentPosition: (chapter: number, section: number) => void
  resetChapterProgress: (chapterIndex: number) => void
  resetAllProgress: () => void
}

const STORAGE_KEY = 'neural-odyssey-progress'
const TOTAL_SECTIONS = 34

const defaultState: ProgressState = {
  completedSections: [],
  completedInteractives: [],
  timeSpent: {},
  streak: 0,
  lastVisit: null,
  currentChapter: 0,
  currentSection: 0,
}

function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultState, lastVisit: new Date().toISOString().slice(0, 10) }
    const parsed = JSON.parse(raw) as ProgressState
    const today = new Date().toISOString().slice(0, 10)
    const lastVisit = parsed.lastVisit
    let streak = parsed.streak || 0

    if (lastVisit) {
      const last = new Date(lastVisit)
      const now = new Date(today)
      const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000)
      if (diffDays === 1) streak += 1
      else if (diffDays > 1) streak = 1
    } else {
      streak = 1
    }

    return { ...parsed, streak, lastVisit: today }
  } catch {
    return { ...defaultState, lastVisit: new Date().toISOString().slice(0, 10) }
  }
}

const ProgressContext = createContext<ProgressContextType | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const markSectionComplete = useCallback((id: string) => {
    setState(prev => {
      if (prev.completedSections.includes(id)) return prev
      return { ...prev, completedSections: [...prev.completedSections, id] }
    })
  }, [])

  const toggleSectionComplete = useCallback((id: string) => {
    setState(prev => {
      if (prev.completedSections.includes(id)) {
        return { ...prev, completedSections: prev.completedSections.filter(s => s !== id) }
      }
      return { ...prev, completedSections: [...prev.completedSections, id] }
    })
  }, [])

  const resetChapterProgress = useCallback((chapterIndex: number) => {
    const prefix = `ch${chapterIndex}-`
    setState(prev => ({
      ...prev,
      completedSections: prev.completedSections.filter(s => !s.startsWith(prefix)),
    }))
  }, [])

  const resetAllProgress = useCallback(() => {
    setState(prev => ({
      ...prev,
      completedSections: [],
      completedInteractives: [],
    }))
  }, [])

  const markInteractiveComplete = useCallback((id: string) => {
    setState(prev => {
      if (prev.completedInteractives.includes(id)) return prev
      return { ...prev, completedInteractives: [...prev.completedInteractives, id] }
    })
  }, [])

  const addTimeSpent = useCallback((chapterId: string, seconds: number) => {
    setState(prev => ({
      ...prev,
      timeSpent: {
        ...prev.timeSpent,
        [chapterId]: (prev.timeSpent[chapterId] || 0) + seconds,
      },
    }))
  }, [])

  const isSectionComplete = useCallback(
    (id: string) => state.completedSections.includes(id),
    [state.completedSections]
  )

  const isInteractiveComplete = useCallback(
    (id: string) => state.completedInteractives.includes(id),
    [state.completedInteractives]
  )

  const getChapterProgress = useCallback(
    (chapterIndex: number, totalSections: number) => {
      const prefix = `ch${chapterIndex}-`
      const completed = state.completedSections.filter(s => s.startsWith(prefix)).length
      return totalSections > 0 ? completed / totalSections : 0
    },
    [state.completedSections]
  )

  const overallProgress = state.completedSections.length / TOTAL_SECTIONS

  const totalTimeMinutes = Math.round(
    Object.values(state.timeSpent).reduce((a, b) => a + b, 0) / 60
  )

  const setCurrentPosition = useCallback((chapter: number, section: number) => {
    setState(prev => ({ ...prev, currentChapter: chapter, currentSection: section }))
  }, [])

  return (
    <ProgressContext.Provider
      value={{
        ...state,
        markSectionComplete,
        toggleSectionComplete,
        markInteractiveComplete,
        addTimeSpent,
        isSectionComplete,
        isInteractiveComplete,
        getChapterProgress,
        overallProgress,
        totalTimeMinutes,
        setCurrentPosition,
        resetChapterProgress,
        resetAllProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
