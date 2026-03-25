import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgress } from '../context/ProgressContext'
import { chapters } from '../data/chapters'

interface Question {
  id: number
  chapter: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

const questions: Question[] = [
  // Chapter 1: Foundations
  {
    id: 1,
    chapter: 1,
    question: 'What fundamentally distinguishes machine learning from traditional programming?',
    options: [
      'Machine learning uses faster hardware',
      'The system derives rules from data rather than being explicitly programmed with rules',
      'Machine learning only works with numerical data',
      'Traditional programs cannot handle large datasets',
    ],
    correct: 1,
    explanation: 'In traditional programming, a developer writes explicit rules. In machine learning, the system learns patterns and rules from data, generalizing to new inputs.',
  },
  {
    id: 2,
    chapter: 1,
    question: 'Which type of learning uses labeled input-output pairs to train a model?',
    options: [
      'Unsupervised learning',
      'Reinforcement learning',
      'Supervised learning',
      'Self-supervised learning',
    ],
    correct: 2,
    explanation: 'Supervised learning trains on labeled examples — pairs of inputs and their correct outputs — enabling the model to learn the mapping between them.',
  },
  {
    id: 3,
    chapter: 1,
    question: 'During the "AI Winter" of the 1970s, what was the primary criticism of early neural networks?',
    options: [
      'They were too expensive to manufacture',
      'Minsky and Papert showed perceptrons could not solve linearly inseparable problems like XOR',
      'They required quantum computers',
      'They could only process images',
    ],
    correct: 1,
    explanation: 'Minsky and Papert\'s 1969 book "Perceptrons" demonstrated the fundamental limitations of single-layer perceptrons, notably their inability to learn XOR, which significantly dampened research funding.',
  },
  {
    id: 4,
    chapter: 1,
    question: 'In reinforcement learning, what signal does the agent use to improve its behavior?',
    options: [
      'Labeled training examples',
      'Cluster centroids',
      'Reward signals from the environment',
      'Pre-computed gradients',
    ],
    correct: 2,
    explanation: 'Reinforcement learning agents learn through trial and error, receiving reward (or penalty) signals from their environment to guide behavior toward optimal policies.',
  },
  // Chapter 2: The Neuron
  {
    id: 5,
    chapter: 2,
    question: 'In an artificial neuron, what mathematical operation is performed before the activation function?',
    options: [
      'Matrix inversion',
      'Weighted sum of inputs plus a bias term',
      'Fourier transform',
      'Random sampling',
    ],
    correct: 1,
    explanation: 'An artificial neuron computes z = w1*x1 + w2*x2 + ... + wn*xn + b (the weighted sum plus bias), then passes z through an activation function.',
  },
  {
    id: 6,
    chapter: 2,
    question: 'What is the primary role of an activation function in a neural network?',
    options: [
      'To speed up computation',
      'To normalize the input data',
      'To introduce non-linearity, enabling the network to learn complex patterns',
      'To reduce the number of parameters',
    ],
    correct: 2,
    explanation: 'Without non-linear activation functions, stacking layers would still produce only a linear transformation. Activation functions enable networks to approximate arbitrarily complex functions.',
  },
  {
    id: 7,
    chapter: 2,
    question: 'Why is the ReLU activation function preferred over sigmoid in deep networks?',
    options: [
      'ReLU produces probabilities between 0 and 1',
      'ReLU is differentiable everywhere',
      'ReLU mitigates the vanishing gradient problem and is computationally cheaper',
      'ReLU guarantees convergence',
    ],
    correct: 2,
    explanation: 'Sigmoid squashes gradients toward zero for large positive/negative inputs, making deep networks difficult to train. ReLU maintains a gradient of 1 for positive values, enabling more effective gradient flow.',
  },
  {
    id: 8,
    chapter: 2,
    question: 'A single perceptron can only classify data that is:',
    options: [
      'Normally distributed',
      'Linearly separable',
      'High-dimensional',
      'Temporally ordered',
    ],
    correct: 1,
    explanation: 'A single perceptron learns a linear decision boundary (a hyperplane). It can only correctly classify datasets where the classes can be separated by a straight line (or hyperplane in higher dimensions).',
  },
  // Chapter 3: Neural Networks
  {
    id: 9,
    chapter: 3,
    question: 'What problem demonstrated the need for multi-layer networks beyond single perceptrons?',
    options: [
      'Image classification',
      'The XOR problem',
      'Natural language processing',
      'Time series forecasting',
    ],
    correct: 1,
    explanation: 'XOR is not linearly separable — no single straight line can divide its outputs. This classic problem showed that multi-layer networks were necessary to learn non-linear decision boundaries.',
  },
  {
    id: 10,
    chapter: 3,
    question: 'During forward propagation, data flows through the network in which direction?',
    options: [
      'From output layer to input layer',
      'Bidirectionally between all layers',
      'From input layer through hidden layers to the output layer',
      'Randomly between any two layers',
    ],
    correct: 2,
    explanation: 'Forward propagation passes data sequentially from the input layer, through each hidden layer (applying weights, biases, and activations), to produce the final output.',
  },
  {
    id: 11,
    chapter: 3,
    question: 'What does the Universal Approximation Theorem guarantee?',
    options: [
      'Any network can be trained in polynomial time',
      'A network with one hidden layer of sufficient width can approximate any continuous function on a compact set',
      'Deep networks always outperform shallow ones',
      'Neural networks can solve any computational problem',
    ],
    correct: 1,
    explanation: 'Cybenko (1989) proved that a feedforward network with a single hidden layer containing enough neurons can approximate any continuous function to arbitrary accuracy — though it says nothing about how to find those weights.',
  },
  {
    id: 12,
    chapter: 3,
    question: 'In a feedforward network, what is the role of a hidden layer?',
    options: [
      'To store training data',
      'To learn intermediate representations that transform inputs into features useful for the output',
      'To regularize the network',
      'To reduce the input dimensionality only',
    ],
    correct: 1,
    explanation: 'Hidden layers learn progressively abstract internal representations. Early layers might detect edges, later layers detect shapes, and final layers detect objects — each building on the previous representation.',
  },
  // Chapter 4: Learning
  {
    id: 13,
    chapter: 4,
    question: 'What does a loss function measure?',
    options: [
      'The speed of training',
      'The number of parameters in the model',
      'The discrepancy between the model\'s predictions and the true values',
      'The amount of training data available',
    ],
    correct: 2,
    explanation: 'A loss function quantifies how wrong the model is — the gap between predicted and actual outputs. Training aims to minimize this value.',
  },
  {
    id: 14,
    chapter: 4,
    question: 'In gradient descent, the learning rate controls:',
    options: [
      'The number of epochs',
      'The size of each parameter update step',
      'The number of layers in the network',
      'The batch size',
    ],
    correct: 1,
    explanation: 'The learning rate scales the gradient to determine how much each parameter changes per update. Too large risks overshooting; too small causes extremely slow convergence.',
  },
  {
    id: 15,
    chapter: 4,
    question: 'Backpropagation fundamentally relies on which mathematical principle?',
    options: [
      'Bayes\' theorem',
      'The chain rule of calculus',
      'The central limit theorem',
      'Eigenvalue decomposition',
    ],
    correct: 1,
    explanation: 'Backpropagation applies the chain rule to efficiently compute the gradient of the loss with respect to every weight, propagating error derivatives backward through the network\'s layers.',
  },
  {
    id: 16,
    chapter: 4,
    question: 'What advantage does the Adam optimizer have over vanilla SGD?',
    options: [
      'Adam uses no hyperparameters',
      'Adam adapts the learning rate per-parameter using estimates of first and second moments of gradients',
      'Adam guarantees finding the global minimum',
      'Adam does not require backpropagation',
    ],
    correct: 1,
    explanation: 'Adam maintains per-parameter running averages of both the gradient (first moment) and the squared gradient (second moment), effectively giving each parameter its own adaptive learning rate.',
  },
  // Chapter 5: CNNs
  {
    id: 17,
    chapter: 5,
    question: 'Why are fully connected networks impractical for raw image inputs?',
    options: [
      'Images cannot be represented as numbers',
      'The number of parameters explodes — a 256x256 RGB image would need millions of weights in just the first layer',
      'Fully connected networks cannot use activation functions',
      'Images require reinforcement learning',
    ],
    correct: 1,
    explanation: 'A 256x256x3 image has 196,608 pixels. A fully connected layer to just 1,000 neurons would require ~197 million weights — computationally infeasible and prone to overfitting.',
  },
  {
    id: 18,
    chapter: 5,
    question: 'In a convolution operation, what does the kernel (filter) do?',
    options: [
      'Removes noise from the image',
      'Slides across the input, computing element-wise products and sums to detect local patterns',
      'Compresses the image file size',
      'Converts the image to grayscale',
    ],
    correct: 1,
    explanation: 'A convolution kernel is a small matrix of learnable weights that slides over the input. At each position, it computes a dot product with the local patch, producing a feature map that highlights specific patterns.',
  },
  {
    id: 19,
    chapter: 5,
    question: 'What is the purpose of max pooling in a CNN?',
    options: [
      'To add more parameters to the model',
      'To increase the spatial resolution',
      'To reduce spatial dimensions while retaining the most prominent features, adding translation invariance',
      'To apply the activation function',
    ],
    correct: 2,
    explanation: 'Max pooling selects the maximum value within each pooling window, reducing spatial dimensions (lowering computation) while preserving the strongest activations and providing some translation invariance.',
  },
  {
    id: 20,
    chapter: 5,
    question: 'What key innovation did ResNet introduce to enable training of very deep networks?',
    options: [
      'Dropout layers',
      'Batch normalization',
      'Skip (residual) connections that allow gradients to flow directly through identity mappings',
      'Larger kernel sizes',
    ],
    correct: 2,
    explanation: 'ResNet\'s skip connections add the input of a block directly to its output (F(x) + x), creating shortcut paths for gradient flow. This solved the degradation problem and enabled networks with hundreds of layers.',
  },
  // Chapter 6: Sequences & Memory
  {
    id: 21,
    chapter: 6,
    question: 'What distinguishes a recurrent neural network from a feedforward network?',
    options: [
      'RNNs use convolutional layers',
      'RNNs maintain a hidden state that carries information across time steps, creating a form of memory',
      'RNNs can only process images',
      'RNNs do not use backpropagation',
    ],
    correct: 1,
    explanation: 'RNNs process sequences by maintaining a hidden state vector that is updated at each time step. This hidden state acts as a memory, allowing information from earlier inputs to influence later outputs.',
  },
  {
    id: 22,
    chapter: 6,
    question: 'The vanishing gradient problem in RNNs causes:',
    options: [
      'Gradients to become extremely large, causing numerical overflow',
      'Gradients to shrink exponentially over long sequences, preventing learning of long-range dependencies',
      'The network to run out of memory',
      'The loss function to become negative',
    ],
    correct: 1,
    explanation: 'During backpropagation through time, gradients are multiplied by the same weight matrix at each step. If the largest eigenvalue is less than 1, gradients decay exponentially, making it impossible to learn dependencies that span many time steps.',
  },
  {
    id: 23,
    chapter: 6,
    question: 'How does the LSTM solve the vanishing gradient problem?',
    options: [
      'By using larger learning rates',
      'By removing recurrent connections entirely',
      'Through a gated memory cell with forget, input, and output gates that regulate information flow',
      'By using convolutional layers instead of recurrent ones',
    ],
    correct: 2,
    explanation: 'LSTM introduces a cell state with additive updates controlled by learnable gates. The forget gate decides what to discard, the input gate what to store, and the output gate what to reveal — allowing gradients to flow unimpeded through the cell state.',
  },
  {
    id: 24,
    chapter: 6,
    question: 'How does the GRU simplify the LSTM architecture?',
    options: [
      'By removing all gates',
      'By combining the forget and input gates into a single update gate and merging cell and hidden states',
      'By adding more layers',
      'By using attention mechanisms',
    ],
    correct: 1,
    explanation: 'The GRU uses only two gates (reset and update) instead of LSTM\'s three, and combines the cell state and hidden state into a single state vector, achieving comparable performance with fewer parameters.',
  },
  // Chapter 7: Attention & Transformers
  {
    id: 25,
    chapter: 7,
    question: 'What bottleneck problem does the attention mechanism address in sequence-to-sequence models?',
    options: [
      'The inability to process inputs in parallel',
      'The encoder compresses the entire input into a single fixed-length vector, losing information for long sequences',
      'The lack of activation functions',
      'The need for labeled data',
    ],
    correct: 1,
    explanation: 'In classic seq2seq models, the encoder must compress an entire input sequence into one fixed-size vector. For long sequences, this bottleneck loses crucial information. Attention allows the decoder to look back at all encoder states.',
  },
  {
    id: 26,
    chapter: 7,
    question: 'In the Transformer\'s self-attention, what do the Query, Key, and Value matrices represent?',
    options: [
      'Input, output, and hidden states',
      'Q asks "what am I looking for?", K answers "what do I contain?", V provides "what information do I carry?"',
      'Learning rate, momentum, and weight decay',
      'Encoder, decoder, and attention layers',
    ],
    correct: 1,
    explanation: 'Each token is projected into three vectors: Query (what information it seeks), Key (what information it advertises), and Value (the actual content). Attention scores are computed as dot products of Q and K, then used to weight V.',
  },
  {
    id: 27,
    chapter: 7,
    question: 'Why does the Transformer use multi-head attention instead of a single attention mechanism?',
    options: [
      'To reduce the number of parameters',
      'To allow the model to attend to information from different representation subspaces at different positions simultaneously',
      'To speed up inference only',
      'Multi-head attention is mathematically identical to single-head',
    ],
    correct: 1,
    explanation: 'Multi-head attention runs several attention operations in parallel, each with different learned projections. Different heads can learn to focus on different types of relationships — syntactic, semantic, positional — enriching the model\'s representation.',
  },
  {
    id: 28,
    chapter: 7,
    question: 'Why does the Transformer need positional encoding?',
    options: [
      'To reduce computation cost',
      'Self-attention is permutation-invariant — without positional encoding, the model has no notion of token order',
      'To normalize input values',
      'To compress long sequences',
    ],
    correct: 1,
    explanation: 'Unlike RNNs which inherently process tokens in order, self-attention treats the input as a set. Positional encodings inject sequence order information so the model can distinguish "the cat sat" from "sat the cat".',
  },
  // Chapter 8: Modern Landscape
  {
    id: 29,
    chapter: 8,
    question: 'What is the core training objective of autoregressive language models like GPT?',
    options: [
      'Classifying text into categories',
      'Predicting the next token given all previous tokens',
      'Translating between languages',
      'Detecting grammatical errors',
    ],
    correct: 1,
    explanation: 'Autoregressive language models are trained to predict P(next token | all previous tokens). This simple objective, scaled with massive data and compute, produces models with emergent capabilities far beyond next-word prediction.',
  },
  {
    id: 30,
    chapter: 8,
    question: 'How do diffusion models generate images?',
    options: [
      'By directly mapping random noise to images in one step',
      'By learning to iteratively denoise, reversing a gradual noising process step by step',
      'By searching a database of existing images',
      'By combining pixels from training images',
    ],
    correct: 1,
    explanation: 'Diffusion models learn the reverse of a forward noising process. During generation, they start from pure Gaussian noise and gradually denoise it over many steps, producing high-quality images through this iterative refinement.',
  },
]

const QUIZ_STORAGE_KEY = 'neural-odyssey-quiz'
const PASS_THRESHOLD = 0.7

interface QuizState {
  answers: Record<number, number>
  submitted: boolean
}

export default function Quiz() {
  const navigate = useNavigate()
  const { overallProgress } = useProgress()
  const allChaptersComplete = overallProgress >= 1

  const [state, setState] = useState<QuizState>(() => {
    try {
      const stored = localStorage.getItem(QUIZ_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch { /* ignore */ }
    return { answers: {}, submitted: false }
  })

  const [currentPage, setCurrentPage] = useState(0)
  const questionsPerPage = 5
  const totalPages = Math.ceil(questions.length / questionsPerPage)
  const pageQuestions = questions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage)

  const score = useMemo(() => {
    if (!state.submitted) return 0
    return questions.filter(q => state.answers[q.id] === q.correct).length
  }, [state])

  const passed = score / questions.length >= PASS_THRESHOLD

  function selectAnswer(questionId: number, optionIndex: number) {
    if (state.submitted) return
    setState(prev => {
      const next = { ...prev, answers: { ...prev.answers, [questionId]: optionIndex } }
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  function submitQuiz() {
    const next = { ...state, submitted: true }
    setState(next)
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(next))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function retakeQuiz() {
    const next: QuizState = { answers: {}, submitted: false }
    setState(next)
    setCurrentPage(0)
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(next))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const answeredCount = Object.keys(state.answers).length
  const allAnswered = answeredCount === questions.length

  if (!allChaptersComplete) {
    const totalSections = chapters.reduce((sum, ch) => sum + ch.sections.length, 0)
    return (
      <div className="min-h-screen py-12">
        <div className="prose-content">
          <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary mb-6">
            <Link to="/" className="hover:text-accent no-underline text-text-tertiary">Home</Link>
            <span>/</span>
            <span>Final Assessment</span>
          </div>
          <div className="text-center py-20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-text-tertiary">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <h1 className="text-3xl font-display font-bold mb-3">Assessment Locked</h1>
            <p className="text-text-secondary mb-2">
              Complete all {totalSections} sections across 8 chapters to unlock the final assessment.
            </p>
            <p className="text-sm text-text-tertiary mb-8">
              Current progress: {Math.round(overallProgress * 100)}%
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-body font-semibold text-sm no-underline hover:bg-accent/90 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="prose-content">
        <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary mb-6">
          <Link to="/" className="hover:text-accent no-underline text-text-tertiary">Home</Link>
          <span>/</span>
          <span>Final Assessment</span>
        </div>

        {/* Results banner */}
        {state.submitted && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border p-6 mb-8 ${
              passed
                ? 'border-neural-weight/30 bg-neural-weight/5'
                : 'border-neural-gradient/30 bg-neural-gradient/5'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold m-0 mb-1">
                  {passed ? 'Assessment Passed' : 'Not Quite There Yet'}
                </h2>
                <p className="text-text-secondary m-0 text-sm">
                  You scored {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%).
                  {passed
                    ? ' You have demonstrated strong understanding of the material.'
                    : ` You need ${Math.ceil(questions.length * PASS_THRESHOLD)} correct answers (${Math.round(PASS_THRESHOLD * 100)}%) to pass.`
                  }
                </p>
              </div>
              <div className="flex gap-3">
                {passed && (
                  <button
                    onClick={() => navigate('/certificate')}
                    className="px-5 py-2.5 bg-accent text-white rounded-xl font-body font-semibold text-sm hover:bg-accent/90 transition-colors"
                  >
                    Get Certificate
                  </button>
                )}
                <button
                  onClick={retakeQuiz}
                  className="px-5 py-2.5 border border-border rounded-xl font-body font-semibold text-sm text-text-secondary hover:bg-surface-alt transition-colors"
                >
                  Retake
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {!state.submitted && (
          <>
            <h1 className="text-3xl font-display font-bold mb-2">Final Assessment</h1>
            <p className="text-text-secondary mb-1">
              {questions.length} questions covering all 8 chapters. You need {Math.round(PASS_THRESHOLD * 100)}% to earn your certificate.
            </p>
            <p className="text-sm text-text-tertiary mb-8">
              {answeredCount} of {questions.length} answered
            </p>
          </>
        )}

        {/* Questions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {pageQuestions.map((q, qi) => {
              const globalIndex = currentPage * questionsPerPage + qi
              const selectedAnswer = state.answers[q.id]
              const isCorrect = selectedAnswer === q.correct
              const chapterTitle = chapters[q.chapter - 1]?.title || ''

              return (
                <div key={q.id} className="mb-8 last:mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-text-tertiary bg-surface-alt px-2 py-0.5 rounded">
                      Ch. {q.chapter}
                    </span>
                    <span className="text-xs text-text-tertiary">{chapterTitle}</span>
                  </div>
                  <h3 className="text-base font-display font-semibold m-0 mb-4">
                    <span className="font-mono text-text-tertiary mr-2">{globalIndex + 1}.</span>
                    {q.question}
                  </h3>
                  <div className="space-y-2">
                    {q.options.map((option, oi) => {
                      let optionStyle = 'border-border bg-surface-elevated hover:bg-surface-alt text-text-secondary'
                      if (selectedAnswer === oi && !state.submitted) {
                        optionStyle = 'border-accent bg-accent/5 text-text-primary ring-1 ring-accent/30'
                      }
                      if (state.submitted) {
                        if (oi === q.correct) {
                          optionStyle = 'border-neural-weight/50 bg-neural-weight/5 text-text-primary'
                        } else if (selectedAnswer === oi && !isCorrect) {
                          optionStyle = 'border-neural-gradient/50 bg-neural-gradient/5 text-text-primary'
                        } else {
                          optionStyle = 'border-border bg-surface-elevated text-text-tertiary'
                        }
                      }

                      return (
                        <button
                          key={oi}
                          onClick={() => selectAnswer(q.id, oi)}
                          disabled={state.submitted}
                          className={`flex items-start gap-3 w-full px-4 py-3 rounded-lg text-sm text-left transition-all border ${optionStyle} ${state.submitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <span className="font-mono text-xs mt-0.5 text-text-tertiary flex-shrink-0 w-5">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span>{option}</span>
                          {state.submitted && oi === q.correct && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-auto flex-shrink-0 mt-0.5 text-neural-weight">
                              <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                          {state.submitted && selectedAnswer === oi && !isCorrect && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-auto flex-shrink-0 mt-0.5 text-neural-gradient">
                              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  {state.submitted && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 text-xs text-text-secondary leading-relaxed bg-surface-alt rounded-lg px-4 py-3"
                    >
                      {q.explanation}
                    </motion.p>
                  )}
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 pb-8 border-t border-border">
          <button
            onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={currentPage === 0}
            className="px-4 py-2 text-sm font-body border border-border rounded-lg hover:bg-surface-alt transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageStart = i * questionsPerPage
              const pageEnd = Math.min((i + 1) * questionsPerPage, questions.length)
              const pageAnswered = questions.slice(pageStart, pageEnd).filter(q => state.answers[q.id] !== undefined).length
              const pageFull = pageAnswered === pageEnd - pageStart

              return (
                <button
                  key={i}
                  onClick={() => { setCurrentPage(i); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className={`w-8 h-8 rounded-lg text-xs font-mono transition-colors ${
                    i === currentPage
                      ? 'bg-accent text-white'
                      : pageFull
                        ? 'bg-neural-weight/10 text-neural-weight'
                        : 'bg-surface-alt text-text-tertiary hover:bg-surface'
                  }`}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>

          {currentPage < totalPages - 1 ? (
            <button
              onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="px-4 py-2 text-sm font-body bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Next →
            </button>
          ) : !state.submitted ? (
            <button
              onClick={submitQuiz}
              disabled={!allAnswered}
              className="px-5 py-2 text-sm font-body font-semibold bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Assessment
            </button>
          ) : (
            <div className="w-24" />
          )}
        </div>
      </div>
    </div>
  )
}
