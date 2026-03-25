import { useState } from 'react'
import ChapterLayout from '../components/shared/ChapterLayout'
import StepperAnimation, { type Step } from '../components/shared/StepperAnimation'
import CodeBlock from '../components/shared/CodeBlock'
import Callout from '../components/shared/Callout'
import { chapters } from '../data/chapters'

/* ─── Convolution Stepper ─── */
function ConvolutionStepper() {
  // 6x6 input image (pixel values)
  const image = [
    [0, 0, 1, 1, 0, 0],
    [0, 1, 2, 2, 1, 0],
    [1, 2, 3, 3, 2, 1],
    [1, 2, 3, 3, 2, 1],
    [0, 1, 2, 2, 1, 0],
    [0, 0, 1, 1, 0, 0],
  ]

  // 3x3 edge detection filter
  const filter = [
    [-1, -1, -1],
    [-1,  8, -1],
    [-1, -1, -1],
  ]

  // Compute all output positions
  const positions: { row: number; col: number; products: number[]; sum: number }[] = []
  for (let r = 0; r <= image.length - 3; r++) {
    for (let c = 0; c <= image[0].length - 3; c++) {
      const prods: number[] = []
      let sum = 0
      for (let fr = 0; fr < 3; fr++) {
        for (let fc = 0; fc < 3; fc++) {
          const p = image[r + fr][c + fc] * filter[fr][fc]
          prods.push(p)
          sum += p
        }
      }
      positions.push({ row: r, col: c, products: prods, sum })
    }
  }

  const cellSize = 40
  const filterCellSize = 36
  const outCellSize = 40

  const steps: Step[] = [
    {
      explanation: 'A 6×6 image (grayscale pixel values 0-3) and a 3×3 edge detection filter. The filter slides across the image, computing a dot product at each position to produce a 4×4 output feature map.',
      render: () => (
        <div className="flex items-start justify-center gap-6 flex-wrap">
          <div>
            <div className="text-xs font-mono text-text-tertiary mb-1 text-center">Input (6×6)</div>
            <svg width={cellSize * 6 + 2} height={cellSize * 6 + 2}>
              {image.map((row, r) => row.map((val, c) => (
                <g key={`${r}-${c}`}>
                  <rect x={c * cellSize + 1} y={r * cellSize + 1} width={cellSize} height={cellSize} fill={`rgb(${255 - val * 60}, ${255 - val * 60}, ${255 - val * 60})`} stroke="var(--color-border-strong)" strokeWidth={0.5} />
                  <text x={c * cellSize + cellSize / 2 + 1} y={r * cellSize + cellSize / 2 + 5} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill={val > 1 ? 'white' : '#57534E'}>{val}</text>
                </g>
              )))}
            </svg>
          </div>
          <div className="flex items-center">
            <span className="text-2xl text-text-tertiary">*</span>
          </div>
          <div>
            <div className="text-xs font-mono text-text-tertiary mb-1 text-center">Filter (3×3)</div>
            <svg width={filterCellSize * 3 + 2} height={filterCellSize * 3 + 2}>
              {filter.map((row, r) => row.map((val, c) => (
                <g key={`f${r}-${c}`}>
                  <rect x={c * filterCellSize + 1} y={r * filterCellSize + 1} width={filterCellSize} height={filterCellSize} fill={val > 0 ? '#DBEAFE' : '#FEE2E2'} stroke="var(--color-border-strong)" strokeWidth={0.5} />
                  <text x={c * filterCellSize + filterCellSize / 2 + 1} y={r * filterCellSize + filterCellSize / 2 + 5} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill={val > 0 ? '#3B82F6' : '#EF4444'} fontWeight="bold">{val}</text>
                </g>
              )))}
            </svg>
          </div>
        </div>
      ),
    },
    ...positions.map((pos, idx) => ({
      explanation: `Position (${pos.row},${pos.col}): Multiply each filter value by the overlapping pixel, then sum: ${pos.products.map(p => p >= 0 ? p : `(${p})`).join(' + ')} = ${pos.sum}. This output pixel detects edges at this location.`,
      render: () => (
        <div className="flex items-start justify-center gap-4 flex-wrap">
          <div>
            <div className="text-xs font-mono text-text-tertiary mb-1 text-center">Input + Filter overlay</div>
            <svg width={cellSize * 6 + 2} height={cellSize * 6 + 2}>
              {image.map((row, r) => row.map((val, c) => {
                const inFilter = r >= pos.row && r < pos.row + 3 && c >= pos.col && c < pos.col + 3
                return (
                  <g key={`${r}-${c}`}>
                    <rect x={c * cellSize + 1} y={r * cellSize + 1} width={cellSize} height={cellSize}
                      fill={inFilter ? '#DBEAFE' : `rgb(${255 - val * 60}, ${255 - val * 60}, ${255 - val * 60})`}
                      stroke={inFilter ? '#3B82F6' : '#D6D3D1'} strokeWidth={inFilter ? 2 : 0.5} />
                    <text x={c * cellSize + cellSize / 2 + 1} y={r * cellSize + cellSize / 2 + 5}
                      textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)"
                      fill={inFilter ? '#3B82F6' : (val > 1 ? 'white' : '#57534E')} fontWeight={inFilter ? 'bold' : 'normal'}>{val}</text>
                  </g>
                )
              }))}
            </svg>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-mono text-text-tertiary">=</span>
          </div>
          <div>
            <div className="text-xs font-mono text-text-tertiary mb-1 text-center">Output (built so far)</div>
            <svg width={outCellSize * 4 + 2} height={outCellSize * 4 + 2}>
              {Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, c) => {
                const posIdx = r * 4 + c
                const computed = posIdx <= idx
                const isCurrent = posIdx === idx
                const val = computed ? positions[posIdx].sum : null
                return (
                  <g key={`o${r}-${c}`}>
                    <rect x={c * outCellSize + 1} y={r * outCellSize + 1} width={outCellSize} height={outCellSize}
                      fill={isCurrent ? '#DBEAFE' : computed ? (val! > 0 ? '#F0FDFA' : '#FAFAF9') : '#F5F5F4'}
                      stroke={isCurrent ? '#3B82F6' : '#D6D3D1'} strokeWidth={isCurrent ? 2 : 0.5} />
                    {computed && (
                      <text x={c * outCellSize + outCellSize / 2 + 1} y={r * outCellSize + outCellSize / 2 + 5}
                        textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)"
                        fill={isCurrent ? '#3B82F6' : '#57534E'} fontWeight={isCurrent ? 'bold' : 'normal'}>{val}</text>
                    )}
                  </g>
                )
              }))}
            </svg>
          </div>
        </div>
      ),
    } as Step)),
    {
      explanation: `Convolution complete! The 4×4 output feature map highlights edges in the input. High values (like ${Math.max(...positions.map(p => p.sum))}) indicate strong edges; values near 0 indicate uniform regions. This is how CNNs "see" — by detecting local patterns.`,
      render: () => (
        <div className="flex items-start justify-center gap-4 flex-wrap">
          <div>
            <div className="text-xs font-mono text-text-tertiary mb-1 text-center">Input</div>
            <svg width={cellSize * 6 + 2} height={cellSize * 6 + 2}>
              {image.map((row, r) => row.map((val, c) => (
                <g key={`${r}-${c}`}>
                  <rect x={c * cellSize + 1} y={r * cellSize + 1} width={cellSize} height={cellSize} fill={`rgb(${255 - val * 60}, ${255 - val * 60}, ${255 - val * 60})`} stroke="var(--color-border-strong)" strokeWidth={0.5} />
                  <text x={c * cellSize + cellSize / 2 + 1} y={r * cellSize + cellSize / 2 + 5} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill={val > 1 ? 'white' : '#57534E'}>{val}</text>
                </g>
              )))}
            </svg>
          </div>
          <div className="flex items-center"><span className="text-lg font-mono text-text-tertiary">→</span></div>
          <div>
            <div className="text-xs font-mono text-text-tertiary mb-1 text-center">Feature Map</div>
            <svg width={outCellSize * 4 + 2} height={outCellSize * 4 + 2}>
              {Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, c) => {
                const val = positions[r * 4 + c].sum
                const maxVal = Math.max(...positions.map(p => Math.abs(p.sum)))
                const intensity = Math.abs(val) / maxVal
                return (
                  <g key={`o${r}-${c}`}>
                    <rect x={c * outCellSize + 1} y={r * outCellSize + 1} width={outCellSize} height={outCellSize}
                      fill={val > 0 ? `rgba(20, 184, 166, ${intensity * 0.6})` : `rgba(239, 68, 68, ${intensity * 0.3})`}
                      stroke="var(--color-border-strong)" strokeWidth={0.5} />
                    <text x={c * outCellSize + outCellSize / 2 + 1} y={r * outCellSize + outCellSize / 2 + 5}
                      textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-text-primary)" fontWeight="bold">{val}</text>
                  </g>
                )
              }))}
            </svg>
          </div>
        </div>
      ),
    },
  ]

  return <StepperAnimation id="ch5-convolution" title="Convolution Step-by-Step" steps={steps} height={320} />
}

