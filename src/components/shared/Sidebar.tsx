import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { chapters } from '../../data/chapters'
import { useProgress } from '../../context/ProgressContext'
import { useTheme } from '../../context/ThemeContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className}>
      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BarChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="8" width="3" height="6" rx="0.5" />
      <rect x="6.5" y="4" width="3" height="10" rx="0.5" />
      <rect x="11" y="2" width="3" height="12" rx="0.5" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M3.4 12.6l1.06-1.06M11.54 4.46l1.06-1.06" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.5 8.5a5.5 5.5 0 1 1-6-6 4 4 0 0 0 6 6Z" />
    </svg>
  )
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { isSectionComplete } = useProgress()
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-surface-elevated border-r border-border z-50 overflow-y-auto transform transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <Link to="/" className="text-decoration-none" onClick={onClose}>
            <h1 className="text-lg font-display font-bold m-0 text-text-primary">
              Neural Odyssey
            </h1>
            <p className="text-xs text-text-tertiary font-mono m-0 mt-0.5">
              Interactive AI/ML
            </p>
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-surface-alt transition-colors text-text-secondary"
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <nav className="p-3" aria-label="Chapter navigation">
          <Link
            to="/dashboard"
            onClick={onClose}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm no-underline mb-2 transition-colors ${
              location.pathname === '/dashboard'
                ? 'bg-accent/10 text-accent font-medium'
                : 'text-text-secondary hover:bg-surface-alt'
            }`}
          >
            <BarChartIcon />
            Dashboard
          </Link>

          {chapters.map(chapter => {
            const chapterPath = `/chapter/${chapter.index}`
            const isActive = location.pathname.startsWith(chapterPath)
            const completedCount = chapter.sections.filter(s => isSectionComplete(s.id)).length
            const totalSections = chapter.sections.length

            return (
              <div key={chapter.index} className="mb-1">
                <Link
                  to={chapterPath}
                  onClick={onClose}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm no-underline transition-colors ${
                    isActive
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-text-secondary hover:bg-surface-alt'
                  }`}
                >
                  <span className="font-mono text-xs text-text-tertiary w-5">
                    {String(chapter.index).padStart(2, '0')}
                  </span>
                  <span className="flex-1 truncate">{chapter.title}</span>
                  {completedCount > 0 && (
                    <span className="text-xs font-mono text-text-tertiary">
                      {completedCount}/{totalSections}
                    </span>
                  )}
                </Link>

                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="ml-7 mt-0.5 mb-1 border-l border-border pl-3"
                  >
                    {chapter.sections.map(section => {
                      const sectionComplete = isSectionComplete(section.id)
                      return (
                        <Link
                          key={section.id}
                          to={`${chapterPath}#${section.id}`}
                          onClick={onClose}
                          className="flex items-center gap-2 py-1.5 text-xs no-underline text-text-tertiary hover:text-text-secondary transition-colors"
                        >
                          {sectionComplete ? (
                            <span className="text-neural-weight"><CheckIcon /></span>
                          ) : (
                            <span className="w-3 h-3 rounded-full border border-border inline-block" />
                          )}
                          <span className="truncate">{section.title}</span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </div>
            )
          })}

          <Link
            to="/quiz"
            onClick={onClose}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm no-underline mt-2 transition-colors ${
              location.pathname === '/quiz' || location.pathname === '/certificate'
                ? 'bg-accent/10 text-accent font-medium'
                : 'text-text-secondary hover:bg-surface-alt'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="6" r="5" />
              <path d="M5.4 10.2L4.5 15l3.5-2 3.5 2-.9-4.8" />
            </svg>
            Final Assessment
          </Link>
        </nav>
      </aside>
    </>
  )
}
