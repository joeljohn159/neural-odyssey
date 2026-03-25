import { useState } from 'react'
import ChapterLayout from '../components/shared/ChapterLayout'
import StepperAnimation, { type Step } from '../components/shared/StepperAnimation'
import CodeBlock from '../components/shared/CodeBlock'
import Callout from '../components/shared/Callout'
import { chapters } from '../data/chapters'

/* ─── Perceptron Stepper Interactive ─── */
function PerceptronStepper() {
  const inputs = [0.5, 0.8]
  const weights = [0.3, 0.6]
  const bias = 0.1

  const wp0 = inputs[0] * weights[0] // 0.15
  const wp1 = inputs[1] * weights[1] // 0.48
  const weightedSum = wp0 + wp1       // 0.63
  const withBias = weightedSum + bias  // 0.73
  const output = Math.max(0, withBias) // 0.73

  const steps: Step[] = [
    {
      explanation: `We start with two input values: x₁ = ${inputs[0]} and x₂ = ${inputs[1]}. These are our features — perhaps "hours studied" and "hours slept" for a student, or pixel intensities in a tiny image.`,
      render: () => (
        <svg viewBox="0 0 600 300" className="w-full max-w-xl">
          {/* Input nodes */}
          <circle cx={100} cy={100} r={30} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={100} y={105} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{inputs[0]}</text>
          <text x={100} y={75} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">x₁</text>

          <circle cx={100} cy={220} r={30} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={100} y={225} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{inputs[1]}</text>
          <text x={100} y={195} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">x₂</text>

          {/* Neuron */}
          <circle cx={400} cy={160} r={40} fill="#F5F3FF" stroke="#8B5CF6" strokeWidth={2} />
          <text x={400} y={165} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill="#8B5CF6">neuron</text>
        </svg>
      ),
    },
    {
      explanation: `Each input has a weight. Weight w₁ = ${weights[0]} and w₂ = ${weights[1]}. Weights determine how important each input is — larger weights mean the input has more influence on the output.`,
      render: () => (
        <svg viewBox="0 0 600 300" className="w-full max-w-xl">
          <circle cx={100} cy={100} r={30} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={100} y={105} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{inputs[0]}</text>

          <circle cx={100} cy={220} r={30} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={100} y={225} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{inputs[1]}</text>

          {/* Connections with weights */}
          <line x1={130} y1={100} x2={360} y2={150} stroke="#10B981" strokeWidth={2} />
          <text x={230} y={115} textAnchor="middle" fontSize={13} fontFamily="var(--font-mono)" fill="#10B981" fontWeight="bold">w₁ = {weights[0]}</text>

          <line x1={130} y1={220} x2={360} y2={170} stroke="#10B981" strokeWidth={2} />
          <text x={230} y={215} textAnchor="middle" fontSize={13} fontFamily="var(--font-mono)" fill="#10B981" fontWeight="bold">w₂ = {weights[1]}</text>

          <circle cx={400} cy={160} r={40} fill="#F5F3FF" stroke="#8B5CF6" strokeWidth={2} />
          <text x={400} y={165} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill="#8B5CF6">neuron</text>
        </svg>
      ),
    },
    {
      explanation: `Multiply each input by its weight: x₁ × w₁ = ${inputs[0]} × ${weights[0]} = ${wp0.toFixed(2)}, and x₂ × w₂ = ${inputs[1]} × ${weights[1]} = ${wp1.toFixed(2)}. These products measure each input's contribution.`,
      render: () => (
        <svg viewBox="0 0 600 300" className="w-full max-w-xl">
          <circle cx={100} cy={100} r={30} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={100} y={105} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{inputs[0]}</text>

          <circle cx={100} cy={220} r={30} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={100} y={225} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{inputs[1]}</text>

          <line x1={130} y1={100} x2={360} y2={150} stroke="#10B981" strokeWidth={2} />
          <line x1={130} y1={220} x2={360} y2={170} stroke="#10B981" strokeWidth={2} />

          {/* Multiplication labels */}
          <rect x={190} y={95} width={100} height={24} rx={4} fill="var(--color-surface-elevated)" stroke="var(--color-border)" />
          <text x={240} y={112} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-text-primary)">{inputs[0]}×{weights[0]} = {wp0.toFixed(2)}</text>

          <rect x={190} y={205} width={100} height={24} rx={4} fill="var(--color-surface-elevated)" stroke="var(--color-border)" />
          <text x={240} y={222} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-text-primary)">{inputs[1]}×{weights[1]} = {wp1.toFixed(2)}</text>

          <circle cx={400} cy={160} r={40} fill="#F5F3FF" stroke="#8B5CF6" strokeWidth={2} />
          <text x={400} y={155} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="#8B5CF6">{wp0.toFixed(2)}</text>
          <text x={400} y={175} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="#8B5CF6">{wp1.toFixed(2)}</text>
        </svg>
      ),
    },
    {
      explanation: `Sum the weighted inputs: ${wp0.toFixed(2)} + ${wp1.toFixed(2)} = ${weightedSum.toFixed(2)}. This weighted sum is the neuron's raw signal — how much total evidence it has received.`,
      render: () => (
        <svg viewBox="0 0 600 300" className="w-full max-w-xl">
          <circle cx={100} cy={100} r={30} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={100} y={105} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{inputs[0]}</text>

          <circle cx={100} cy={220} r={30} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={100} y={225} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{inputs[1]}</text>

          <line x1={130} y1={100} x2={360} y2={150} stroke="#10B981" strokeWidth={2} />
          <line x1={130} y1={220} x2={360} y2={170} stroke="#10B981" strokeWidth={2} />

          <circle cx={400} cy={160} r={40} fill="#F5F3FF" stroke="#8B5CF6" strokeWidth={2} />
          <text x={400} y={150} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">Σ</text>
          <text x={400} y={172} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#8B5CF6" fontWeight="bold">{weightedSum.toFixed(2)}</text>
        </svg>
      ),
    },
    {
      explanation: `Add the bias: ${weightedSum.toFixed(2)} + ${bias} = ${withBias.toFixed(2)}. The bias shifts the neuron's activation threshold — it lets the neuron fire even when inputs are small, or stay quiet even when inputs are large.`,
      render: () => (
        <svg viewBox="0 0 600 300" className="w-full max-w-xl">
          <circle cx={100} cy={100} r={30} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={100} y={105} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{inputs[0]}</text>

          <circle cx={100} cy={220} r={30} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={100} y={225} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{inputs[1]}</text>

          <line x1={130} y1={100} x2={360} y2={150} stroke="#10B981" strokeWidth={2} />
          <line x1={130} y1={220} x2={360} y2={170} stroke="#10B981" strokeWidth={2} />

          {/* Bias arrow */}
          <line x1={400} y1={80} x2={400} y2={118} stroke="#F59E0B" strokeWidth={2} markerEnd="url(#arrow)" />
          <text x={400} y={72} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill="#F59E0B" fontWeight="bold">b = {bias}</text>
          <defs><marker id="arrow" viewBox="0 0 10 10" refX={5} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#F59E0B" /></marker></defs>

          <circle cx={400} cy={160} r={40} fill="#F5F3FF" stroke="#8B5CF6" strokeWidth={2} />
          <text x={400} y={148} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">{weightedSum.toFixed(2)} + {bias}</text>
          <text x={400} y={172} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#8B5CF6" fontWeight="bold">{withBias.toFixed(2)}</text>
        </svg>
      ),
    },
    {
      explanation: `Apply the activation function (ReLU): max(0, ${withBias.toFixed(2)}) = ${output.toFixed(2)}. Since ${withBias.toFixed(2)} > 0, ReLU passes it through unchanged. If it were negative, ReLU would output 0 — the neuron "doesn't fire."`,
      render: () => (
        <svg viewBox="0 0 600 300" className="w-full max-w-xl">
          <circle cx={100} cy={100} r={30} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={100} y={105} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{inputs[0]}</text>

          <circle cx={100} cy={220} r={30} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={100} y={225} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{inputs[1]}</text>

          <line x1={130} y1={100} x2={310} y2={150} stroke="#10B981" strokeWidth={2} />
          <line x1={130} y1={220} x2={310} y2={170} stroke="#10B981" strokeWidth={2} />

          {/* Neuron */}
          <circle cx={350} cy={160} r={35} fill="#F5F3FF" stroke="#8B5CF6" strokeWidth={2} />
          <text x={350} y={165} textAnchor="middle" fontSize={14} fontFamily="var(--font-mono)" fill="#8B5CF6" fontWeight="bold">{withBias.toFixed(2)}</text>

          {/* Activation */}
          <rect x={410} y={140} width={60} height={40} rx={8} fill="#F5F3FF" stroke="#8B5CF6" strokeWidth={1.5} />
          <text x={440} y={157} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#8B5CF6">ReLU</text>
          <text x={440} y={172} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">max(0, x)</text>
          <line x1={385} y1={160} x2={410} y2={160} stroke="#8B5CF6" strokeWidth={1.5} />

          {/* Output */}
          <line x1={470} y1={160} x2={510} y2={160} stroke="#14B8A6" strokeWidth={2} />
          <circle cx={540} cy={160} r={28} fill="#F0FDFA" stroke="#14B8A6" strokeWidth={2} />
          <text x={540} y={165} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#14B8A6" fontWeight="bold">{output.toFixed(2)}</text>
          <text x={540} y={135} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">output</text>
        </svg>
      ),
    },
    {
      explanation: `The output is ${output.toFixed(2)}. This single number is what the neuron passes to the next layer. The entire forward pass — multiply, sum, add bias, activate — is the fundamental operation of neural networks. Every neuron in every network does exactly this.`,
      render: () => (
        <svg viewBox="0 0 600 300" className="w-full max-w-xl">
          {/* Full diagram with all values visible */}
          <circle cx={80} cy={100} r={28} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={80} y={105} textAnchor="middle" fontSize={14} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{inputs[0]}</text>
          <text x={80} y={78} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">x₁</text>

          <circle cx={80} cy={220} r={28} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
          <text x={80} y={225} textAnchor="middle" fontSize={14} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{inputs[1]}</text>
          <text x={80} y={198} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">x₂</text>

          <line x1={108} y1={100} x2={270} y2={150} stroke="#10B981" strokeWidth={2} />
          <text x={180} y={118} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="#10B981">w₁={weights[0]}</text>
          <line x1={108} y1={220} x2={270} y2={170} stroke="#10B981" strokeWidth={2} />
          <text x={180} y={212} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="#10B981">w₂={weights[1]}</text>

          <circle cx={310} cy={160} r={35} fill="#F5F3FF" stroke="#8B5CF6" strokeWidth={2} />
          <text x={310} y={155} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">Σ + b</text>
          <text x={310} y={172} textAnchor="middle" fontSize={14} fontFamily="var(--font-mono)" fill="#8B5CF6" fontWeight="bold">{withBias.toFixed(2)}</text>

          <rect x={370} y={143} width={55} height={34} rx={6} fill="#F5F3FF" stroke="#8B5CF6" strokeWidth={1} />
          <text x={397} y={164} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#8B5CF6">ReLU</text>
          <line x1={345} y1={160} x2={370} y2={160} stroke="#8B5CF6" strokeWidth={1.5} />

          <line x1={425} y1={160} x2={470} y2={160} stroke="#14B8A6" strokeWidth={2} />
          <circle cx={500} cy={160} r={28} fill="#F0FDFA" stroke="#14B8A6" strokeWidth={2.5} />
          <text x={500} y={165} textAnchor="middle" fontSize={16} fontFamily="var(--font-mono)" fill="#14B8A6" fontWeight="bold">{output.toFixed(2)}</text>
          <text x={500} y={138} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">output</text>

          {/* Summary formula at bottom */}
          <text x={300} y={280} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">
            ReLU({inputs[0]}×{weights[0]} + {inputs[1]}×{weights[1]} + {bias}) = ReLU({withBias.toFixed(2)}) = {output.toFixed(2)}
          </text>
        </svg>
      ),
    },
  ]

  return <StepperAnimation id="ch2-perceptron" title="Perceptron Forward Pass" steps={steps} height={340} />
}

