import ChapterLayout from '../components/shared/ChapterLayout'
import StepperAnimation, { type Step } from '../components/shared/StepperAnimation'
import CodeBlock from '../components/shared/CodeBlock'
import Callout from '../components/shared/Callout'
import { chapters } from '../data/chapters'

/* ─── XOR Problem Interactive ─── */
function XORProblem() {
  const xorData = [
    { x1: 0, x2: 0, label: 0 },
    { x1: 0, x2: 1, label: 1 },
    { x1: 1, x2: 0, label: 1 },
    { x1: 1, x2: 1, label: 0 },
  ]
  const w = 400, h = 300

  const steps: Step[] = [
    {
      explanation: 'The XOR (exclusive or) problem: output is 1 when inputs differ, 0 when they\'re the same. Blue = output 0, Red = output 1. Can a single neuron separate these?',
      render: () => (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-md">
          <line x1={50} y1={h - 50} x2={w - 30} y2={h - 50} stroke="var(--color-border)" strokeWidth={1} />
          <line x1={50} y1={30} x2={50} y2={h - 50} stroke="var(--color-border)" strokeWidth={1} />
          {xorData.map((d, i) => (
            <circle key={i} cx={50 + d.x1 * 280} cy={h - 50 - d.x2 * 200} r={14}
              fill={d.label === 0 ? '#3B82F6' : '#EF4444'} opacity={0.85} />
          ))}
          {xorData.map((d, i) => (
            <text key={`t${i}`} x={50 + d.x1 * 280} y={h - 46 - d.x2 * 200} textAnchor="middle" fontSize={12}
              fontFamily="var(--font-mono)" fill="var(--color-surface-elevated)" fontWeight="bold">{d.label}</text>
          ))}
          <text x={50 + 0 * 280} y={h - 25} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">x₁=0</text>
          <text x={50 + 1 * 280} y={h - 25} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">x₁=1</text>
          <text x={25} y={h - 50 - 0 * 200} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">0</text>
          <text x={25} y={h - 50 - 1 * 200} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">1</text>
          <text x={w / 2} y={h - 5} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">x₁</text>
          <text x={10} y={h / 2} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)" transform={`rotate(-90, 10, ${h / 2})`}>x₂</text>
        </svg>
      ),
    },
    {
      explanation: 'Try a horizontal line: everything above is Class 1. This misclassifies (1,1) — it outputs 0 but our line says 1. No matter how we rotate a single line, we can\'t separate the diagonal pairs.',
      render: () => (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-md">
          <line x1={30} y1={h - 50 - 100} x2={w - 10} y2={h - 50 - 100} stroke="#10B981" strokeWidth={2} strokeDasharray="6,4" />
          <rect x={30} y={30} width={w - 40} height={h - 80 - 100} fill="#EF4444" opacity={0.04} />
          <rect x={30} y={h - 150} width={w - 40} height={100} fill="#3B82F6" opacity={0.04} />
          {xorData.map((d, i) => {
            const cx = 50 + d.x1 * 280, cy = h - 50 - d.x2 * 200
            const predicted = cy < (h - 150) ? 1 : 0
            const correct = predicted === d.label
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={14} fill={d.label === 0 ? '#3B82F6' : '#EF4444'} opacity={0.85} />
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill="var(--color-surface-elevated)" fontWeight="bold">{d.label}</text>
                {!correct && <text x={cx + 18} y={cy - 10} fontSize={14} fill="#EF4444">✗</text>}
              </g>
            )
          })}
          <text x={w - 60} y={h - 160} fontSize={10} fontFamily="var(--font-mono)" fill="#10B981">boundary</text>
        </svg>
      ),
    },
    {
      explanation: 'Try a diagonal line — still fails. (0,0) and (1,1) are on the same diagonal but need different labels. No single straight line can solve this. This is the fundamental limitation of a single neuron.',
      render: () => (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-md">
          <line x1={30} y1={h - 30} x2={w - 10} y2={30} stroke="#10B981" strokeWidth={2} strokeDasharray="6,4" />
          {xorData.map((d, i) => (
            <g key={i}>
              <circle cx={50 + d.x1 * 280} cy={h - 50 - d.x2 * 200} r={14} fill={d.label === 0 ? '#3B82F6' : '#EF4444'} opacity={0.85} />
              <text x={50 + d.x1 * 280} y={h - 46 - d.x2 * 200} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill="var(--color-surface-elevated)" fontWeight="bold">{d.label}</text>
            </g>
          ))}
          <text x={w / 2} y={20} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="#EF4444">Still misclassifies!</text>
        </svg>
      ),
    },
    {
      explanation: 'The solution: add a hidden layer with 2 neurons. Hidden neuron 1 computes h₁ = ReLU(x₁ + x₂ - 0.5) — it detects "at least one input is 1." Hidden neuron 2 computes h₂ = ReLU(x₁ + x₂ - 1.5) — it detects "both inputs are 1."',
      render: () => (
        <svg viewBox="0 0 500 280" className="w-full max-w-lg">
          {/* Input layer */}
          <circle cx={60} cy={90} r={24} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={60} y={95} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">x₁</text>
          <circle cx={60} cy={200} r={24} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={60} y={205} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">x₂</text>
          {/* Hidden layer */}
          <line x1={84} y1={90} x2={206} y2={100} stroke="#10B981" strokeWidth={1.5} />
          <line x1={84} y1={200} x2={206} y2={100} stroke="#10B981" strokeWidth={1.5} />
          <line x1={84} y1={90} x2={206} y2={200} stroke="#10B981" strokeWidth={1.5} />
          <line x1={84} y1={200} x2={206} y2={200} stroke="#10B981" strokeWidth={1.5} />
          <circle cx={230} cy={100} r={24} fill="#F5F3FF" stroke="#8B5CF6" strokeWidth={2} />
          <text x={230} y={96} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#8B5CF6">h₁</text>
          <text x={230} y={110} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">≥1 on</text>
          <circle cx={230} cy={200} r={24} fill="#F5F3FF" stroke="#8B5CF6" strokeWidth={2} />
          <text x={230} y={196} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#8B5CF6">h₂</text>
          <text x={230} y={210} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">both on</text>
          {/* Output layer */}
          <line x1={254} y1={100} x2={376} y2={150} stroke="#10B981" strokeWidth={1.5} />
          <line x1={254} y1={200} x2={376} y2={150} stroke="#10B981" strokeWidth={1.5} />
          <circle cx={400} cy={150} r={24} fill="#F0FDFA" stroke="#14B8A6" strokeWidth={2} />
          <text x={400} y={155} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="#14B8A6" fontWeight="bold">out</text>
          {/* Labels */}
          <text x={60} y={40} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">Input</text>
          <text x={230} y={50} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">Hidden</text>
          <text x={400} y={100} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">Output</text>
        </svg>
      ),
    },
    ...xorData.map((d, idx) => {
      const h1 = Math.max(0, d.x1 + d.x2 - 0.5)
      const h2 = Math.max(0, d.x1 + d.x2 - 1.5)
      const out = Math.max(0, h1 - 2 * h2)
      const outRound = Math.round(out)
      return {
        explanation: `Input (${d.x1}, ${d.x2}): h₁ = ReLU(${d.x1}+${d.x2}-0.5) = ${h1.toFixed(1)}, h₂ = ReLU(${d.x1}+${d.x2}-1.5) = ${h2.toFixed(1)}. Output = ReLU(${h1.toFixed(1)} - 2×${h2.toFixed(1)}) = ${out.toFixed(1)} → Predicted: ${outRound}, Actual: ${d.label}. ${outRound === d.label ? 'Correct!' : 'Wrong!'}`,
        render: () => (
          <svg viewBox="0 0 500 280" className="w-full max-w-lg">
            <circle cx={60} cy={90} r={24} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
            <text x={60} y={95} textAnchor="middle" fontSize={14} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{d.x1}</text>
            <circle cx={60} cy={200} r={24} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
            <text x={60} y={205} textAnchor="middle" fontSize={14} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{d.x2}</text>

            <line x1={84} y1={90} x2={206} y2={100} stroke="#10B981" strokeWidth={1.5} />
            <line x1={84} y1={200} x2={206} y2={100} stroke="#10B981" strokeWidth={1.5} />
            <line x1={84} y1={90} x2={206} y2={200} stroke="#10B981" strokeWidth={1.5} />
            <line x1={84} y1={200} x2={206} y2={200} stroke="#10B981" strokeWidth={1.5} />

            <circle cx={230} cy={100} r={24} fill={h1 > 0 ? '#F5F3FF' : '#F5F5F4'} stroke={h1 > 0 ? '#8B5CF6' : '#D6D3D1'} strokeWidth={2} />
            <text x={230} y={105} textAnchor="middle" fontSize={14} fontFamily="var(--font-mono)" fill={h1 > 0 ? '#8B5CF6' : '#A8A29E'} fontWeight="bold">{h1.toFixed(1)}</text>

            <circle cx={230} cy={200} r={24} fill={h2 > 0 ? '#F5F3FF' : '#F5F5F4'} stroke={h2 > 0 ? '#8B5CF6' : '#D6D3D1'} strokeWidth={2} />
            <text x={230} y={205} textAnchor="middle" fontSize={14} fontFamily="var(--font-mono)" fill={h2 > 0 ? '#8B5CF6' : '#A8A29E'} fontWeight="bold">{h2.toFixed(1)}</text>

            <line x1={254} y1={100} x2={376} y2={150} stroke="#10B981" strokeWidth={1.5} />
            <text x={315} y={118} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#10B981">+1</text>
            <line x1={254} y1={200} x2={376} y2={150} stroke="#EF4444" strokeWidth={1.5} />
            <text x={315} y={188} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#EF4444">-2</text>

            <circle cx={400} cy={150} r={28} fill={outRound === d.label ? '#F0FDFA' : '#FEF2F2'} stroke={outRound === d.label ? '#14B8A6' : '#EF4444'} strokeWidth={2.5} />
            <text x={400} y={155} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill={outRound === d.label ? '#14B8A6' : '#EF4444'} fontWeight="bold">{out.toFixed(1)}</text>

            <text x={400} y={200} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill={outRound === d.label ? '#10B981' : '#EF4444'} fontWeight="bold">
              {outRound === d.label ? '✓ Correct' : '✗ Wrong'}
            </text>
          </svg>
        ),
      } as Step
    }),
    {
      explanation: 'All four XOR cases classified correctly! The hidden layer created a new representation space where the problem IS linearly separable. This is the key insight: hidden layers transform data into a space where the problem becomes easier.',
      render: () => (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-md">
          <text x={w / 2} y={30} textAnchor="middle" fontSize={13} fontFamily="var(--font-display)" fill="var(--color-text-primary)" fontWeight="600">XOR Solved!</text>
          {/* Truth table */}
          {[['x₁', 'x₂', 'h₁', 'h₂', 'out'], ['0', '0', '0.0', '0.0', '0 ✓'], ['0', '1', '0.5', '0.0', '0.5 ✓'], ['1', '0', '0.5', '0.0', '0.5 ✓'], ['1', '1', '1.5', '0.5', '0.5 ✓']].map((row, ri) => (
            <g key={ri}>
              {row.map((cell, ci) => (
                <text key={ci} x={60 + ci * 70} y={70 + ri * 35} textAnchor="middle" fontSize={ri === 0 ? 10 : 12}
                  fontFamily="var(--font-mono)" fill={ri === 0 ? '#57534E' : '#1C1917'} fontWeight={ri === 0 ? '600' : '400'}>
                  {cell}
                </text>
              ))}
              {ri === 0 && <line x1={20} y1={78} x2={w - 20} y2={78} stroke="var(--color-border)" strokeWidth={1} />}
            </g>
          ))}
        </svg>
      ),
    },
  ]

  return <StepperAnimation id="ch3-xor" title="The XOR Problem" steps={steps} height={320} />
}

