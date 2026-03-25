import { useState, useRef, useCallback } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import { useProgress } from '../context/ProgressContext'

const QUIZ_STORAGE_KEY = 'neural-odyssey-quiz'

function getQuizResult(): { passed: boolean; score: number } | null {
  try {
    const stored = localStorage.getItem(QUIZ_STORAGE_KEY)
    if (!stored) return null
    const state = JSON.parse(stored)
    if (!state.submitted) return null
    // Recalculate score from stored answers
    const score = Object.keys(state.answers).length
    return { passed: true, score }
  } catch {
    return null
  }
}

function CertificateSVG({ name, date, id }: { name: string; date: string; id: string }) {
  return (
    <svg
      viewBox="0 0 1100 780"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      style={{ fontFamily: "'Newsreader', 'Georgia', serif" }}
    >
      <defs>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FAFAF9" />
          <stop offset="100%" stopColor="#F5F5F4" />
        </linearGradient>
        <linearGradient id="accent-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4A853" />
          <stop offset="50%" stopColor="#F2D675" />
          <stop offset="100%" stopColor="#D4A853" />
        </linearGradient>
        <pattern id="net-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1.5" fill="#E7E5E4" />
          <line x1="0" y1="30" x2="60" y2="30" stroke="#E7E5E4" strokeWidth="0.3" />
          <line x1="30" y1="0" x2="30" y2="60" stroke="#E7E5E4" strokeWidth="0.3" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width="1100" height="780" fill="url(#bg-grad)" />
      <rect width="1100" height="780" fill="url(#net-pattern)" opacity="0.5" />

      {/* Outer border */}
      <rect x="20" y="20" width="1060" height="740" rx="4" fill="none" stroke="#D6D3D1" strokeWidth="1" />
      <rect x="30" y="30" width="1040" height="720" rx="3" fill="none" stroke="#E7E5E4" strokeWidth="0.5" />

      {/* Top accent line */}
      <rect x="30" y="30" width="1040" height="4" fill="url(#accent-grad)" rx="2" />

      {/* Corner ornaments */}
      {[
        { x: 50, y: 50, r: 0 },
        { x: 1050, y: 50, r: 90 },
        { x: 1050, y: 730, r: 180 },
        { x: 50, y: 730, r: 270 },
      ].map((corner, i) => (
        <g key={i} transform={`translate(${corner.x}, ${corner.y}) rotate(${corner.r})`}>
          <path d="M0 0 L20 0 M0 0 L0 20" stroke="#D4A853" strokeWidth="1.5" fill="none" />
          <circle cx="0" cy="0" r="2" fill="#D4A853" />
        </g>
      ))}

      {/* Institution seal */}
      <g transform="translate(550, 110)">
        <circle cx="0" cy="0" r="32" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="26" fill="none" stroke="url(#gold-grad)" strokeWidth="0.5" />
        {/* Network icon inside seal */}
        <circle cx="-8" cy="-6" r="3" fill="none" stroke="#D4A853" strokeWidth="1" />
        <circle cx="8" cy="-6" r="3" fill="none" stroke="#D4A853" strokeWidth="1" />
        <circle cx="0" cy="8" r="3" fill="none" stroke="#D4A853" strokeWidth="1" />
        <line x1="-5" y1="-4" x2="5" y2="-4" stroke="#D4A853" strokeWidth="0.8" />
        <line x1="-6" y1="-3" x2="-2" y2="6" stroke="#D4A853" strokeWidth="0.8" />
        <line x1="6" y1="-3" x2="2" y2="6" stroke="#D4A853" strokeWidth="0.8" />
      </g>

      {/* Title */}
      <text x="550" y="180" textAnchor="middle" fontSize="13" fill="#A8A29E" letterSpacing="6" fontFamily="'JetBrains Mono', monospace" fontWeight="400">
        NEURAL ODYSSEY
      </text>

      {/* Certificate of Completion */}
      <text x="550" y="230" textAnchor="middle" fontSize="38" fill="#1C1917" fontWeight="600" fontFamily="'Newsreader', Georgia, serif">
        Certificate of Completion
      </text>

      {/* Divider */}
      <line x1="380" y1="252" x2="720" y2="252" stroke="url(#gold-grad)" strokeWidth="1" />

      {/* Subtitle */}
      <text x="550" y="290" textAnchor="middle" fontSize="14" fill="#78716C" fontFamily="'Source Sans 3', sans-serif">
        This certifies that
      </text>

      {/* Recipient name */}
      <text x="550" y="345" textAnchor="middle" fontSize="36" fill="#1C1917" fontWeight="700" fontFamily="'Newsreader', Georgia, serif" fontStyle="italic">
        {name}
      </text>

      {/* Name underline */}
      <line x1="280" y1="365" x2="820" y2="365" stroke="#D6D3D1" strokeWidth="0.5" />

      {/* Description */}
      <text x="550" y="410" textAnchor="middle" fontSize="14" fill="#78716C" fontFamily="'Source Sans 3', sans-serif">
        has successfully completed all eight chapters and passed the final assessment of
      </text>

      {/* Course title */}
      <text x="550" y="450" textAnchor="middle" fontSize="22" fill="#2563EB" fontWeight="600" fontFamily="'Newsreader', Georgia, serif">
        Neural Odyssey: Interactive AI &amp; Machine Learning
      </text>

      {/* Curriculum details */}
      <text x="550" y="490" textAnchor="middle" fontSize="12" fill="#A8A29E" fontFamily="'Source Sans 3', sans-serif">
        Foundations  ·  The Neuron  ·  Neural Networks  ·  Learning  ·  CNNs  ·  Sequences &amp; Memory  ·  Attention &amp; Transformers  ·  The Modern Landscape
      </text>

      {/* Skills covered */}
      <g transform="translate(550, 530)">
        {[
          'Perceptrons & Activation Functions',
          'Forward & Backpropagation',
          'Convolutional Neural Networks',
          'RNNs, LSTMs & GRUs',
          'Self-Attention & Transformers',
          'Modern Language & Diffusion Models',
        ].map((skill, i) => {
          const cols = 3
          const col = i % cols
          const row = Math.floor(i / cols)
          const colWidth = 280
          const startX = -(cols * colWidth) / 2 + colWidth / 2
          const x = startX + col * colWidth
          const y = row * 22
          return (
            <g key={i}>
              <circle cx={x - 70} cy={y - 4} r="2" fill="#D4A853" />
              <text x={x - 60} y={y} fontSize="11" fill="#57534E" fontFamily="'Source Sans 3', sans-serif">
                {skill}
              </text>
            </g>
          )
        })}
      </g>

      {/* Bottom section divider */}
      <line x1="100" y1="600" x2="1000" y2="600" stroke="#E7E5E4" strokeWidth="0.5" />

      {/* Date and ID */}
      <text x="200" y="650" textAnchor="middle" fontSize="16" fill="#1C1917" fontWeight="600" fontFamily="'Newsreader', Georgia, serif">
        {date}
      </text>
      <line x1="120" y1="660" x2="280" y2="660" stroke="#D6D3D1" strokeWidth="0.5" />
      <text x="200" y="680" textAnchor="middle" fontSize="11" fill="#A8A29E" fontFamily="'Source Sans 3', sans-serif">
        Date of Completion
      </text>

      {/* Signature area */}
      <g transform="translate(550, 620)">
        {/* Scrawled signature — intentionally illegible */}
        <g transform="translate(-55, 0)" fill="none" stroke="#1C1917" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
          {/* J flourish */}
          <path d="M0 12 C2 4, 6 -2, 8 2 C9 5, 7 14, 4 18 C1 22, -2 20, -1 17" />
          {/* oel run */}
          <path d="M10 8 C12 4, 16 3, 18 7 C19 10, 14 13, 17 12 C20 11, 22 6, 25 8 C27 10, 24 14, 27 13" />
          {/* connecting swoop into J */}
          <path d="M27 13 C32 10, 36 5, 38 8" />
          {/* second J */}
          <path d="M38 8 C40 2, 44 -1, 46 3 C47 6, 45 15, 42 19 C39 22, 36 20, 37 17" />
          {/* ohn scribble */}
          <path d="M48 6 C50 2, 55 3, 54 8 C53 12, 49 11, 52 9 C55 7, 58 5, 60 9 C61 12, 58 14, 61 12 C64 10, 66 7, 68 9 C70 11, 68 15, 71 13" />
          {/* trailing flourish */}
          <path d="M71 13 C76 9, 82 7, 90 10 C95 12, 100 8, 108 11" />
          {/* crossbar / underline scribble */}
          <path d="M5 24 C20 22, 50 21, 70 23 C85 24, 95 22, 105 23" strokeWidth="0.6" opacity="0.4" />
        </g>
        <line x1="-80" y1="38" x2="80" y2="38" stroke="#D6D3D1" strokeWidth="0.5" />
        <text x="0" y="54" textAnchor="middle" fontSize="11" fill="#A8A29E" fontFamily="'Source Sans 3', sans-serif">
          Course Director
        </text>
      </g>

      {/* Certificate ID */}
      <text x="900" y="650" textAnchor="middle" fontSize="13" fill="#1C1917" fontWeight="500" fontFamily="'JetBrains Mono', monospace">
        {id}
      </text>
      <line x1="820" y1="660" x2="980" y2="660" stroke="#D6D3D1" strokeWidth="0.5" />
      <text x="900" y="680" textAnchor="middle" fontSize="11" fill="#A8A29E" fontFamily="'Source Sans 3', sans-serif">
        Certificate ID
      </text>

      {/* Bottom accent line */}
      <rect x="30" y="746" width="1040" height="4" fill="url(#accent-grad)" rx="2" />
    </svg>
  )
}