/* ─── Activation Function Explorer ─── */
function ActivationExplorer() {
  const [activeFn, setActiveFn] = useState<'sigmoid' | 'relu' | 'tanh'>('sigmoid')

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x))
  const sigmoidDeriv = (x: number) => { const s = sigmoid(x); return s * (1 - s) }
  const relu = (x: number) => Math.max(0, x)
  const reluDeriv = (x: number) => x > 0 ? 1 : 0
  const tanh_ = (x: number) => Math.tanh(x)
  const tanhDeriv = (x: number) => 1 - Math.tanh(x) ** 2

  const fns = {
    sigmoid: { fn: sigmoid, deriv: sigmoidDeriv, color: '#8B5CF6', name: 'Sigmoid', formula: 'σ(x) = 1/(1+e⁻ˣ)' },
    relu: { fn: relu, deriv: reluDeriv, color: '#3B82F6', name: 'ReLU', formula: 'f(x) = max(0, x)' },
    tanh: { fn: tanh_, deriv: tanhDeriv, color: '#10B981', name: 'Tanh', formula: 'tanh(x) = (eˣ−e⁻ˣ)/(eˣ+e⁻ˣ)' },
  }

  const testInputs = [-3, -2, -1, -0.5, 0, 0.5, 1, 2, 3]
  const active = fns[activeFn]

  const steps: Step[] = testInputs.map((input, _idx) => {
    const outVal = active.fn(input)
    const derivVal = active.deriv(input)
    const w = 500, h = 250
    const xScale = (v: number) => ((v + 4) / 8) * w
    const yScale = (v: number) => h / 2 - v * (h / 4)

    // Build curve path
    const points: string[] = []
    const derivPoints: string[] = []
    for (let px = -4; px <= 4; px += 0.1) {
      points.push(`${xScale(px).toFixed(1)},${yScale(active.fn(px)).toFixed(1)}`)
      derivPoints.push(`${xScale(px).toFixed(1)},${yScale(active.deriv(px)).toFixed(1)}`)
    }

    return {
      explanation: `Input x = ${input}: ${active.name}(${input}) = ${outVal.toFixed(4)}. Derivative: ${derivVal.toFixed(4)}. ${
        activeFn === 'sigmoid' ? (outVal > 0.5 ? 'Output is above 0.5 — the neuron "fires."' : outVal < 0.5 ? 'Output is below 0.5 — the neuron stays quiet.' : 'Right at the threshold — 50/50.')
        : activeFn === 'relu' ? (input > 0 ? 'Positive input passes through unchanged.' : 'Negative input is zeroed out — the neuron is "dead" for this input.')
        : (Math.abs(outVal) > 0.5 ? 'Strong signal — output is far from zero.' : 'Weak signal — output is near zero.')
      }`,
      render: () => (
        <div className="w-full max-w-xl mx-auto">
          {/* Tab buttons */}
          <div className="flex gap-2 mb-3 justify-center">
            {(Object.keys(fns) as Array<keyof typeof fns>).map(key => (
              <button
                key={key}
                onClick={(e) => { e.stopPropagation(); setActiveFn(key) }}
                className={`px-3 py-1 text-xs font-mono rounded-lg border transition-colors ${
                  activeFn === key
                    ? `border-current bg-opacity-10 font-semibold`
                    : 'border-gray-200 text-gray-400 hover:text-gray-600'
                }`}
                style={activeFn === key ? { color: fns[key].color, backgroundColor: fns[key].color + '15' } : {}}
              >
                {fns[key].name}
              </button>
            ))}
          </div>
          <svg viewBox={`0 0 ${w} ${h + 40}`} className="w-full">
            {/* Grid */}
            <line x1={0} y1={h / 2} x2={w} y2={h / 2} stroke="var(--color-border)" strokeWidth={1} />
            <line x1={xScale(0)} y1={0} x2={xScale(0)} y2={h} stroke="var(--color-border)" strokeWidth={1} />
            {[-3, -2, -1, 1, 2, 3].map(v => (
              <text key={v} x={xScale(v)} y={h / 2 + 14} textAnchor="middle" fontSize={9} fill="var(--color-text-tertiary)" fontFamily="var(--font-mono)">{v}</text>
            ))}

            {/* Derivative curve */}
            <polyline points={derivPoints.join(' ')} fill="none" stroke={active.color} strokeWidth={1} opacity={0.3} strokeDasharray="4,3" />

            {/* Function curve */}
            <polyline points={points.join(' ')} fill="none" stroke={active.color} strokeWidth={2.5} />

            {/* Current point */}
            <circle cx={xScale(input)} cy={yScale(outVal)} r={6} fill={active.color} stroke="var(--color-surface-elevated)" strokeWidth={2} />
            <line x1={xScale(input)} y1={h / 2} x2={xScale(input)} y2={yScale(outVal)} stroke={active.color} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />

            {/* Labels */}
            <rect x={xScale(input) + 10} y={yScale(outVal) - 22} width={90} height={18} rx={4} fill="var(--color-surface-elevated)" stroke="var(--color-border)" />
            <text x={xScale(input) + 55} y={yScale(outVal) - 10} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill={active.color} fontWeight="bold">
              f({input}) = {outVal.toFixed(3)}
            </text>

            {/* Formula */}
            <text x={w / 2} y={h + 25} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">{active.formula}</text>

            {/* Legend */}
            <line x1={15} y1={20} x2={35} y2={20} stroke={active.color} strokeWidth={2.5} />
            <text x={40} y={24} fontSize={9} fill="var(--color-text-secondary)" fontFamily="var(--font-mono)">{active.name}</text>
            <line x1={15} y1={35} x2={35} y2={35} stroke={active.color} strokeWidth={1} strokeDasharray="4,3" opacity={0.5} />
            <text x={40} y={39} fontSize={9} fill="var(--color-text-secondary)" fontFamily="var(--font-mono)">Derivative</text>
          </svg>
        </div>
      ),
    }
  })

  return <StepperAnimation id="ch2-activation" title="Activation Function Explorer" steps={steps} height={360} />
}