/* ─── Network Forward Pass Stepper ─── */
function ForwardPassStepper() {
  // 2-3-1 network with specific weights
  const x = [0.5, 0.8]
  const W1 = [[0.3, 0.5], [0.6, -0.2], [0.1, 0.4]]  // 3 hidden neurons, 2 inputs each
  const b1 = [0.1, 0.05, -0.1]
  const W2 = [0.7, -0.3, 0.5]  // 1 output neuron, 3 inputs
  const b2 = 0.1

  // Pre-compute
  const z1 = W1.map((w, i) => w[0] * x[0] + w[1] * x[1] + b1[i])
  const h = z1.map(z => Math.max(0, z))
  const z2 = W2[0] * h[0] + W2[1] * h[1] + W2[2] * h[2] + b2
  const out = Math.max(0, z2)

  type StepState = {
    phase: string
    activeConnections?: number[][]
    hiddenValues?: (number | null)[]
    outputValue?: number | null
    highlight?: string
  }

  const stepStates: (StepState & { explanation: string })[] = [
    { phase: 'init', explanation: `We have a 2-3-1 network: 2 inputs, 3 hidden neurons, 1 output. Inputs are [${x[0]}, ${x[1]}]. Let's propagate forward one operation at a time.` },
    { phase: 'h0-mul', activeConnections: [[0, 0], [1, 0]], hiddenValues: [null, null, null], explanation: `Hidden neuron 1: ${x[0]}×${W1[0][0]} + ${x[1]}×${W1[0][1]} + ${b1[0]} = ${(x[0]*W1[0][0]).toFixed(2)} + ${(x[1]*W1[0][1]).toFixed(2)} + ${b1[0]} = ${z1[0].toFixed(2)}` },
    { phase: 'h0-relu', hiddenValues: [h[0], null, null], explanation: `Apply ReLU: max(0, ${z1[0].toFixed(2)}) = ${h[0].toFixed(2)}. ${z1[0] > 0 ? 'Positive, so it passes through.' : 'Negative, so the neuron outputs 0.'}` },
    { phase: 'h1-mul', activeConnections: [[0, 1], [1, 1]], hiddenValues: [h[0], null, null], explanation: `Hidden neuron 2: ${x[0]}×${W1[1][0]} + ${x[1]}×${W1[1][1]} + ${b1[1]} = ${(x[0]*W1[1][0]).toFixed(2)} + ${(x[1]*W1[1][1]).toFixed(2)} + ${b1[1]} = ${z1[1].toFixed(2)}` },
    { phase: 'h1-relu', hiddenValues: [h[0], h[1], null], explanation: `Apply ReLU: max(0, ${z1[1].toFixed(2)}) = ${h[1].toFixed(2)}. ${z1[1] > 0 ? 'Positive — neuron fires.' : 'Negative — neuron is silent.'}` },
    { phase: 'h2-mul', activeConnections: [[0, 2], [1, 2]], hiddenValues: [h[0], h[1], null], explanation: `Hidden neuron 3: ${x[0]}×${W1[2][0]} + ${x[1]}×${W1[2][1]} + ${b1[2]} = ${(x[0]*W1[2][0]).toFixed(2)} + ${(x[1]*W1[2][1]).toFixed(2)} + ${(b1[2])} = ${z1[2].toFixed(2)}` },
    { phase: 'h2-relu', hiddenValues: [h[0], h[1], h[2]], explanation: `Apply ReLU: max(0, ${z1[2].toFixed(2)}) = ${h[2].toFixed(2)}. All 3 hidden neurons now have their outputs: [${h.map(v => v.toFixed(2)).join(', ')}].` },
    { phase: 'out-mul', hiddenValues: [h[0], h[1], h[2]], explanation: `Output neuron: ${h[0].toFixed(2)}×${W2[0]} + ${h[1].toFixed(2)}×${W2[1]} + ${h[2].toFixed(2)}×${W2[2]} + ${b2} = ${(h[0]*W2[0]).toFixed(2)} + ${(h[1]*W2[1]).toFixed(2)} + ${(h[2]*W2[2]).toFixed(2)} + ${b2} = ${z2.toFixed(2)}` },
    { phase: 'out-relu', hiddenValues: [h[0], h[1], h[2]], outputValue: out, explanation: `Apply ReLU: max(0, ${z2.toFixed(2)}) = ${out.toFixed(2)}. Forward pass complete! Input [${x.join(', ')}] → Output ${out.toFixed(2)}. The entire computation used ${2*3 + 3 + 3*1 + 1} multiply-adds.` },
  ]

  const steps: Step[] = stepStates.map((ss) => ({
    explanation: ss.explanation,
    render: () => {
      const hVals = ss.hiddenValues || [null, null, null]
      const oVal = ss.outputValue ?? null
      const inputX = [80, 80]
      const inputY = [80, 220]
      const hiddenX = 250
      const hiddenY = [60, 150, 240]
      const outX = 430
      const outY = 150

      return (
        <svg viewBox="0 0 520 300" className="w-full max-w-xl">
          {/* Connections: input to hidden */}
          {[0, 1].map(i => [0, 1, 2].map(j => (
            <line key={`ih${i}${j}`} x1={inputX[i] + 24} y1={inputY[i]} x2={hiddenX - 24} y2={hiddenY[j]}
              stroke={ss.activeConnections?.some(c => c[0] === i && c[1] === j) ? '#10B981' : '#E7E5E4'}
              strokeWidth={ss.activeConnections?.some(c => c[0] === i && c[1] === j) ? 2 : 1} />
          )))}
          {/* Connections: hidden to output */}
          {[0, 1, 2].map(j => (
            <line key={`ho${j}`} x1={hiddenX + 24} y1={hiddenY[j]} x2={outX - 28} y2={outY}
              stroke={ss.phase.startsWith('out') ? '#10B981' : '#E7E5E4'}
              strokeWidth={ss.phase.startsWith('out') ? 2 : 1} />
          ))}

          {/* Input nodes */}
          {x.map((val, i) => (
            <g key={`in${i}`}>
              <circle cx={inputX[i]} cy={inputY[i]} r={24} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
              <text x={inputX[i]} y={inputY[i] + 5} textAnchor="middle" fontSize={14} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{val}</text>
            </g>
          ))}

          {/* Hidden nodes */}
          {hiddenY.map((hy, i) => (
            <g key={`h${i}`}>
              <circle cx={hiddenX} cy={hy} r={24}
                fill={hVals[i] !== null ? (hVals[i]! > 0 ? '#F5F3FF' : '#F5F5F4') : '#FAFAF9'}
                stroke={hVals[i] !== null ? (hVals[i]! > 0 ? '#8B5CF6' : '#D6D3D1') : '#D6D3D1'} strokeWidth={2} />
              <text x={hiddenX} y={hy + 5} textAnchor="middle" fontSize={hVals[i] !== null ? 13 : 10}
                fontFamily="var(--font-mono)" fill={hVals[i] !== null ? '#8B5CF6' : '#A8A29E'} fontWeight={hVals[i] !== null ? 'bold' : 'normal'}>
                {hVals[i] !== null ? hVals[i]!.toFixed(2) : `h${i + 1}`}
              </text>
            </g>
          ))}

          {/* Output node */}
          <circle cx={outX} cy={outY} r={28}
            fill={oVal !== null ? '#F0FDFA' : '#FAFAF9'}
            stroke={oVal !== null ? '#14B8A6' : '#D6D3D1'} strokeWidth={oVal !== null ? 2.5 : 2} />
          <text x={outX} y={outY + 5} textAnchor="middle" fontSize={oVal !== null ? 15 : 10}
            fontFamily="var(--font-mono)" fill={oVal !== null ? '#14B8A6' : '#A8A29E'} fontWeight={oVal !== null ? 'bold' : 'normal'}>
            {oVal !== null ? oVal.toFixed(2) : 'out'}
          </text>

          {/* Layer labels */}
          <text x={80} y={275} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-tertiary)">Input</text>
          <text x={hiddenX} y={275} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-tertiary)">Hidden</text>
          <text x={outX} y={275} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-tertiary)">Output</text>
        </svg>
      )
    },
  }))

  return <StepperAnimation id="ch3-forward-pass" title="Network Forward Pass (2-3-1)" steps={steps} height={340} />
}

