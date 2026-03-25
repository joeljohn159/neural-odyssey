import { lazy, Suspense, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProgressProvider } from './context/ProgressContext'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar from './components/shared/Sidebar'
import ScrollRestoration from './components/shared/ScrollRestoration'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Quiz = lazy(() => import('./pages/Quiz'))
const Certificate = lazy(() => import('./pages/Certificate'))
const Chapter1 = lazy(() => import('./chapters/Chapter1'))
const Chapter2 = lazy(() => import('./chapters/Chapter2'))
const Chapter3 = lazy(() => import('./chapters/Chapter3'))
const Chapter4 = lazy(() => import('./chapters/Chapter4'))
const Chapter5 = lazy(() => import('./chapters/Chapter5'))
const Chapter6 = lazy(() => import('./chapters/Chapter6'))
const Chapter7 = lazy(() => import('./chapters/Chapter7'))
const Chapter8 = lazy(() => import('./chapters/Chapter8'))

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-text-tertiary font-mono">Loading...</p>
      </div>
    </div>
  )
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-w-0">
        <ScrollRestoration />
        {/* Mobile nav bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-surface/80 backdrop-blur-sm border-b border-border lg:hidden no-print">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-surface-alt transition-colors"
            aria-label="Open navigation"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          </button>
          <span className="text-sm font-display font-semibold">Neural Odyssey</span>
        </div>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/certificate" element={<Certificate />} />
            <Route path="/chapter/1" element={<Chapter1 />} />
            <Route path="/chapter/2" element={<Chapter2 />} />
            <Route path="/chapter/3" element={<Chapter3 />} />
            <Route path="/chapter/4" element={<Chapter4 />} />
            <Route path="/chapter/5" element={<Chapter5 />} />
            <Route path="/chapter/6" element={<Chapter6 />} />
            <Route path="/chapter/7" element={<Chapter7 />} />
            <Route path="/chapter/8" element={<Chapter8 />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <AppLayout />
      </ProgressProvider>
    </ThemeProvider>
  )
}
