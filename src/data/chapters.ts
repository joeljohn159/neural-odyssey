export interface Section {
  id: string
  title: string
  readingTime: number // minutes
}

export interface Chapter {
  index: number
  title: string
  subtitle: string
  description: string
  sections: Section[]
  papers: Paper[]
}

export interface Paper {
  title: string
  authors: string
  year: number
  description: string
  link: string
}

export const chapters: Chapter[] = [
  {
    index: 1,
    title: 'Foundations',
    subtitle: 'What Is Intelligence?',
    description: 'Begin your journey by understanding what it means for a machine to learn, the history that brought us here, and the types of problems AI can solve.',
    sections: [
      { id: 'ch1-what-is-learning', title: 'What Does It Mean for a Machine to Learn?', readingTime: 8 },
      { id: 'ch1-history', title: 'The History of AI', readingTime: 10 },
      { id: 'ch1-types-of-learning', title: 'Types of Learning', readingTime: 7 },
      { id: 'ch1-data-pipeline', title: 'The Data Pipeline', readingTime: 6 },
    ],
    papers: [],
  },
  {
    index: 2,
    title: 'The Neuron',
    subtitle: 'Where It All Begins',
    description: 'Discover the fundamental building block of neural networks — the artificial neuron — and understand how it transforms inputs into decisions.',
    sections: [
      { id: 'ch2-bio-vs-artificial', title: 'Biological vs Artificial Neurons', readingTime: 7 },
      { id: 'ch2-perceptron', title: 'The Perceptron', readingTime: 9 },
      { id: 'ch2-activation-functions', title: 'Activation Functions Deep Dive', readingTime: 8 },
      { id: 'ch2-decision-boundaries', title: 'Decision Boundaries', readingTime: 6 },
    ],
    papers: [
      {
        title: 'The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain',
        authors: 'Frank Rosenblatt',
        year: 1958,
        description: 'The paper that started it all. Rosenblatt introduced the perceptron as a simplified model of biological neural networks, demonstrating that a machine could learn to classify patterns through a training procedure. This work ignited the field of neural networks and remains foundational to how we think about machine learning.',
        link: 'https://psycnet.apa.org/doi/10.1037/h0042519',
      },
    ],
  },
  {
    index: 3,
    title: 'Neural Networks',
    subtitle: 'Layers of Thought',
    description: 'Stack neurons into layers and witness the emergence of networks that can solve problems no single neuron could handle alone.',
    sections: [
      { id: 'ch3-why-layers', title: 'From One Neuron to Many', readingTime: 8 },
      { id: 'ch3-architecture', title: 'Network Architecture', readingTime: 7 },
      { id: 'ch3-forward-prop', title: 'Forward Propagation', readingTime: 10 },
      { id: 'ch3-universal-approx', title: 'Universal Approximation Theorem', readingTime: 7 },
    ],
    papers: [
      {
        title: 'Approximation by Superpositions of a Sigmoidal Function',
        authors: 'George Cybenko',
        year: 1989,
        description: 'This landmark theorem proved that a feedforward network with a single hidden layer containing a finite number of neurons can approximate any continuous function on compact subsets of Rn. It gave mathematical legitimacy to neural networks and explained why they could, in principle, solve any problem.',
        link: 'https://doi.org/10.1007/BF02551274',
      },
    ],
  },
  {
    index: 4,
    title: 'Learning',
    subtitle: 'How Networks Get Smarter',
    description: 'Understand the engine of intelligence: how networks measure their mistakes, compute corrections, and gradually improve through backpropagation.',
    sections: [
      { id: 'ch4-loss-functions', title: 'Loss Functions', readingTime: 8 },
      { id: 'ch4-gradient-descent', title: 'Gradient Descent', readingTime: 9 },
      { id: 'ch4-backpropagation', title: 'Backpropagation', readingTime: 12 },
      { id: 'ch4-hyperparameters', title: 'Hyperparameters', readingTime: 7 },
      { id: 'ch4-optimizers', title: 'Optimizers', readingTime: 8 },
    ],
    papers: [
      {
        title: 'Learning Representations by Back-Propagating Errors',
        authors: 'David E. Rumelhart, Geoffrey E. Hinton, Ronald J. Williams',
        year: 1986,
        description: 'The paper that made deep learning possible. While backpropagation had been discovered before, Rumelhart, Hinton, and Williams showed how it could efficiently train multi-layer networks, enabling them to learn internal representations. This unlocked the practical training of deep networks and remains the foundation of modern deep learning.',
        link: 'https://doi.org/10.1038/323533a0',
      },
    ],
  },
  {
    index: 5,
    title: 'Convolutional Neural Networks',
    subtitle: 'Seeing the World',
    description: 'Learn how CNNs exploit the spatial structure of images through convolutions, enabling machines to recognize faces, objects, and scenes.',
    sections: [
      { id: 'ch5-why-cnn', title: 'Why Fully Connected Networks Fail at Images', readingTime: 7 },
      { id: 'ch5-convolution', title: 'The Convolution Operation', readingTime: 9 },
      { id: 'ch5-filters', title: 'Filters and Kernels', readingTime: 8 },
      { id: 'ch5-pooling', title: 'Pooling, Stride, and Padding', readingTime: 6 },
      { id: 'ch5-architectures', title: 'Famous Architectures', readingTime: 9 },
    ],
    papers: [
      {
        title: 'Gradient-Based Learning Applied to Document Recognition',
        authors: 'Yann LeCun, Léon Bottou, Yoshua Bengio, Patrick Haffner',
        year: 1998,
        description: 'Introduced LeNet-5, the convolutional neural network architecture that proved CNNs could achieve state-of-the-art results on handwritten digit recognition. This paper established the blueprint — convolution, pooling, fully connected — that nearly all modern image recognition systems still follow.',
        link: 'http://yann.lecun.com/exdb/publis/pdf/lecun-98.pdf',
      },
      {
        title: 'Deep Residual Learning for Image Recognition',
        authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun',
        year: 2015,
        description: 'Introduced skip connections (residual learning), solving the degradation problem that prevented training of very deep networks. ResNet enabled networks with 100+ layers and won ILSVRC 2015. The idea of residual connections has since become ubiquitous in all areas of deep learning, including transformers.',
        link: 'https://arxiv.org/abs/1512.03385',
      },
    ],
  },
  {
    index: 6,
    title: 'Sequences & Memory',
    subtitle: 'Understanding Time',
    description: 'Explore how recurrent networks process sequential data, why they struggle with long-term memory, and how LSTMs solved the vanishing gradient problem.',
    sections: [
      { id: 'ch6-why-sequences', title: 'Why Order Matters', readingTime: 6 },
      { id: 'ch6-rnn', title: 'Recurrent Neural Networks', readingTime: 9 },
      { id: 'ch6-vanishing-gradients', title: 'The Vanishing Gradient Problem', readingTime: 8 },
      { id: 'ch6-lstm', title: 'Long Short-Term Memory', readingTime: 10 },
      { id: 'ch6-gru', title: 'GRU and Beyond', readingTime: 6 },
    ],
    papers: [
      {
        title: 'Long Short-Term Memory',
        authors: 'Sepp Hochreiter, Jürgen Schmidhuber',
        year: 1997,
        description: 'Solved the fundamental vanishing gradient problem that had crippled recurrent neural networks. By introducing a gated memory cell that could maintain information over long time periods, LSTM made it possible to learn long-range dependencies in sequential data — enabling breakthroughs in speech recognition, machine translation, and time series prediction.',
        link: 'https://doi.org/10.1162/neco.1997.9.8.1735',
      },
    ],
  },
  {
    index: 7,
    title: 'Attention & Transformers',
    subtitle: 'The Revolution',
    description: 'Understand the mechanism that changed everything: how attention lets models focus on what matters, and how Transformers reshaped the entire field.',
    sections: [
      { id: 'ch7-bottleneck', title: 'The Bottleneck Problem', readingTime: 7 },
      { id: 'ch7-attention', title: 'The Attention Mechanism', readingTime: 10 },
      { id: 'ch7-self-attention', title: 'Self-Attention', readingTime: 9 },
      { id: 'ch7-multihead', title: 'Multi-Head Attention', readingTime: 8 },
      { id: 'ch7-transformer', title: 'The Full Transformer', readingTime: 12 },
    ],
    papers: [
      {
        title: 'Attention Is All You Need',
        authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin',
        year: 2017,
        description: 'Perhaps the most influential machine learning paper of the 2010s. By dispensing with recurrence and convolutions entirely and relying solely on attention mechanisms, the Transformer architecture achieved state-of-the-art results in machine translation while being vastly more parallelizable. This architecture underlies GPT, BERT, Claude, and nearly every major AI system today.',
        link: 'https://arxiv.org/abs/1706.03762',
      },
    ],
  },
  {
    index: 8,
    title: 'The Modern Landscape',
    subtitle: 'Where We Are Now',
    description: 'Survey the frontiers: large language models, diffusion models, multimodal AI, scaling laws, and the critical questions of safety and alignment.',
    sections: [
      { id: 'ch8-language-models', title: 'Language Models', readingTime: 9 },
      { id: 'ch8-training', title: 'How Modern Models Are Trained', readingTime: 10 },
      { id: 'ch8-diffusion', title: 'Diffusion Models', readingTime: 8 },
      { id: 'ch8-multimodal', title: 'Multimodal Models & Scaling Laws', readingTime: 7 },
      { id: 'ch8-ethics', title: 'Ethics, Safety, and Alignment', readingTime: 8 },
    ],
    papers: [
      {
        title: 'Improving Language Understanding by Generative Pre-Training',
        authors: 'Alec Radford, Karthik Narasimhan, Tim Salimans, Ilya Sutskever',
        year: 2018,
        description: 'Introduced GPT-1 and demonstrated that generative pre-training on a large corpus followed by discriminative fine-tuning could achieve strong performance across diverse NLP tasks. This paper established the pre-train then fine-tune paradigm that would scale to GPT-2, GPT-3, GPT-4, and beyond.',
        link: 'https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf',
      },
      {
        title: 'Denoising Diffusion Probabilistic Models',
        authors: 'Jonathan Ho, Ajay Jain, Pieter Abbeel',
        year: 2020,
        description: 'Showed that diffusion models — which learn to reverse a gradual noising process — could generate high-quality images competitive with GANs. This paper sparked the diffusion revolution that led to DALL-E 2, Stable Diffusion, Midjourney, and fundamentally changed how we think about generative models.',
        link: 'https://arxiv.org/abs/2006.11239',
      },
    ],
  },
]
