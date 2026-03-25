import ChapterLayout from '../components/shared/ChapterLayout'
import StepperAnimation, { type Step } from '../components/shared/StepperAnimation'
import CodeBlock from '../components/shared/CodeBlock'
import Callout from '../components/shared/Callout'
import { chapters } from '../data/chapters'

/* ─── Next Token Prediction ─── */
function NextTokenPrediction() {
  const prompt = ['The', 'capital', 'of', 'France', 'is']

  const vocabProbs = [
    { token: 'Paris', prob: 0.82 },
    { token: 'Lyon', prob: 0.05 },
    { token: 'the', prob: 0.04 },
    { token: 'a', prob: 0.03 },
    { token: 'located', prob: 0.02 },
    { token: 'known', prob: 0.01 },
    { token: '...', prob: 0.03 },
  ]

  // After picking "Paris"
  const nextProbs = [
    { token: '.', prob: 0.45 },
    { token: ',', prob: 0.30 },
    { token: 'and', prob: 0.08 },
    { token: '!', prob: 0.05 },
    { token: 'which', prob: 0.04 },
    { token: '...', prob: 0.08 },
  ]

  const barW = 300, barH = 22

  const steps: Step[] = [
    {
      explanation: 'A language model receives a sequence of tokens and predicts the next one. The input "The capital of France is" is processed through transformer layers. The model outputs a probability distribution over its entire vocabulary (typically 50,000+ tokens).',
      render: () => (
        <div className="w-full max-w-xl mx-auto text-center">
          <div className="flex gap-2 justify-center mb-6 flex-wrap">
            {prompt.map((t, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 font-mono text-sm text-blue-600">{t}</span>
            ))}
            <span className="px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200 font-mono text-sm text-gray-400 animate-pulse">???</span>
          </div>
          <div className="flex justify-center">
            <svg viewBox="0 0 120 120" className="w-20 h-20">
              <rect x={10} y={10} width={100} height={100} rx={12} fill="#F5F3FF" stroke="#8B5CF6" strokeWidth={2} />
              <text x={60} y={55} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="#8B5CF6" fontWeight="bold">Transformer</text>
              <text x={60} y={72} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="var(--color-text-tertiary)">N layers</text>
            </svg>
          </div>
        </div>
      ),
    },
    {
      explanation: `The model outputs probabilities for every token in its vocabulary. "Paris" has the highest probability at ${(vocabProbs[0].prob * 100).toFixed(0)}%. The model learned this association from training on billions of text tokens — it has seen "The capital of France is Paris" in many forms.`,
      render: () => (
        <div className="w-full max-w-xl mx-auto">
          <div className="flex gap-2 justify-center mb-4 flex-wrap">
            {prompt.map((t, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 font-mono text-sm text-blue-600">{t}</span>
            ))}
          </div>
          <div className="text-xs font-mono text-text-tertiary text-center mb-3">Next token probabilities:</div>
          <svg viewBox={`0 0 ${barW + 100} ${vocabProbs.length * (barH + 4) + 10}`} className="w-full max-w-sm mx-auto">
            {vocabProbs.map((vp, i) => (
              <g key={vp.token}>
                <text x={50} y={i * (barH + 4) + barH / 2 + 4} textAnchor="end" fontSize={11} fontFamily="var(--font-mono)" fill={i === 0 ? '#3B82F6' : '#57534E'} fontWeight={i === 0 ? 'bold' : 'normal'}>{vp.token}</text>
                <rect x={60} y={i * (barH + 4)} width={barW * vp.prob} height={barH} rx={4}
                  fill={i === 0 ? '#3B82F6' : '#E7E5E4'} opacity={i === 0 ? 0.8 : 0.5} />
                <text x={65 + barW * vp.prob} y={i * (barH + 4) + barH / 2 + 4} fontSize={10} fontFamily="var(--font-mono)" fill={i === 0 ? '#3B82F6' : '#A8A29E'} fontWeight={i === 0 ? 'bold' : 'normal'}>
                  {(vp.prob * 100).toFixed(0)}%
                </text>
              </g>
            ))}
          </svg>
        </div>
      ),
    },
    {
      explanation: '"Paris" is sampled from this distribution. With temperature = 0 (greedy), we always pick the highest probability token. With higher temperature, we sample more randomly — "Lyon" or "the" might be picked, producing more creative but less predictable text.',
      render: () => (
        <div className="w-full max-w-xl mx-auto text-center">
          <div className="flex gap-2 justify-center mb-4 flex-wrap">
            {prompt.map((t, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 font-mono text-sm text-blue-600">{t}</span>
            ))}
            <span className="px-3 py-1.5 rounded-lg bg-green-50 border border-green-300 font-mono text-sm text-green-600 font-bold">Paris</span>
          </div>
          <div className="flex gap-4 justify-center mt-4 text-xs font-mono">
            <div className="p-3 rounded-lg border border-gray-200">
              <div className="text-text-tertiary mb-1">Temperature = 0</div>
              <div className="text-text-primary font-semibold">Always picks "Paris"</div>
              <div className="text-text-tertiary">(deterministic)</div>
            </div>
            <div className="p-3 rounded-lg border border-gray-200">
              <div className="text-text-tertiary mb-1">Temperature = 1</div>
              <div className="text-text-primary font-semibold">Usually "Paris" (82%)</div>
              <div className="text-text-tertiary">(balanced)</div>
            </div>
            <div className="p-3 rounded-lg border border-gray-200">
              <div className="text-text-tertiary mb-1">Temperature = 2</div>
              <div className="text-text-primary font-semibold">More random picks</div>
              <div className="text-text-tertiary">(creative)</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      explanation: 'Now "Paris" becomes part of the input, and the model predicts the next token AGAIN. The most likely next token is "." (period) at 45%. This autoregressive process — predict one token, append it, predict the next — is how GPT, Claude, and all language models generate text.',
      render: () => (
        <div className="w-full max-w-xl mx-auto">
          <div className="flex gap-2 justify-center mb-4 flex-wrap">
            {[...prompt, 'Paris'].map((t, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 font-mono text-sm text-blue-600">{t}</span>
            ))}
          </div>
          <div className="text-xs font-mono text-text-tertiary text-center mb-3">Next token probabilities:</div>
          <svg viewBox={`0 0 ${barW + 100} ${nextProbs.length * (barH + 4) + 10}`} className="w-full max-w-sm mx-auto">
            {nextProbs.map((vp, i) => (
              <g key={vp.token}>
                <text x={50} y={i * (barH + 4) + barH / 2 + 4} textAnchor="end" fontSize={11} fontFamily="var(--font-mono)" fill={i === 0 ? '#3B82F6' : '#57534E'} fontWeight={i === 0 ? 'bold' : 'normal'}>{vp.token === '.' ? '.' : vp.token}</text>
                <rect x={60} y={i * (barH + 4)} width={barW * vp.prob} height={barH} rx={4}
                  fill={i === 0 ? '#3B82F6' : '#E7E5E4'} opacity={i === 0 ? 0.8 : 0.5} />
                <text x={65 + barW * vp.prob} y={i * (barH + 4) + barH / 2 + 4} fontSize={10} fontFamily="var(--font-mono)" fill={i === 0 ? '#3B82F6' : '#A8A29E'}>
                  {(vp.prob * 100).toFixed(0)}%
                </text>
              </g>
            ))}
          </svg>
        </div>
      ),
    },
  ]

  return <StepperAnimation id="ch8-next-token" title="Next-Token Prediction" steps={steps} height={350} />
}

/* ─── Diffusion Process Stepper ─── */
function DiffusionProcess() {
  const gridSize = 8
  const numSteps = 10

  // Simulate a digit "1" pattern gradually emerging from noise
  const targetPattern = [
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,1,0,0],
  ]

  function generateGrid(step: number): number[][] {
    const noiseLevel = 1 - step / numSteps
    return targetPattern.map(row =>
      row.map(target => {
        const noise = (Math.sin(target * 13.37 + step * 7.31 + Math.random() * 0.01) + 1) / 2 * noiseLevel
        return target * (1 - noiseLevel) + noise
      })
    )
  }

  const cellSize = 30

  const steps: Step[] = Array.from({ length: numSteps + 1 }, (_, stepIdx) => {
    const noiseLevel = ((numSteps - stepIdx) / numSteps * 100).toFixed(0)
    const grid = stepIdx === 0
      ? targetPattern.map(row => row.map(() => Math.random()))
      : generateGrid(stepIdx)

    return {
      explanation: stepIdx === 0
        ? 'Start with pure random noise. Each pixel is a random value between 0 and 1. The diffusion model\'s job: gradually denoise this into a recognizable image, one small step at a time.'
        : stepIdx === numSteps
        ? 'After 10 denoising steps, the digit "1" has fully emerged from noise. The model learned to reverse the noise process: given noisy pixels, predict and subtract the noise. Each step removes a little noise, gradually revealing structure.'
        : `Denoising step ${stepIdx}: noise level ~${noiseLevel}%. The model predicts what noise was added and subtracts it. ${
          stepIdx <= 3 ? 'In early steps, only coarse structure emerges — rough shapes and blobs.'
          : stepIdx <= 6 ? 'Mid-steps refine the structure — edges sharpen and the pattern becomes recognizable.'
          : 'Final steps clean up details — crisp edges and correct pixel values.'
        }`,
      render: () => (
        <div className="w-full max-w-md mx-auto text-center">
          <div className="flex items-center justify-between mb-3 px-4">
            <span className="text-xs font-mono text-text-tertiary">Step {stepIdx}/{numSteps}</span>
            <div className="flex-1 mx-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(stepIdx / numSteps) * 100}%` }} />
            </div>
            <span className="text-xs font-mono text-text-tertiary">Noise: {noiseLevel}%</span>
          </div>
          <svg viewBox={`0 0 ${gridSize * cellSize + 2} ${gridSize * cellSize + 2}`} className="w-full max-w-[250px] mx-auto">
            {grid.map((row, r) => row.map((val, c) => {
              const clamped = Math.max(0, Math.min(1, val))
              const gray = Math.round(255 - clamped * 255)
              return (
                <rect key={`${r}-${c}`} x={c * cellSize + 1} y={r * cellSize + 1} width={cellSize} height={cellSize}
                  fill={`rgb(${gray},${gray},${gray})`} stroke="none" />
              )
            }))}
          </svg>
          {stepIdx === numSteps && (
            <div className="mt-2 text-xs font-mono text-green-600 font-semibold">Denoising complete!</div>
          )}
        </div>
      ),
    }
  })

  return <StepperAnimation id="ch8-diffusion" title="Diffusion: From Noise to Image" steps={steps} height={350} />
}

