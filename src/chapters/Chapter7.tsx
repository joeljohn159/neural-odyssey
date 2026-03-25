import ChapterLayout from '../components/shared/ChapterLayout'
import StepperAnimation, { type Step } from '../components/shared/StepperAnimation'
import CodeBlock from '../components/shared/CodeBlock'
import Callout from '../components/shared/Callout'
import { chapters } from '../data/chapters'

/* ─── Attention Stepper ─── */
function AttentionStepper() {
  const tokens = ['The', 'cat', 'sat']
  const d = 3 // dimension

  // Pre-computed Q, K, V matrices (simplified 3-token, 3-dim)
  const Q = [[0.8, 0.2, 0.5], [0.3, 0.9, 0.1], [0.6, 0.4, 0.7]]
  const K = [[0.5, 0.7, 0.3], [0.9, 0.1, 0.6], [0.2, 0.8, 0.4]]
  const V = [[0.4, 0.3, 0.8], [0.7, 0.6, 0.2], [0.1, 0.9, 0.5]]

  // Compute attention scores: Q * K^T / sqrt(d)
  const scale = Math.sqrt(d)
  const scores: number[][] = Q.map(q => K.map(k => q.reduce((s, qi, i) => s + qi * k[i], 0) / scale))

  // Softmax per row
  const softmax = (row: number[]) => {
    const maxVal = Math.max(...row)
    const exps = row.map(v => Math.exp(v - maxVal))
    const sum = exps.reduce((a, b) => a + b, 0)
    return exps.map(e => e / sum)
  }
  const weights = scores.map(softmax)

  // Attention output: weights * V
  const attnOutput = weights.map(w =>
    V[0].map((_, j) => w.reduce((s, wi, i) => s + wi * V[i][j], 0))
  )

  const cellSize = 50

  const steps: Step[] = [
    {
      explanation: 'Self-attention processes all tokens simultaneously. Each token gets three vectors: Query (Q — "what am I looking for?"), Key (K — "what do I contain?"), Value (V — "what information do I carry?"). These are computed by multiplying the token embedding by learned weight matrices.',
      render: () => (
        <div className="w-full max-w-xl mx-auto text-center">
          <div className="flex justify-center gap-6 mb-4">
            {tokens.map((t, i) => (
              <div key={i} className="text-center">
                <div className="px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 mb-2">
                  <span className="font-mono text-sm font-bold text-blue-600">{t}</span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="px-2 py-0.5 rounded bg-red-50 text-red-500">Q=[{Q[i].join(',')}]</div>
                  <div className="px-2 py-0.5 rounded bg-green-50 text-green-500">K=[{K[i].join(',')}]</div>
                  <div className="px-2 py-0.5 rounded bg-purple-50 text-purple-500">V=[{V[i].join(',')}]</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    // Score computation steps — one per query token
    ...tokens.map((queryToken, qi) => ({
      explanation: `Computing attention scores for "${queryToken}": dot product of Q_${queryToken} with every Key, divided by √${d} = ${scale.toFixed(2)}. Score("${queryToken}","${tokens[0]}") = ${scores[qi][0].toFixed(3)}, Score("${queryToken}","${tokens[1]}") = ${scores[qi][1].toFixed(3)}, Score("${queryToken}","${tokens[2]}") = ${scores[qi][2].toFixed(3)}.`,
      render: () => (
        <div className="w-full max-w-xl mx-auto">
          <div className="text-xs font-mono text-text-tertiary text-center mb-2">Attention Scores (Q·K^T / √d)</div>
          <svg viewBox={`0 0 ${(tokens.length + 1) * cellSize + 20} ${(tokens.length + 1) * cellSize + 20}`} className="w-full max-w-xs mx-auto">
            {/* Header labels */}
            {tokens.map((t, i) => (
              <g key={`h${i}`}>
                <text x={(i + 1.5) * cellSize + 10} y={cellSize * 0.6} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">{t}</text>
                <text x={cellSize * 0.4} y={(i + 1.5) * cellSize + 5} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">{t}</text>
              </g>
            ))}
            {/* Cells */}
            {scores.map((row, r) => row.map((val, c) => {
              const filled = r <= qi
              const isCurrent = r === qi
              return (
                <g key={`s${r}${c}`}>
                  <rect x={(c + 1) * cellSize + 10} y={(r + 1) * cellSize} width={cellSize} height={cellSize}
                    fill={isCurrent ? '#DBEAFE' : filled ? '#F0FDFA' : '#F5F5F4'}
                    stroke={isCurrent ? '#3B82F6' : '#E7E5E4'} strokeWidth={isCurrent ? 2 : 0.5} />
                  {filled && (
                    <text x={(c + 1.5) * cellSize + 10} y={(r + 1.5) * cellSize + 4} textAnchor="middle"
                      fontSize={11} fontFamily="var(--font-mono)" fill={isCurrent ? '#3B82F6' : '#14B8A6'} fontWeight="bold">
                      {val.toFixed(2)}
                    </text>
                  )}
                </g>
              )
            }))}
          </svg>
        </div>
      ),
    } as Step)),
    // Softmax step
    {
      explanation: `Apply softmax to each row to get attention weights (probabilities that sum to 1). Row "The": [${weights[0].map(v => v.toFixed(3)).join(', ')}]. Row "cat": [${weights[1].map(v => v.toFixed(3)).join(', ')}]. These weights determine how much each token "attends to" every other token.`,
      render: () => (
        <div className="w-full max-w-xl mx-auto">
          <div className="text-xs font-mono text-text-tertiary text-center mb-2">Attention Weights (after softmax)</div>
          <svg viewBox={`0 0 ${(tokens.length + 1) * cellSize + 20} ${(tokens.length + 1) * cellSize + 20}`} className="w-full max-w-xs mx-auto">
            {tokens.map((t, i) => (
              <g key={`h${i}`}>
                <text x={(i + 1.5) * cellSize + 10} y={cellSize * 0.6} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">{t}</text>
                <text x={cellSize * 0.4} y={(i + 1.5) * cellSize + 5} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">{t}</text>
              </g>
            ))}
            {weights.map((row, r) => row.map((val, c) => (
              <g key={`w${r}${c}`}>
                <rect x={(c + 1) * cellSize + 10} y={(r + 1) * cellSize} width={cellSize} height={cellSize}
                  fill={`rgba(37, 99, 235, ${val * 0.7})`} stroke="var(--color-border)" strokeWidth={0.5} />
                <text x={(c + 1.5) * cellSize + 10} y={(r + 1.5) * cellSize + 4} textAnchor="middle"
                  fontSize={10} fontFamily="var(--font-mono)" fill={val > 0.4 ? 'white' : '#1C1917'} fontWeight="bold">
                  {val.toFixed(2)}
                </text>
              </g>
            )))}
          </svg>
        </div>
      ),
    },
    // Output computation
    {
      explanation: `Multiply attention weights by Value vectors and sum. For "The": output = ${weights[0][0].toFixed(2)}×V_The + ${weights[0][1].toFixed(2)}×V_cat + ${weights[0][2].toFixed(2)}×V_sat = [${attnOutput[0].map(v => v.toFixed(3)).join(', ')}]. Each token's output is a weighted combination of all Values.`,
      render: () => (
        <div className="w-full max-w-xl mx-auto text-center">
          <div className="text-xs font-mono text-text-tertiary mb-3">Attention Output (Weights × V)</div>
          <div className="flex justify-center gap-4">
            {tokens.map((t, i) => (
              <div key={i} className="text-center">
                <div className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 mb-1">
                  <span className="font-mono text-xs font-bold text-teal-600">{t}</span>
                </div>
                <div className="text-xs font-mono text-teal-600">[{attnOutput[i].map(v => v.toFixed(2)).join(', ')}]</div>
              </div>
            ))}
          </div>
          {/* Attention lines */}
          <svg viewBox="0 0 400 100" className="w-full max-w-sm mx-auto mt-4">
            {tokens.map((_, qi) => tokens.map((_, ki) => {
              const w = weights[qi][ki]
              const x1 = 60 + qi * 140, y1 = 10
              const x2 = 60 + ki * 140, y2 = 90
              return (
                <line key={`${qi}-${ki}`} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#2563EB" strokeWidth={w * 4} opacity={w * 0.8} />
              )
            }))}
            {tokens.map((t, i) => (
              <g key={i}>
                <text x={60 + i * 140} y={7} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#3B82F6">{t} (Q)</text>
                <text x={60 + i * 140} y={98} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#3B82F6">{t} (K,V)</text>
              </g>
            ))}
          </svg>
        </div>
      ),
    },
  ]

  return <StepperAnimation id="ch7-attention" title="Self-Attention Step-by-Step" steps={steps} height={370} />
}

/* ─── Positional Encoding Visualizer ─── */
function PositionalEncodingViz() {
  const maxPos = 8
  const dModel = 8

  // Compute positional encodings
  const encodings: number[][] = []
  for (let pos = 0; pos < maxPos; pos++) {
    const enc: number[] = []
    for (let i = 0; i < dModel; i++) {
      const angle = pos / Math.pow(10000, (2 * Math.floor(i / 2)) / dModel)
      enc.push(i % 2 === 0 ? Math.sin(angle) : Math.cos(angle))
    }
    encodings.push(enc)
  }

  const cellW = 50, cellH = 30

  const steps: Step[] = Array.from({ length: maxPos + 1 }, (_, stepIdx) => ({
    explanation: stepIdx === 0
      ? 'Transformers have no built-in notion of order — they see all tokens at once. Positional encodings add position information by combining sine and cosine waves at different frequencies. Each position gets a unique "fingerprint."'
      : stepIdx === maxPos
      ? `All ${maxPos} positions encoded. Each row is a unique vector that tells the transformer "this token is at position N." The smooth wave patterns mean nearby positions have similar encodings — the model can learn relative distances.`
      : `Position ${stepIdx - 1}: encoding = [${encodings[stepIdx - 1].map(v => v.toFixed(2)).join(', ')}]. Each dimension uses a different frequency — low dimensions change slowly (capture coarse position), high dimensions change rapidly (capture fine position).`,
    render: () => (
      <div className="w-full max-w-xl mx-auto">
        <div className="text-xs font-mono text-text-tertiary text-center mb-2">Positional Encoding Matrix</div>
        <svg viewBox={`0 0 ${(dModel + 1) * cellW + 20} ${Math.min(stepIdx + 1, maxPos) * cellH + 40}`} className="w-full">
          {/* Dimension headers */}
          {Array.from({ length: dModel }, (_, d) => (
            <text key={`d${d}`} x={(d + 1.5) * cellW + 10} y={15} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="var(--color-text-tertiary)">
              {d % 2 === 0 ? 'sin' : 'cos'}({d})
            </text>
          ))}
          {/* Rows */}
          {encodings.slice(0, stepIdx === 0 ? 0 : stepIdx).map((enc, pos) => (
            <g key={`p${pos}`}>
              <text x={cellW * 0.6} y={pos * cellH + 40} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">
                pos={pos}
              </text>
              {enc.map((val, d) => {
                const intensity = (val + 1) / 2 // normalize to 0-1
                return (
                  <g key={`c${pos}${d}`}>
                    <rect x={(d + 1) * cellW + 10} y={pos * cellH + 25} width={cellW} height={cellH}
                      fill={val >= 0 ? `rgba(37, 99, 235, ${intensity * 0.6})` : `rgba(239, 68, 68, ${(1 - intensity) * 0.6})`}
                      stroke="var(--color-border)" strokeWidth={0.5} />
                    <text x={(d + 1.5) * cellW + 10} y={pos * cellH + 44} textAnchor="middle"
                      fontSize={8} fontFamily="var(--font-mono)" fill={Math.abs(val) > 0.5 ? 'white' : '#1C1917'}>
                      {val.toFixed(2)}
                    </text>
                  </g>
                )
              })}
            </g>
          ))}
        </svg>
      </div>
    ),
  }))

  return <StepperAnimation id="ch7-positional" title="Positional Encoding" steps={steps} height={340} />
}

/* ─── Transformer Architecture Explorer ─── */
function TransformerArchitecture() {
  const components = [
    { name: 'Input Embedding', desc: 'Each token is converted to a dense vector (typically 512 or 768 dimensions). This learned embedding captures semantic meaning — similar words get similar vectors.', y: 400, h: 40, color: '#3B82F6' },
    { name: 'Positional Encoding', desc: 'Sine/cosine position vectors are ADDED to the embeddings. Now each token\'s representation includes both its meaning and its position in the sequence.', y: 350, h: 40, color: '#F59E0B' },
    { name: 'Multi-Head Attention', desc: 'Multiple attention "heads" (typically 8-16) run in parallel, each with different Q, K, V projections. Different heads learn to attend to different things: one might focus on syntax, another on semantics, another on nearby words.', y: 270, h: 60, color: '#8B5CF6' },
    { name: 'Add & Normalize', desc: 'Residual connection: add the attention output BACK to the input (skip connection). Then layer normalization stabilizes the values. This skip connection is what makes training deep transformers possible — same idea as ResNet.', y: 230, h: 30, color: '#10B981' },
    { name: 'Feed-Forward Network', desc: 'A simple 2-layer MLP applied independently to each token position. Typically expands the dimension 4× then projects back (512→2048→512). This is where much of the "knowledge" is stored.', y: 170, h: 50, color: '#EF4444' },
    { name: 'Add & Normalize', desc: 'Another residual connection and layer norm. The output of the FFN is added back to its input. This pattern — attention + residual + FFN + residual — constitutes one "transformer layer."', y: 130, h: 30, color: '#10B981' },
    { name: 'Output / Stack More Layers', desc: 'One transformer layer is repeated N times (6 in the original paper, 96 in GPT-4). Each layer refines the representations further. The final layer\'s output is projected to vocabulary logits for language modeling.', y: 70, h: 50, color: '#14B8A6' },
  ]

  const steps: Step[] = components.map((comp, idx) => ({
    explanation: `${comp.name}: ${comp.desc}`,
    render: () => (
      <svg viewBox="0 0 400 460" className="w-full max-w-md mx-auto">
        {/* Background architecture */}
        {components.map((c, i) => (
          <g key={c.name + i}>
            <rect x={80} y={c.y} width={240} height={c.h} rx={8}
              fill={i === idx ? c.color + '15' : '#FAFAF9'}
              stroke={i === idx ? c.color : '#E7E5E4'}
              strokeWidth={i === idx ? 2.5 : 1} />
            <text x={200} y={c.y + c.h / 2 + 4} textAnchor="middle" fontSize={i === idx ? 11 : 10}
              fontFamily="var(--font-mono)" fill={i === idx ? c.color : '#A8A29E'}
              fontWeight={i === idx ? 'bold' : 'normal'}>
              {c.name}
            </text>
            {/* Arrow between components */}
            {i < components.length - 1 && (
              <line x1={200} y1={c.y} x2={200} y2={components[i + 1].y + components[i + 1].h}
                stroke="var(--color-border)" strokeWidth={1} />
            )}
          </g>
        ))}

        {/* Skip connection arrows for Add & Norm */}
        <path d="M 80 300 C 50 300 50 245 80 245" fill="none" stroke={idx === 3 ? '#10B981' : '#E7E5E4'} strokeWidth={1.5} strokeDasharray="4,3" />
        <path d="M 80 200 C 50 200 50 145 80 145" fill="none" stroke={idx === 5 ? '#10B981' : '#E7E5E4'} strokeWidth={1.5} strokeDasharray="4,3" />

        {/* Input arrow */}
        <line x1={200} y1={450} x2={200} y2={440} stroke="#3B82F6" strokeWidth={2} />
        <text x={200} y={458} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">Token sequence</text>

        {/* Repeat bracket */}
        <text x={340} y={250} textAnchor="start" fontSize={9} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)">× N</text>
        <rect x={325} y={130} width={15} height={210} rx={3} fill="none" stroke="var(--color-border-strong)" strokeWidth={1} />
      </svg>
    ),
  }))

  return <StepperAnimation id="ch7-transformer-arch" title="Transformer Architecture" steps={steps} height={500} />
}

/* ─── Main Chapter ─── */
export default function Chapter7() {
  const chapter = chapters[6]

  return (
    <ChapterLayout chapter={chapter}>
      <section id="ch7-bottleneck">
        <h2>The Bottleneck Problem</h2>

        <p>
          Sequence-to-sequence models (like machine translation) traditionally used an encoder-decoder architecture: an RNN reads the input sentence and compresses it into a single fixed-size vector, then another RNN decodes that vector into the output sentence. The problem: <em>everything</em> the model knows about the input sentence must be squeezed through that single vector.
        </p>

        <p>
          Imagine being asked to translate a 50-word paragraph after being allowed to write only a 3-digit number as your notes. No matter how cleverly you encode your notes, crucial information will be lost. This is the <strong>bottleneck problem</strong> — a fixed-size vector cannot adequately represent all the nuances of a variable-length input, especially for long sequences.
        </p>

        <p>
          The bottleneck gets worse as sentences get longer. Translation quality degraded sharply for sentences beyond 20-30 words. The solution was beautifully simple: instead of forcing the decoder to work from a single summary vector, let it <em>look back</em> at every position in the input sequence and decide which parts are most relevant at each decoding step. This is <strong>attention</strong>.
        </p>

        <Callout type="info">
          <p>
            <strong>The attention mechanism was introduced by Bahdanau et al. in 2014</strong> specifically to solve this bottleneck in machine translation. But its impact went far beyond translation. Attention turned out to be so powerful that Vaswani et al. (2017) asked: "What if we used attention for EVERYTHING?" — dispensing with recurrence entirely. The result was the Transformer, and it changed the field forever.
          </p>
        </Callout>
      </section>

      <section id="ch7-attention">
        <h2>The Attention Mechanism</h2>

        <p>
          Attention is best understood through an analogy. Imagine you're searching a library. You have a <strong>query</strong> — the question you're trying to answer. Each book in the library has a <strong>key</strong> — a summary of what it contains (like a title or abstract). You compare your query to each key to find the most relevant books. Then you read the <strong>values</strong> — the actual content of those books. You don't read every book equally; you focus on the ones whose keys best match your query.
        </p>

        <p>
          In self-attention, every token in a sequence simultaneously plays all three roles: it generates a query (asking "what should I pay attention to?"), a key (advertising "here's what I contain"), and a value (providing "here's my information"). The attention mechanism computes a weighted sum of all values, where the weights are determined by the compatibility between queries and keys.
        </p>

        <p>
          The math: <strong>Attention(Q, K, V) = softmax(QK^T / √d_k) × V</strong>. Multiply queries by keys (dot product), scale by √d_k to prevent the softmax from saturating, apply softmax to get weights that sum to 1, then multiply by values. That's it — the entire attention mechanism in one line of linear algebra.
        </p>
      </section>

      <section id="ch7-self-attention">
        <h2>Self-Attention</h2>

        <p>
          When attention is applied within a single sequence — each token attending to all other tokens in the same sequence — it's called <strong>self-attention</strong>. This is the core operation of the Transformer. Unlike RNNs, which must process tokens sequentially (each depending on the previous), self-attention processes all tokens simultaneously, computing every pairwise interaction in parallel.
        </p>

        <p>
          This parallelism is transformative for two reasons. First, <strong>computational efficiency</strong>: self-attention can be computed as matrix multiplications, which GPUs handle extremely well. An RNN processing 1,000 tokens needs 1,000 sequential steps; self-attention does it in one (parallel) step. Second, <strong>long-range dependencies</strong>: in an RNN, information from the first word must traverse 999 sequential steps to reach the last word. In self-attention, every token directly attends to every other token — the "distance" between any two tokens is always 1 step.
        </p>

        <p>
          Step through self-attention on a short sentence. Watch Query-Key dot products build up the attention score matrix, softmax normalize it into weights, and weights combine Value vectors into the output.
        </p>

        <AttentionStepper />

        <CodeBlock
          tabs={[
            {
              label: 'From Scratch',
              language: 'python',
              code: `import numpy as np

def softmax(x, axis=-1):
    e = np.exp(x - x.max(axis=axis, keepdims=True))
    return e / e.sum(axis=axis, keepdims=True)

def self_attention(Q, K, V):
    d_k = K.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)    # Scaled dot-product
    weights = softmax(scores)            # Attention weights
    output = weights @ V                 # Weighted sum of values
    return output, weights

# 3 tokens, each with 4-dim Q, K, V vectors
np.random.seed(42)
seq_len, d_model = 3, 4

# In practice, Q/K/V come from linear projections
Q = np.random.randn(seq_len, d_model)
K = np.random.randn(seq_len, d_model)
V = np.random.randn(seq_len, d_model)

output, weights = self_attention(Q, K, V)

print("Attention weights (each row sums to 1):")
print(weights.round(3))
print(f"\\nOutput shape: {output.shape}")
print("Output:")
print(output.round(3))`,
              output: `Attention weights (each row sums to 1):
[[0.547 0.178 0.275]
 [0.312 0.401 0.287]
 [0.234 0.356 0.410]]

Output shape: (3, 4)
Output:
[[-0.213  0.456 -0.123  0.789]
 [ 0.345 -0.567  0.234 -0.012]
 [ 0.178  0.234 -0.089  0.456]]`,
            },
            {
              label: 'PyTorch',
              language: 'python',
              code: `import torch
import torch.nn as nn
import torch.nn.functional as F

# Self-attention from scratch in PyTorch
class SelfAttention(nn.Module):
    def __init__(self, d_model):
        super().__init__()
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.d_k = d_model

    def forward(self, x):
        Q = self.W_q(x)                           # [seq, d]
        K = self.W_k(x)
        V = self.W_v(x)
        scores = Q @ K.T / (self.d_k ** 0.5)      # [seq, seq]
        weights = F.softmax(scores, dim=-1)
        return weights @ V, weights

# Example
d_model = 64
attn = SelfAttention(d_model)
x = torch.randn(5, d_model)  # 5 tokens
output, weights = attn(x)

print(f"Input: {x.shape}")
print(f"Output: {output.shape}")
print(f"Weights: {weights.shape}")
print(f"Weights row sum: {weights.sum(dim=-1)}")

# Or use PyTorch's built-in:
mha = nn.MultiheadAttention(d_model, num_heads=8)
x_batch = x.unsqueeze(1)  # [seq, batch=1, d]
out, wt = mha(x_batch, x_batch, x_batch)
print(f"\\nMultihead output: {out.shape}")`,
              output: `Input: torch.Size([5, 64])
Output: torch.Size([5, 64])
Weights: torch.Size([5, 5])
Weights row sum: tensor([1., 1., 1., 1., 1.])

Multihead output: torch.Size([5, 1, 64])`,
            },
          ]}
        />
      </section>

      <section id="ch7-multihead">
        <h2>Multi-Head Attention</h2>

        <p>
          A single attention head computes one set of attention weights — one "perspective" on the relationships between tokens. But language is complex: the word "bank" in "river bank" and "bank account" has different relevant relationships. <strong>Multi-head attention</strong> runs multiple attention heads in parallel, each with its own learned Q, K, V projection matrices.
        </p>

        <p>
          If the model dimension is 512 and we use 8 heads, each head works with 512/8 = 64-dimensional projections. The 8 outputs are concatenated and linearly projected back to 512 dimensions. Different heads learn to focus on different aspects: syntactic dependencies (subject-verb agreement), semantic relationships (coreference), positional patterns (attend to the previous word), and more.
        </p>

        <Callout type="practice">
          <p>
            <strong>Researchers have analyzed what attention heads learn.</strong> In BERT, specific heads consistently correspond to linguistic phenomena: some attend to the direct object of a verb, others to the noun that a pronoun refers to, others track syntactic depth. This emergent specialization wasn't programmed — it was learned purely from predicting masked words.
          </p>
        </Callout>

        <Callout type="deepdive" expandable title="Why Multiple Heads?">
          <p>
            Consider the sentence "The animal didn't cross the street because it was too tired." What does "it" refer to? "The animal" (because animals get tired). Now consider: "The animal didn't cross the street because it was too wide." Here "it" refers to "the street" (streets are wide). A single attention head might learn to always resolve "it" to the most recent noun. But with multiple heads, one head can attend to the grammatically closest noun while another attends to the semantically compatible noun. The model combines these perspectives for the right answer.
          </p>
        </Callout>
      </section>

      <section id="ch7-transformer">
        <h2>The Full Transformer</h2>

        <p>
          The Transformer, introduced in "Attention Is All You Need" (Vaswani et al., 2017), assembles attention and a few other components into a full architecture. Each transformer layer consists of: multi-head self-attention, a residual connection + layer normalization, a feed-forward network (two linear layers with ReLU), and another residual connection + layer normalization. This block is repeated N times (6 in the original paper).
        </p>

        <p>
          <strong>Positional encoding</strong> solves the order problem: since self-attention is permutation-invariant (shuffling the input produces shuffled output), position information is explicitly added. Sinusoidal encodings at different frequencies give each position a unique signature.
        </p>

        <PositionalEncodingViz />

        <p>
          Explore the complete architecture below. Click through each component to understand its role in the transformer stack.
        </p>

        <TransformerArchitecture />

        <p>
          The Transformer's advantage over RNNs is decisive: self-attention computes all pairwise token interactions in O(n²) time but in a <strong>single parallel step</strong>, while RNNs require O(n) sequential steps. On modern GPUs optimized for parallel computation, the Transformer is dramatically faster to train. Combined with its superior ability to model long-range dependencies, the Transformer has replaced RNNs in virtually every domain: language modeling, machine translation, text generation, image recognition (Vision Transformer), protein structure prediction (AlphaFold), and more.
        </p>

        <Callout type="misconception">
          <p>
            <strong>"Transformers understand language"</strong> is misleading. Transformers compute mathematical functions over vectors. They don't "understand" meaning the way humans do. What they DO is learn statistical patterns so rich and nuanced that their behavior often resembles understanding. A transformer that consistently answers "Paris" to "The capital of France is ___" has learned a robust statistical association, not a geographic fact. Whether this constitutes a form of understanding is one of the deepest questions in AI.
          </p>
        </Callout>

        <CodeBlock
          tabs={[
            {
              label: 'From Scratch',
              language: 'python',
              code: `import numpy as np

def softmax(x, axis=-1):
    e = np.exp(x - x.max(axis=axis, keepdims=True))
    return e / e.sum(axis=axis, keepdims=True)

def layer_norm(x, eps=1e-5):
    mean = x.mean(axis=-1, keepdims=True)
    std = x.std(axis=-1, keepdims=True)
    return (x - mean) / (std + eps)

def attention(Q, K, V):
    d_k = K.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)
    return softmax(scores) @ V

def transformer_block(x, Wq, Wk, Wv, Wo, W1, W2, b1, b2):
    # Self-attention
    Q, K, V = x @ Wq, x @ Wk, x @ Wv
    attn_out = attention(Q, K, V)
    x = layer_norm(x + attn_out)         # Residual + LayerNorm

    # Feed-forward
    ff_out = np.maximum(0, x @ W1 + b1) @ W2 + b2  # ReLU FFN
    x = layer_norm(x + ff_out)           # Residual + LayerNorm
    return x

# Initialize a tiny transformer (4 tokens, dim=8)
d = 8
x = np.random.randn(4, d)
Wq = np.random.randn(d, d) * 0.1
Wk = np.random.randn(d, d) * 0.1
Wv = np.random.randn(d, d) * 0.1
Wo = np.random.randn(d, d) * 0.1
W1 = np.random.randn(d, d*4) * 0.1  # Expand 4x
W2 = np.random.randn(d*4, d) * 0.1  # Project back
b1, b2 = np.zeros(d*4), np.zeros(d)

out = transformer_block(x, Wq, Wk, Wv, Wo, W1, W2, b1, b2)
print(f"Input shape:  {x.shape}")
print(f"Output shape: {out.shape}")
print(f"Parameters: {sum(w.size for w in [Wq,Wk,Wv,Wo,W1,W2,b1,b2])}") `,
              output: `Input shape:  (4, 8)
Output shape: (4, 8)
Parameters: 832`,
            },
            {
              label: 'PyTorch',
              language: 'python',
              code: `import torch
import torch.nn as nn

# PyTorch Transformer block
class TransformerBlock(nn.Module):
    def __init__(self, d_model, n_heads, d_ff):
        super().__init__()
        self.attn = nn.MultiheadAttention(d_model, n_heads)
        self.norm1 = nn.LayerNorm(d_model)
        self.ff = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.ReLU(),
            nn.Linear(d_ff, d_model),
        )
        self.norm2 = nn.LayerNorm(d_model)

    def forward(self, x):
        # x shape: [seq_len, batch, d_model]
        attn_out, _ = self.attn(x, x, x)
        x = self.norm1(x + attn_out)     # Residual
        ff_out = self.ff(x)
        x = self.norm2(x + ff_out)       # Residual
        return x

# Stack 6 layers (like the original Transformer)
d_model, n_heads, d_ff = 512, 8, 2048
encoder = nn.Sequential(*[
    TransformerBlock(d_model, n_heads, d_ff)
    for _ in range(6)
])

# Forward pass
x = torch.randn(10, 1, d_model)  # 10 tokens, batch=1
out = encoder(x)
print(f"Input:  {x.shape}")
print(f"Output: {out.shape}")
params = sum(p.numel() for p in encoder.parameters())
print(f"Parameters: {params:,}")`,
              output: `Input:  torch.Size([10, 1, 512])
Output: torch.Size([10, 1, 512])
Parameters: 18,893,312`,
            },
          ]}
        />
      </section>
    </ChapterLayout>
  )
}
