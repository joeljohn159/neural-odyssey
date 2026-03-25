import ChapterLayout from '../components/shared/ChapterLayout'
import StepperAnimation, { type Step } from '../components/shared/StepperAnimation'
import CodeBlock from '../components/shared/CodeBlock'
import Callout from '../components/shared/Callout'
import { chapters } from '../data/chapters'

// Classification Boundary Interactive
function ClassificationBoundary() {
  const w = 500, h = 350
  const classA = [
    [120, 80], [150, 120], [100, 150], [180, 90], [130, 180], [160, 160], [90, 100], [140, 130],
  ]
  const classB = [
    [320, 250], [350, 280], [300, 220], [370, 300], [340, 260], [280, 290], [360, 240], [310, 310],
  ]

  const boundarySteps: { angle: number; offset: number; error: number }[] = [
    { angle: 0, offset: 250, error: 0.45 },
    { angle: -10, offset: 230, error: 0.38 },
    { angle: -20, offset: 210, error: 0.28 },
    { angle: -30, offset: 200, error: 0.18 },
    { angle: -38, offset: 195, error: 0.10 },
    { angle: -42, offset: 192, error: 0.05 },
    { angle: -45, offset: 190, error: 0.02 },
  ]

  const steps: Step[] = [
    {
      explanation: 'We have two classes of data points on a 2D plane. Blue circles are Class A (e.g., "cat images") and red circles are Class B (e.g., "dog images"). Our goal: find a line that separates them.',
      render: () => (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg">
          {classA.map((p, i) => <circle key={`a${i}`} cx={p[0]} cy={p[1]} r={6} fill="#3B82F6" opacity={0.8} />)}
          {classB.map((p, i) => <circle key={`b${i}`} cx={p[0]} cy={p[1]} r={6} fill="#EF4444" opacity={0.8} />)}
          <text x={120} y={40} fontSize={11} fill="#3B82F6" fontFamily="var(--font-mono)" textAnchor="middle">Class A</text>
          <text x={340} y={340} fontSize={11} fill="#EF4444" fontFamily="var(--font-mono)" textAnchor="middle">Class B</text>
        </svg>
      ),
    },
    {
      explanation: 'A human might draw a horizontal line — but it doesn\'t separate the classes well. Several points are on the wrong side. The error rate is 45%.',
      render: () => (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg">
          {classA.map((p, i) => <circle key={`a${i}`} cx={p[0]} cy={p[1]} r={6} fill="#3B82F6" opacity={0.8} />)}
          {classB.map((p, i) => <circle key={`b${i}`} cx={p[0]} cy={p[1]} r={6} fill="#EF4444" opacity={0.8} />)}
          <line x1={0} y1={250} x2={w} y2={250} stroke="#10B981" strokeWidth={2} strokeDasharray="6,4" />
          <text x={w - 10} y={245} fontSize={10} fill="#10B981" fontFamily="var(--font-mono)" textAnchor="end">Error: 45%</text>
        </svg>
      ),
    },
    ...boundarySteps.map((bs, idx) => {
      const rad = (bs.angle * Math.PI) / 180
      const cx = w / 2
      const cy = h / 2
      const len = 400
      const x1 = cx - len * Math.cos(rad)
      const y1 = cy + bs.offset - h / 2 - len * Math.sin(rad)
      const x2 = cx + len * Math.cos(rad)
      const y2 = cy + bs.offset - h / 2 + len * Math.sin(rad)
      return {
        explanation: idx === 0
          ? `The machine learning algorithm starts with an initial guess. It measures the error: ${(bs.error * 100).toFixed(0)}% of points are misclassified. It will now iteratively improve.`
          : idx === boundarySteps.length - 1
          ? `After ${idx} iterations, the boundary has converged. Error is now just ${(bs.error * 100).toFixed(0)}%. The algorithm found a better separation than our initial guess by systematically minimizing errors.`
          : `Iteration ${idx}: The algorithm adjusts the boundary — rotating and shifting it to reduce errors. Error dropped to ${(bs.error * 100).toFixed(0)}%.`,
        render: () => (
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg">
            {classA.map((p, i) => <circle key={`a${i}`} cx={p[0]} cy={p[1]} r={6} fill="#3B82F6" opacity={0.8} />)}
            {classB.map((p, i) => <circle key={`b${i}`} cx={p[0]} cy={p[1]} r={6} fill="#EF4444" opacity={0.8} />)}
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#10B981" strokeWidth={2.5} />
            <rect x={w - 120} y={10} width={110} height={50} rx={6} fill="var(--color-surface-elevated)" stroke="var(--color-border)" />
            <text x={w - 65} y={30} fontSize={10} fill="var(--color-text-secondary)" fontFamily="var(--font-mono)" textAnchor="middle">Iteration {idx + 1}</text>
            <text x={w - 65} y={48} fontSize={14} fill={bs.error < 0.1 ? '#10B981' : '#EF4444'} fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
              Error: {(bs.error * 100).toFixed(0)}%
            </text>
          </svg>
        ),
      } as Step
    }),
  ]

  return (
    <StepperAnimation
      id="ch1-classification"
      title="Classification Boundary"
      steps={steps}
      height={380}
    />
  )
}