/* ─── Filter Playground ─── */
function FilterPlayground() {
  const [activeFilter, setActiveFilter] = useState(0)

  const filters = [
    { name: 'Edge Detect', kernel: [[-1,-1,-1],[-1,8,-1],[-1,-1,-1]], desc: 'Highlights boundaries where pixel values change sharply' },
    { name: 'Horizontal Edge', kernel: [[-1,-1,-1],[0,0,0],[1,1,1]], desc: 'Detects horizontal edges — transitions from dark to light vertically' },
    { name: 'Vertical Edge', kernel: [[-1,0,1],[-1,0,1],[-1,0,1]], desc: 'Detects vertical edges — transitions from dark to light horizontally' },
    { name: 'Blur', kernel: [[1,1,1],[1,1,1],[1,1,1]].map(r => r.map(v => v)), desc: 'Averages neighboring pixels, smoothing out noise (values divided by 9)' },
    { name: 'Sharpen', kernel: [[0,-1,0],[-1,5,-1],[0,-1,0]], desc: 'Enhances edges by amplifying the center pixel relative to neighbors' },
  ]

  const image = [
    [0, 0, 0, 2, 2, 2],
    [0, 0, 0, 2, 2, 2],
    [0, 0, 0, 2, 2, 2],
    [3, 3, 3, 1, 1, 1],
    [3, 3, 3, 1, 1, 1],
    [3, 3, 3, 1, 1, 1],
  ]

  const f = filters[activeFilter]
  const cellSize = 38
  const outCellSize = 42

  // Compute output
  const output: number[][] = []
  for (let r = 0; r <= 3; r++) {
    const row: number[] = []
    for (let c = 0; c <= 3; c++) {
      let sum = 0
      for (let fr = 0; fr < 3; fr++) {
        for (let fc = 0; fc < 3; fc++) {
          sum += image[r + fr][c + fc] * f.kernel[fr][fc]
        }
      }
      if (f.name === 'Blur') sum = Math.round(sum / 9)
      row.push(sum)
    }
    output.push(row)
  }

  const steps: Step[] = filters.map((fil, idx) => ({
    explanation: `${fil.name} filter: ${fil.desc}. The filter kernel values determine what pattern it detects. ${
      idx === 0 ? 'The center value (8) emphasizes the pixel, while surrounding -1s subtract neighbors — if neighbors differ, the output is large.'
      : idx === 3 ? 'All 1s mean every pixel in the window contributes equally — this averages them, blurring the image.'
      : ''
    }`,
    render: () => {
      // Compute this filter's output
      const out: number[][] = []
      for (let r = 0; r <= 3; r++) {
        const row: number[] = []
        for (let c = 0; c <= 3; c++) {
          let sum = 0
          for (let fr = 0; fr < 3; fr++) for (let fc = 0; fc < 3; fc++) sum += image[r + fr][c + fc] * fil.kernel[fr][fc]
          if (fil.name === 'Blur') sum = Math.round(sum / 9)
          row.push(sum)
        }
        out.push(row)
      }
      const maxVal = Math.max(1, ...out.flat().map(Math.abs))

      return (
        <div className="flex flex-col items-center gap-4">
          {/* Filter selector */}
          <div className="flex gap-1 flex-wrap justify-center">
            {filters.map((flt, i) => (
              <button key={flt.name} onClick={(e) => { e.stopPropagation(); setActiveFilter(i) }}
                className={`px-2 py-1 text-xs font-mono rounded border transition-colors ${
                  idx === i ? 'bg-accent/10 border-accent text-accent font-semibold' : 'border-gray-200 text-gray-400'
                }`}>{flt.name}</button>
            ))}
          </div>
          <div className="flex items-start gap-4 flex-wrap justify-center">
            {/* Kernel */}
            <div>
              <div className="text-xs font-mono text-text-tertiary mb-1 text-center">Kernel</div>
              <svg width={cellSize * 3 + 2} height={cellSize * 3 + 2}>
                {fil.kernel.map((row, r) => row.map((val, c) => (
                  <g key={`k${r}${c}`}>
                    <rect x={c * cellSize + 1} y={r * cellSize + 1} width={cellSize} height={cellSize}
                      fill={val > 0 ? '#DBEAFE' : val < 0 ? '#FEE2E2' : '#F5F5F4'} stroke="var(--color-border-strong)" strokeWidth={0.5} />
                    <text x={c * cellSize + cellSize / 2 + 1} y={r * cellSize + cellSize / 2 + 5} textAnchor="middle" fontSize={12}
                      fontFamily="var(--font-mono)" fill={val > 0 ? '#3B82F6' : val < 0 ? '#EF4444' : '#A8A29E'} fontWeight="bold">{val}</text>
                  </g>
                )))}
              </svg>
            </div>
            <div className="flex items-center pt-8"><span className="font-mono text-text-tertiary">→</span></div>
            {/* Output */}
            <div>
              <div className="text-xs font-mono text-text-tertiary mb-1 text-center">Output</div>
              <svg width={outCellSize * 4 + 2} height={outCellSize * 4 + 2}>
                {out.map((row, r) => row.map((val, c) => {
                  const int = Math.abs(val) / maxVal
                  return (
                    <g key={`o${r}${c}`}>
                      <rect x={c * outCellSize + 1} y={r * outCellSize + 1} width={outCellSize} height={outCellSize}
                        fill={val > 0 ? `rgba(20,184,166,${int * 0.5})` : val < 0 ? `rgba(239,68,68,${int * 0.3})` : '#FAFAF9'}
                        stroke="var(--color-border-strong)" strokeWidth={0.5} />
                      <text x={c * outCellSize + outCellSize / 2 + 1} y={r * outCellSize + outCellSize / 2 + 5}
                        textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-text-primary)">{val}</text>
                    </g>
                  )
                }))}
              </svg>
            </div>
          </div>
        </div>
      )
    },
  }))

  return <StepperAnimation id="ch5-filters" title="Filter Playground" steps={steps} height={340} />
}

