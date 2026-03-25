import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { chapters, type Chapter } from '../../data/chapters'
import { useProgress } from '../../context/ProgressContext'
import PaperCard from './PaperCard'

interface ChapterLayoutProps {
  chapter: Chapter
  children: ReactNode
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M3 7l3 3 5-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ChapterLayout({ chapter, children }: ChapterLayoutProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const { toggleSectionComplete, isSectionComplete, addTimeSpent, resetChapterProgress } = useProgress()
  const totalReadingTime = chapter.sections.reduce((a, s) => a + s.readingTime, 0)
  const completedCount = chapter.sections.filter(s => isSectionComplete(s.id)).length

  useEffect(() => {
    const start = Date.now()
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      const elapsed = Math.round((Date.now() - start) / 1000)
      if (elapsed > 5) addTimeSpent(`ch${chapter.index}`, elapsed)
    }
  }, [chapter.index, addTimeSpent])

  const prevChapter = chapters.find(c => c.index === chapter.index - 1)
  const nextChapter = chapters.find(c => c.index === chapter.index + 1)

  return (
    <article className="min-h-screen">
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-border no-print">
        <motion.div
          className="h-full bg-accent"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Chapter header */}
      <header className="pt-12 pb-8 prose-content">
        <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary mb-4">
          <Link to="/" className="hover:text-accent no-underline text-text-tertiary">Home</Link>
          <span>/</span>
          <span>Chapter {chapter.index}</span>
        </div>
        <p className="text-xs font-mono text-accent uppercase tracking-widest m-0 mb-2">
          Chapter {chapter.index}
        </p>
        <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight m-0 mb-2">
          {chapter.title}
        </h1>
        <p className="text-xl text-text-tertiary font-display italic m-0 mb-4">
          {chapter.subtitle}
        </p>
        <p className="text-base text-text-secondary m-0 mb-4">
          {chapter.description}
        </p>
        <div className="flex items-center gap-4 text-xs font-mono text-text-tertiary">
          <span>~{totalReadingTime} min read</span>
          <span>•</span>
          <span>{chapter.sections.length} sections</span>
          {chapter.papers.length > 0 && (
            <>
              <span>•</span>
              <span>{chapter.papers.length} paper{chapter.papers.length > 1 ? 's' : ''}</span>
            </>
          )}
        </div>
      </header>

      <div className="border-t border-border" />

      {/* Content */}
      <div className="prose-content py-8">
        {children}

        {/* Section complete buttons */}
        {chapter.sections.map(section => (
          <div key={section.id} id={`complete-${section.id}`} />
        ))}
      </div>

      {/* Mark Complete */}
      <div className="prose-content pb-8">
        <div className="border border-border rounded-xl p-6 bg-surface-alt">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display m-0">Mark Sections Complete</h3>
            {completedCount > 0 && (
              <button
                onClick={() => resetChapterProgress(chapter.index)}
                className="text-xs font-mono text-text-tertiary hover:text-neural-gradient transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="space-y-2">
            {chapter.sections.map(section => {
              const complete = isSectionComplete(section.id)
              return (
                <button
                  key={section.id}
                  onClick={() => toggleSectionComplete(section.id)}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-left transition-colors ${
                    complete
                      ? 'bg-neural-weight/10 text-neural-weight'
                      : 'bg-surface-elevated border border-border hover:bg-surface text-text-secondary'
                  }`}
                >
                  {complete ? (
                    <CheckIcon />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-border-strong" />
                  )}
                  {section.title}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Papers */}
      {chapter.papers.length > 0 && (
        <div className="prose-content pb-8">
          <h2 className="text-2xl font-display mb-4">Seminal Papers</h2>
          <div className="space-y-4">
            {chapter.papers.map(paper => (
              <PaperCard key={paper.title} paper={paper} />
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="border-t border-border">
        <div className="prose-content py-8 flex justify-between gap-4">
          {prevChapter ? (
            <Link
              to={`/chapter/${prevChapter.index}`}
              className="flex-1 p-4 rounded-xl border border-border hover:bg-surface-alt transition-colors no-underline group"
            >
              <span className="text-xs font-mono text-text-tertiary">← Previous</span>
              <span className="block text-base font-display font-semibold text-text-primary group-hover:text-accent mt-1">
                {prevChapter.title}
              </span>
            </Link>
          ) : <div className="flex-1" />}
          {nextChapter ? (
            <Link
              to={`/chapter/${nextChapter.index}`}
              className="flex-1 p-4 rounded-xl border border-border hover:bg-surface-alt transition-colors no-underline text-right group"
            >
              <span className="text-xs font-mono text-text-tertiary">Next →</span>
              <span className="block text-base font-display font-semibold text-text-primary group-hover:text-accent mt-1">
                {nextChapter.title}
              </span>
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="flex-1 p-4 rounded-xl border border-accent bg-accent/5 hover:bg-accent/10 transition-colors no-underline text-right group"
            >
              <span className="text-xs font-mono text-accent">Finish →</span>
              <span className="block text-base font-display font-semibold text-accent mt-1">
                View Dashboard
              </span>
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
