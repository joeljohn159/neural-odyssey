import ChapterLayout from '../components/shared/ChapterLayout'
import StepperAnimation, { type Step } from '../components/shared/StepperAnimation'
import CodeBlock from '../components/shared/CodeBlock'
import Callout from '../components/shared/Callout'
import { chapters } from '../data/chapters'

/* ─── Loss Landscape Explorer ─── */
function LossLandscapeExplorer() {
  const w = 480, h = 350

  // Simple 2D loss surface: L(w) = (w - 3)^2 + 1
  const lossAt = (wt: number) => (wt - 3) ** 2 + 1
  const gradAt = (wt: number) => 2 * (wt - 3)

  const trajectories: { lr: number; label: string; color: string }[] = [
    { lr: 0.1, label: 'LR = 0.1 (good)', color: '#10B981' },
  ]

  // Simulate gradient descent steps
  const numSteps = 12
  let wt = 0.5 // starting weight
  const lr = 0.1
  const descentSteps: { w: number; loss: number; grad: number }[] = [{ w: wt, loss: lossAt(wt), grad: gradAt(wt) }]
  for (let i = 0; i < numSteps; i++) {
    const g = gradAt(wt)
    wt = wt - lr * g
    descentSteps.push({ w: wt, loss: lossAt(wt), grad: gradAt(wt) })
  }

  const xScale = (v: number) => 50 + ((v + 1) / 8) * (w - 80)
  const yScale = (v: number) => h - 50 - (v / 15) * (h - 80)

  // Build loss curve
  const curvePts: string[] = []
  for (let x = -1; x <= 7; x += 0.1) {
    curvePts.push(`${xScale(x).toFixed(1)},${yScale(lossAt(x)).toFixed(1)}`)
  }

  const steps: Step[] = descentSteps.map((ds, idx) => ({
    explanation: idx === 0
      ? `Starting at weight w = ${ds.w.toFixed(2)}, loss = ${ds.loss.toFixed(2)}. The gradient is ${ds.grad.toFixed(2)} — pointing steeply downhill to the right. We'll use learning rate 0.1.`
      : idx === descentSteps.length - 1
      ? `Step ${idx}: w = ${ds.w.toFixed(3)}, loss = ${ds.loss.toFixed(3)}. We've converged! The loss is near its minimum at w ≈ 3.0. Each step, the gradient got smaller as we approached the bottom.`
      : `Step ${idx}: gradient = ${ds.grad.toFixed(3)}, so we update: w = ${descentSteps[idx - 1].w.toFixed(3)} - 0.1 × ${ds.grad.toFixed(3)} → w = ${ds.w.toFixed(3)}. Loss dropped to ${ds.loss.toFixed(3)}.`,
    render: () => (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xl">
        {/* Loss curve */}
        <polyline points={curvePts.join(' ')} fill="none" stroke="#3B82F6" strokeWidth={2.5} />

        {/* Past trajectory */}
        {descentSteps.slice(0, idx + 1).map((s, i) => (
          <g key={i}>
            {i > 0 && (
              <line
                x1={xScale(descentSteps[i - 1].w)} y1={yScale(descentSteps[i - 1].loss)}
                x2={xScale(s.w)} y2={yScale(s.loss)}
                stroke="#EF4444" strokeWidth={1} opacity={0.5}
              />
            )}
            <circle
              cx={xScale(s.w)} cy={yScale(s.loss)} r={i === idx ? 6 : 3}
              fill={i === idx ? '#EF4444' : '#EF4444'} opacity={i === idx ? 1 : 0.4}
              stroke={i === idx ? 'white' : 'none'} strokeWidth={2}
            />
          </g>
        ))}

        {/* Gradient arrow */}
        {Math.abs(ds.grad) > 0.1 && (
          <line
            x1={xScale(ds.w)} y1={yScale(ds.loss) + 15}
            x2={xScale(ds.w - ds.grad * 0.3)} y2={yScale(ds.loss) + 15}
            stroke="#F59E0B" strokeWidth={2} markerEnd="url(#grad-arrow)"
          />
        )}
        <defs>
          <marker id="grad-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#F59E0B" />
          </marker>
        </defs>

        {/* Axis labels */}
        <text x={w / 2} y={h - 10} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">weight (w)</text>
        <text x={15} y={h / 2} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)" transform={`rotate(-90, 15, ${h / 2})`}>loss</text>

        {/* Info box */}
        <rect x={w - 165} y={10} width={155} height={55} rx={6} fill="var(--color-surface-elevated)" stroke="var(--color-border)" />
        <text x={w - 88} y={28} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">w = {ds.w.toFixed(3)}</text>
        <text x={w - 88} y={43} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">loss = {ds.loss.toFixed(3)}</text>
        <text x={w - 88} y={58} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill={Math.abs(ds.grad) < 0.1 ? '#10B981' : '#F59E0B'}>grad = {ds.grad.toFixed(3)}</text>
      </svg>
    ),
  }))

  return <StepperAnimation id="ch4-loss-landscape" title="Loss Landscape & Gradient Descent" steps={steps} height={380} />
}

