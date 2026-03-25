import { useState } from 'react'
import ChapterLayout from '../components/shared/ChapterLayout'
import StepperAnimation, { type Step } from '../components/shared/StepperAnimation'
import CodeBlock from '../components/shared/CodeBlock'
import Callout from '../components/shared/Callout'
import { chapters } from '../data/chapters'

/* ─── RNN Stepper ─── */
function RNNStepper() {
  const words = ['The', 'cat', 'sat', 'on', 'mat']
  // Simulated hidden state vectors (3-dimensional for visualization)
  const hiddenStates = [
    [0, 0, 0],         // initial
    [0.4, 0.2, -0.1],  // after "The"
    [0.6, 0.8, 0.3],   // after "cat"
    [0.3, 0.5, 0.7],   // after "sat"
    [0.2, 0.3, 0.5],   // after "on"
    [0.5, 0.7, 0.4],   // after "mat"
  ]

  const w = 500, h = 260

  const steps: Step[] = [
    {
      explanation: 'An RNN processes a sentence word by word. It maintains a hidden state vector that acts as its "memory" — updated at each time step. The hidden state starts as zeros.',
      render: () => (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xl">
          {words.map((word, i) => (
            <g key={i}>
              <rect x={20 + i * 95} y={180} width={80} height={30} rx={6} fill="var(--color-surface-alt)" stroke="var(--color-border-strong)" />
              <text x={60 + i * 95} y={200} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">{word}</text>
            </g>
          ))}
          {/* RNN cells */}
          {words.map((_, i) => (
            <g key={`c${i}`}>
              <rect x={25 + i * 95} y={90} width={70} height={50} rx={8} fill="var(--color-surface)" stroke="var(--color-border-strong)" />
              <text x={60 + i * 95} y={120} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-tertiary)">RNN</text>
              <line x1={60 + i * 95} y1={180} x2={60 + i * 95} y2={140} stroke="var(--color-border-strong)" strokeWidth={1} />
              {i > 0 && <line x1={25 + i * 95 - 25} y1={115} x2={25 + i * 95} y2={115} stroke="var(--color-border-strong)" strokeWidth={1} />}
            </g>
          ))}
          {/* Initial hidden state */}
          <text x={60} y={75} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--color-text-tertiary)">h₀ = [0, 0, 0]</text>
        </svg>
      ),
    },
    ...words.map((word, idx) => ({
      explanation: `Word "${word}" enters at time step ${idx + 1}. The RNN combines the word embedding with the previous hidden state h${idx} to compute new hidden state h${idx + 1} = [${hiddenStates[idx + 1].join(', ')}]. ${
        idx === 1 ? 'Notice the hidden state changed significantly — "cat" is a content word with strong features.' :
        idx === 3 ? 'Function words like "on" cause smaller state changes — less informational content.' : ''
      }`,
      render: () => (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xl">
          {words.map((w2, i) => (
            <g key={i}>
              <rect x={20 + i * 95} y={180} width={80} height={30} rx={6}
                fill={i === idx ? '#DBEAFE' : i < idx ? '#F0FDFA' : '#F5F5F4'}
                stroke={i === idx ? '#3B82F6' : i < idx ? '#14B8A6' : '#D6D3D1'}
                strokeWidth={i === idx ? 2 : 1} />
              <text x={60 + i * 95} y={200} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)"
                fill={i === idx ? '#3B82F6' : i < idx ? '#14B8A6' : '#57534E'}
                fontWeight={i === idx ? 'bold' : 'normal'}>{w2}</text>
            </g>
          ))}
          {words.map((_, i) => (
            <g key={`c${i}`}>
              <rect x={25 + i * 95} y={90} width={70} height={50} rx={8}
                fill={i === idx ? '#F5F3FF' : i < idx ? '#F0FDFA' : '#FAFAF9'}
                stroke={i === idx ? '#8B5CF6' : i < idx ? '#14B8A6' : '#D6D3D1'}
                strokeWidth={i <= idx ? 2 : 1} />
              {i <= idx ? (
                <text x={60 + i * 95} y={120} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)"
                  fill={i === idx ? '#8B5CF6' : '#14B8A6'} fontWeight="bold">
                  [{hiddenStates[i + 1].map(v => v.toFixed(1)).join(',')}]
                </text>
              ) : (
                <text x={60 + i * 95} y={120} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-tertiary)">RNN</text>
              )}
              <line x1={60 + i * 95} y1={180} x2={60 + i * 95} y2={140} stroke={i <= idx ? '#8B5CF6' : '#D6D3D1'} strokeWidth={i === idx ? 2 : 1} />
              {i > 0 && (
                <line x1={25 + i * 95 - 25} y1={115} x2={25 + i * 95} y2={115}
                  stroke={i <= idx ? '#8B5CF6' : '#D6D3D1'} strokeWidth={i === idx ? 2 : 1}
                  markerEnd={i === idx ? 'url(#rnn-arrow)' : undefined} />
              )}
            </g>
          ))}
          <defs>
            <marker id="rnn-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#8B5CF6" />
            </marker>
          </defs>
          {/* Hidden state bar visualization */}
          <g transform="translate(20, 20)">
            <text x={0} y={0} fontSize={9} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">Hidden state h{idx + 1}:</text>
            {hiddenStates[idx + 1].map((v, d) => (
              <g key={d}>
                <rect x={100 + d * 50} y={-10} width={40} height={14} rx={3}
                  fill={v > 0 ? `rgba(139,92,246,${Math.abs(v)})` : `rgba(239,68,68,${Math.abs(v)})`} />
                <text x={120 + d * 50} y={1} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="var(--color-surface-elevated)" fontWeight="bold">
                  {v.toFixed(1)}
                </text>
              </g>
            ))}
          </g>
        </svg>
      ),
    } as Step)),
    {
      explanation: 'After processing all 5 words, the final hidden state h₅ = [0.5, 0.7, 0.4] encodes the entire sentence. This single vector is the RNN\'s compressed representation of "The cat sat on mat" — capturing word order, context, and meaning in just 3 numbers.',
      render: () => (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xl">
          {words.map((w2, i) => (
            <g key={i}>
              <rect x={20 + i * 95} y={180} width={80} height={30} rx={6} fill="#F0FDFA" stroke="#14B8A6" />
              <text x={60 + i * 95} y={200} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill="#14B8A6">{w2}</text>
            </g>
          ))}
          {words.map((_, i) => (
            <g key={`c${i}`}>
              <rect x={25 + i * 95} y={90} width={70} height={50} rx={8} fill="#F0FDFA" stroke="#14B8A6" strokeWidth={i === 4 ? 2.5 : 1} />
              <text x={60 + i * 95} y={120} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#14B8A6" fontWeight="bold">
                [{hiddenStates[i + 1].map(v => v.toFixed(1)).join(',')}]
              </text>
              <line x1={60 + i * 95} y1={180} x2={60 + i * 95} y2={140} stroke="#14B8A6" strokeWidth={1} />
              {i > 0 && <line x1={25 + i * 95 - 25} y1={115} x2={25 + i * 95} y2={115} stroke="#14B8A6" strokeWidth={1} />}
            </g>
          ))}
          {/* Final output arrow */}
          <line x1={60 + 4 * 95} y1={90} x2={60 + 4 * 95} y2={50} stroke="#14B8A6" strokeWidth={2} />
          <rect x={390} y={20} width={110} height={30} rx={6} fill="#14B8A6" />
          <text x={445} y={40} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-surface-elevated)" fontWeight="bold">
            [{hiddenStates[5].join(', ')}]
          </text>
          <text x={445} y={15} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">Final encoding</text>
        </svg>
      ),
    },
  ]

  return <StepperAnimation id="ch6-rnn" title="RNN Processing a Sentence" steps={steps} height={300} />
}