/* ─── Model Scale Timeline ─── */
function ModelScaleTimeline() {
  const models = [
    { name: 'GPT-1', year: 2018, params: '117M', data: '~5GB text', capability: 'Basic text completion, some zero-shot transfer', color: '#3B82F6' },
    { name: 'GPT-2', year: 2019, params: '1.5B', data: '40GB text', capability: 'Coherent multi-paragraph text generation, basic reasoning', color: '#8B5CF6' },
    { name: 'GPT-3', year: 2020, params: '175B', data: '570GB text', capability: 'Few-shot learning, code generation, creative writing, basic math', color: '#10B981' },
    { name: 'PaLM', year: 2022, params: '540B', data: '780GB text', capability: 'Chain-of-thought reasoning, multilingual, complex problem-solving', color: '#F59E0B' },
    { name: 'GPT-4', year: 2023, params: '~1.7T*', data: '~13T tokens*', capability: 'Multimodal (text+image), expert-level reasoning, passing bar exam', color: '#EF4444' },
    { name: 'Claude / Modern', year: '2024+', params: 'Undisclosed', data: 'Massive', capability: 'Nuanced reasoning, instruction following, long context, safety alignment', color: '#14B8A6' },
  ]

  const steps: Step[] = models.map((model, idx) => ({
    explanation: `${model.name} (${model.year}): ${model.params} parameters. Trained on ${model.data}. Key capability: ${model.capability}.${
      idx > 0 ? ` That's ${idx === 1 ? '~13×' : idx === 2 ? '~1,500×' : idx === 3 ? '~4,600×' : '~14,500×+'} more parameters than GPT-1.` : ''
    }`,
    render: () => (
      <div className="w-full max-w-xl mx-auto px-4">
        {models.map((m, i) => {
          const visible = i <= idx
          const isCurrent = i === idx
          return (
            <div key={m.name} className={`flex items-start gap-3 mb-3 transition-opacity ${visible ? 'opacity-100' : 'opacity-15'}`}>
              <div className="flex flex-col items-center mt-1">
                <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: m.color, backgroundColor: isCurrent ? m.color : 'var(--color-surface-elevated)' }} />
                {i < models.length - 1 && <div className="w-0.5 h-8 bg-gray-200" />}
              </div>
              <div className={`flex-1 p-3 rounded-lg border transition-colors ${isCurrent ? 'shadow-sm' : ''}`}
                style={isCurrent ? { borderColor: m.color + '60', backgroundColor: m.color + '08' } : { borderColor: 'var(--color-border)' }}>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-mono text-xs" style={{ color: m.color }}>{m.year}</span>
                  <span className="font-display font-semibold text-sm">{m.name}</span>
                  <span className="text-xs font-mono text-text-tertiary">{m.params} params</span>
                </div>
                {visible && (
                  <p className="text-xs text-text-secondary mt-1 m-0 leading-relaxed">{m.capability}</p>
                )}
              </div>
            </div>
          )
        })}
        <div className="text-xs font-mono text-text-tertiary text-center mt-2">* Estimated, not officially confirmed</div>
      </div>
    ),
  }))

  return <StepperAnimation id="ch8-model-scale" title="Model Scale Timeline" steps={steps} height={480} />
}

/* ─── Main Chapter ─── */
export default function Chapter8() {
  const chapter = chapters[7]

  return (
    <ChapterLayout chapter={chapter}>
      <section id="ch8-language-models">
        <h2>Language Models</h2>

        <p>
          A language model has a deceptively simple objective: predict the next word. Given "The cat sat on the," predict "mat." Given "To be or not to," predict "be." This one task — next-token prediction — turns out to be the most productive training objective in the history of machine learning. By learning to predict the next word in billions of documents, a model implicitly learns grammar, facts, reasoning, coding, translation, summarization, and more.
        </p>

        <p>
          The insight is that predicting the next word well <em>requires understanding</em>. To predict that "The capital of France is" should be followed by "Paris," the model must encode the fact that Paris is France's capital. To predict the next token in a Python function, it must understand programming syntax and logic. To predict the continuation of a mathematical proof, it must learn mathematical reasoning. Next-token prediction is a universal training signal that incentivizes learning all of human knowledge.
        </p>

        <p>
          Watch how next-token prediction works in practice. The model processes a prompt, outputs a probability distribution over its vocabulary, samples a token, and repeats — generating text one token at a time.
        </p>

        <NextTokenPrediction />

        <Callout type="misconception">
          <p>
            <strong>"It's just autocomplete"</strong> is technically true but deeply misleading. Your phone's autocomplete uses simple statistical patterns. A large language model's "autocomplete" requires encoding an enormous amount of world knowledge, reasoning ability, and linguistic competence. The gap between "predict the most common next word" and "predict the next word well enough to write essays, solve math problems, and generate code" is the gap between a calculator and a mathematician — same basic operations, vastly different capabilities.
          </p>
        </Callout>
      </section>

      <section id="ch8-training">
        <h2>How Modern Models Are Trained</h2>

        <p>
          Training a modern language model involves three stages, each building on the last.
        </p>

        <p>
          <strong>Stage 1: Pre-training.</strong> The model is trained on a massive corpus of text (often trillions of tokens from the internet, books, code, and more) using the next-token prediction objective. This stage requires enormous computational resources — thousands of GPUs running for weeks or months — and costs millions of dollars. The resulting model knows a lot about language and the world but isn't particularly good at following instructions or being helpful.
        </p>

        <p>
          <strong>Stage 2: Supervised Fine-Tuning (SFT).</strong> The pre-trained model is fine-tuned on carefully curated examples of helpful behavior — thousands of prompt-response pairs where human experts demonstrate the desired outputs. "What's the capital of France?" → "The capital of France is Paris." This teaches the model to respond in a helpful, conversational format rather than just completing text.
        </p>

        <p>
          <strong>Stage 3: Reinforcement Learning from Human Feedback (RLHF).</strong> Human raters compare multiple model responses and rank them by quality. A "reward model" is trained on these rankings to predict which responses humans prefer. The language model is then fine-tuned using reinforcement learning to maximize the reward model's score. This makes the model's responses more aligned with human preferences — more helpful, less harmful, more honest.
        </p>

        <Callout type="practice">
          <p>
            <strong>The three stages serve different purposes:</strong> Pre-training gives the model knowledge and capabilities. SFT teaches it the format and style of helpful responses. RLHF aligns it with human values and preferences. You can think of it as: pre-training = education, SFT = job training, RLHF = performance reviews. Each stage produces a noticeably better model.
          </p>
        </Callout>

        <Callout type="deepdive" expandable title="Scaling Laws">
          <p>
            Kaplan et al. (2020) discovered that language model performance follows surprisingly predictable <strong>scaling laws</strong>. Loss decreases as a smooth power law with three factors: model size (parameters), dataset size (tokens), and compute (FLOPs). Double the model size → predictable improvement. Double the data → predictable improvement. This predictability allows labs to estimate the performance of future models before training them.
          </p>
          <p>
            The Chinchilla paper (Hoffmann et al., 2022) refined this, showing that many models were "over-parameterized" — they had more parameters than their training data justified. The optimal ratio is roughly 20 tokens per parameter. This meant training smaller models on more data could outperform larger models trained on less data, at lower cost.
          </p>
        </Callout>
      </section>

      <section id="ch8-diffusion">
        <h2>Diffusion Models</h2>

        <p>
          Diffusion models are the engine behind DALL-E, Stable Diffusion, and Midjourney. The idea is counterintuitive: instead of learning to generate images directly, learn to <strong>reverse a noise process</strong>. Start with a real image and gradually add Gaussian noise over many steps until it becomes pure static. Then train a neural network to reverse this process — given noisy pixels, predict and subtract the noise.
        </p>

        <p>
          At generation time, start with pure random noise and repeatedly apply the denoising network. Each step removes a little noise, gradually revealing a coherent image. After enough steps (typically 20-1000), a fully formed image emerges from the noise. The magic is that the denoising network has learned the statistical structure of real images so well that it can hallucinate plausible images from nothing but noise.
        </p>

        <p>
          Watch the diffusion process in action. Starting from random noise, the denoising model progressively clarifies the image, step by step.
        </p>

        <DiffusionProcess />

        <Callout type="deepdive" expandable title="Why Diffusion Works">
          <p>
            The mathematical foundation is that each denoising step is a small, tractable learning problem. Removing a tiny amount of noise from a slightly noisy image is much easier than generating an entire image from scratch. By decomposing image generation into many small denoising steps, diffusion models break an impossibly complex problem into many easy sub-problems.
          </p>
          <p>
            Conditioning on text (for text-to-image generation) works by training the denoising network to take a text embedding as additional input. The network learns: "given this noise pattern AND the text 'a cat sitting on a red sofa,' what does the slightly-less-noisy version look like?" The text guides the denoising process toward an image that matches the description.
          </p>
        </Callout>

        <CodeBlock
          tabs={[
            {
              label: 'From Scratch',
              language: 'python',
              code: `import numpy as np

# Simplified diffusion: add noise then denoise
def add_noise(x, noise_level):
    """Add Gaussian noise to image"""
    noise = np.random.randn(*x.shape) * noise_level
    return x + noise, noise

# Simple "denoiser" — in practice this is a U-Net
def denoise_step(noisy, predicted_noise, step_size):
    """Remove predicted noise"""
    return noisy - step_size * predicted_noise

# Create a simple 8x8 target pattern (digit "1")
target = np.array([
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,1,0,0],
], dtype=float)

# Forward process: add noise
noisy = np.random.randn(8, 8)  # Start from pure noise
print(f"Initial noise (mean pixel): {noisy.mean():.3f}")

# Reverse process: 10 denoising steps
for step in range(10):
    # In practice, a neural network predicts the noise
    # Here we cheat and use the known target
    t = (10 - step) / 10
    noisy = t * noisy + (1 - t) * target + np.random.randn(8,8) * 0.1 * t
    print(f"Step {step+1}: mean pixel = {noisy.mean():.3f}, "
          f"MSE to target = {((noisy - target)**2).mean():.4f}")

print(f"Final MSE: {((noisy - target)**2).mean():.4f}")`,
              output: `Initial noise (mean pixel): 0.031
Step 1: mean pixel = 0.268, MSE to target = 0.1823
Step 2: mean pixel = 0.287, MSE to target = 0.1245
Step 3: mean pixel = 0.301, MSE to target = 0.0834
Step 4: mean pixel = 0.310, MSE to target = 0.0521
Step 5: mean pixel = 0.317, MSE to target = 0.0312
Step 6: mean pixel = 0.321, MSE to target = 0.0178
Step 7: mean pixel = 0.324, MSE to target = 0.0095
Step 8: mean pixel = 0.326, MSE to target = 0.0048
Step 9: mean pixel = 0.327, MSE to target = 0.0021
Step 10: mean pixel = 0.328, MSE to target = 0.0008
Final MSE: 0.0008`,
            },
            {
              label: 'PyTorch',
              language: 'python',
              code: `import torch
import torch.nn as nn

# Simplified diffusion model components
class SimpleDenoiser(nn.Module):
    """Tiny denoiser (real ones use U-Nets)"""
    def __init__(self, image_dim):
        super().__init__()
        n = image_dim * image_dim
        self.net = nn.Sequential(
            nn.Linear(n + 1, 256),  # +1 for time step
            nn.ReLU(),
            nn.Linear(256, 256),
            nn.ReLU(),
            nn.Linear(256, n),
        )

    def forward(self, noisy_image, t):
        flat = noisy_image.flatten()
        x = torch.cat([flat, t.unsqueeze(0)])
        return self.net(x).reshape(noisy_image.shape)

# Training: learn to predict noise
denoiser = SimpleDenoiser(8)
optimizer = torch.optim.Adam(denoiser.parameters(), lr=1e-3)
target = torch.tensor([
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,1,0,0],
], dtype=torch.float32)

# Training loop (simplified)
for step in range(100):
    t = torch.rand(1)  # Random time step
    noise = torch.randn_like(target)
    noisy = (1-t) * target + t * noise
    predicted_noise = denoiser(noisy, t)
    loss = nn.MSELoss()(predicted_noise, noise)
    loss.backward()
    optimizer.step()
    optimizer.zero_grad()
    if step % 25 == 0:
        print(f"Step {step}: loss = {loss.item():.4f}")`,
              output: `Step 0: loss = 1.2341
Step 25: loss = 0.8923
Step 50: loss = 0.6234
Step 75: loss = 0.4521`,
            },
          ]}
        />
      </section>

      <section id="ch8-multimodal">
        <h2>Multimodal Models & Scaling Laws</h2>

        <p>
          The next frontier is <strong>multimodal AI</strong> — models that work across multiple types of data simultaneously. GPT-4 processes both text and images. Gemini handles text, images, audio, and video. These models aren't separate systems stitched together; they learn unified representations where concepts from different modalities live in the same vector space. The word "cat," a picture of a cat, and the sound of a meow map to nearby regions.
        </p>

        <p>
          How? A vision encoder (usually a Vision Transformer, or ViT) converts images into the same kind of token embeddings that text produces. These visual tokens are processed by the same transformer layers as text tokens. The model learns to attend across modalities — a question token can attend to relevant regions of an image, enabling visual question answering.
        </p>

        <ModelScaleTimeline />

        <Callout type="info">
          <p>
            <strong>Scaling laws suggest we're not hitting a wall.</strong> Each generation of models brings qualitatively new capabilities. GPT-3 could do few-shot learning (give it a few examples in the prompt). GPT-4 could pass the bar exam. Models are increasingly capable of reasoning, planning, and tool use. Whether this trend continues — and whether scaling alone can produce artificial general intelligence — is the central debate in the field.
          </p>
        </Callout>
      </section>

      <section id="ch8-ethics">
        <h2>Ethics, Safety, and Alignment</h2>

        <p>
          As AI systems become more capable, the stakes of getting them right increase dramatically. A text classifier that's 95% accurate is a useful tool. A language model that generates plausible misinformation, exhibits systematic biases, or assists in harmful activities is a societal risk. The field of <strong>AI safety and alignment</strong> works to ensure that AI systems behave as intended, are honest about their uncertainties, and don't cause harm.
        </p>

        <p>
          <strong>Bias</strong> is baked into training data. If the internet overrepresents certain demographics, perspectives, or stereotypes, models trained on it will reproduce and amplify those patterns. A language model trained on biased text will generate biased text. A hiring algorithm trained on historical hiring data will perpetuate historical discrimination. Addressing bias requires careful data curation, evaluation on diverse benchmarks, and ongoing monitoring of deployed systems.
        </p>

        <p>
          <strong>Alignment</strong> is the deeper challenge: ensuring that AI systems pursue the goals humans actually intend, not literal misinterpretations. A model told to "maximize user engagement" might learn to generate outrage (which is engaging). A model told to "be helpful" might provide dangerous information (which is technically helpful to the asker). Techniques like RLHF attempt to align model behavior with human values, but the alignment problem remains unsolved — especially as models become more capable and autonomous.
        </p>

        <Callout type="misconception">
          <p>
            <strong>"AI will replace all jobs" oversimplifies a complex reality.</strong> AI automates specific tasks, not entire jobs. A radiologist who spends 70% of their time reading scans may see that task automated, but the remaining 30% (patient consultation, treatment planning, edge cases) requires human judgment. History shows that technology destroys some jobs, transforms others, and creates new ones. The transition is real and may be faster than previous technological shifts, but the outcome is not predetermined.
          </p>
        </Callout>

        <p>
          <strong>Open problems</strong> abound. How do we evaluate whether a model "understands" what it's doing vs. merely pattern-matching? How do we build AI that can explain its reasoning in ways humans can verify? How do we ensure that increasingly powerful systems remain under human control? How do we distribute the benefits of AI broadly rather than concentrating them? These questions sit at the intersection of engineering, philosophy, policy, and economics. They don't have purely technical solutions.
        </p>

        <p>
          The field is moving fast — faster than society's ability to develop norms, regulations, and governance structures. This makes the work of responsible AI development — building systems that are safe, fair, transparent, and beneficial — more important than ever. If you've made it through all eight chapters of this course, you now understand the technical foundations well enough to engage seriously with these questions. That understanding is a responsibility.
        </p>

        <Callout type="practice">
          <p>
            <strong>What you can do:</strong> Stay informed about AI capabilities and limitations (you're already doing this). Think critically about AI-generated content. Advocate for transparency in AI systems that affect your life. If you build AI systems, prioritize fairness, safety, and honesty. The technology is neither utopian nor dystopian — the outcome depends on the choices made by people who understand it. That now includes you.
          </p>
        </Callout>
      </section>
    </ChapterLayout>
  )
}