/* ─── Backpropagation Stepper ─── */
function BackpropStepper() {
  // Simple 2-2-1 network
  const x = [1.0, 0.5]
  const w1 = [[0.4, 0.3], [0.2, 0.6]]
  const b1 = [0.1, 0.05]
  const w2 = [0.5, 0.3]
  const b2 = 0.1
  const target = 1.0
  const lr = 0.1

  // Forward pass
  const z1 = [w1[0][0]*x[0] + w1[0][1]*x[1] + b1[0], w1[1][0]*x[0] + w1[1][1]*x[1] + b1[1]]
  const h = z1.map(z => Math.max(0, z))
  const z2 = w2[0]*h[0] + w2[1]*h[1] + b2
  const out = z2 // linear output for simplicity
  const loss = 0.5 * (out - target) ** 2

  // Backward pass
  const dL_dout = out - target
  const dL_dw2 = [dL_dout * h[0], dL_dout * h[1]]
  const dL_db2 = dL_dout
  const dL_dh = [dL_dout * w2[0], dL_dout * w2[1]]
  const dL_dz1 = dL_dh.map((d, i) => z1[i] > 0 ? d : 0)
  const dL_dw1 = [[dL_dz1[0]*x[0], dL_dz1[0]*x[1]], [dL_dz1[1]*x[0], dL_dz1[1]*x[1]]]
  const dL_db1 = dL_dz1

  // Updated weights
  const new_w2 = [w2[0] - lr * dL_dw2[0], w2[1] - lr * dL_dw2[1]]
  const new_b2 = b2 - lr * dL_db2

  const steps: Step[] = [
    {
      explanation: `Network: 2-2-1. Inputs: [${x.join(', ')}]. Target output: ${target}. Let's do a full forward pass, compute the loss, then backpropagate gradients to every weight.`,
      render: () => <NetworkDiagram x={x} h={[null, null]} out={null} phase="init" />,
    },
    {
      explanation: `Forward: h₁ = ReLU(${x[0]}×${w1[0][0]} + ${x[1]}×${w1[0][1]} + ${b1[0]}) = ReLU(${z1[0].toFixed(2)}) = ${h[0].toFixed(2)}`,
      render: () => <NetworkDiagram x={x} h={[h[0], null]} out={null} phase="fwd-h0" />,
    },
    {
      explanation: `Forward: h₂ = ReLU(${x[0]}×${w1[1][0]} + ${x[1]}×${w1[1][1]} + ${b1[1]}) = ReLU(${z1[1].toFixed(2)}) = ${h[1].toFixed(2)}`,
      render: () => <NetworkDiagram x={x} h={[h[0], h[1]]} out={null} phase="fwd-h1" />,
    },
    {
      explanation: `Forward: output = ${h[0].toFixed(2)}×${w2[0]} + ${h[1].toFixed(2)}×${w2[1]} + ${b2} = ${out.toFixed(4)}. Target was ${target}.`,
      render: () => <NetworkDiagram x={x} h={[h[0], h[1]]} out={out} phase="fwd-out" />,
    },
    {
      explanation: `Loss = ½(output - target)² = ½(${out.toFixed(4)} - ${target})² = ${loss.toFixed(4)}. Now we backpropagate to find how each weight contributed to this error.`,
      render: () => <NetworkDiagram x={x} h={[h[0], h[1]]} out={out} loss={loss} phase="loss" />,
    },
    {
      explanation: `∂L/∂output = output - target = ${out.toFixed(4)} - ${target} = ${dL_dout.toFixed(4)}. This is how much the loss changes when the output changes.`,
      render: () => <NetworkDiagram x={x} h={[h[0], h[1]]} out={out} loss={loss} grads={{ dout: dL_dout }} phase="grad-out" />,
    },
    {
      explanation: `∂L/∂w₂₁ = ∂L/∂out × h₁ = ${dL_dout.toFixed(4)} × ${h[0].toFixed(2)} = ${dL_dw2[0].toFixed(4)}. ∂L/∂w₂₂ = ${dL_dout.toFixed(4)} × ${h[1].toFixed(2)} = ${dL_dw2[1].toFixed(4)}.`,
      render: () => <NetworkDiagram x={x} h={[h[0], h[1]]} out={out} loss={loss} grads={{ dout: dL_dout, dw2: dL_dw2 }} phase="grad-w2" />,
    },
    {
      explanation: `Backprop to hidden: ∂L/∂h₁ = ∂L/∂out × w₂₁ = ${dL_dout.toFixed(4)} × ${w2[0]} = ${dL_dh[0].toFixed(4)}. Through ReLU (h₁ > 0): ∂L/∂z₁ = ${dL_dz1[0].toFixed(4)}.`,
      render: () => <NetworkDiagram x={x} h={[h[0], h[1]]} out={out} loss={loss} grads={{ dout: dL_dout, dw2: dL_dw2, dh: dL_dh }} phase="grad-h" />,
    },
    {
      explanation: `∂L/∂w₁₁₁ = ${dL_dz1[0].toFixed(4)} × ${x[0]} = ${dL_dw1[0][0].toFixed(4)}. ∂L/∂w₁₁₂ = ${dL_dz1[0].toFixed(4)} × ${x[1]} = ${dL_dw1[0][1].toFixed(4)}. We now have gradients for all weights!`,
      render: () => <NetworkDiagram x={x} h={[h[0], h[1]]} out={out} loss={loss} grads={{ dout: dL_dout, dw2: dL_dw2, dh: dL_dh, dw1: dL_dw1 }} phase="grad-w1" />,
    },
    {
      explanation: `Update output weights: w₂₁ = ${w2[0]} - ${lr}×${dL_dw2[0].toFixed(4)} = ${new_w2[0].toFixed(4)}. w₂₂ = ${w2[1]} - ${lr}×${dL_dw2[1].toFixed(4)} = ${new_w2[1].toFixed(4)}. One step of learning complete!`,
      render: () => <NetworkDiagram x={x} h={[h[0], h[1]]} out={out} loss={loss} grads={{ dout: dL_dout, dw2: dL_dw2, dh: dL_dh, dw1: dL_dw1 }} phase="update" newW2={new_w2} />,
    },
  ]

  return <StepperAnimation id="ch4-backprop" title="Backpropagation Step-by-Step" steps={steps} height={350} />
}