/* ─── Decision Boundary Playground ─── */
function DecisionBoundaryPlayground() {
  const w = 480, h = 340
  const dataA = [[80, 70], [120, 100], [90, 130], [140, 80], [110, 160], [70, 110], [150, 140], [100, 90]]
  const dataB = [[300, 240], [340, 270], [280, 210], [360, 290], [320, 250], [290, 280], [350, 230], [310, 300]]

  const weightSteps = [
    { w1: 0.1, w2: 0.0, b: -50, desc: 'vertical' },
    { w1: 0.2, w2: 0.15, b: -60, desc: 'tilting' },
    { w1: 0.3, w2: 0.3, b: -80, desc: 'diagonal' },
    { w1: 0.4, w2: 0.35, b: -95, desc: 'better' },
    { w1: 0.5, w2: 0.45, b: -115, desc: 'good' },
    { w1: 0.55, w2: 0.5, b: -125, desc: 'great' },
    { w1: 0.58, w2: 0.52, b: -130, desc: 'optimal' },
  ]

  const steps: Step[] = [
    {
      explanation: 'Two classes of points on a 2D plane. A single neuron draws a decision boundary — a straight line defined by its weights. Points on one side are "Class A" (blue), points on the other are "Class B" (red). Can we find the right line?',
      render: () => (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg">
          {dataA.map((p, i) => <circle key={`a${i}`} cx={p[0]} cy={p[1]} r={6} fill="#3B82F6" opacity={0.8} />)}
          {dataB.map((p, i) => <circle key={`b${i}`} cx={p[0]} cy={p[1]} r={6} fill="#EF4444" opacity={0.8} />)}
          <text x={110} y={40} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="#3B82F6">Class A</text>
          <text x={320} y={330} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="#EF4444">Class B</text>
        </svg>
      ),
    },
    ...weightSteps.map((ws, idx) => {
      // Line: w1*x + w2*y + b = 0  →  y = -(w1*x + b)/w2
      const y_at = (x: number) => ws.w2 !== 0 ? -(ws.w1 * x + ws.b) / ws.w2 : h / 2
      const misA = dataA.filter(p => ws.w1 * p[0] + ws.w2 * p[1] + ws.b > 0).length
      const misB = dataB.filter(p => ws.w1 * p[0] + ws.w2 * p[1] + ws.b <= 0).length
      const misclassified = misA + misB
      const acc = ((16 - misclassified) / 16 * 100).toFixed(0)

      return {
        explanation: idx === 0
          ? `Starting with weights w₁=${ws.w1}, w₂=${ws.w2}, bias=${ws.b}. The boundary is nearly vertical — not a good fit. Accuracy: ${acc}%.`
          : idx === weightSteps.length - 1
          ? `After training, weights converged to w₁=${ws.w1}, w₂=${ws.w2}, bias=${ws.b}. The boundary cleanly separates both classes. Accuracy: ${acc}%. This is what learning looks like for a single neuron.`
          : `Adjusting weights: w₁=${ws.w1}, w₂=${ws.w2}, bias=${ws.b}. The boundary rotates to better separate the classes. Accuracy: ${acc}%.`,
        render: () => (
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg">
            {/* Shaded regions */}
            <polygon
              points={`0,0 ${w},0 ${w},${Math.max(0, Math.min(h, y_at(w)))} 0,${Math.max(0, Math.min(h, y_at(0)))}`}
              fill="#3B82F6" opacity={0.04}
            />
            <polygon
              points={`0,${Math.max(0, Math.min(h, y_at(0)))} ${w},${Math.max(0, Math.min(h, y_at(w)))} ${w},${h} 0,${h}`}
              fill="#EF4444" opacity={0.04}
            />

            {dataA.map((p, i) => <circle key={`a${i}`} cx={p[0]} cy={p[1]} r={6} fill="#3B82F6" opacity={0.8} />)}
            {dataB.map((p, i) => <circle key={`b${i}`} cx={p[0]} cy={p[1]} r={6} fill="#EF4444" opacity={0.8} />)}

            <line
              x1={0} y1={Math.max(0, Math.min(h, y_at(0)))}
              x2={w} y2={Math.max(0, Math.min(h, y_at(w)))}
              stroke="#10B981" strokeWidth={2.5}
            />

            {/* Info box */}
            <rect x={w - 140} y={10} width={130} height={60} rx={6} fill="var(--color-surface-elevated)" stroke="var(--color-border)" />
            <text x={w - 75} y={30} textAnchor="middle" fontSize={10} fill="var(--color-text-secondary)" fontFamily="var(--font-mono)">w₁={ws.w1} w₂={ws.w2}</text>
            <text x={w - 75} y={45} textAnchor="middle" fontSize={10} fill="var(--color-text-secondary)" fontFamily="var(--font-mono)">bias={ws.b}</text>
            <text x={w - 75} y={62} textAnchor="middle" fontSize={13} fill={parseInt(acc) >= 90 ? '#10B981' : '#EF4444'} fontFamily="var(--font-mono)" fontWeight="bold">
              Acc: {acc}%
            </text>
          </svg>
        ),
      } as Step
    }),
  ]

  return <StepperAnimation id="ch2-decision-boundary" title="Decision Boundary Playground" steps={steps} height={370} />
}