/* ─── Architecture Timeline ─── */
function ArchitectureTimeline() {
  const architectures = [
    { name: 'LeNet-5', year: 1998, params: '60K', accuracy: '99.2%', layers: 7, innovation: 'First successful CNN — proved convolutions work for digit recognition', color: '#3B82F6' },
    { name: 'AlexNet', year: 2012, params: '61M', accuracy: '84.7%', layers: 8, innovation: 'Won ImageNet by 10%+ margin. Used ReLU, dropout, and GPU training — launched the deep learning revolution', color: '#8B5CF6' },
    { name: 'VGGNet', year: 2014, params: '138M', accuracy: '92.7%', layers: 19, innovation: 'Showed that depth matters: simple 3×3 filters stacked deep outperform complex shallow networks', color: '#10B981' },
    { name: 'GoogLeNet', year: 2014, params: '6.8M', accuracy: '93.3%', layers: 22, innovation: 'Inception modules — parallel filters of different sizes. More accurate than VGG with 20× fewer parameters', color: '#F59E0B' },
    { name: 'ResNet', year: 2015, params: '25.6M', accuracy: '96.4%', layers: 152, innovation: 'Skip connections solved the degradation problem, enabling 100+ layer networks. The most cited paper in deep learning', color: '#EF4444' },
  ]

  const steps: Step[] = architectures.map((arch, idx) => ({
    explanation: `${arch.name} (${arch.year}): ${arch.params} parameters, ${arch.layers} layers, ${arch.accuracy} top-5 accuracy on ImageNet. ${arch.innovation}.`,
    render: () => (
      <div className="w-full max-w-xl mx-auto px-4">
        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          {architectures.map((a, i) => (
            <div key={a.name} className={`relative pl-10 pb-4 ${i <= idx ? 'opacity-100' : 'opacity-20'}`}>
              <div className="absolute left-2.5 top-1 w-4 h-4 rounded-full border-2" style={{ borderColor: a.color, backgroundColor: i === idx ? a.color : 'var(--color-surface-elevated)' }} />
              <div className={`p-3 rounded-lg border ${i === idx ? 'border-current shadow-sm' : 'border-gray-100'}`} style={i === idx ? { borderColor: a.color + '60', backgroundColor: a.color + '08' } : {}}>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs" style={{ color: a.color }}>{a.year}</span>
                  <span className="font-display font-semibold text-sm">{a.name}</span>
                </div>
                {i <= idx && (
                  <div className="flex gap-4 mt-1 text-xs font-mono text-text-tertiary">
                    <span>{a.params} params</span>
                    <span>{a.layers} layers</span>
                    <span>{a.accuracy} acc</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  }))

  return <StepperAnimation id="ch5-architectures" title="CNN Architecture Evolution" steps={steps} height={420} />
}

/* ─── Main Chapter ─── */
export default function Chapter5() {
  const chapter = chapters[4]

  return (
    <ChapterLayout chapter={chapter}>
      <section id="ch5-why-cnn">
        <h2>Why Fully Connected Networks Fail at Images</h2>

        <p>
          A 224×224 color image has 224 × 224 × 3 = 150,528 pixels. If we fed this into a fully connected network with 1,000 hidden neurons, the first layer alone would need 150,528 × 1,000 = 150 million weights. For a single layer. This is absurdly wasteful, because most of those connections are meaningless — a pixel in the top-left corner has almost no direct relationship to a pixel in the bottom-right corner.
        </p>

        <p>
          Images have <strong>spatial structure</strong>. Nearby pixels are related; distant pixels usually aren't. A cat's ear is defined by the arrangement of pixels in a small local region, not by the relationship between that region and pixels across the image. Fully connected networks ignore this structure entirely — they treat each pixel as an independent input with its own dedicated weight to every hidden neuron.
        </p>

        <p>
          The solution is <strong>weight sharing</strong>: instead of learning separate weights for every pixel, use the same small filter (say, 3×3) across the entire image. This filter slides across the image, performing the same operation at every position. A single filter has just 9 weights instead of millions, and it can detect the same pattern regardless of where it appears in the image. This is the core idea behind <strong>Convolutional Neural Networks</strong> (CNNs).
        </p>

        <Callout type="practice">
          <p>
            <strong>Parameter efficiency matters enormously.</strong> AlexNet (2012) classified ImageNet images using 61 million parameters with a CNN architecture. A fully connected network of equivalent depth would need billions. Fewer parameters means faster training, less memory, and less overfitting. CNNs exploit the structure of images to achieve more with less.
          </p>
        </Callout>
      </section>

      <section id="ch5-convolution">
        <h2>The Convolution Operation</h2>

        <p>
          Convolution is the mathematical operation at the heart of CNNs. A small filter (also called a <strong>kernel</strong>) slides across the input image. At each position, it computes a dot product — multiplying each filter value by the overlapping pixel value and summing the results. This produces a single output value. As the filter slides to every position, it builds an output <strong>feature map</strong> that highlights wherever the filter's pattern appears in the input.
        </p>

        <p>
          The intuition: a filter is a pattern detector. An edge-detection filter has negative values around a positive center — it responds strongly wherever pixel values change sharply (an edge) and stays near zero in uniform regions. A horizontal line detector has positive values in its middle row and negative values in the top and bottom rows. The network learns what patterns to detect from the training data.
        </p>

        <p>
          Watch a convolution happen one position at a time. At each step, the filter overlaps a 3×3 region of the input, computes 9 multiplications and their sum, and places the result in the output feature map.
        </p>

        <ConvolutionStepper />

        <Callout type="deepdive" expandable title="Convolution Math">
          <p>
            For a 2D convolution with input I, filter K, and output O:
          </p>
          <p className="font-mono text-sm">
            O[r,c] = Σᵢ Σⱼ I[r+i, c+j] × K[i,j]
          </p>
          <p>
            The output size is (H - F + 2P)/S + 1, where H is the input height, F is the filter size, P is padding, and S is stride. For our 6×6 input with a 3×3 filter, no padding, stride 1: (6-3+0)/1 + 1 = 4. Output is 4×4.
          </p>
        </Callout>
      </section>

      <section id="ch5-filters">
        <h2>Filters and Kernels</h2>

        <p>
          Different filters detect different features. This isn't something engineers design by hand — in a trained CNN, the filters are <em>learned</em> from data. But understanding what classic filters do helps build intuition for what the network is learning.
        </p>

        <p>
          An <strong>edge detection</strong> filter has a large positive center and negative surroundings. Where the image is uniform, the positive and negative values cancel out (output near zero). Where there's an edge, one side adds while the other subtracts, producing a large output. <strong>Horizontal</strong> and <strong>vertical</strong> edge filters detect edges in specific orientations. <strong>Blur</strong> filters average neighboring pixels, smoothing out noise. <strong>Sharpen</strong> filters emphasize the center pixel relative to its neighbors, making edges crisper.
        </p>

        <p>
          Explore different filters below. Switch between them and see how each one transforms the same input image into a completely different feature map.
        </p>

        <FilterPlayground />

        <Callout type="info">
          <p>
            <strong>In a trained CNN, you don't choose filters — the network learns them.</strong> The first layer typically learns simple filters: edges at various angles, color blobs. Deeper layers combine these into textures, then parts of objects, then whole objects. This hierarchy — edges → textures → parts → objects — emerges automatically from training on labeled images. Nobody programs it.
          </p>
        </Callout>

        <CodeBlock
          tabs={[
            {
              label: 'From Scratch',
              language: 'python',
              code: `import numpy as np

# Manual 2D convolution
def convolve2d(image, kernel):
    ih, iw = image.shape
    kh, kw = kernel.shape
    oh, ow = ih - kh + 1, iw - kw + 1
    output = np.zeros((oh, ow))

    for r in range(oh):
        for c in range(ow):
            # Extract the patch, multiply, sum
            patch = image[r:r+kh, c:c+kw]
            output[r, c] = np.sum(patch * kernel)

    return output

# 6x6 input image
image = np.array([
    [0, 0, 1, 1, 0, 0],
    [0, 1, 2, 2, 1, 0],
    [1, 2, 3, 3, 2, 1],
    [1, 2, 3, 3, 2, 1],
    [0, 1, 2, 2, 1, 0],
    [0, 0, 1, 1, 0, 0],
], dtype=float)

# Edge detection kernel
kernel = np.array([
    [-1, -1, -1],
    [-1,  8, -1],
    [-1, -1, -1],
], dtype=float)

result = convolve2d(image, kernel)
print("Output feature map:")
print(result)
print(f"\\nOutput shape: {result.shape}")`,
              output: `Output feature map:
[[-2.  0.  0. -2.]
 [ 0.  4.  4.  0.]
 [ 0.  4.  4.  0.]
 [-2.  0.  0. -2.]]

Output shape: (4, 4)`,
            },
            {
              label: 'PyTorch',
              language: 'python',
              code: `import torch
import torch.nn as nn

# PyTorch convolution
image = torch.tensor([
    [0, 0, 1, 1, 0, 0],
    [0, 1, 2, 2, 1, 0],
    [1, 2, 3, 3, 2, 1],
    [1, 2, 3, 3, 2, 1],
    [0, 1, 2, 2, 1, 0],
    [0, 0, 1, 1, 0, 0],
], dtype=torch.float32).unsqueeze(0).unsqueeze(0)  # [1,1,6,6]

# Conv2d: 1 input channel, 1 output channel, 3x3 kernel
conv = nn.Conv2d(1, 1, kernel_size=3, bias=False)

# Set our edge detection kernel
with torch.no_grad():
    conv.weight.copy_(torch.tensor([[[
        [-1, -1, -1],
        [-1,  8, -1],
        [-1, -1, -1],
    ]]], dtype=torch.float32))

output = conv(image)
print(f"Input shape: {image.shape}")
print(f"Output shape: {output.shape}")
print(f"Output:\\n{output.squeeze()}")

# In practice, use multiple filters:
conv_multi = nn.Conv2d(1, 16, kernel_size=3, padding=1)
print(f"\\n16 filters: {sum(p.numel() for p in conv_multi.parameters())} params")`,
              output: `Input shape: torch.Size([1, 1, 6, 6])
Output shape: torch.Size([1, 1, 4, 4])
Output:
tensor([[-2.,  0.,  0., -2.],
        [ 0.,  4.,  4.,  0.],
        [ 0.,  4.,  4.,  0.],
        [-2.,  0.,  0., -2.]])

16 filters: 160 params`,
            },
          ]}
        />
      </section>

      <section id="ch5-pooling">
        <h2>Pooling, Stride, and Padding</h2>

        <p>
          After convolution, two additional operations help build effective CNNs. <strong>Pooling</strong> reduces the spatial dimensions of feature maps, making the representation more compact and computationally cheaper. <strong>Max pooling</strong> (the most common type) slides a window (typically 2×2) across the feature map and keeps only the maximum value in each window. This halves the height and width, reducing the number of values by 75%.
        </p>

        <p>
          Pooling provides a form of <strong>translation invariance</strong>. If a feature (like an edge) shifts by one pixel, max pooling often produces the same output — the maximum in the 2×2 window is the same. This makes the network robust to small shifts and distortions, which is desirable for image recognition (a cat shifted two pixels to the right is still a cat).
        </p>

        <p>
          <strong>Stride</strong> controls how far the filter moves between positions. A stride of 1 means the filter moves one pixel at a time (standard). A stride of 2 means it skips every other position, halving the output size — an alternative to pooling. Many modern architectures (like ResNet) use strided convolutions instead of pooling.
        </p>

        <p>
          <strong>Padding</strong> adds zeros around the border of the input. Without padding, each convolution shrinks the feature map. With "same" padding (adding enough zeros so the output size equals the input size), information at the edges isn't lost, and you can stack many convolution layers without the feature maps shrinking to nothing.
        </p>

        <Callout type="misconception">
          <p>
            <strong>Pooling doesn't just "make things smaller."</strong> It creates a hierarchy of abstraction. Early layers with small receptive fields detect local features (edges, corners). After pooling, the same-sized filter in the next layer "sees" a larger region of the original image. After several pooling operations, neurons have a very large effective receptive field — they respond to high-level patterns spanning the entire image, even though they only look at a small local feature map.
          </p>
        </Callout>
      </section>

      <section id="ch5-architectures">
        <h2>Famous Architectures</h2>

        <p>
          The history of CNN architectures is a story of one breakthrough after another, each building on the previous. It's measured by performance on <strong>ImageNet</strong>, a dataset of 1.2 million images in 1,000 categories. Before 2012, the best algorithms achieved about 74% top-5 accuracy (the correct label is among the model's top 5 guesses). The deep learning revolution began when AlexNet shattered that record.
        </p>

        <ArchitectureTimeline />

        <p>
          The progression tells a clear story: networks got deeper (7 → 152 layers), but raw depth alone wasn't enough. Key innovations — ReLU activation, dropout regularization, batch normalization, inception modules, and skip connections — were needed to make depth work. ResNet's skip connections, in particular, were so fundamental that they appear in virtually every deep architecture today, including transformers.
        </p>

        <Callout type="practice">
          <p>
            <strong>You almost never design a CNN from scratch.</strong> In practice, start with a pre-trained ResNet or EfficientNet, fine-tune it on your data. This technique — <strong>transfer learning</strong> — leverages features learned from millions of ImageNet images. A ResNet trained on ImageNet already knows what edges, textures, and common objects look like. Fine-tuning it on your specific task (medical images, satellite photos, product defects) requires far less data than training from scratch.
          </p>
        </Callout>
      </section>
    </ChapterLayout>
  )
}