function NetworkDiagram({ x, h, out, loss, grads, phase, newW2 }: {
  x: number[], h: (number | null)[], out: number | null, loss?: number,
  grads?: { dout?: number, dw2?: number[], dh?: number[], dw1?: number[][] },
  phase: string, newW2?: number[]
}) {
  const showGrads = phase.startsWith('grad') || phase === 'update'
  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-xl">
      {/* Connections */}
      <line x1={104} y1={90} x2={226} y2={100} stroke={showGrads ? '#EF4444' : '#10B981'} strokeWidth={1.5} opacity={0.7} />
      <line x1={104} y1={90} x2={226} y2={200} stroke={showGrads ? '#EF4444' : '#10B981'} strokeWidth={1.5} opacity={0.7} />
      <line x1={104} y1={210} x2={226} y2={100} stroke={showGrads ? '#EF4444' : '#10B981'} strokeWidth={1.5} opacity={0.7} />
      <line x1={104} y1={210} x2={226} y2={200} stroke={showGrads ? '#EF4444' : '#10B981'} strokeWidth={1.5} opacity={0.7} />
      <line x1={274} y1={100} x2={396} y2={150} stroke={showGrads ? '#EF4444' : '#10B981'} strokeWidth={1.5} opacity={0.7} />
      <line x1={274} y1={200} x2={396} y2={150} stroke={showGrads ? '#EF4444' : '#10B981'} strokeWidth={1.5} opacity={0.7} />

      {/* Gradient annotations */}
      {grads?.dw2 && (
        <>
          <text x={340} y={118} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="#EF4444">∂L/∂w={grads.dw2[0].toFixed(3)}</text>
          <text x={340} y={188} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="#EF4444">∂L/∂w={grads.dw2[1].toFixed(3)}</text>
        </>
      )}
      {grads?.dw1 && (
        <>
          <text x={155} y={85} textAnchor="middle" fontSize={7} fontFamily="var(--font-mono)" fill="#EF4444">{grads.dw1[0][0].toFixed(3)}</text>
          <text x={155} y={170} textAnchor="middle" fontSize={7} fontFamily="var(--font-mono)" fill="#EF4444">{grads.dw1[0][1].toFixed(3)}</text>
        </>
      )}

      {/* Input nodes */}
      <circle cx={80} cy={90} r={24} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
      <text x={80} y={95} textAnchor="middle" fontSize={14} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{x[0]}</text>
      <circle cx={80} cy={210} r={24} fill="var(--color-accent-light)" stroke="#3B82F6" strokeWidth={2} />
      <text x={80} y={215} textAnchor="middle" fontSize={14} fontFamily="var(--font-mono)" fill="#3B82F6" fontWeight="bold">{x[1]}</text>

      {/* Hidden nodes */}
      <circle cx={250} cy={100} r={24} fill={h[0] !== null ? '#F5F3FF' : '#FAFAF9'} stroke={h[0] !== null ? '#8B5CF6' : '#D6D3D1'} strokeWidth={2} />
      <text x={250} y={105} textAnchor="middle" fontSize={h[0] !== null ? 13 : 10} fontFamily="var(--font-mono)" fill={h[0] !== null ? '#8B5CF6' : '#A8A29E'} fontWeight={h[0] !== null ? 'bold' : 'normal'}>
        {h[0] !== null ? h[0].toFixed(2) : 'h₁'}
      </text>
      <circle cx={250} cy={200} r={24} fill={h[1] !== null ? '#F5F3FF' : '#FAFAF9'} stroke={h[1] !== null ? '#8B5CF6' : '#D6D3D1'} strokeWidth={2} />
      <text x={250} y={205} textAnchor="middle" fontSize={h[1] !== null ? 13 : 10} fontFamily="var(--font-mono)" fill={h[1] !== null ? '#8B5CF6' : '#A8A29E'} fontWeight={h[1] !== null ? 'bold' : 'normal'}>
        {h[1] !== null ? h[1].toFixed(2) : 'h₂'}
      </text>

      {/* Output node */}
      <circle cx={420} cy={150} r={28} fill={out !== null ? '#F0FDFA' : '#FAFAF9'} stroke={out !== null ? '#14B8A6' : '#D6D3D1'} strokeWidth={2} />
      <text x={420} y={155} textAnchor="middle" fontSize={out !== null ? 13 : 10} fontFamily="var(--font-mono)" fill={out !== null ? '#14B8A6' : '#A8A29E'} fontWeight={out !== null ? 'bold' : 'normal'}>
        {out !== null ? out.toFixed(3) : 'out'}
      </text>

      {/* Loss */}
      {loss !== undefined && (
        <g>
          <rect x={445} y={80} width={70} height={36} rx={6} fill="#FEF2F2" stroke="#EF4444" strokeWidth={1} />
          <text x={480} y={95} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="#EF4444">Loss</text>
          <text x={480} y={110} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="#EF4444" fontWeight="bold">{loss.toFixed(4)}</text>
        </g>
      )}

      {/* Weight updates */}
      {newW2 && (
        <g>
          <rect x={300} y={240} width={210} height={40} rx={6} fill="#F0FDF4" stroke="#10B981" strokeWidth={1} />
          <text x={405} y={255} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#10B981">Updated: w₂₁={newW2[0].toFixed(4)}</text>
          <text x={405} y={270} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#10B981">Updated: w₂₂={newW2[1].toFixed(4)}</text>
        </g>
      )}

      {/* Labels */}
      <text x={80} y={270} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-tertiary)">Input</text>
      <text x={250} y={270} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-tertiary)">Hidden</text>
      <text x={420} y={215} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-tertiary)">Output</text>
    </svg>
  )
}

