import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { chapters } from '../data/chapters'
import { useProgress } from '../context/ProgressContext'

function ProgressRing({ progress, size = 120, strokeWidth = 8 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - progress * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
    </svg>
  )
}

export default function Dashboard() {
  const {
    completedSections,
    completedInteractives,
    streak,
    totalTimeMinutes,
    overallProgress,
    isSectionComplete,
    currentChapter,
  } = useProgress()

  const continueChapter = currentChapter || 1

  return (
    <div className="min-h-screen py-12">
      <div className="prose-content">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary mb-6">
          <Link to="/" className="hover:text-accent no-underline text-text-tertiary">Home</Link>
          <span>/</span>
          <span>Dashboard</span>
        </div>
        <h1 className="text-3xl font-display font-bold mb-8">Your Progress</h1>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="flex flex-col items-center p-5 rounded-xl border border-border bg-surface-elevated">
            <ProgressRing progress={overallProgress} size={80} strokeWidth={6} />
            <span className="text-2xl font-mono font-bold mt-3">{Math.round(overallProgress * 100)}%</span>
            <span className="text-xs text-text-tertiary">Complete</span>
          </div>
          <div className="flex flex-col items-center justify-center p-5 rounded-xl border border-border bg-surface-elevated">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={streak > 0 ? '#F59E0B' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`mb-1 ${streak > 0 ? '' : 'text-text-tertiary'}`}>
              <path d="M12 2C8 7 4 10 4 14a8 8 0 0 0 16 0c0-4-4-7-8-12Z" />
              {streak > 0 && <path d="M12 22c-2 0-4-1.5-4-4 0-2.5 4-5 4-8 0 3 4 5.5 4 8 0 2.5-2 4-4 4Z" fill="#F59E0B" stroke="none" />}
            </svg>
            <span className="text-2xl font-mono font-bold">{streak}</span>
            <span className="text-xs text-text-tertiary">Day Streak</span>
          </div>
          <div className="flex flex-col items-center justify-center p-5 rounded-xl border border-border bg-surface-elevated">
            <span className="text-2xl font-mono font-bold">{totalTimeMinutes}</span>
            <span className="text-xs text-text-tertiary">Minutes Invested</span>
          </div>
          <div className="flex flex-col items-center justify-center p-5 rounded-xl border border-border bg-surface-elevated">
            <span className="text-2xl font-mono font-bold">{completedInteractives.length}</span>
            <span className="text-xs text-text-tertiary">Interactives Done</span>
          </div>
        </div>

        {/* Continue button */}
        <Link
          to={`/chapter/${continueChapter}`}
          className="flex items-center justify-between p-5 rounded-xl border border-accent bg-accent/5 hover:bg-accent/10 transition-colors no-underline mb-10"
        >
          <div>
            <span className="text-xs font-mono text-accent">Continue where you left off</span>
            <span className="block text-lg font-display font-semibold text-text-primary mt-0.5">
              Chapter {continueChapter}: {chapters[continueChapter - 1]?.title}
            </span>
          </div>
          <span className="text-accent text-lg">→</span>
        </Link>

        {/* Chapter progress */}
        <h2 className="text-xl font-display font-semibold mb-4">Chapters</h2>
        <div className="space-y-3 mb-10">
          {chapters.map(chapter => {
            const completed = chapter.sections.filter(s => isSectionComplete(s.id)).length
            const total = chapter.sections.length
            const pct = total > 0 ? completed / total : 0

            return (
              <Link
                key={chapter.index}
                to={`/chapter/${chapter.index}`}
                className="block p-4 rounded-xl border border-border bg-surface-elevated hover:shadow-sm transition-all no-underline"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-text-tertiary">
                      {String(chapter.index).padStart(2, '0')}
                    </span>
                    <span className="font-display font-semibold text-text-primary">
                      {chapter.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-text-tertiary">
                    {completed}/{total}
                  </span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                {/* Section details */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {chapter.sections.map(section => (
                    <span
                      key={section.id}
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isSectionComplete(section.id)
                          ? 'bg-neural-weight/10 text-neural-weight'
                          : 'bg-surface-alt text-text-tertiary'
                      }`}
                    >
                      {isSectionComplete(section.id) && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="inline-block mr-1 -mt-0.5"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}{section.title}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Completed interactives */}
        {completedInteractives.length > 0 && (
          <>
            <h2 className="text-xl font-display font-semibold mb-4">Completed Interactives</h2>
            <div className="flex flex-wrap gap-2 mb-10">
              {completedInteractives.map(id => (
                <span key={id} className="text-xs font-mono bg-neural-weight/10 text-neural-weight px-3 py-1 rounded-full">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="inline-block mr-1 -mt-0.5"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>{id}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Final Assessment */}
        <Link
          to="/quiz"
          className={`flex items-center justify-between p-5 rounded-xl border transition-colors no-underline mb-10 ${
            overallProgress >= 1
              ? 'border-accent bg-accent/5 hover:bg-accent/10'
              : 'border-border bg-surface-alt opacity-60 pointer-events-none'
          }`}
        >
          <div>
            <span className={`text-xs font-mono ${overallProgress >= 1 ? 'text-accent' : 'text-text-tertiary'}`}>
              {overallProgress >= 1 ? 'Ready' : 'Complete all chapters to unlock'}
            </span>
            <span className="block text-lg font-display font-semibold text-text-primary mt-0.5">
              Final Assessment &amp; Certificate
            </span>
          </div>
          <span className={overallProgress >= 1 ? 'text-accent text-lg' : 'text-text-tertiary'}>
            {overallProgress >= 1 ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 4l6 6-6 6" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="9" width="10" height="8" rx="1.5" />
                <path d="M7 9V6.5a3 3 0 0 1 6 0V9" />
              </svg>
            )}
          </span>
        </Link>

        {/* Sections completed */}
        <div className="text-center text-sm text-text-tertiary py-8">
          {completedSections.length} of 34 sections completed
        </div>
      </div>
    </div>
  )
}
