'use client'

import { motion } from 'framer-motion'
import type { PortfolioItem } from '@/lib/content/public-site'

interface PortfolioCardProps {
  item: PortfolioItem
  onClick?: () => void
}

export function PortfolioCard({
  item,
  onClick,
}: PortfolioCardProps): React.JSX.Element {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative w-full text-left rounded-2xl overflow-hidden border border-vma-border bg-vma-surface cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vma-violet"
      aria-label={`View case study: ${item.title}`}
    >
      {/* Placeholder image area */}
      <div
        className={`relative h-56 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
          aria-hidden="true"
        />
        <span className="font-display text-4xl font-bold text-vma-text-dim opacity-30">
          {item.serviceLabel}
        </span>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-vma-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
          <span className="text-sm font-semibold text-vma-violet">View Case Study →</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-vma-violet bg-vma-violet-dim px-2.5 py-0.5 rounded-full">
            {item.serviceLabel}
          </span>
        </div>
        <h3 className="font-display text-base font-bold text-vma-text mb-1">
          {item.title}
        </h3>
        <p className="text-xs text-vma-text-muted mb-3">{item.client}</p>
        <p className="text-sm font-semibold text-vma-green">{item.result}</p>
      </div>
    </motion.button>
  )
}