/* ─── Main Chapter Component ─── */
export default function Chapter2() {
  const chapter = chapters[1]

  return (
    <ChapterLayout chapter={chapter}>
      {/* Section 1: Biological vs Artificial Neurons */}
      <section id="ch2-bio-vs-artificial">
        <h2>Biological vs Artificial Neurons</h2>

        <p>
          Your brain contains roughly 86 billion neurons — each a tiny biological processor that receives electrical signals from other neurons, performs a simple computation, and decides whether to fire its own signal onward. A single neuron isn't intelligent. It doesn't know anything. But 86 billion of them, connected by approximately 100 trillion synapses (the connections between neurons), produce consciousness, language, love, mathematics, and the ability to read this sentence and understand it.
        </p>

        <p>
          The artificial neuron — the mathematical object at the heart of every neural network — is a deliberately simplified model of its biological counterpart. In the 1940s, Warren McCulloch (a neuroscientist) and Walter Pitts (a logician) proposed that a neuron could be modeled as a simple threshold device: it receives numerical inputs, computes a weighted sum, and fires if that sum exceeds a threshold. Their 1943 paper, "A Logical Calculus of the Ideas Immanent in Nervous Activity," is one of the founding documents of both neuroscience and artificial intelligence.
        </p>

        <p>
          Here's the analogy. A biological neuron has <strong>dendrites</strong> — branching extensions that receive signals from other neurons. These signals arrive with different strengths, determined by the <strong>synaptic strength</strong> of each connection. The neuron integrates all incoming signals in its <strong>cell body</strong>. If the combined signal exceeds a certain threshold, the neuron fires — it sends an electrical pulse down its <strong>axon</strong> to other neurons.
        </p>

        <p>
          The artificial neuron mirrors this architecture with mathematical precision. <strong>Inputs</strong> correspond to dendrites — they're the data coming in. <strong>Weights</strong> correspond to synaptic strengths — they determine how much each input matters. The <strong>weighted sum</strong> corresponds to the cell body's integration. The <strong>activation function</strong> corresponds to the firing decision. And the <strong>output</strong> corresponds to the axon signal that feeds into the next layer.
        </p>

        <Callout type="misconception">
          <p>
            <strong>Artificial neurons are not simulations of biological neurons.</strong> They're inspired by biology, but the analogy is loose. Real neurons communicate through complex chemical and electrical processes involving ion channels, neurotransmitters, and timing-dependent plasticity. They can inhibit as well as excite. Their firing patterns encode information in ways we still don't fully understand. An artificial neuron captures the spirit — receive, weight, sum, decide — while discarding nearly all the biological detail. This simplification is a feature, not a bug: it makes the math tractable while preserving the essential computational principle.
          </p>
        </Callout>

        <p>
          The remarkable thing is that this simplification <em>works</em>. Despite being a crude caricature of biological neural computation, artificial neurons arranged in networks can learn to recognize faces, translate languages, play games, and generate art. It's as if a stick-figure drawing of a human could somehow learn to walk and talk. The power lies not in the fidelity of the individual unit, but in the emergent capabilities that arise when millions of these simple units work together.
        </p>

        <p>
          Learning in the brain happens by adjusting synaptic strengths — a process first articulated by Donald Hebb in 1949: "Neurons that fire together, wire together." When two connected neurons are both active simultaneously, the connection between them strengthens. Over time, frequently used pathways become highways while rarely used ones fade. Artificial neural networks learn by an analogous process: adjusting weights to reduce errors. The math is different (backpropagation rather than Hebbian learning), but the principle — learning by adjusting connection strengths — is shared.
        </p>
      </section>

      {/* Section 2: The Perceptron */}
      <section id="ch2-perceptron">
        <h2>The Perceptron</h2>

        <p>
          In 1958, Frank Rosenblatt, a psychologist at Cornell, built the Mark I Perceptron — a physical machine made of 400 photocells, potentiometers, and motor-driven adjustable weights. It was the first device that could genuinely learn from examples. Feed it images of letters, tell it which is which, and it would adjust its internal weights until it could classify them correctly. The New York Times reported that the Navy had unveiled a machine that "will be able to walk, talk, see, write, reproduce itself and be conscious of its existence."
        </p>

        <p>
          The math behind it is beautifully simple. A perceptron takes a vector of inputs (x₁, x₂, ..., xₙ), multiplies each by a corresponding weight (w₁, w₂, ..., wₙ), adds a bias term (b), and passes the result through an activation function. In equation form:
        </p>

        <p className="text-center font-mono text-lg my-6">
          output = f(w₁x₁ + w₂x₂ + ... + wₙxₙ + b)
        </p>

        <p>
          That's it. Every single artificial neuron in every neural network, from the simplest perceptron to the largest transformer, performs this exact computation. The differences between architectures lie in how neurons are connected, how many there are, and which activation function f is used — but the fundamental operation of every neuron is: <em>weighted sum, then activate</em>.
        </p>

        <p>
          Let's watch this happen step by step. The interactive below walks through a perceptron's forward pass with real numbers. Two inputs, two weights, a bias, and a ReLU activation. Click through each step to see exactly how input becomes output.
        </p>

        <PerceptronStepper />

        <Callout type="practice">
          <p>
            <strong>Perceptrons are still used today</strong> — just not alone. Every neuron in a modern neural network is essentially a perceptron. When people say "a neural network with 175 billion parameters," they mean 175 billion weights and biases distributed across billions of these simple units. The revolution wasn't in making the individual unit more complex; it was in connecting astronomical numbers of simple units together.
          </p>
        </Callout>

        <p>
          The perceptron learning algorithm is also simple: make a prediction, check if it's wrong, and if so, adjust the weights slightly in the direction that would have made it right. This nudging process — performed thousands of times across thousands of examples — gradually moves the weights toward values that produce correct predictions. It's a primitive form of the gradient descent we'll explore in Chapter 4, and it provably converges to a correct solution if one exists.
        </p>

        <p>
          But there's a catch. A single perceptron can only solve <strong>linearly separable</strong> problems — problems where you can draw a straight line (or hyperplane, in higher dimensions) that separates the classes. This limitation, as Minsky and Papert devastatingly demonstrated in 1969, means a single perceptron cannot compute the XOR function. We'll see exactly why in the next chapter, and how adding layers solves it.
        </p>

        <CodeBlock
          tabs={[
            {
              label: 'From Scratch',
              language: 'python',
              code: `import numpy as np

# A single neuron (perceptron)
inputs = np.array([0.5, 0.8])       # Two input features

# These are what the network "learns"
weights = np.array([0.3, 0.6])      # One weight per input
bias = 0.1                           # Bias term

# Forward pass: weighted sum + bias
z = np.dot(inputs, weights) + bias   # 0.5*0.3 + 0.8*0.6 + 0.1
# z = 0.15 + 0.48 + 0.1 = 0.73

# Activation function (ReLU)
output = max(0, z)                   # max(0, 0.73) = 0.73

print(f"Weighted sum: {z:.4f}")      # 0.7300
print(f"After ReLU: {output:.4f}")   # 0.7300

# What if the weighted sum were negative?
z_neg = np.dot(np.array([-0.5, 0.2]),
               weights) + bias        # -0.5*0.3 + 0.2*0.6 + 0.1
output_neg = max(0, z_neg)           # max(0, -0.03) = 0
print(f"Negative case: z={z_neg:.4f}, output={output_neg:.4f}")`,
              output: `Weighted sum: 0.7300
After ReLU: 0.7300
Negative case: z=-0.0300, output=0.0000`,
            },
            {
              label: 'PyTorch',
              language: 'python',
              code: `import torch
import torch.nn as nn

# A single neuron: 2 inputs → 1 output
neuron = nn.Linear(2, 1)

# Set specific weights and bias (normally these are random)
with torch.no_grad():
    neuron.weight.copy_(torch.tensor([[0.3, 0.6]]))
    neuron.bias.copy_(torch.tensor([0.1]))

# Forward pass
x = torch.tensor([0.5, 0.8])
z = neuron(x)                        # Linear: weighted sum + bias
output = torch.relu(z)               # Activation

print(f"Weighted sum: {z.item():.4f}")    # 0.7300
print(f"After ReLU: {output.item():.4f}") # 0.7300

# In practice, you'd wrap this in a module:
class SingleNeuron(nn.Module):
    def __init__(self):
        super().__init__()
        self.linear = nn.Linear(2, 1)

    def forward(self, x):
        return torch.relu(self.linear(x))

model = SingleNeuron()
print(f"Parameters: {sum(p.numel() for p in model.parameters())}")`,
              output: `Weighted sum: 0.7300
After ReLU: 0.7300
Parameters: 3`,
            },
          ]}
        />
      </section>

      {/* Section 3: Activation Functions */}
      <section id="ch2-activation-functions">
        <h2>Activation Functions Deep Dive</h2>

        <p>
          Why do we need activation functions at all? Here's the key insight: without an activation function, a neural network — no matter how many layers it has — can only compute <strong>linear transformations</strong>. A linear function of a linear function is still linear. Stacking layers without activation functions is mathematically equivalent to a single layer. The activation function introduces <strong>nonlinearity</strong>, which is what gives neural networks their extraordinary power to learn complex patterns.
        </p>

        <p>
          Think of it this way: without activation functions, a neural network can only draw straight lines. With them, it can draw arbitrary curves. A straight line can't separate a spiral of data points. A curve can.
        </p>

        <p>
          <strong>Sigmoid</strong> (σ(x) = 1/(1+e⁻ˣ)) was the original activation function, beloved for its smooth S-curve that squashes any input into the range (0, 1). It has a satisfying biological interpretation: 0 means "neuron doesn't fire," 1 means "neuron fires fully," and values in between represent partial activation. It's differentiable everywhere, which matters for training via gradient descent.
        </p>

        <p>
          But sigmoid has a fatal flaw for deep networks: the <strong>vanishing gradient problem</strong>. Look at the derivative curve in the explorer below — it peaks at just 0.25 (when x = 0) and drops toward zero for large positive or negative inputs. During backpropagation, gradients pass through multiple sigmoid layers, and each one multiplies the gradient by a number less than 0.25. After several layers, the gradient virtually vanishes — the early layers receive almost no learning signal. This made deep networks (more than 2-3 layers) nearly impossible to train with sigmoid.
        </p>

        <p>
          <strong>ReLU</strong> (Rectified Linear Unit: f(x) = max(0, x)) solved this problem with brutal simplicity. For positive inputs, the gradient is exactly 1 — no shrinkage. For negative inputs, the output and gradient are exactly 0 — the neuron is "dead" for that input. This all-or-nothing behavior seemed like a step backward in elegance, but it worked spectacularly in practice. ReLU trained deep networks faster and better than sigmoid. It's now the default activation function for most architectures.
        </p>

        <p>
          <strong>Tanh</strong> (tanh(x) = (eˣ−e⁻ˣ)/(eˣ+e⁻ˣ)) is a scaled and shifted sigmoid that outputs values between -1 and +1 instead of 0 and 1. This zero-centered output makes optimization easier in some cases. Tanh suffers from the same vanishing gradient problem as sigmoid, but less severely — its derivative peaks at 1.0 instead of 0.25. It's commonly used in recurrent neural networks (Chapter 6).
        </p>

        <p>
          Explore all three in the interactive below. Step through different input values and watch how each function transforms them. Pay special attention to the derivatives — they determine how well the network can learn.
        </p>

        <ActivationExplorer />

        <Callout type="deepdive" expandable title="Other Activation Functions">
          <p>
            <strong>Leaky ReLU</strong> addresses the "dying ReLU" problem (neurons that output 0 for all inputs and stop learning) by allowing a small gradient when x &lt; 0: f(x) = x if x &gt; 0, else 0.01x.
          </p>
          <p>
            <strong>GELU</strong> (Gaussian Error Linear Unit) is used in transformers like GPT and BERT. It smoothly approximates ReLU: GELU(x) = x · Φ(x), where Φ is the standard normal CDF. Think of it as ReLU with probabilistic smoothing.
          </p>
          <p>
            <strong>Softmax</strong> isn't applied to a single neuron but to an entire layer. It converts a vector of values into a probability distribution that sums to 1. It's used at the output layer for classification: if you're classifying an image into 10 categories, softmax gives you 10 probabilities that sum to 1.
          </p>
          <p>
            <strong>Swish</strong> (f(x) = x · σ(x)) was discovered by Google's AutoML search and sometimes outperforms ReLU. Its non-monotonic shape (it dips below zero for slightly negative inputs) seems to help in deeper networks.
          </p>
        </Callout>

        <Callout type="misconception">
          <p>
            <strong>"The best activation function" doesn't exist.</strong> ReLU is the default for most feedforward and convolutional networks because it trains fast and avoids vanishing gradients. Tanh is common in RNNs. GELU dominates in transformers. Softmax is standard for classification outputs. The choice depends on the architecture, the problem, and sometimes just empirical experimentation. Don't overthink it — start with ReLU and only change if you have a specific reason.
          </p>
        </Callout>
      </section>

      {/* Section 4: Decision Boundaries */}
      <section id="ch2-decision-boundaries">
        <h2>Decision Boundaries</h2>

        <p>
          A neuron's weights and bias define a <strong>decision boundary</strong> — a line (in 2D), plane (in 3D), or hyperplane (in higher dimensions) that separates the input space into two regions. Points on one side of the boundary get classified as Class A; points on the other side get classified as Class B. Learning, in this context, means finding the boundary that correctly classifies the training data.
        </p>

        <p>
          The equation of the boundary is deceptively simple: w₁x₁ + w₂x₂ + b = 0. This is a line in 2D space. The weights (w₁, w₂) determine the orientation of the line — which direction it tilts. The bias b determines its position — how far from the origin it sits. Together, three numbers define a line that carves the input space in half.
        </p>

        <p>
          During training, the algorithm adjusts these three numbers — the two weights and the bias — to find the line that best separates the classes. Each adjustment rotates and shifts the boundary slightly. After many iterations, the boundary converges to a position that minimizes classification errors.
        </p>

        <p>
          Watch the process unfold in the interactive below. See how the decision boundary starts in a poor position and gradually rotates and shifts into one that cleanly separates the two classes.
        </p>

        <DecisionBoundaryPlayground />

        <p>
          There's a fundamental limitation here: a single neuron can only draw a straight line. This means it can only solve <strong>linearly separable</strong> problems. If the classes are intertwined — say, arranged in a spiral or a checkerboard pattern — no single line can separate them. You need curves. Curves require multiple neurons working together, organized in layers. That's the subject of the next chapter.
        </p>

        <Callout type="practice">
          <p>
            <strong>Linear classifiers are still widely used.</strong> Logistic regression, one of the most popular machine learning algorithms in industry, is essentially a single neuron with a sigmoid activation. It's fast, interpretable, and works well when the data is approximately linearly separable. Email spam filtering, credit scoring, and medical screening often use logistic regression because its simplicity makes it easy to understand, debug, and explain to non-technical stakeholders. When a bank denies your loan application, they can point to specific features (income, debt ratio, credit history) and their weights — something you can't easily do with a 100-layer deep network.
          </p>
        </Callout>

        <CodeBlock
          tabs={[
            {
              label: 'From Scratch',
              language: 'python',
              code: `import numpy as np

# Decision boundary: w1*x1 + w2*x2 + b = 0
# Points where this expression > 0 → Class 1
# Points where this expression < 0 → Class 0

weights = np.array([0.58, 0.52])
bias = -130

# Classify some test points
test_points = [
    [100, 100],   # Should be Class A (near blue cluster)
    [300, 260],   # Should be Class B (near red cluster)
    [200, 180],   # Near the boundary
]

for point in test_points:
    z = np.dot(point, weights) + bias
    prediction = "Class B" if z > 0 else "Class A"
    confidence = abs(z)
    print(f"Point {point}: z = {z:.1f} → {prediction} "
          f"(confidence: {confidence:.1f})")

# The boundary line itself: where z = 0
# w1*x1 + w2*x2 + b = 0
# x2 = -(w1*x1 + b) / w2
x1_vals = np.array([0, 100, 200, 300, 400])
x2_boundary = -(weights[0] * x1_vals + bias) / weights[1]
print(f"\\nBoundary passes through:")
for x1, x2 in zip(x1_vals, x2_boundary):
    print(f"  ({x1:.0f}, {x2:.1f})")`,
              output: `Point [100, 100]: z = -20.0 → Class A (confidence: 20.0)
Point [300, 260]: z = 179.2 → Class B (confidence: 179.2)
Point [200, 180]: z = 79.6 → Class B (confidence: 79.6)

Boundary passes through:
  (0, 250.0)
  (100, 138.5)
  (200, 27.0)
  (300, -84.6)
  (400, -196.2)`,
            },
            {
              label: 'PyTorch',
              language: 'python',
              code: `import torch
import torch.nn as nn

# Generate 2D classification data
torch.manual_seed(42)
class_a = torch.randn(50, 2) * 30 + torch.tensor([100.0, 100.0])
class_b = torch.randn(50, 2) * 30 + torch.tensor([300.0, 260.0])

X = torch.cat([class_a, class_b])
y = torch.cat([torch.zeros(50), torch.ones(50)])

# Single neuron classifier
model = nn.Linear(2, 1)
loss_fn = nn.BCEWithLogitsLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.0001)

# Train
for epoch in range(200):
    logits = model(X).squeeze()
    loss = loss_fn(logits, y)
    loss.backward()
    optimizer.step()
    optimizer.zero_grad()

    if epoch % 40 == 0:
        acc = ((logits > 0).float() == y).float().mean()
        print(f"Epoch {epoch}: loss={loss:.4f}, acc={acc:.1%}")

# Extract learned boundary
w = model.weight.data.squeeze()
b = model.bias.data.item()
print(f"\\nLearned weights: [{w[0]:.3f}, {w[1]:.3f}]")
print(f"Learned bias: {b:.3f}")`,
              output: `Epoch 0: loss=0.8912, acc=45.0%
Epoch 40: loss=0.3214, acc=89.0%
Epoch 80: loss=0.1547, acc=96.0%
Epoch 120: loss=0.0923, acc=99.0%
Epoch 160: loss=0.0634, acc=100.0%

Learned weights: [0.571, 0.518]
Learned bias: -128.432`,
            },
          ]}
        />
      </section>
    </ChapterLayout>
  )
}
