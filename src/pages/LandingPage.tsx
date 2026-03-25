import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as d3 from 'd3'
import { chapters } from '../data/chapters'
import { useProgress } from '../context/ProgressContext'

function NeuralNetworkBackground() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = window.innerWidth
    const height = 600

    svg.attr('viewBox', `0 0 ${width} ${height}`)

    // Create layers of nodes
    const layers = [5, 8, 10, 8, 5]
    const nodes: { x: number; y: number; layer: number }[] = []
    const links: { source: number; target: number }[] = []

    const layerSpacing = width / (layers.length + 1)

    layers.forEach((count, layerIdx) => {
      const nodeSpacing = height / (count + 1)
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: layerSpacing * (layerIdx + 1),
          y: nodeSpacing * (i + 1),
          layer: layerIdx,
        })
      }
    })

    // Connect adjacent layers
    let offset = 0
    for (let l = 0; l < layers.length - 1; l++) {
      const currentCount = layers[l]
      const nextCount = layers[l + 1]
      const nextOffset = offset + currentCount
      for (let i = 0; i < currentCount; i++) {
        for (let j = 0; j < nextCount; j++) {
          if (Math.random() > 0.4) {
            links.push({ source: offset + i, target: nextOffset + j })
          }
        }
      }
      offset += currentCount
    }

    // Draw links
    svg.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('x1', d => nodes[d.source].x)
      .attr('y1', d => nodes[d.source].y)
      .attr('x2', d => nodes[d.target].x)
      .attr('y2', d => nodes[d.target].y)
      .attr('stroke', 'var(--color-border)')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0)
      .transition()
      .delay((_, i) => i * 5)
      .duration(1000)
      .attr('opacity', 0.4)

    // Draw nodes
    svg.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 0)
      .attr('fill', 'var(--color-surface)')
      .attr('stroke', 'var(--color-border-strong)')
      .attr('stroke-width', 1)
      .transition()
      .delay((_, i) => i * 30)
      .duration(600)
      .attr('r', 4)

    // Animate signal pulses
    function pulse() {
      const randomLink = links[Math.floor(Math.random() * links.length)]
      if (!randomLink) return
      const source = nodes[randomLink.source]
      const target = nodes[randomLink.target]

      svg.append('circle')
        .attr('cx', source.x)
        .attr('cy', source.y)
        .attr('r', 2)
        .attr('fill', '#3B82F6')
        .attr('opacity', 0.8)
        .transition()
        .duration(800)
        .attr('cx', target.x)
        .attr('cy', target.y)
        .attr('opacity', 0)
        .remove()
    }

    const interval = setInterval(pulse, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
    />
  )
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function LandingPage() {
  const { overallProgress, streak } = useProgress()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface" style={{ minHeight: '85vh' }}>
        <NeuralNetworkBackground />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6" style={{ minHeight: '85vh' }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.p variants={itemVariants} className="text-xs font-mono text-accent uppercase tracking-[0.25em] mb-4">
              Interactive Learning Platform
            </motion.p>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-6">
              Neural Odyssey
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
              Go from knowing nothing about AI to deeply understanding transformers.
              Every concept explained with step-by-step interactive animations, real numbers,
              and runnable code. No prerequisites. No fluff.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link
                to={overallProgress > 0 ? '/dashboard' : '/chapter/1'}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-text-primary text-surface-elevated rounded-xl font-body font-semibold text-base no-underline hover:bg-text-primary/90 transition-colors shadow-lg"
              >
                {overallProgress > 0 ? 'Continue Learning' : 'Start Learning'} →
              </Link>
              {streak > 1 && (
                <span className="text-sm font-mono text-text-tertiary flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C8 7 4 10 4 14a8 8 0 0 0 16 0c0-4-4-7-8-12Z" />
                  </svg>
                  {streak} day streak
                </span>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { title: 'Step-by-Step', desc: 'Click through every algorithm operation one step at a time. See every number change, every calculation happen.' },
              { title: 'Real Numbers', desc: 'No hand-waving. Every weight, gradient, and activation is a real number you can trace through the computation.' },
              { title: 'Runnable Code', desc: 'NumPy from scratch and PyTorch implementations for every concept. Same numbers as the animations.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <h3 className="text-lg font-display font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter Roadmap */}
      <section className="border-t border-border py-16 px-6 bg-surface-alt">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-2">The Journey</h2>
          <p className="text-center text-text-secondary mb-12">8 chapters from foundations to the frontier</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map((chapter, i) => (
              <motion.div
                key={chapter.index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  to={`/chapter/${chapter.index}`}
                  className="block p-5 rounded-xl border border-border bg-surface-elevated hover:shadow-md transition-all no-underline group"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-2xl font-bold text-text-tertiary/40 group-hover:text-accent/40 transition-colors">
                      {String(chapter.index).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-base font-display font-semibold m-0 mb-0.5 text-text-primary group-hover:text-accent transition-colors">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-text-tertiary font-display italic m-0 mb-2">
                        {chapter.subtitle}
                      </p>
                      <p className="text-xs text-text-secondary m-0 leading-relaxed">
                        {chapter.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-xs font-mono text-text-tertiary">
                        <span>{chapter.sections.length} sections</span>
                        <span>•</span>
                        <span>~{chapter.sections.reduce((a, s) => a + s.readingTime, 0)} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center">
        <p className="text-xs text-text-tertiary font-mono">
          Neural Odyssey — An interactive guide to artificial intelligence and machine learning
        </p>
      </footer>
    </div>
  )
}
