'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PORTFOLIO_ITEMS, SERVICES } from '@/lib/content/public-site'
import type { PortfolioItem, ServiceSlug } from '@/lib/content/public-site'

type FilterSlug = 'all' | ServiceSlug

const FILTERS: { slug: FilterSlug; label: string }[] = [
  { slug: 'all', label: 'All' },
  { slug: 'social', label: 'Social' },
  { slug: 'seo', label: 'SEO' },
  { slug: 'paid', label: 'Paid' },
  { slug: 'web', label: 'Web' },
  { slug: 'email', label: 'Email' },
  { slug: 'ai', label: 'AI' },
]

export default function PortfolioPage(): React.JSX.Element {
  const [activeFilter, setActiveFilter] = useState<FilterSlug>('all')
  const [selected, setSelected] = useState<PortfolioItem | null>(null)

  const filtered =
    activeFilter === 'all'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.service === activeFilter)

  return (
    <>
      {/* PAGE HERO */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-vma-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-0 right-0 w-[600px] h-[400px] opacity-[0.06] blur-[140px]"
            style={{ background: 'var(--vma-gradient-brand)' }}
          />
          <div className="absolute inset-0 grid-mesh opacity-30" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-vma-violet mb-4">
            Our Work
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-vma-text mb-6">
            Results That{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--vma-gradient-brand)' }}
            >
              Speak
            </span>
          </h1>
          <p className="text-xl text-vma-text-muted max-w-xl mx-auto leading-relaxed">
            Real campaigns. Real metrics. Real clients.
          </p>
        </div>
      </section>

      {/* FILTER + GRID */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter chips */}
          <div
            className="flex flex-wrap gap-2 mb-12 justify-center"
            role="group"
            aria-label="Filter portfolio by service"
          >
            {FILTERS.map((f) => (
              <button
                key={f.slug}
                type="button"
                onClick={() => setActiveFilter(f.slug)}
                aria-pressed={activeFilter === f.slug}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  activeFilter === f.slug
                    ? 'bg-vma-violet text-white border-vma-violet'
                    : 'text-vma-text-muted border-vma-border hover:border-vma-violet hover:text-vma-violet'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Masonry grid — CSS columns */}
          {filtered.length === 0 ? (
            <p className="text-center text-vma-text-muted py-16">
              No work in this category yet.
            </p>
          ) : (
            <div
              className="[column-count:1] sm:[column-count:2] lg:[column-count:3] gap-6"
              style={{ columnGap: '1.5rem' }}
            >
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="break-inside-avoid mb-6"
                >
                  <button
                    type="button"
                    onClick={() => setSelected(item)}
                    className="group w-full text-left rounded-2xl overflow-hidden border border-vma-border bg-vma-surface hover:border-vma-violet transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vma-violet"
                    aria-label={`View case study: ${item.title}`}
                  >
                    {/* Placeholder image */}
                    <div
                      className={`relative h-48 bg-gradient-to-br ${item.gradient} flex items-center justify-center overflow-hidden`}
                    >
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          backgroundImage:
                            'linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }}
                        aria-hidden="true"
                      />
                      <span className="font-display text-5xl font-bold text-vma-text-dim opacity-10">
                        {item.serviceLabel}
                      </span>

                      <div className="absolute inset-0 bg-vma-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-sm font-semibold text-vma-violet">
                          View Case Study →
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <span className="text-xs font-medium text-vma-violet bg-vma-violet-dim px-2.5 py-0.5 rounded-full">
                        {item.serviceLabel}
                      </span>
                      <h3 className="font-display text-base font-bold text-vma-text mt-3 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-vma-text-muted mb-3">{item.client}</p>
                      <p className="text-sm font-semibold text-vma-green">{item.result}</p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CASE STUDY DIALOG */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl bg-vma-surface border border-vma-border">
          {selected && (
            <>
              {/* Placeholder header image */}
              <div
                className={`h-48 -mx-6 -mt-6 mb-6 rounded-t-lg bg-gradient-to-br ${selected.gradient} flex items-center justify-center`}
              >
                <span className="font-display text-6xl font-bold text-vma-text-dim opacity-10">
                  {selected.serviceLabel}
                </span>
              </div>

              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-vma-violet bg-vma-violet-dim px-2.5 py-0.5 rounded-full">
                    {selected.serviceLabel}
                  </span>
                </div>
                <DialogTitle className="font-display text-2xl font-bold text-vma-text">
                  {selected.title}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-vma-text-dim mb-1">
                    Client
                  </p>
                  <p className="text-vma-text">{selected.client}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-vma-text-dim mb-1">
                    Key Result
                  </p>
                  <p className="text-xl font-bold text-vma-green">{selected.result}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-vma-text-dim mb-1">
                    About This Project
                  </p>
                  <p className="text-vma-text-muted leading-relaxed">
                    {selected.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-vma-border">
                  <p className="text-xs text-vma-text-dim">
                    Want results like these?{' '}
                    <a
                      href="/contact"
                      className="text-vma-violet hover:text-vma-violet-light transition-colors"
                    >
                      Let&apos;s talk →
                    </a>
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
