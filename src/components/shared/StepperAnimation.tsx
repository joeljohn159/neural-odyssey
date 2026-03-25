import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgress } from '../../context/ProgressContext'

export interface Step {
  explanation: string
  render: (animationProgress: number) => ReactNode
  codeHighlight?: number[]
}

interface StepperAnimationProps {
  id: string
  title: string
  steps: Step[]
  height?: number
  className?: string
}

export default function StepperAnimation({
  id,
  title,
  steps,
  height = 400,
  className = '',
}: StepperAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playSpeed, setPlaySpeed] = useState(2000)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { markInteractiveComplete, isInteractiveComplete } = useProgress()
  const completed = isInteractiveComplete(id)

  const totalSteps = steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const goNext = useCallback(() => {
    setCurrentStep(prev => {
      const next = Math.min(prev + 1, totalSteps - 1)
      if (next === totalSteps - 1) {
        markInteractiveComplete(id)
        setIsPlaying(false)
      }
      return next
    })
  }, [totalSteps, id, markInteractiveComplete])

  const goBack = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }, [])

  const reset = useCallback(() => {
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(goNext, playSpeed)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, playSpeed, goNext])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goBack() }
      if (e.key === ' ') { e.preventDefault(); togglePlay() }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goBack, togglePlay])

  const step = steps[currentStep]

  return (
    <div
      className={`my-8 rounded-xl border border-border bg-surface-elevated shadow-sm overflow-hidden ${className}`}
      role="region"
      aria-label={title}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-alt">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neural-activation" />
          <h4 className="text-sm font-semibold font-body m-0">{title}</h4>
          {completed && (
            <span className="text-xs text-neural-weight font-mono bg-neural-weight/10 px-2 py-0.5 rounded-full">
              Completed
            </span>
          )}
        </div>
        <span className="text-xs font-mono text-text-tertiary">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-border">
        <motion.div
          className="h-full bg-accent"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Visualization area */}
      <div
        className="relative overflow-hidden bg-surface-elevated"
        style={{ minHeight: height }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full flex items-center justify-center p-4"
            style={{ minHeight: height }}
          >
            {step.render(1)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Explanation */}
      <div className="px-5 py-4 border-t border-border bg-surface-alt/50 min-h-[80px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-text-secondary leading-relaxed m-0"
          >
            {step.explanation}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-surface-alt">
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="px-3 py-1.5 text-xs font-mono text-text-tertiary hover:text-text-primary border border-border rounded-lg hover:bg-surface transition-colors"
            aria-label="Reset"
          >
            Reset
          </button>
          <button
            onClick={togglePlay}
            className="px-3 py-1.5 text-xs font-mono text-text-tertiary hover:text-text-primary border border-border rounded-lg hover:bg-surface transition-colors flex items-center gap-1"
            aria-label={isPlaying ? 'Pause' : 'Play all'}
          >
            {isPlaying ? (
              <><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="inline-block"><rect x="2" y="1.5" width="3" height="9" rx="0.5" /><rect x="7" y="1.5" width="3" height="9" rx="0.5" /></svg> Pause</>
            ) : (
              <><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="inline-block"><path d="M3 1.5v9l7-4.5z" /></svg> Play All</>
            )}
          </button>
          {isPlaying && (
            <select
              value={playSpeed}
              onChange={e => setPlaySpeed(Number(e.target.value))}
              className="text-xs font-mono border border-border rounded-lg px-2 py-1.5 bg-surface-elevated text-text-secondary"
              aria-label="Playback speed"
            >
              <option value={3000}>Slow</option>
              <option value={2000}>Normal</option>
              <option value={1000}>Fast</option>
              <option value={500}>Very Fast</option>
            </select>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            disabled={currentStep === 0}
            className="px-4 py-1.5 text-sm font-body font-medium border border-border rounded-lg hover:bg-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous step"
          >
            ← Back
          </button>
          <button
            onClick={goNext}
            disabled={currentStep === totalSteps - 1}
            className="px-4 py-1.5 text-sm font-body font-medium bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next step"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
