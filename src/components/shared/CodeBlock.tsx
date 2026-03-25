import { useState, useCallback } from 'react'

interface CodeTab {
  label: string
  language: string
  code: string
  output?: string
}

interface CodeBlockProps {
  tabs: CodeTab[]
  className?: string
}

function highlightPython(code: string): string {
  // Tokenize first, then render — avoids regex-inside-HTML corruption
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const keywords = new Set(['import', 'from', 'def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'in', 'not', 'and', 'or', 'True', 'False', 'None', 'as', 'with', 'try', 'except', 'raise', 'lambda', 'yield', 'pass', 'break', 'continue'])
  const builtins = new Set(['print', 'len', 'range', 'max', 'min', 'sum', 'abs', 'type', 'int', 'float', 'str', 'list', 'dict', 'tuple', 'set', 'np', 'torch', 'nn', 'F'])

  // Tokenize with a single regex that captures comments, strings, words, numbers, and other chars
  const tokenPattern = /(#.*$)|(f?"[^"]*"|f?'[^']*')|(\b[a-zA-Z_]\w*\b)|(\b\d+\.?\d*\b)|(\S)/gm
  let result = ''
  let lastIndex = 0

  for (const match of escaped.matchAll(tokenPattern)) {
    // Add any whitespace/gap before this match
    if (match.index > lastIndex) {
      result += escaped.slice(lastIndex, match.index)
    }
    lastIndex = match.index + match[0].length

    const [full, comment, str, word, num] = match
    if (comment) {
      result += `<span class="text-text-tertiary italic">${comment}</span>`
    } else if (str) {
      result += `<span class="text-neural-weight">${str}</span>`
    } else if (word && keywords.has(word)) {
      result += `<span class="text-neural-activation font-semibold">${word}</span>`
    } else if (word && builtins.has(word)) {
      result += `<span class="text-neural-bias">${word}</span>`
    } else if (num) {
      result += `<span class="text-neural-input">${num}</span>`
    } else {
      result += full
    }
  }
  // Add any trailing content
  if (lastIndex < escaped.length) {
    result += escaped.slice(lastIndex)
  }

  return result
}

export default function CodeBlock({ tabs, className = '' }: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(tabs[activeTab].code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [activeTab, tabs])

  const tab = tabs[activeTab]
  const lines = tab.code.split('\n')

  return (
    <div className={`my-6 rounded-xl border border-border overflow-hidden bg-surface-elevated shadow-sm ${className}`}>
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface-alt px-1 py-1">
        <div className="flex gap-1">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActiveTab(i)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                i === activeTab
                  ? 'bg-surface-elevated text-text-primary shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={copyCode}
          className="px-3 py-1.5 text-xs font-mono text-text-tertiary hover:text-text-primary transition-colors"
          aria-label="Copy code"
        >
          {copied ? (<><svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="inline-block mr-1 -mt-0.5"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Copied</>) : 'Copy'}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="m-0 p-4 text-sm leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none text-text-tertiary/50 w-8 text-right pr-4 flex-shrink-0 text-xs leading-relaxed">
                  {i + 1}
                </span>
                <span
                  dangerouslySetInnerHTML={{ __html: highlightPython(line) }}
                  className="flex-1"
                />
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Output */}
      {tab.output && (
        <div className="border-t border-border bg-text-primary/95 px-4 py-3">
          <div className="text-xs font-mono text-text-tertiary mb-1">Output:</div>
          <pre className="m-0 text-sm font-mono text-neural-weight leading-relaxed whitespace-pre-wrap">
            {tab.output}
          </pre>
        </div>
      )}
    </div>
  )
}