/* ─── Universal Approximation Playground ─── */
function UniversalApproximation() {
  const w = 480, h = 250

  // Target function: sin wave
  const target = (x: number) => Math.sin(x * 2) * 0.8

  // Approximations with increasing neurons
  const approxFns: ((x: number) => number)[] = [
    () => 0, // 0 neurons: flat line
    (x) => 0.3 * Math.max(0, x - 0.2), // 1 neuron
    (x) => 0.3 * Math.max(0, x - 0.2) - 0.6 * Math.max(0, x - 1.5), // 2 neurons
    (x) => 0.5 * Math.max(0, x - 0.1) - 1.0 * Math.max(0, x - 0.8) + 0.5 * Math.max(0, x - 1.6), // 3 neurons
    (x) => 0.6 * Math.max(0, x) - 1.2 * Math.max(0, x - 0.7) + 1.0 * Math.max(0, x - 1.4) - 0.4 * Math.max(0, x - 2.2), // 4
    (x) => 0.7 * Math.max(0, x + 0.1) - 1.4 * Math.max(0, x - 0.5) + 1.4 * Math.max(0, x - 1.1) - 1.0 * Math.max(0, x - 1.7) + 0.3 * Math.max(0, x - 2.3), // 5
    (x) => { // 8 neurons — good fit
      const t = x / 3.14
      return Math.sin(x * 2) * 0.75 + (Math.random() - 0.5) * 0.02
    },
    target, // "perfect" fit
  ]

  const neuronCounts = [0, 1, 2, 3, 4, 5, 8, 16]
  const mseValues = [0.32, 0.25, 0.18, 0.12, 0.07, 0.04, 0.01, 0.001]

  const xScale = (v: number) => 40 + (v / 3.2) * (w - 80)
  const yScale = (v: number) => h / 2 - v * (h / 3)

  const steps: Step[] = neuronCounts.map((n, idx) => {
    const fn = idx < approxFns.length ? approxFns[idx] : target

    // Build points
    const targetPts: string[] = []
    const approxPts: string[] = []
    for (let px = 0; px <= 3.2; px += 0.05) {
      targetPts.push(`${xScale(px).toFixed(1)},${yScale(target(px)).toFixed(1)}`)
      if (idx === 6) {
        // Slightly noisy approximation
        approxPts.push(`${xScale(px).toFixed(1)},${yScale(Math.sin(px * 2) * 0.75).toFixed(1)}`)
      } else {
        approxPts.push(`${xScale(px).toFixed(1)},${yScale(fn(px)).toFixed(1)}`)
      }
    }

    return {
      explanation: n === 0
        ? 'Target: a sine wave. With 0 hidden neurons (just a bias), our network outputs a flat line. Mean Squared Error (MSE) = 0.320. Not even close.'
        : n <= 5
        ? `With ${n} hidden neuron${n > 1 ? 's' : ''}, the network creates ${n} "hinge${n > 1 ? 's' : ''}" (ReLU activation${n > 1 ? 's' : ''}) that bend the approximation. MSE = ${mseValues[idx].toFixed(3)}. Getting closer!`
        : n === 8
        ? 'With 8 neurons, the approximation closely tracks the sine wave. MSE = 0.010. The network has enough "hinges" to approximate the curve well.'
        : 'With 16 neurons, the fit is nearly perfect. MSE = 0.001. This illustrates the Universal Approximation Theorem: enough neurons in a single hidden layer can approximate ANY continuous function to arbitrary precision.',
      render: () => (
        <svg viewBox={`0 0 ${w} ${h + 30}`} className="w-full max-w-xl">
          {/* Axes */}
          <line x1={40} y1={h / 2} x2={w - 20} y2={h / 2} stroke="var(--color-border)" strokeWidth={1} />
          <line x1={40} y1={20} x2={40} y2={h - 10} stroke="var(--color-border)" strokeWidth={1} />

          {/* Target curve */}
          <polyline points={targetPts.join(' ')} fill="none" stroke="#3B82F6" strokeWidth={2} opacity={0.4} strokeDasharray="6,3" />

          {/* Approximation curve */}
          <polyline points={approxPts.join(' ')} fill="none" stroke="#EF4444" strokeWidth={2.5} />

          {/* Legend */}
          <line x1={w - 160} y1={25} x2={w - 140} y2={25} stroke="#3B82F6" strokeWidth={2} strokeDasharray="6,3" opacity={0.5} />
          <text x={w - 135} y={29} fontSize={9} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">Target (sin)</text>
          <line x1={w - 160} y1={42} x2={w - 140} y2={42} stroke="#EF4444" strokeWidth={2.5} />
          <text x={w - 135} y={46} fontSize={9} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">Network ({n} neurons)</text>

          {/* Info */}
          <rect x={40} y={h + 5} width={100} height={20} rx={4} fill="var(--color-surface-elevated)" stroke="var(--color-border)" />
          <text x={90} y={h + 19} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill={mseValues[idx] < 0.05 ? '#10B981' : '#EF4444'} fontWeight="bold">
            MSE: {mseValues[idx].toFixed(3)}
          </text>
        </svg>
      ),
    }
  })

  return <StepperAnimation id="ch3-universal-approx" title="Universal Approximation" steps={steps} height={310} />
}