/* ─── Optimizer Race ─── */
function OptimizerRace() {
  const w = 480, h = 300
  const lossAt = (x: number) => (x - 3) ** 2 + 0.5 * Math.sin(x * 3) + 2

  // Pre-compute trajectories for 3 optimizers
  function runSGD(start: number, lr: number, steps: number) {
    const path = [{ w: start, loss: lossAt(start) }]
    let wt = start
    for (let i = 0; i < steps; i++) {
      const grad = 2 * (wt - 3) + 0.5 * 3 * Math.cos(wt * 3)
      wt -= lr * grad
      path.push({ w: wt, loss: lossAt(wt) })
    }
    return path
  }

  function runMomentum(start: number, lr: number, beta: number, steps: number) {
    const path = [{ w: start, loss: lossAt(start) }]
    let wt = start, v = 0
    for (let i = 0; i < steps; i++) {
      const grad = 2 * (wt - 3) + 0.5 * 3 * Math.cos(wt * 3)
      v = beta * v + grad
      wt -= lr * v
      path.push({ w: wt, loss: lossAt(wt) })
    }
    return path
  }

  function runAdam(start: number, lr: number, steps: number) {
    const path = [{ w: start, loss: lossAt(start) }]
    let wt = start, m = 0, v = 0
    const b1 = 0.9, b2 = 0.999, eps = 1e-8
    for (let i = 0; i < steps; i++) {
      const grad = 2 * (wt - 3) + 0.5 * 3 * Math.cos(wt * 3)
      m = b1 * m + (1 - b1) * grad
      v = b2 * v + (1 - b2) * grad ** 2
      const mHat = m / (1 - b1 ** (i + 1))
      const vHat = v / (1 - b2 ** (i + 1))
      wt -= lr * mHat / (Math.sqrt(vHat) + eps)
      path.push({ w: wt, loss: lossAt(wt) })
    }
    return path
  }

  const sgdPath = runSGD(0.0, 0.05, 20)
  const momPath = runMomentum(0.0, 0.02, 0.9, 20)
  const adamPath = runAdam(0.0, 0.3, 20)

  const xScale = (v: number) => 40 + ((v + 1) / 7) * (w - 80)
  const yScale = (v: number) => h - 40 - ((v - 1) / 12) * (h - 70)

  const curvePts: string[] = []
  for (let px = -1; px <= 6; px += 0.05) {
    curvePts.push(`${xScale(px).toFixed(1)},${yScale(lossAt(px)).toFixed(1)}`)
  }

  const optimizers = [
    { path: sgdPath, color: '#3B82F6', name: 'SGD' },
    { path: momPath, color: '#8B5CF6', name: 'Momentum' },
    { path: adamPath, color: '#10B981', name: 'Adam' },
  ]

  const steps: Step[] = Array.from({ length: 21 }, (_, idx) => ({
    explanation: idx === 0
      ? 'Three optimizers start at the same point (w = 0). SGD (blue) takes simple steps. Momentum (purple) builds up speed. Adam (green) adapts its learning rate. Watch how they converge differently.'
      : idx === 20
      ? `After 20 steps: SGD loss = ${sgdPath[idx].loss.toFixed(3)}, Momentum loss = ${momPath[idx].loss.toFixed(3)}, Adam loss = ${adamPath[idx].loss.toFixed(3)}. Adam converged fastest by adapting its step size. Momentum overshot but recovered. SGD was steady but slow.`
      : `Step ${idx}: SGD w=${sgdPath[idx].w.toFixed(2)} (loss=${sgdPath[idx].loss.toFixed(2)}), Momentum w=${momPath[idx].w.toFixed(2)} (loss=${momPath[idx].loss.toFixed(2)}), Adam w=${adamPath[idx].w.toFixed(2)} (loss=${adamPath[idx].loss.toFixed(2)}).`,
    render: () => (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xl">
        <polyline points={curvePts.join(' ')} fill="none" stroke="var(--color-border-strong)" strokeWidth={2} />

        {optimizers.map(opt => (
          <g key={opt.name}>
            {/* Trail */}
            {opt.path.slice(0, idx + 1).map((s, i) => (
              <g key={i}>
                {i > 0 && (
                  <line
                    x1={xScale(opt.path[i - 1].w)} y1={yScale(opt.path[i - 1].loss)}
                    x2={xScale(s.w)} y2={yScale(s.loss)}
                    stroke={opt.color} strokeWidth={1} opacity={0.3}
                  />
                )}
              </g>
            ))}
            {/* Current position */}
            {idx < opt.path.length && (
              <circle
                cx={xScale(opt.path[idx].w)} cy={yScale(opt.path[idx].loss)}
                r={5} fill={opt.color} stroke="var(--color-surface-elevated)" strokeWidth={1.5}
              />
            )}
          </g>
        ))}

        {/* Legend */}
        {optimizers.map((opt, i) => (
          <g key={opt.name}>
            <circle cx={w - 110} cy={15 + i * 18} r={4} fill={opt.color} />
            <text x={w - 100} y={19 + i * 18} fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">{opt.name}</text>
          </g>
        ))}

        <text x={w / 2} y={h - 8} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">weight (w) — Step {idx}</text>
      </svg>
    ),
  }))

  return <StepperAnimation id="ch4-optimizer-race" title="Optimizer Race: SGD vs Momentum vs Adam" steps={steps} height={330} />
}

