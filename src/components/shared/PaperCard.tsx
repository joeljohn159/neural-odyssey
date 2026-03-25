import type { Paper } from '../../data/chapters'

export default function PaperCard({ paper }: { paper: Paper }) {
  return (
    <div className="border border-border rounded-xl p-5 bg-surface-elevated hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="text-base font-display font-semibold leading-snug m-0 mb-1">
            {paper.title}
          </h4>
          <p className="text-xs font-mono text-text-tertiary m-0 mb-3">
            {paper.authors} ({paper.year})
          </p>
        </div>
        <a
          href={paper.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-xs font-mono text-accent hover:underline"
        >
          Read →
        </a>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed m-0">
        {paper.description}
      </p>
    </div>
  )
}