export default function Chapter1() {
  const chapter = chapters[0]

  return (
    <ChapterLayout chapter={chapter}>
      {/* Section 1 */}
      <section id="ch1-what-is-learning">
        <h2>What Does It Mean for a Machine to Learn?</h2>

        <p>
          Imagine you're teaching a child to recognize dogs. You don't sit them down with a textbook listing every possible pixel arrangement that constitutes a dog. Instead, you point at dogs — big ones, small ones, fluffy ones, sleek ones — and say "dog." You point at cats and say "not dog." After enough examples, something remarkable happens: the child can recognize dogs they've never seen before. They've extracted some invisible essence of "dogness" from the examples.
        </p>

        <p>
          Machine learning works on exactly the same principle, though the mechanism is entirely different. A machine learning algorithm is given data — thousands or millions of examples — and it finds patterns in that data that allow it to make predictions about new, unseen data. The machine doesn't "understand" dogs the way a child does. It has no concept of fur or tails or loyalty. But it can learn a mathematical function that maps images to labels with startling accuracy.
        </p>

        <p>
          More precisely, machine learning is the study of algorithms that improve their performance at a task through experience. The computer scientist Tom Mitchell gave perhaps the cleanest definition in 1997: "A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P, if its performance at tasks in T, as measured by P, improves with experience E." This sounds clinical, but it captures something profound. The program gets better <em>on its own</em>. You don't program the solution — you program the ability to find solutions.
        </p>

        <Callout type="misconception">
          <p>
            <strong>Machine learning is not artificial general intelligence.</strong> When a model learns to classify images of cats and dogs, it hasn't "understood" animals. It has found statistical patterns in pixel values that correlate with human-assigned labels. A model that achieves 99% accuracy on dog photos cannot tell you what a dog is, why dogs bark, or whether dogs are good pets. It performs one narrow task very well. This distinction matters because confusing narrow pattern-matching with understanding leads to both overhype and misplaced fear.
          </p>
        </Callout>

        <p>
          The key insight that separates machine learning from traditional programming is this: in traditional programming, you write explicit rules. "If the email contains 'Nigerian prince' and asks for money, mark it as spam." In machine learning, you provide examples of spam and not-spam emails, and the algorithm discovers its own rules. These discovered rules are often subtle and complex — far beyond what a human programmer could write by hand. A spam filter trained on millions of emails might learn that certain combinations of formatting, word frequencies, sender patterns, and link structures predict spam with uncanny accuracy.
        </p>

        <p>
          Think of it this way: traditional programming is like giving someone a recipe (precise instructions that produce a specific dish). Machine learning is like giving someone a thousand dishes and asking them to figure out the recipe. The machine works backward from examples to rules, from outputs to the process that generates them. This is sometimes called "inverse programming," and it turns out to be extraordinarily powerful.
        </p>

        <Callout type="practice">
          <p>
            <strong>Your phone uses machine learning every day.</strong> Autocomplete predicts your next word by learning from billions of text messages. Face unlock identifies you by learning the geometry of your face from multiple angles. Photo search lets you search "beach" and find your vacation pictures because a neural network learned what beaches look like. The spam filter in your email, the fraud detection on your credit card, the route optimization in your maps app — all machine learning.
          </p>
        </Callout>

        <p>
          But here's what makes machine learning truly fascinating: the same basic approach — give examples, learn patterns, make predictions — works across an astonishing range of domains. The mathematical framework that learns to recognize handwritten digits can, with modifications, also learn to translate languages, play chess, fold proteins, generate images, and compose music. The universality of the approach is one of the most remarkable discoveries in computer science.
        </p>

        <p>
          In this chapter, we'll build a foundation for understanding how all of this works. We'll start with the history that brought us here — a story full of drama, broken promises, and eventual triumph. Then we'll explore the different types of learning and finally look at how data flows through a machine learning system. By the end, you'll have the mental framework to understand everything that follows.
        </p>
      </section>

      {/* Section 2 */}
      <section id="ch1-history">
        <h2>The History of AI</h2>

        <p>
          The dream of artificial intelligence is ancient — myths of Galatea, the Golem, and Frankenstein all grapple with the idea of creating thinking beings. But the scientific pursuit began in earnest in 1950, when Alan Turing published "Computing Machinery and Intelligence," the paper that opened with the immortal question: "Can machines think?" Rather than getting bogged down in philosophy, Turing proposed a practical test: if a machine could carry on a conversation so convincingly that a human couldn't tell it apart from another human, we should grant that it can think. This "Turing Test" reframed the question from metaphysics to engineering, and suddenly, building intelligent machines felt like a tractable problem.
        </p>

        <p>
          The field was officially born at the Dartmouth Conference in 1956, where John McCarthy, Marvin Minsky, Nathaniel Rochester, and Claude Shannon gathered a small group of researchers for a summer workshop. Their proposal was breathtaking in its optimism: "Every aspect of learning or any other feature of intelligence can in principle be so precisely described that a machine can be made to simulate it." They believed that a group of talented researchers, working for a single summer, could make significant progress toward human-level AI. They were wrong about the timeline by roughly seventy years — and counting.
        </p>

        <p>
          The early years produced genuine excitement. Frank Rosenblatt built the Perceptron in 1958, a machine that could learn to classify simple patterns — the first artificial neural network. It worked by adjusting the strength of connections between simulated neurons based on examples, and it genuinely learned from experience. The New York Times reported that the Navy had built a machine that could "think." Rosenblatt himself was boldly optimistic, predicting machines that could walk, talk, and be conscious of their existence.
        </p>

        <p>
          Then came the first winter. In 1969, Marvin Minsky and Seymour Papert published "Perceptrons," a mathematical analysis proving that single-layer perceptrons couldn't solve certain simple problems — most famously, the XOR function (we'll explore this in Chapter 3). Though they acknowledged that multi-layer networks might overcome these limitations, the book was widely interpreted as a death blow to neural networks. Funding dried up. Researchers moved on. The first AI winter had begun.
        </p>

        <p>
          The 1980s brought a resurgence with expert systems — programs that encoded human knowledge as explicit rules. A medical diagnosis system, MYCIN, could identify blood infections and recommend antibiotics. For a while, it seemed like the right approach. But expert systems were brittle, expensive to maintain, and couldn't learn. They required human experts to laboriously encode every rule, and the real world had far more rules than anyone could write down. By the late 1980s, the hype had collapsed again. Second AI winter.
        </p>

        <Callout type="deepdive" expandable title="The Connectionism Wars">
          <p>
            The debate between symbolic AI (explicit rules and logic) and connectionism (neural networks learning from data) is one of the great intellectual battles in computer science. Symbolists argued that intelligence required manipulating structured representations — you need to know that a dog IS-A animal, HAS legs, CAN bark. Connectionists argued that intelligence emerges from simple units connected in complex ways, and that the representations should be learned, not hand-designed.
          </p>
          <p>
            For decades, the symbolists dominated. Neural networks were seen as a curiosity — mathematically interesting but practically useless. The connectionist revival began in 1986 when Rumelhart, Hinton, and Williams demonstrated that backpropagation could train multi-layer networks (Chapter 4). But it wasn't until the 2010s, with vast data and powerful GPUs, that connectionism won definitively. Today's most capable AI systems — GPT, Claude, AlphaFold — are all neural networks. The data-driven approach triumphed over the rule-based approach.
          </p>
        </Callout>

        <p>
          Meanwhile, a quieter revolution was brewing. In 1986, David Rumelhart, Geoffrey Hinton, and Ronald Williams published their paper on backpropagation, showing how to train multi-layer neural networks. The math worked beautifully, but the computers of the era couldn't handle large networks or large datasets. For two decades, neural networks remained a niche interest, kept alive by a small band of true believers — Hinton, Yann LeCun, Yoshua Bengio — who would later be called the "Godfathers of Deep Learning."
        </p>

        <p>
          The deep learning revolution arrived in 2012. Alex Krizhevsky, a student of Hinton's, entered the ImageNet competition — a brutal contest to classify 1.2 million images into 1,000 categories. His deep neural network, AlexNet, crushed the competition, reducing the error rate by a staggering 10 percentage points. This wasn't incremental improvement; it was a paradigm shift. Within two years, every competitive entry used deep learning. Within five years, deep learning had conquered image recognition, speech recognition, machine translation, and game playing. The approach that had been dismissed for decades was suddenly the most powerful tool in computer science.
        </p>

        <p>
          What changed? Three things converged: <strong>data</strong> (the internet generated massive labeled datasets), <strong>compute</strong> (GPUs designed for video games turned out to be perfect for training neural networks), and <strong>algorithms</strong> (better architectures, better training techniques, better understanding of why deep networks work). This trinity — data, compute, algorithms — remains the engine of progress today.
        </p>
      </section>

      {/* Section 3 */}
      <section id="ch1-types-of-learning">
        <h2>Types of Learning</h2>

        <p>
          Machine learning isn't a single technique — it's a family of approaches, each suited to different problems. Understanding the three main types gives you a map of the entire field.
        </p>

        <p>
          <strong>Supervised learning</strong> is the most common and most intuitive type. You provide the algorithm with input-output pairs: "This image is a cat," "This email is spam," "This house with 3 bedrooms sold for $450,000." The algorithm learns a function that maps inputs to outputs, then uses that function to make predictions on new inputs. The word "supervised" comes from the idea that a teacher (the labeled data) guides the learning process — telling the algorithm whether each guess is right or wrong.
        </p>

        <p>
          Supervised learning splits into two subtypes. <strong>Classification</strong> predicts categories: spam/not-spam, cat/dog/bird, malignant/benign. <strong>Regression</strong> predicts continuous values: house prices, temperature tomorrow, stock returns. The fundamental mechanics are the same — learn a function from examples — but the output type differs. Classification answers "which category?" while regression answers "how much?"
        </p>

        <p>
          <strong>Unsupervised learning</strong> works without labels. You give the algorithm raw data — no answers, no categories — and ask it to find structure on its own. Clustering algorithms group similar data points together: given customer purchase histories, they might discover that your customers naturally fall into five segments (bargain hunters, premium buyers, seasonal shoppers, etc.) without you ever defining those segments. Dimensionality reduction algorithms compress high-dimensional data into lower dimensions while preserving important structure, like taking a 1000-feature dataset and finding the 10 most informative combinations of features.
        </p>

        <Callout type="practice">
          <p>
            <strong>Netflix uses unsupervised learning for recommendations.</strong> By clustering users based on viewing patterns (without predefined categories), the system discovers groups like "people who watch sci-fi on weekday evenings" or "families who watch animated movies on weekends." Your recommendations come from finding which cluster you belong to and suggesting what others in your cluster enjoyed.
          </p>
        </Callout>

        <p>
          <strong>Reinforcement learning</strong> is the third paradigm, and it's the most different. Instead of learning from examples, an agent learns by interacting with an environment and receiving rewards or penalties. Think of training a dog: the dog tries things, and you reward the behaviors you want. Over time, the dog learns to sit, stay, and fetch — not because you showed it examples of sitting, but because sitting led to treats. Reinforcement learning is behind game-playing AI (AlphaGo, which mastered Go by playing millions of games against itself), robotics (learning to walk, grasp objects), and increasingly, the fine-tuning of large language models.
        </p>

        <p>
          These three types aren't mutually exclusive. Modern AI systems often combine them. A self-driving car might use supervised learning to recognize objects (trained on labeled images), unsupervised learning to understand road scenes (clustering different driving conditions), and reinforcement learning to decide what action to take (rewarding safe driving). The power of machine learning comes from having multiple tools that can be combined and adapted to different problems.
        </p>

        <Callout type="misconception">
          <p>
            <strong>"More data is always better" is not always true.</strong> Quality matters more than quantity. A smaller dataset with accurate, diverse, well-labeled examples will often outperform a massive dataset full of noise, duplicates, or biased labels. A million blurry photos teach a model less than ten thousand sharp, well-labeled ones. The mantra should be: "Better data first, more data second."
          </p>
        </Callout>
      </section>

      {/* Section 4 */}
      <section id="ch1-data-pipeline">
        <h2>The Data Pipeline</h2>

        <p>
          Before any learning can happen, data must be prepared. This process — collecting, cleaning, structuring, and splitting data — is often called the most important (and most time-consuming) part of any machine learning project. Ask any ML engineer, and they'll tell you they spend more time wrangling data than building models. The data pipeline isn't glamorous, but it's foundational. Get it wrong, and no algorithm can save you.
        </p>

        <p>
          It starts with <strong>features</strong> and <strong>labels</strong>. Features are the input variables — the measurements, attributes, or characteristics that describe each example. For a house price prediction model, features might include square footage, number of bedrooms, location, age of the house, and lot size. Labels are the outputs — what you're trying to predict. In this case, the sale price. Together, a feature set and its corresponding label form one <strong>training example</strong>. A dataset is a collection of thousands or millions of such examples.
        </p>

        <p>
          Feature selection and engineering — deciding which features to include and how to represent them — is an art. Including irrelevant features (like the color of the front door for house pricing) adds noise. Missing important features (like neighborhood crime rates) leaves the model blind to crucial information. Feature engineering, the process of creating new features from existing ones (like computing "price per square foot" from price and area), can dramatically improve model performance. It requires domain knowledge — understanding the problem deeply enough to know what matters.
        </p>

        <p>
          Once you have features and labels, you must split the data into at least two sets: <strong>training data</strong> (typically 70-80% of total) and <strong>test data</strong> (20-30%). The model learns from the training data and is evaluated on the test data — data it has never seen during training. This split is crucial because the goal of machine learning isn't to memorize the training data; it's to generalize to new data. A student who memorizes answers to practice problems might fail the exam if the questions are slightly different. Similarly, a model that performs perfectly on training data but poorly on test data has <strong>overfit</strong> — it memorized rather than learned.
        </p>

        <Callout type="misconception">
          <p>
            <strong>Overfitting isn't a sign of too much learning — it's a sign of learning the wrong things.</strong> An overfit model hasn't learned too well; it's learned the noise and quirks specific to the training data rather than the underlying patterns. A model that memorizes that "house #4732 sold for $523,000" is useless. A model that learns "houses near good schools with large lots sell for more" is useful. The art of machine learning is building models complex enough to capture real patterns but not so complex that they memorize noise.
          </p>
        </Callout>

        <p>
          Now let's see this in action. The interactive below shows how a machine learning algorithm learns to classify data points by iteratively improving a decision boundary.
        </p>

        <ClassificationBoundary />

        <CodeBlock
          tabs={[
            {
              label: 'From Scratch',
              language: 'python',
              code: `import numpy as np

# Generate some 2D data points
np.random.seed(42)
class_a = np.random.randn(20, 2) * 0.8 + np.array([2, 2])
class_b = np.random.randn(20, 2) * 0.8 + np.array([5, 5])

# Combine into training data
X = np.vstack([class_a, class_b])          # Shape: (40, 2)
y = np.array([0]*20 + [1]*20)              # Labels: 0 for A, 1 for B

# Simple linear classifier: y = sign(w1*x1 + w2*x2 + bias)
weights = np.random.randn(2) * 0.1         # Start with small random weights
bias = 0.0
learning_rate = 0.01

# Training loop — adjust weights based on errors
for epoch in range(100):
    errors = 0
    for i in range(len(X)):
        # Predict: compute weighted sum
        z = np.dot(X[i], weights) + bias
        prediction = 1 if z > 0 else 0

        # Update if wrong
        error = y[i] - prediction
        if error != 0:
            weights += learning_rate * error * X[i]
            bias += learning_rate * error
            errors += 1

    if epoch % 20 == 0:
        print(f"Epoch {epoch}: {errors} errors")

print(f"Final weights: {weights}")
print(f"Final bias: {bias:.4f}")`,
              output: `Epoch 0: 12 errors
Epoch 20: 2 errors
Epoch 40: 0 errors
Epoch 60: 0 errors
Epoch 80: 0 errors
Final weights: [0.2847 0.3102]
Final bias: -1.8234`,
            },
            {
              label: 'PyTorch',
              language: 'python',
              code: `import torch
import torch.nn as nn

# Same data, as PyTorch tensors
torch.manual_seed(42)
class_a = torch.randn(20, 2) * 0.8 + torch.tensor([2.0, 2.0])
class_b = torch.randn(20, 2) * 0.8 + torch.tensor([5.0, 5.0])

X = torch.cat([class_a, class_b])           # (40, 2)
y = torch.cat([torch.zeros(20), torch.ones(20)])  # (40,)

# Linear classifier (1 neuron, 2 inputs, 1 output)
model = nn.Linear(2, 1)
loss_fn = nn.BCEWithLogitsLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

# Training loop
for epoch in range(100):
    logits = model(X).squeeze()              # Forward pass
    loss = loss_fn(logits, y)                # Compute loss
    loss.backward()                          # Compute gradients
    optimizer.step()                         # Update weights
    optimizer.zero_grad()                    # Reset gradients

    if epoch % 20 == 0:
        preds = (logits > 0).float()
        acc = (preds == y).float().mean()
        print(f"Epoch {epoch}: loss={loss:.4f}, acc={acc:.2%}")`,
              output: `Epoch 0: loss=0.8321, acc=47.50%
Epoch 20: loss=0.3847, acc=90.00%
Epoch 40: loss=0.1923, acc=97.50%
Epoch 60: loss=0.1204, acc=100.00%
Epoch 80: loss=0.0867, acc=100.00%`,
            },
          ]}
        />
      </section>
    </ChapterLayout>
  )
}