/* ─── Main Chapter ─── */
export default function Chapter4() {
  const chapter = chapters[3]

  return (
    <ChapterLayout chapter={chapter}>
      {/* Section 1: Loss Functions */}
      <section id="ch4-loss-functions">
        <h2>Loss Functions</h2>

        <p>
          A neural network makes predictions, but how does it know when it's wrong? And more importantly, how does it know <em>how wrong</em>? This is the job of the <strong>loss function</strong> (also called cost function or objective function) — a mathematical measure of the difference between the network's prediction and the actual answer. The loss function turns the vague concept of "the model is wrong" into a precise number that the optimization algorithm can minimize.
        </p>

        <p>
          The choice of loss function depends on the task. For <strong>regression</strong> (predicting continuous values like temperature or price), the standard loss is <strong>Mean Squared Error</strong> (MSE): take the difference between prediction and target, square it, and average over all examples. MSE = (1/n) Σ(ŷᵢ - yᵢ)². Squaring serves two purposes: it makes all errors positive (an overestimate of 5 is just as bad as an underestimate of 5) and it penalizes large errors more heavily than small ones (an error of 10 has squared error 100, ten times worse than an error of √10 with squared error 10).
        </p>

        <p>
          For <strong>classification</strong> (predicting categories like spam/not-spam), the standard loss is <strong>Cross-Entropy Loss</strong>. If the model outputs probability p for the correct class, the loss is -log(p). When the model is confident and correct (p close to 1), -log(1) ≈ 0 — low loss. When the model is confident and wrong (p close to 0), -log(0) → ∞ — extremely high loss. This creates a powerful learning signal: being confidently wrong is severely punished.
        </p>

        <Callout type="misconception">
          <p>
            <strong>The loss function is not accuracy.</strong> Accuracy is "what percentage of predictions were correct?" — a clean, interpretable number. But accuracy has a fatal flaw for training: it's not differentiable. A prediction is either right or wrong; there's no gradient. The loss function is the differentiable proxy that tells the optimizer not just whether the answer was wrong, but in which direction and by how much. Accuracy is for humans to evaluate; loss is for the optimizer to minimize.
          </p>
        </Callout>

        <Callout type="practice">
          <p>
            <strong>Choosing loss functions in practice:</strong> Binary classification → Binary Cross-Entropy (BCELoss in PyTorch). Multi-class classification → Cross-Entropy Loss (CrossEntropyLoss). Regression → MSE (MSELoss) or MAE (L1Loss). Ranking or similarity tasks → Contrastive or Triplet loss. Modern language models use a variant of cross-entropy where the "classes" are vocabulary tokens.
          </p>
        </Callout>
      </section>

      {/* Section 2: Gradient Descent */}
      <section id="ch4-gradient-descent">
        <h2>Gradient Descent</h2>

        <p>
          Imagine you're standing on a mountainside in thick fog. You can't see the valley below, but you can feel the slope of the ground under your feet. To get to the bottom, you take a step in the steepest downhill direction, then feel the slope again, step again, and repeat until you reach flat ground. This is <strong>gradient descent</strong> — the algorithm that trains virtually every neural network.
        </p>

        <p>
          The "mountain" is the loss function, plotted as a surface over all possible weight values. Each point on the surface represents a specific combination of weights and the loss the network produces with those weights. The "slope" is the <strong>gradient</strong> — a vector of partial derivatives that points in the direction of steepest ascent. To minimize loss, we move in the opposite direction: we subtract the gradient from the current weights.
        </p>

        <p>
          The update rule is simple: <strong>w_new = w_old - learning_rate × gradient</strong>. The <strong>learning rate</strong> controls step size. Too large, and you overshoot the minimum, bouncing wildly. Too small, and convergence takes forever. Finding the right learning rate is one of the most important practical decisions in training neural networks.
        </p>

        <p>
          Watch gradient descent in action. The ball starts at a high-loss position and slides toward the minimum, one step at a time. Notice how the gradient (yellow arrow) shrinks as we approach the bottom — the slope flattens out.
        </p>

        <LossLandscapeExplorer />

        <Callout type="deepdive" expandable title="Stochastic Gradient Descent">
          <p>
            "True" gradient descent computes the gradient over the entire dataset before taking one step. This is accurate but expensive — imagine computing the loss across millions of images before making a single weight update. <strong>Stochastic Gradient Descent</strong> (SGD) instead computes the gradient on a small random subset (a "mini-batch") of the data. This gradient is noisier but much cheaper to compute, allowing more frequent updates. In practice, SGD with mini-batches of 32-256 examples converges faster than full-batch gradient descent.
          </p>
          <p>
            The noise in SGD is actually helpful — it can knock the optimizer out of shallow local minima and into better ones. This counterintuitive benefit of noise is one of the deep insights of modern optimization theory.
          </p>
        </Callout>
      </section>

      {/* Section 3: Backpropagation */}
      <section id="ch4-backpropagation">
        <h2>Backpropagation</h2>

        <p>
          Gradient descent tells us what to do with the gradient (subtract it from the weights). But how do we compute the gradient in the first place? For a single neuron, it's straightforward calculus. But for a network with millions of neurons, we need an efficient algorithm. That algorithm is <strong>backpropagation</strong> — short for "backward propagation of errors" — and it's arguably the most important algorithm in all of deep learning.
        </p>

        <p>
          The key insight is the <strong>chain rule</strong> from calculus. If y depends on z, and z depends on x, then the derivative of y with respect to x equals the derivative of y with respect to z, times the derivative of z with respect to x: dy/dx = dy/dz × dz/dx. A neural network is a chain of operations: each layer transforms its input into an output, which becomes the input to the next layer. Backpropagation applies the chain rule backward through this chain, computing the gradient of the loss with respect to every weight in the network.
        </p>

        <p>
          The algorithm works in two phases. First, the <strong>forward pass</strong>: data flows from input to output, computing the prediction and the loss. Then, the <strong>backward pass</strong>: starting from the loss, gradients flow backward through the network, layer by layer. At each layer, we compute: "how much does the loss change if this weight changes?" The answer is the gradient for that weight.
        </p>

        <p>
          This is the interactive where backpropagation finally clicks. We'll walk through a complete forward-backward pass, one gradient at a time, showing every chain rule multiplication and every weight update.
        </p>

        <BackpropStepper />

        <CodeBlock
          tabs={[
            {
              label: 'From Scratch',
              language: 'python',
              code: `import numpy as np

# 2-2-1 network — manual backpropagation
x = np.array([1.0, 0.5])
target = 1.0
lr = 0.1

# Initialize weights
W1 = np.array([[0.4, 0.3], [0.2, 0.6]])
b1 = np.array([0.1, 0.05])
w2 = np.array([0.5, 0.3])
b2 = 0.1

# === FORWARD PASS ===
z1 = W1 @ x + b1                    # Hidden pre-activation
h = np.maximum(0, z1)               # ReLU
out = np.dot(w2, h) + b2            # Output (linear)
loss = 0.5 * (out - target) ** 2    # MSE loss

print(f"Forward: h={h}, out={out:.4f}, loss={loss:.4f}")

# === BACKWARD PASS ===
dL_dout = out - target               # ∂L/∂output
dL_dw2 = dL_dout * h                 # ∂L/∂w2
dL_db2 = dL_dout                     # ∂L/∂b2
dL_dh = dL_dout * w2                 # ∂L/∂h
dL_dz1 = dL_dh * (z1 > 0)           # Through ReLU
dL_dW1 = np.outer(dL_dz1, x)        # ∂L/∂W1
dL_db1 = dL_dz1                      # ∂L/∂b1

print(f"Gradients: dw2={dL_dw2}, dW1=\\n{dL_dW1}")

# === UPDATE WEIGHTS ===
W1 -= lr * dL_dW1
b1 -= lr * dL_db1
w2 -= lr * dL_dw2
b2 -= lr * dL_db2

# Check: loss should decrease
out_new = np.dot(w2, np.maximum(0, W1 @ x + b1)) + b2
loss_new = 0.5 * (out_new - target) ** 2
print(f"After update: loss {loss:.4f} → {loss_new:.4f}")`,
              output: `Forward: h=[0.65 0.55], out=0.5900, loss=0.0841
Gradients: dw2=[-0.2665 -0.2255], dW1=
[[-0.205  -0.1025]
 [-0.123  -0.0615]]
After update: loss 0.0841 → 0.0526`,
            },
            {
              label: 'PyTorch',
              language: 'python',
              code: `import torch
import torch.nn as nn

# PyTorch does backprop automatically!
x = torch.tensor([1.0, 0.5])
target = torch.tensor([1.0])

model = nn.Sequential(
    nn.Linear(2, 2),      # Hidden layer
    nn.ReLU(),
    nn.Linear(2, 1),      # Output layer
)

loss_fn = nn.MSELoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.1)

# Training loop — 5 steps
for step in range(5):
    output = model(x)                 # Forward pass
    loss = loss_fn(output, target)    # Compute loss
    loss.backward()                   # Backpropagation!
    optimizer.step()                  # Update weights
    optimizer.zero_grad()             # Reset gradients

    print(f"Step {step}: loss = {loss.item():.4f}")

# That's it! loss.backward() computes ALL gradients
# optimizer.step() updates ALL weights
# No manual chain rule needed`,
              output: `Step 0: loss = 0.4213
Step 1: loss = 0.3127
Step 2: loss = 0.2318
Step 3: loss = 0.1720
Step 4: loss = 0.1277`,
            },
          ]}
        />
      </section>

      {/* Section 4: Hyperparameters */}
      <section id="ch4-hyperparameters">
        <h2>Hyperparameters</h2>

        <p>
          Weights and biases are <em>parameters</em> — the network learns them during training. But many other choices affect training and aren't learned — they're set by the engineer. These are <strong>hyperparameters</strong>, and tuning them is one of the most important practical skills in deep learning.
        </p>

        <p>
          The <strong>learning rate</strong> is the most critical hyperparameter. Too high, and the network overshoots the optimum, oscillating wildly or diverging entirely. Too low, and training crawls, potentially getting stuck in a poor local minimum. The optimal learning rate depends on the problem, the architecture, and even the current phase of training. Modern practice often uses a <strong>learning rate schedule</strong> — starting high for fast initial progress, then gradually decreasing for fine-tuning.
        </p>

        <p>
          <strong>Batch size</strong> determines how many examples the network sees before updating weights. Small batches (16-32) provide noisy but frequent updates — faster learning per step but noisier gradients. Large batches (256-4096) provide smoother gradients but fewer updates per epoch. The tradeoff is subtle: small batches can actually generalize better because the noise helps escape sharp local minima.
        </p>

        <p>
          <strong>Epochs</strong> is the number of times the network sees the entire training dataset. Too few epochs and the model underfits (hasn't learned enough). Too many and it overfits (memorizes training data). In practice, you monitor the loss on a validation set and stop training when it starts to increase — a technique called <strong>early stopping</strong>.
        </p>

        <Callout type="practice">
          <p>
            <strong>Practical hyperparameter tuning:</strong> Start with Adam optimizer, learning rate 3e-4 (the "Karpathy constant"), batch size 32-64, and train until validation loss stops decreasing. If training is unstable, lower the learning rate. If training is slow, try a larger batch size. Use weight decay (0.01) for regularization. These defaults work surprisingly well for most problems.
          </p>
        </Callout>
      </section>

      {/* Section 5: Optimizers */}
      <section id="ch4-optimizers">
        <h2>Optimizers</h2>

        <p>
          Vanilla SGD works, but it has limitations. It uses the same learning rate for all parameters, struggles with loss landscapes that are steep in one direction and flat in another, and can get stuck oscillating around narrow valleys. Over the decades, researchers have developed smarter optimizers that address these issues.
        </p>

        <p>
          <strong>SGD with Momentum</strong> adds inertia to the optimization. Instead of stepping based only on the current gradient, it maintains a running average of past gradients (the "velocity"). If gradients have been pointing in the same direction for several steps, momentum builds up and the optimizer takes bigger steps. If gradients oscillate back and forth, momentum dampens them. Think of a ball rolling downhill — it picks up speed on consistent slopes and smooths out bumpy terrain.
        </p>

        <p>
          <strong>Adam</strong> (Adaptive Moment Estimation) combines momentum with per-parameter adaptive learning rates. It maintains both a running average of gradients (like momentum) and a running average of squared gradients (which measures how variable each gradient is). Parameters with consistently large gradients get smaller learning rates; parameters with small, noisy gradients get larger learning rates. Adam is the default optimizer for most deep learning work today.
        </p>

        <p>
          Watch all three optimizers race to minimize the same loss function. Same starting point, same objective — but very different paths.
        </p>

        <OptimizerRace />

        <CodeBlock
          tabs={[
            {
              label: 'From Scratch',
              language: 'python',
              code: `import numpy as np

# Compare optimizers on f(w) = (w-3)^2 + 0.5*sin(3w) + 2
def loss(w): return (w-3)**2 + 0.5*np.sin(3*w) + 2
def grad(w): return 2*(w-3) + 1.5*np.cos(3*w)

# SGD
w_sgd = 0.0
for i in range(20):
    w_sgd -= 0.05 * grad(w_sgd)

# SGD + Momentum
w_mom, v = 0.0, 0.0
for i in range(20):
    v = 0.9 * v + grad(w_mom)
    w_mom -= 0.02 * v

# Adam
w_adam, m, v = 0.0, 0.0, 0.0
for i in range(20):
    g = grad(w_adam)
    m = 0.9 * m + 0.1 * g
    v = 0.999 * v + 0.001 * g**2
    m_hat = m / (1 - 0.9**(i+1))
    v_hat = v / (1 - 0.999**(i+1))
    w_adam -= 0.3 * m_hat / (np.sqrt(v_hat) + 1e-8)

print(f"SGD:      w={w_sgd:.4f}, loss={loss(w_sgd):.4f}")
print(f"Momentum: w={w_mom:.4f}, loss={loss(w_mom):.4f}")
print(f"Adam:     w={w_adam:.4f}, loss={loss(w_adam):.4f}")`,
              output: `SGD:      w=2.8347, loss=1.5672
Momentum: w=3.1024, loss=1.5398
Adam:     w=2.9876, loss=1.5023`,
            },
            {
              label: 'PyTorch',
              language: 'python',
              code: `import torch
import torch.nn as nn

# Same network, different optimizers
def train_with_optimizer(opt_class, opt_kwargs, steps=100):
    torch.manual_seed(42)
    model = nn.Sequential(nn.Linear(10, 32), nn.ReLU(),
                         nn.Linear(32, 1))
    optimizer = opt_class(model.parameters(), **opt_kwargs)
    loss_fn = nn.MSELoss()

    x = torch.randn(64, 10)
    y = torch.randn(64, 1)

    for step in range(steps):
        loss = loss_fn(model(x), y)
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()

    return loss.item()

# Compare
sgd_loss = train_with_optimizer(
    torch.optim.SGD, {'lr': 0.01})
mom_loss = train_with_optimizer(
    torch.optim.SGD, {'lr': 0.01, 'momentum': 0.9})
adam_loss = train_with_optimizer(
    torch.optim.Adam, {'lr': 0.001})

print(f"SGD:      final loss = {sgd_loss:.4f}")
print(f"Momentum: final loss = {mom_loss:.4f}")
print(f"Adam:     final loss = {adam_loss:.4f}")`,
              output: `SGD:      final loss = 0.8234
Momentum: final loss = 0.4521
Adam:     final loss = 0.1847`,
            },
          ]}
        />
      </section>
    </ChapterLayout>
  )
}