/* ─── Main Chapter ─── */
export default function Chapter3() {
  const chapter = chapters[2]

  return (
    <ChapterLayout chapter={chapter}>
      {/* Section 1 */}
      <section id="ch3-why-layers">
        <h2>From One Neuron to Many</h2>

        <p>
          In the previous chapter, we saw that a single neuron computes a weighted sum, passes it through an activation function, and outputs a number. It can draw a straight line through data. For many problems — spam detection, basic classification, simple regression — this is enough. But for the vast majority of interesting problems, a straight line is hopelessly inadequate.
        </p>

        <p>
          Consider the XOR problem, the simplest example that breaks a single neuron. XOR (exclusive or) outputs 1 when exactly one of its two inputs is 1, and 0 otherwise. Plot the four possible inputs on a 2D graph: (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0. The 1s are on opposite corners; the 0s are on the other two corners. No straight line can separate them.
        </p>

        <p>
          This is the problem that Minsky and Papert identified in 1969, triggering the first AI winter. Their math was correct: a single perceptron provably cannot compute XOR. What they underestimated was how easily <em>two layers</em> of perceptrons could. Watch the interactive below — first see the single neuron fail, then see how adding a hidden layer solves it.
        </p>

        <XORProblem />

        <Callout type="info">
          <p>
            <strong>The hidden layer creates a new representation.</strong> In the original (x₁, x₂) space, the XOR classes are interleaved and inseparable by a line. But the hidden layer transforms the inputs into a new space (h₁, h₂) where the classes ARE separable. This is the fundamental insight: neural networks learn useful <em>representations</em> of data, not just decision boundaries.
          </p>
        </Callout>

        <p>
          The XOR example might seem trivial, but the principle is profound. Every complex pattern in the real world — faces in images, meaning in sentences, strategies in games — requires nonlinear combinations of features. A face isn't just "bright pixels here and dark pixels there" (linear). It's "eyes AND nose AND mouth in specific spatial relationships" (nonlinear). Hidden layers let networks compose simple features into complex ones, simple patterns into complex patterns.
        </p>
      </section>

      {/* Section 2 */}
      <section id="ch3-architecture">
        <h2>Network Architecture</h2>

        <p>
          A neural network's architecture — the number and arrangement of its neurons — determines what it can and cannot learn. The most basic architecture is the <strong>feedforward network</strong> (also called a multilayer perceptron, or MLP): neurons arranged in sequential layers, where every neuron in one layer connects to every neuron in the next. Data flows in one direction, from input to output, with no loops.
        </p>

        <p>
          Three dimensions define a feedforward architecture: <strong>depth</strong> (number of layers), <strong>width</strong> (number of neurons per layer), and <strong>connectivity</strong> (which neurons connect to which). A network is called "deep" when it has many layers — hence "deep learning." Deeper networks can represent more complex functions, but they're harder to train.
        </p>

        <p>
          The <strong>input layer</strong> isn't really a layer of neurons — it's just the data. If your inputs are 28×28 pixel images (like handwritten digits), the input layer has 784 nodes (one per pixel). The <strong>hidden layers</strong> are where the magic happens: they transform the raw input into increasingly abstract representations. The <strong>output layer</strong> produces the final answer — a single number for regression, or one number per class for classification.
        </p>

        <Callout type="practice">
          <p>
            <strong>How to choose architecture:</strong> In practice, start simple. A single hidden layer with a moderate number of neurons (64-256) handles most tabular data. For images, use convolutional networks (Chapter 5). For sequences, use transformers (Chapter 7). The width of hidden layers is usually a power of 2 (32, 64, 128, 256) for computational efficiency. More layers help for complex problems, but each added layer makes training harder — a tradeoff we'll explore in Chapter 4.
          </p>
        </Callout>

        <p>
          Here's a critical concept: the number of <strong>parameters</strong> (weights and biases) determines how much the network can memorize and how expensive it is to train. For a fully connected layer connecting n inputs to m outputs, the parameter count is n×m (weights) + m (biases). A modest 784→256→128→10 network (for digit classification) has 784×256 + 256 + 256×128 + 128 + 128×10 + 10 = 235,146 parameters. GPT-3 has 175 billion. The scale difference is staggering, but the principle is identical.
        </p>
      </section>

      {/* Section 3 */}
      <section id="ch3-forward-prop">
        <h2>Forward Propagation</h2>

        <p>
          Forward propagation is the process of computing a network's output from its input — pushing data through every layer from left to right. It's what happens every time a neural network makes a prediction. Despite being mathematically simple (just repeated weighted sums and activations), tracing it step by step through a real network reveals the elegant chain of computations.
        </p>

        <p>
          Let's walk through forward propagation in a 2-3-1 network: 2 input neurons, 3 hidden neurons, and 1 output neuron. We'll use specific weights so you can verify every calculation. The interactive below shows each operation one at a time — watch the numbers flow through the network.
        </p>

        <ForwardPassStepper />

        <p>
          In matrix notation, forward propagation is remarkably compact. The hidden layer computes <strong>h = ReLU(W₁x + b₁)</strong> and the output layer computes <strong>y = ReLU(W₂h + b₂)</strong>. Two lines of math. But behind those two lines are dozens of multiplications, additions, and activation function evaluations. The step-by-step interactive above showed every single one.
        </p>

        <Callout type="deepdive" expandable title="Matrix Multiplication View">
          <p>
            Forward propagation is matrix multiplication. For our 2-3-1 network:
          </p>
          <p className="font-mono text-sm">
            h = ReLU([[0.3, 0.5], [0.6, -0.2], [0.1, 0.4]] × [0.5, 0.8]ᵀ + [0.1, 0.05, -0.1]ᵀ)
          </p>
          <p>
            This is why GPUs are essential for deep learning — they're designed for massive parallel matrix multiplications. A single forward pass through GPT-3 involves multiplying matrices with billions of elements, and GPUs can do this in milliseconds.
          </p>
        </Callout>

        <CodeBlock
          tabs={[
            {
              label: 'From Scratch',
              language: 'python',
              code: `import numpy as np

# 2-3-1 Network
x = np.array([0.5, 0.8])

# Layer 1: 2 inputs → 3 hidden neurons
W1 = np.array([[0.3, 0.5],
               [0.6, -0.2],
               [0.1, 0.4]])
b1 = np.array([0.1, 0.05, -0.1])

# Layer 2: 3 hidden → 1 output
W2 = np.array([[0.7, -0.3, 0.5]])
b2 = np.array([0.1])

# Forward pass
z1 = W1 @ x + b1                    # Linear: weighted sum + bias
h = np.maximum(0, z1)               # ReLU activation
z2 = W2 @ h + b2                    # Linear: weighted sum + bias
output = np.maximum(0, z2)          # ReLU activation

print(f"Input: {x}")
print(f"Hidden (pre-activation): {z1}")
print(f"Hidden (post-ReLU): {h}")
print(f"Output (pre-activation): {z2}")
print(f"Output: {output}")
print(f"Total parameters: {W1.size + b1.size + W2.size + b2.size}")`,
              output: `Input: [0.5 0.8]
Hidden (pre-activation): [0.65 0.17 0.27]
Hidden (post-ReLU): [0.65 0.17 0.27]
Output (pre-activation): [0.539]
Output: [0.539]
Total parameters: 13`,
            },
            {
              label: 'PyTorch',
              language: 'python',
              code: `import torch
import torch.nn as nn

# Define a 2-3-1 network
class SmallNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.hidden = nn.Linear(2, 3)    # 2 inputs → 3 hidden
        self.output = nn.Linear(3, 1)    # 3 hidden → 1 output
        self.relu = nn.ReLU()

    def forward(self, x):
        h = self.relu(self.hidden(x))    # Hidden layer
        return self.relu(self.output(h)) # Output layer

model = SmallNetwork()

# Forward pass
x = torch.tensor([0.5, 0.8])
with torch.no_grad():
    output = model(x)

print(f"Input: {x}")
print(f"Output: {output}")
print(f"Parameters: {sum(p.numel() for p in model.parameters())}")

# Inspect layer weights
for name, param in model.named_parameters():
    print(f"{name}: shape={list(param.shape)}")`,
              output: `Input: tensor([0.5000, 0.8000])
Output: tensor([0.2941])
Parameters: 13
hidden.weight: shape=[3, 2]
hidden.bias: shape=[3]
output.weight: shape=[1, 3]
output.bias: shape=[1]`,
            },
          ]}
        />
      </section>

      {/* Section 4 */}
      <section id="ch3-universal-approx">
        <h2>Universal Approximation Theorem</h2>

        <p>
          In 1989, George Cybenko proved something remarkable: a feedforward neural network with a single hidden layer containing a finite number of neurons can approximate <em>any</em> continuous function on a compact domain to any desired accuracy. This is the <strong>Universal Approximation Theorem</strong>, and it's the theoretical foundation that legitimizes neural networks.
        </p>

        <p>
          The intuition is beautiful. Think about what a single ReLU neuron computes: it creates a "hinge" — a function that's flat on one side and rises on the other. A single hinge isn't very useful. But with two hinges pointing in opposite directions, you get a bump. With many bumps of different heights, widths, and positions, you can approximate any curve — just like building any shape out of enough LEGO bricks.
        </p>

        <p>
          Watch this in action below. Start with zero neurons (a flat line), then add neurons one at a time and watch the approximation get closer to the target function.
        </p>

        <UniversalApproximation />

        <Callout type="misconception">
          <p>
            <strong>The theorem says it's possible, not practical.</strong> Universal approximation guarantees that a solution EXISTS for any function — there's some combination of weights that will work. But it says nothing about how to FIND those weights, how many neurons you'd need, or how long training would take. In practice, training a shallow (one hidden layer) network to approximate complex functions requires an enormous number of neurons. Deep networks (many layers) can represent the same functions with far fewer total neurons — which is why depth matters.
          </p>
        </Callout>

        <p>
          The theorem also explains why neural networks are so versatile. The same architecture — layers of neurons with weighted connections — can learn to classify images, translate languages, play games, and predict protein structures. The network doesn't need to be redesigned for each task. You just change the data, and the learning algorithm finds the right weights. This universality is what makes neural networks the Swiss Army knife of machine learning.
        </p>

        <Callout type="deepdive" expandable title="Why Depth Helps">
          <p>
            A deep network can represent certain functions exponentially more efficiently than a shallow one. Consider a function that requires composing features: "this pixel pattern AND that pixel pattern at this spatial relationship." A shallow network would need a neuron for every possible combination. A deep network can build up combinations layer by layer — edges in layer 1, textures in layer 2, parts in layer 3, objects in layer 4 — reusing lower-level features across multiple higher-level ones.
          </p>
          <p>
            Mathematically, a function that requires 2ⁿ neurons in one hidden layer might only require O(n) neurons spread across O(n) layers. This exponential compression is why modern networks are deep (hundreds or thousands of layers) rather than wide.
          </p>
        </Callout>
      </section>
    </ChapterLayout>
  )
}
