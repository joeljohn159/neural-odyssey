import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type CalloutType = 'misconception' | 'practice' | 'deepdive' | 'info'

function AlertTriangleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.86 2.57 1.21 12a1.33 1.33 0 0 0 1.15 2h11.28a1.33 1.33 0 0 0 1.15-2L9.14 2.57a1.33 1.33 0 0 0-2.28 0Z" />
      <path d="M8 6v2.67M8 11.33h.01" />
    </svg>
  )
}

function WrenchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.27 2.4a4 4 0 0 0-4.94 5.56L2 11.33l.67.67 1.33 1.33.67.67 3.37-3.33A4 4 0 0 0 13.6 5.73l-2.27 2.27-1.33-1.33 2.27-2.27Z" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <path d="m10.24 5.76-1.49 2.99-2.99 1.49 1.49-2.99z" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 7.33V11M8 5h.01" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4.5 2.5 3.5 3.5-3.5 3.5" />
    </svg>
  )
}

const config: Record<CalloutType, { icon: () => ReactNode; label: string; border: string; bg: string; text: string }> = {
  misconception: {
    icon: AlertTriangleIcon,
    label: 'Common Misconception',
    border: 'border-neural-gradient/30',
    bg: 'bg-neural-gradient/5',
    text: 'text-neural-gradient',
  },
  practice: {
    icon: WrenchIcon,
    label: 'In Practice',
    border: 'border-neural-weight/30',
    bg: 'bg-neural-weight/5',
    text: 'text-neural-weight',
  },
  deepdive: {
    icon: CompassIcon,
    label: 'Deep Dive',
    border: 'border-neural-activation/30',
    bg: 'bg-neural-activation/5',
    text: 'text-neural-activation',
  },
  info: {
    icon: InfoIcon,
    label: 'Note',
    border: 'border-neural-input/30',
    bg: 'bg-neural-input/5',
    text: 'text-neural-input',
  },
}

interface CalloutProps {
  type: CalloutType
  title?: string
  children: ReactNode
  expandable?: boolean
}

export default function Callout({ type, title, children, expandable = false }: CalloutProps) {
  const [expanded, setExpanded] = useState(!expandable)
  const c = config[type]
  const displayTitle = title || c.label
  const Icon = c.icon

  return (
    <div className={`my-6 rounded-xl border ${c.border} ${c.bg} overflow-hidden`}>
      <button
        onClick={() => expandable && setExpanded(!expanded)}
        className={`flex items-center gap-2 px-4 py-3 w-full text-left ${expandable ? 'cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02]' : 'cursor-default'}`}
        disabled={!expandable}
      >
        <span className={c.text}><Icon /></span>
        <span className={`text-sm font-semibold ${c.text}`}>{displayTitle}</span>
        {expandable && (
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            className="ml-auto text-text-tertiary"
          >
            <ChevronRightIcon />
          </motion.span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={expandable ? { height: 0, opacity: 0 } : false}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm text-text-secondary leading-relaxed [&>p]:mb-3 [&>p:last-child]:mb-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