export default function Certificate() {
  const { overallProgress } = useProgress()
  const [name, setName] = useState('')
  const [generated, setGenerated] = useState(false)
  const certRef = useRef<HTMLDivElement>(null)

  const quizResult = getQuizResult()
  const allComplete = overallProgress >= 1
  const canGenerate = allComplete && quizResult?.passed

  const certDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const certId = useCallback(() => {
    const hash = name.split('').reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0)
    const dateHash = Date.now().toString(36).slice(-4).toUpperCase()
    return `NO-${Math.abs(hash).toString(36).toUpperCase().slice(0, 4)}-${dateHash}`
  }, [name])

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim().length >= 2) {
      setGenerated(true)
    }
  }

  function svgToCanvas(): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      if (!certRef.current) return reject('No ref')
      const svgElement = certRef.current.querySelector('svg')
      if (!svgElement) return reject('No SVG')

      const svgData = new XMLSerializer().serializeToString(svgElement)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject('No context')

      canvas.width = 2200
      canvas.height = 1560

      const img = new Image()
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)

      img.onload = () => {
        ctx.fillStyle = '#FAFAF9'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        URL.revokeObjectURL(url)
        resolve(canvas)
      }
      img.onerror = reject
      img.src = url
    })
  }

  async function downloadPNG() {
    const canvas = await svgToCanvas()
    const link = document.createElement('a')
    link.download = `neural-odyssey-certificate-${name.replace(/\s+/g, '-').toLowerCase()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  async function downloadPDF() {
    const canvas = await svgToCanvas()
    const imgData = canvas.toDataURL('image/png')
    // Landscape A4
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    // Fit certificate to page with margins
    const margin = 8
    const availW = pageWidth - margin * 2
    const availH = pageHeight - margin * 2
    const ratio = Math.min(availW / canvas.width, availH / canvas.height)
    const w = canvas.width * ratio
    const h = canvas.height * ratio
    const x = (pageWidth - w) / 2
    const y = (pageHeight - h) / 2
    pdf.addImage(imgData, 'PNG', x, y, w, h)
    pdf.save(`neural-odyssey-certificate-${name.replace(/\s+/g, '-').toLowerCase()}.pdf`)
  }

  if (!canGenerate) {
    return <Navigate to="/quiz" replace />
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary mb-6">
          <Link to="/" className="hover:text-accent no-underline text-text-tertiary">Home</Link>
          <span>/</span>
          <Link to="/quiz" className="hover:text-accent no-underline text-text-tertiary">Assessment</Link>
          <span>/</span>
          <span>Certificate</span>
        </div>

        {!generated ? (
          <div className="max-w-md mx-auto text-center py-12">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-6 text-accent">
              <circle cx="12" cy="8" r="6" />
              <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
            </svg>
            <h1 className="text-3xl font-display font-bold mb-2">Generate Your Certificate</h1>
            <p className="text-text-secondary text-sm mb-8">
              Enter your full name as you would like it to appear on your certificate of completion.
            </p>
            <form onSubmit={handleGenerate}>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 text-center text-lg font-display border border-border rounded-xl bg-surface-elevated text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent mb-4"
                autoFocus
                required
                minLength={2}
              />
              <button
                type="submit"
                disabled={name.trim().length < 2}
                className="w-full px-6 py-3 bg-accent text-white rounded-xl font-body font-semibold text-sm hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Generate Certificate
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-display font-bold m-0">Your Certificate</h1>
              <div className="flex gap-3">
                <button
                  onClick={() => setGenerated(false)}
                  className="px-4 py-2 text-sm font-body border border-border rounded-lg text-text-secondary hover:bg-surface-alt transition-colors"
                >
                  Edit Name
                </button>
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 px-5 py-2 bg-accent text-white rounded-lg font-body font-semibold text-sm hover:bg-accent/90 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 11v2.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V11M8 2v8.5M5 7.5L8 10.5l3-3" />
                  </svg>
                  Download PDF
                </button>
                <button
                  onClick={downloadPNG}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-body text-sm text-text-secondary hover:bg-surface-alt transition-colors"
                >
                  PNG
                </button>
              </div>
            </div>
            <div ref={certRef} className="rounded-xl overflow-hidden shadow-lg border border-border">
              <CertificateSVG name={name.trim()} date={certDate} id={certId()} />
            </div>
            <p className="text-xs text-text-tertiary text-center mt-4">
              Certificate ID: {certId()}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
