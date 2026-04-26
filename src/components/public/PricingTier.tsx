import Link from 'next/link'
import { Check } from 'lucide-react'
import type { PricingTierDefinition } from '@/lib/content/public-site'

interface PricingTierProps {
  tier: PricingTierDefinition
}

export function PricingTier({ tier }: PricingTierProps): React.JSX.Element {
  return (
    <div
      className={`relative rounded-2xl p-8 border flex flex-col ${
        tier.highlight
          ? 'border-vma-violet bg-vma-surface-2 gradient-border'
          : 'border-vma-border bg-vma-surface'
      }`}
    >
      {tier.highlight && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span
            className="text-xs font-semibold text-white px-4 py-1 rounded-full"
            style={{ background: 'var(--vma-gradient-brand)' }}
          >
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-display text-2xl font-bold text-vma-text mb-1">
          {tier.name}
        </h3>
        <p className="font-mono text-lg font-semibold text-vma-violet mb-3">
          {tier.range}
        </p>
        <p className="text-sm text-vma-text-muted leading-relaxed">
          {tier.description}
        </p>
      </div>

      <ul className="space-y-3 flex-1 mb-8">
        {tier.included.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-vma-text-muted">
            <Check
              className="h-4 w-4 text-vma-violet flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>

      <Link
        href="/contact"
        className={`inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
          tier.highlight
            ? 'text-white glow-violet'
            : 'text-vma-text border border-vma-border-bright hover:border-vma-violet hover:text-vma-violet'
        }`}
        style={tier.highlight ? { background: 'var(--vma-gradient-brand)' } : undefined}
      >
        Get Custom Quote
      </Link>
    </div>
  )
}