/* ─── Vanishing Gradient Demo ─── */
function VanishingGradientDemo() {
  const [mode, setMode] = useState<'rnn' | 'lstm'>('rnn')
  const timeSteps = 10

  // Simulated gradient magnitudes
  const rnnGrads = Array.from({ length: timeSteps }, (_, i) => Math.pow(0.6, timeSteps - 1 - i))
  const lstmGrads = Array.from({ length: timeSteps }, (_, i) => 0.7 + 0.25 * Math.sin(i * 0.5))

  const w = 500, h = 250

  const steps: Step[] = Array.from({ length: timeSteps + 1 }, (_, stepIdx) => {
    const currentStep = timeSteps - stepIdx // backprop goes backward
    const grads = mode === 'rnn' ? rnnGrads : lstmGrads

    return {
      explanation: stepIdx === 0
        ? `Starting backpropagation from time step ${timeSteps}. Gradient starts at 1.0. We'll propagate it backward through ${timeSteps} time steps and watch what happens. Toggle between RNN and LSTM to compare.`
        : stepIdx === timeSteps
        ? mode === 'rnn'
          ? `At time step 1 (the beginning of the sequence), the gradient has shrunk to ${rnnGrads[0].toFixed(4)} — effectively zero. The network CAN'T learn from early words. This is the vanishing gradient problem.`
          : `With LSTM, the gradient at time step 1 is still ${lstmGrads[0].toFixed(2)}! The gated memory cell preserves gradients across long sequences. This is why LSTMs revolutionized sequence modeling.`
        : `Backprop reaches time step ${currentStep + 1}: gradient magnitude = ${grads[currentStep].toFixed(4)}. ${
          mode === 'rnn' && grads[currentStep] < 0.1 ? 'Already dangerously small — early layers will barely learn.' :
          mode === 'lstm' ? 'LSTM gates keep the gradient healthy.' : ''
        }`,
      render: () => (
        <div className="w-full max-w-xl mx-auto">
          <div className="flex gap-2 mb-3 justify-center">
            <button onClick={(e) => { e.stopPropagation(); setMode('rnn') }}
              className={`px-3 py-1 text-xs font-mono rounded-lg border ${mode === 'rnn' ? 'bg-red-50 border-red-300 text-red-600 font-semibold' : 'border-gray-200 text-gray-400'}`}>
              Standard RNN
            </button>
            <button onClick={(e) => { e.stopPropagation(); setMode('lstm') }}
              className={`px-3 py-1 text-xs font-mono rounded-lg border ${mode === 'lstm' ? 'bg-green-50 border-green-300 text-green-600 font-semibold' : 'border-gray-200 text-gray-400'}`}>
              LSTM
            </button>
          </div>
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
            {/* Bars */}
            {grads.map((g, i) => {
              const visible = timeSteps - i <= stepIdx
              const barHeight = g * 150
              const barX = 40 + i * 45
              const barColor = mode === 'rnn'
                ? g < 0.1 ? '#EF4444' : g < 0.3 ? '#F59E0B' : '#10B981'
                : '#10B981'

              return (
                <g key={i}>
                  {/* Background bar */}
                  <rect x={barX} y={h - 40 - 150} width={30} height={150} rx={4} fill="var(--color-surface-alt)" />
                  {/* Gradient bar */}
                  {visible && (
                    <rect x={barX} y={h - 40 - barHeight} width={30} height={barHeight} rx={4} fill={barColor} opacity={0.8} />
                  )}
                  {/* Label */}
                  <text x={barX + 15} y={h - 22} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">t={i + 1}</text>
                  {visible && (
                    <text x={barX + 15} y={h - 44 - barHeight} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill={barColor} fontWeight="bold">
                      {g.toFixed(g < 0.01 ? 4 : 2)}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Axis */}
            <line x1={35} y1={h - 40} x2={w - 10} y2={h - 40} stroke="var(--color-border)" strokeWidth={1} />
            <text x={w / 2} y={h - 5} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">Time step</text>
            <text x={15} y={h / 2 - 20} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)" transform={`rotate(-90, 15, ${h / 2 - 20})`}>Gradient</text>

            {/* Backprop arrow */}
            {stepIdx > 0 && stepIdx < timeSteps && (
              <g>
                <line x1={40 + (timeSteps - stepIdx) * 45 + 35} y1={20} x2={40 + (timeSteps - stepIdx) * 45 + 15} y2={20}
                  stroke="#EF4444" strokeWidth={2} markerEnd="url(#bp-arrow)" />
                <text x={40 + (timeSteps - stepIdx) * 45 + 25} y={15} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="#EF4444">backprop</text>
              </g>
            )}
            <defs>
              <marker id="bp-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#EF4444" />
              </marker>
            </defs>
          </svg>
        </div>
      ),
    }
  })

  return <StepperAnimation id="ch6-vanishing-grad" title="Vanishing Gradient: RNN vs LSTM" steps={steps} height={310} />
}

/* ─── LSTM Gate Stepper ─── */
function LSTMGateStepper() {
  // One time step of LSTM with concrete values
  const ht_prev = [0.3, 0.5]
  const ct_prev = [0.8, 0.2]
  const xt = [0.7, 0.4] // input "word embedding"

  // Simulated gate outputs
  const ft = [0.2, 0.9]  // forget gate
  const it = [0.8, 0.3]  // input gate
  const ct_cand = [0.6, -0.4] // candidate cell state
  const ot = [0.7, 0.5]  // output gate

  // Cell state update: ct = ft * ct_prev + it * ct_cand
  const ct = [ft[0]*ct_prev[0] + it[0]*ct_cand[0], ft[1]*ct_prev[1] + it[1]*ct_cand[1]]
  // Hidden state: ht = ot * tanh(ct)
  const ht = [ot[0]*Math.tanh(ct[0]), ot[1]*Math.tanh(ct[1])]

  const steps: Step[] = [
    {
      explanation: `LSTM cell receives: previous hidden state h(t-1) = [${ht_prev.join(', ')}], previous cell state C(t-1) = [${ct_prev.join(', ')}], and new input x(t) = [${xt.join(', ')}]. Four gates will decide what to remember, forget, and output.`,
      render: () => <LSTMDiagram phase="init" />,
    },
    {
      explanation: `Forget gate: f(t) = σ(W_f · [h(t-1), x(t)] + b_f) = [${ft.join(', ')}]. Values near 0 mean "forget this". The first dimension (${ft[0]}) will forget most of its cell state; the second (${ft[1]}) will keep most of it.`,
      render: () => <LSTMDiagram phase="forget" ft={ft} />,
    },
    {
      explanation: `Input gate: i(t) = [${it.join(', ')}] and candidate values: C̃(t) = [${ct_cand.join(', ')}]. The input gate decides what new information to add. High i(t) means "this new info is important."`,
      render: () => <LSTMDiagram phase="input" ft={ft} it={it} ct_cand={ct_cand} />,
    },
    {
      explanation: `Cell state update: C(t) = f(t)⊙C(t-1) + i(t)⊙C̃(t) = [${ft[0]}×${ct_prev[0]}+${it[0]}×${ct_cand[0]}, ${ft[1]}×${ct_prev[1]}+${it[1]}×${ct_cand[1]}] = [${ct[0].toFixed(2)}, ${ct[1].toFixed(2)}]. Old memories partially forgotten, new information partially added.`,
      render: () => <LSTMDiagram phase="cell" ft={ft} it={it} ct_cand={ct_cand} ct={ct} />,
    },
    {
      explanation: `Output gate: o(t) = [${ot.join(', ')}]. Hidden state: h(t) = o(t)⊙tanh(C(t)) = [${ht[0].toFixed(3)}, ${ht[1].toFixed(3)}]. The output gate controls what part of the cell state is exposed. This h(t) is the LSTM's output for this time step.`,
      render: () => <LSTMDiagram phase="output" ft={ft} it={it} ct_cand={ct_cand} ct={ct} ot={ot} ht={ht} />,
    },
  ]

  return <StepperAnimation id="ch6-lstm-gates" title="LSTM Gate Operations" steps={steps} height={300} />
}

function LSTMDiagram({ phase, ft, it, ct_cand, ct, ot, ht }: {
  phase: string, ft?: number[], it?: number[], ct_cand?: number[], ct?: number[], ot?: number[], ht?: number[]
}) {
  const gateW = 70, gateH = 40

  return (
    <svg viewBox="0 0 520 260" className="w-full max-w-xl">
      {/* Cell state highway */}
      <line x1={20} y1={40} x2={500} y2={40} stroke="#F59E0B" strokeWidth={3} />
      <text x={260} y={25} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#F59E0B">Cell State (memory highway)</text>

      {/* Gates */}
      {/* Forget gate */}
      <rect x={60} y={80} width={gateW} height={gateH} rx={6}
        fill={phase === 'forget' || ft ? '#FEE2E2' : '#F5F5F4'}
        stroke={ft ? '#EF4444' : '#D6D3D1'} strokeWidth={ft ? 2 : 1} />
      <text x={95} y={97} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill={ft ? '#EF4444' : '#A8A29E'}>Forget</text>
      {ft && <text x={95} y={112} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="#EF4444" fontWeight="bold">[{ft.join(', ')}]</text>}

      {/* Input gate */}
      <rect x={180} y={80} width={gateW} height={gateH} rx={6}
        fill={phase === 'input' || it ? '#DBEAFE' : '#F5F5F4'}
        stroke={it ? '#3B82F6' : '#D6D3D1'} strokeWidth={it ? 2 : 1} />
      <text x={215} y={97} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill={it ? '#3B82F6' : '#A8A29E'}>Input</text>
      {it && <text x={215} y={112} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">[{it.join(', ')}]</text>}

      {/* Candidate */}
      {ct_cand && (
        <g>
          <rect x={180} y={135} width={gateW} height={35} rx={6} fill="#F5F3FF" stroke="#8B5CF6" />
          <text x={215} y={150} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="#8B5CF6">C̃ = [{ct_cand.join(', ')}]</text>
        </g>
      )}

      {/* Cell state value */}
      {ct && (
        <g>
          <rect x={300} y={30} width={90} height={22} rx={4} fill="#FEF3C7" stroke="#F59E0B" />
          <text x={345} y={45} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#F59E0B" fontWeight="bold">
            C = [{ct.map(v => v.toFixed(2)).join(', ')}]
          </text>
        </g>
      )}

      {/* Output gate */}
      <rect x={350} y={80} width={gateW} height={gateH} rx={6}
        fill={ot ? '#F0FDFA' : '#F5F5F4'}
        stroke={ot ? '#14B8A6' : '#D6D3D1'} strokeWidth={ot ? 2 : 1} />
      <text x={385} y={97} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill={ot ? '#14B8A6' : '#A8A29E'}>Output</text>
      {ot && <text x={385} y={112} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="#14B8A6" fontWeight="bold">[{ot.join(', ')}]</text>}

      {/* Hidden state output */}
      {ht && (
        <g>
          <rect x={350} y={140} width={gateW} height={30} rx={6} fill="#14B8A6" />
          <text x={385} y={160} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--color-surface-elevated)" fontWeight="bold">
            h = [{ht.map(v => v.toFixed(2)).join(', ')}]
          </text>
        </g>
      )}

      {/* Input labels */}
      <rect x={60} y={200} width={80} height={25} rx={4} fill="var(--color-accent-light)" stroke="#3B82F6" />
      <text x={100} y={217} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#3B82F6">x(t) input</text>

      <rect x={200} y={200} width={80} height={25} rx={4} fill="#F5F3FF" stroke="#8B5CF6" />
      <text x={240} y={217} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#8B5CF6">h(t-1)</text>

      {/* Connection arrows */}
      <line x1={95} y1={55} x2={95} y2={80} stroke="var(--color-border-strong)" strokeWidth={1} />
      <line x1={215} y1={55} x2={215} y2={80} stroke="var(--color-border-strong)" strokeWidth={1} />
      <line x1={385} y1={55} x2={385} y2={80} stroke="var(--color-border-strong)" strokeWidth={1} />
    </svg>
  )
}

/* ─── Main Chapter ─── */
export default function Chapter6() {
  const chapter = chapters[5]

  return (
    <ChapterLayout chapter={chapter}>
      <section id="ch6-why-sequences">
        <h2>Why Order Matters</h2>

        <p>
          "Dog bites man" and "man bites dog" contain the same three words, but they mean completely different things. The order of elements in a sequence carries meaning — sometimes all the meaning. This is true for language, music, stock prices, DNA sequences, and any data where the arrangement of elements matters as much as the elements themselves.
        </p>

        <p>
          The neural networks we've seen so far — feedforward networks and CNNs — process fixed-size inputs with no notion of order. You could scramble the pixels of an image and a CNN could be trained to handle it. But you can't scramble the words of a sentence and expect it to mean the same thing. Sequential data requires a fundamentally different architecture — one that has <strong>memory</strong>.
        </p>

        <p>
          A network for sequential data must do two things: process inputs one at a time (since sequences arrive step by step) and maintain a representation of what it has seen so far (memory). This is exactly what <strong>Recurrent Neural Networks</strong> (RNNs) do.
        </p>

        <Callout type="practice">
          <p>
            <strong>Sequential data is everywhere.</strong> Text (sequences of words), speech (sequences of audio frames), time series (sequences of measurements), DNA (sequences of nucleotides), music (sequences of notes), video (sequences of frames), user behavior (sequences of clicks). Any domain where the order of observations carries information calls for sequence models.
          </p>
        </Callout>
      </section>

      <section id="ch6-rnn">
        <h2>Recurrent Neural Networks</h2>

        <p>
          An RNN processes a sequence one element at a time, maintaining a <strong>hidden state</strong> that serves as its memory. At each time step, the RNN receives two inputs: the current element (say, a word embedding) and the previous hidden state. It combines them through a learned function to produce a new hidden state. This new hidden state is then used at the next time step, creating a chain of computations that threads through the entire sequence.
        </p>

        <p>
          The recurrence equation is: <strong>h(t) = tanh(W_h · h(t-1) + W_x · x(t) + b)</strong>. The hidden state h(t) depends on both the input x(t) and the previous hidden state h(t-1). This creates a feedback loop — the network's output at one step influences its behavior at the next. When "unrolled" across time, an RNN looks like a very deep feedforward network, with one layer per time step, all sharing the same weights.
        </p>

        <p>
          Watch an RNN process a sentence word by word. At each step, the hidden state vector changes, accumulating information about the words seen so far.
        </p>

        <RNNStepper />

        <Callout type="deepdive" expandable title="Weight Sharing in RNNs">
          <p>
            A key property of RNNs is <strong>weight sharing across time</strong>. The same matrices W_h and W_x are used at every time step. This means the network applies the same transformation at each step — just like a CNN applies the same filter at every spatial position. Weight sharing makes the network parameter-efficient (the same weights handle sequences of any length) and forces it to learn transformations that are useful regardless of position in the sequence.
          </p>
        </Callout>
      </section>

      <section id="ch6-vanishing-gradients">
        <h2>The Vanishing Gradient Problem</h2>

        <p>
          RNNs have a fundamental flaw: they can't learn long-range dependencies. If the answer to a question depends on a word 50 steps earlier in the sequence, the gradient signal from that answer has to propagate backward through 50 time steps to reach the relevant word. At each step, the gradient is multiplied by the recurrent weight matrix. If this matrix has eigenvalues less than 1 (which is common), the gradient shrinks exponentially — by step 50, it's essentially zero.
        </p>

        <p>
          This is the <strong>vanishing gradient problem</strong>, and it crippled RNNs for decades. The network could learn short-term patterns (a word predicting the next word) but not long-term dependencies ("The keys, which I left on the table this morning before going to..." — the verb at the end must agree with "keys," 15 words back).
        </p>

        <p>
          The interactive below shows this dramatically. Watch the gradient magnitude during backpropagation through 10 time steps. In a standard RNN, the gradient decays to nearly zero. Switch to LSTM to see how gated memory solves this.
        </p>

        <VanishingGradientDemo />

        <Callout type="misconception">
          <p>
            <strong>The "vanishing" gradient isn't always bad.</strong> Gradients from recent time steps SHOULD have more influence than gradients from distant ones for many tasks. The problem isn't that gradients decay — it's that they decay too fast, becoming zero when they should be small but nonzero. The solution (LSTM, GRU) doesn't eliminate gradient decay; it gives the network control over how much to decay.
          </p>
        </Callout>
      </section>

      <section id="ch6-lstm">
        <h2>Long Short-Term Memory</h2>

        <p>
          In 1997, Sepp Hochreiter and Jürgen Schmidhuber published a paper that solved the vanishing gradient problem with an elegantly engineered solution: the <strong>Long Short-Term Memory</strong> (LSTM) cell. The key innovation is a separate <strong>cell state</strong> — a "memory highway" that runs through the entire sequence with only minimal transformations, allowing gradients to flow backward unimpeded.
        </p>

        <p>
          The LSTM has four components, each a neural network layer:
        </p>

        <p>
          The <strong>forget gate</strong> decides what to remove from the cell state. It outputs values between 0 (completely forget) and 1 (completely keep) for each dimension. A forget gate might learn to reset the subject of a sentence when a new clause begins.
        </p>

        <p>
          The <strong>input gate</strong> decides what new information to add. It has two parts: a sigmoid that decides which dimensions to update, and a tanh that creates candidate values. Together, they control what and how much to write to memory.
        </p>

        <p>
          The <strong>cell state update</strong> combines forgetting and adding: multiply the old cell state by the forget gate (erasing selected memories), then add the input gate's contribution (writing new memories).
        </p>

        <p>
          The <strong>output gate</strong> decides what to expose as the hidden state. Not everything in memory needs to be visible — the output gate selects which aspects of the cell state are relevant for the current output.
        </p>

        <p>
          Step through one time step of an LSTM below. Watch each gate activate, see the cell state update, and observe how the hidden state is computed.
        </p>

        <LSTMGateStepper />

        <CodeBlock
          tabs={[
            {
              label: 'From Scratch',
              language: 'python',
              code: `import numpy as np

def sigmoid(x): return 1 / (1 + np.exp(-x))

class RNNCell:
    """Simple RNN cell"""
    def __init__(self, input_size, hidden_size):
        self.Wh = np.random.randn(hidden_size, hidden_size) * 0.1
        self.Wx = np.random.randn(hidden_size, input_size) * 0.1
        self.b = np.zeros(hidden_size)

    def forward(self, x, h_prev):
        return np.tanh(self.Wh @ h_prev + self.Wx @ x + self.b)

class LSTMCell:
    """LSTM cell with forget, input, output gates"""
    def __init__(self, input_size, hidden_size):
        n = hidden_size
        # Concatenated weight matrices for efficiency
        self.Wf = np.random.randn(n, n + input_size) * 0.1
        self.Wi = np.random.randn(n, n + input_size) * 0.1
        self.Wc = np.random.randn(n, n + input_size) * 0.1
        self.Wo = np.random.randn(n, n + input_size) * 0.1
        self.bf = np.ones(n)  # Initialize forget bias to 1
        self.bi = np.zeros(n)
        self.bc = np.zeros(n)
        self.bo = np.zeros(n)

    def forward(self, x, h_prev, c_prev):
        combined = np.concatenate([h_prev, x])
        ft = sigmoid(self.Wf @ combined + self.bf)  # Forget
        it = sigmoid(self.Wi @ combined + self.bi)   # Input
        ct_cand = np.tanh(self.Wc @ combined + self.bc)
        ct = ft * c_prev + it * ct_cand              # Cell update
        ot = sigmoid(self.Wo @ combined + self.bo)   # Output
        ht = ot * np.tanh(ct)                        # Hidden state
        return ht, ct

# Example usage
lstm = LSTMCell(input_size=4, hidden_size=3)
h = np.zeros(3)
c = np.zeros(3)

words = [np.random.randn(4) for _ in range(5)]
for i, word in enumerate(words):
    h, c = lstm.forward(word, h, c)
    print(f"Step {i+1}: h = {h.round(3)}")`,
              output: `Step 1: h = [0.012 -0.034  0.089]
Step 2: h = [0.045 -0.067  0.123]
Step 3: h = [0.078 -0.023  0.156]
Step 4: h = [0.034 -0.089  0.091]
Step 5: h = [0.056 -0.045  0.134]`,
            },
            {
              label: 'PyTorch',
              language: 'python',
              code: `import torch
import torch.nn as nn

# PyTorch LSTM — handles sequences automatically
lstm = nn.LSTM(input_size=4, hidden_size=3, batch_first=True)

# Process a sequence of 5 "words" (each with 4 features)
sequence = torch.randn(1, 5, 4)  # [batch=1, seq_len=5, features=4]

# Forward pass — outputs hidden states at ALL time steps
outputs, (h_final, c_final) = lstm(sequence)

print(f"Input shape:  {sequence.shape}")
print(f"All outputs:  {outputs.shape}")    # [1, 5, 3]
print(f"Final hidden: {h_final.shape}")    # [1, 1, 3]
print(f"Final cell:   {c_final.shape}")    # [1, 1, 3]

# For classification, use the final hidden state
class SentimentLSTM(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True)
        self.classifier = nn.Linear(hidden_dim, 2)

    def forward(self, x):
        embedded = self.embed(x)
        _, (h_final, _) = self.lstm(embedded)
        return self.classifier(h_final.squeeze(0))

model = SentimentLSTM(10000, 128, 64)
print(f"\\nParams: {sum(p.numel() for p in model.parameters()):,}")`,
              output: `Input shape:  torch.Size([1, 5, 4])
All outputs:  torch.Size([1, 5, 3])
Final hidden: torch.Size([1, 1, 3])
Final cell:   torch.Size([1, 1, 3])

Params: 1,379,330`,
            },
          ]}
        />
      </section>

      <section id="ch6-gru">
        <h2>GRU and Beyond</h2>

        <p>
          The <strong>Gated Recurrent Unit</strong> (GRU), proposed by Cho et al. in 2014, simplifies the LSTM by merging the forget and input gates into a single <strong>update gate</strong>, and merging the cell state and hidden state. The result: fewer parameters, faster training, and comparable performance on most tasks. GRU has two gates instead of three, and no separate cell state.
        </p>

        <p>
          The update gate z(t) decides how much of the old hidden state to keep vs. how much to overwrite with new content. The reset gate r(t) decides how much of the previous state to use when computing the new candidate state. These two gates give the GRU fine-grained control over its memory without the complexity of LSTM's four-gate architecture.
        </p>

        <Callout type="practice">
          <p>
            <strong>LSTM vs GRU — which to use?</strong> For most tasks, performance is comparable. GRU trains faster (fewer parameters). LSTM can model more complex dependencies (more expressive). Start with GRU; switch to LSTM if you need better performance on long sequences. In practice, both are being replaced by Transformers (Chapter 7) for most sequence tasks — but LSTMs remain competitive for time series, audio processing, and edge deployment where model size matters.
          </p>
        </Callout>

        <p>
          <strong>Bidirectional RNNs</strong> process sequences in both directions — forward and backward — and concatenate the hidden states. This gives the network access to both past and future context at every position. For tasks like named entity recognition ("Is 'Apple' a company or a fruit here?"), future context is as informative as past context.
        </p>

        <p>
          <strong>Stacked RNNs</strong> place multiple RNN layers on top of each other. The first layer processes the raw input sequence; the second layer processes the first layer's output sequence. This creates a hierarchy: lower layers capture low-level patterns (character n-grams, word morphology), while upper layers capture higher-level patterns (phrases, sentences). Deep RNNs (2-4 layers) consistently outperform single-layer RNNs.
        </p>

        <Callout type="info">
          <p>
            <strong>The era of RNNs peaked around 2016-2017.</strong> LSTM-based models achieved state-of-the-art results in machine translation (Google Translate switched to LSTM in 2016), speech recognition, and text generation. Then the Transformer architecture arrived and surpassed RNNs on nearly every benchmark. The next chapter explains how and why.
          </p>
        </Callout>
      </section>
    </ChapterLayout>
  )
}
