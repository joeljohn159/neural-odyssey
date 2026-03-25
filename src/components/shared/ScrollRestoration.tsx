import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const scrollPositions = new Map<string, number>()

export default function ScrollRestoration() {
  const location = useLocation()
  const navType = useNavigationType()
  const prevPath = useRef(location.pathname)

  // Save scroll position before navigating away
  useEffect(() => {
    const save = () => {
      scrollPositions.set(prevPath.current, window.scrollY)
    }

    return () => {
      save()
      prevPath.current = location.pathname
    }
  }, [location.pathname])

  // Restore, reset, or hash-scroll on navigation
  useEffect(() => {
    if (location.hash) {
      // Hash link — smooth scroll to the target element
      const id = location.hash.slice(1)
      // Small delay to let lazy-loaded content render
      const timer = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
      return () => clearTimeout(timer)
    }

    if (navType === 'POP') {
      // Back/forward — restore saved position
      const saved = scrollPositions.get(location.pathname)
      if (saved !== undefined) {
        requestAnimationFrame(() => {
          window.scrollTo(0, saved)
        })
      }
    } else {
      // PUSH or REPLACE — new navigation, scroll to top
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash, navType])

  return null
}
