'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { SectionReveal } from '@/components/public/SectionReveal'
import { PRICING_TIERS } from '@/lib/content/public-site'

interface RoiFormValues {
  ltv: number
  currentCustomers: number
  targetCustomers: number
}

const FEATURE_MATRIX: Record<string, [boolean, boolean, boolean]> = {
  'Social media management':        [true,  true,  true ],
  'SEO & content marketing':        [false, true,  true ],
  'Paid media (1 channel)':         [false, true,  true ],
  'Paid media (multi-channel)':     [false, false, true ],
  'Email marketing & automation':   [false, true,  true ],
  'AI content production':          [false, false, true ],
  'Monthly performance reporting':  [true,  true,  true ],
  'Bi-weekly strategy calls':       [false, true,  true ],
  'Dedicated account team':         [false, false, true ],
  'Custom analytics dashboard':     [false, false, true ],
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`
  return `$${n}`
}

export default function PricingPage(): React.JSX.Element {
  const [showAnnual] = useState(false)
  void showAnnual

  const { register, control } = useForm<RoiFormValues>({
    defaultValues: {
      ltv: 2500,
      currentCustomers: 10,
      targetCustomers: 25,
    },
  })

  const ltv = useWatch({ control, name: 'ltv' })
  const current = useWatch({ control, name: 'currentCustomers' })
  const target = useWatch({ control, name: 'targetCustomers' })

  const additionalCustomers = Math.max(0, target - current)
  const additionalAnnualRevenue = additionalCustomers * ltv * 12

  return (
    <>
      {/* PAGE HERO */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-vma-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.06] blur-[140px]"
            style={{ background: 'var(--vma-gradient-brand)' }}
          />
          <div className="absolute inset-0 grid-mesh opacity-30" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-vma-violet mb-4">
            Investment
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-vma-text mb-6">
            Transparent{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--vma-gradient-brand)' }}
            >
              Pricing
            </span>
          </h1>
          <p className="text-xl text-vma-text-muted max-w-2xl mx-auto leading-relaxed">
            Every engagement is custom — these are typical ranges. Get a precise quote after your free audit.
          </p>
        </div>
      </section>

      {/* TIER CARDS */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier, i) => (
              <SectionReveal key={tier.name} delay={i * 0.1}>
                <div
                  className={`relative rounded-2xl p-8 border flex flex-col h-full ${
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

                  <h3 className="font-display text-2xl font-bold text-vma-text mb-1">
                    {tier.name}
                  </h3>
                  <p className="font-mono text-lg font-semibold text-vma-violet mb-3">
                    {tier.range}
                  </p>
                  <p className="text-sm text-vma-text-muted leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  <ul className="space-y-3 flex-1 mb-8">
                    {tier.included.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-vma-text-muted">
                        <Check className="h-4 w-4 text-vma-violet flex-shrink-0 mt-0.5" aria-hidden="true" />
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
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE MATRIX */}
      <section className="py-20 bg-vma-black/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-vma-text mb-12 text-center">
              Feature Comparison
            </h2>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="rounded-2xl border border-vma-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-vma-border bg-vma-surface">
                    <th className="text-left px-6 py-4 text-vma-text-muted font-medium w-1/2">
                      Feature
                    </th>
                    {PRICING_TIERS.map((t) => (
                      <th
                        key={t.name}
                        className={`px-4 py-4 text-center font-display font-bold ${
                          t.highlight ? 'text-vma-violet' : 'text-vma-text'
                        }`}
                      >
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(FEATURE_MATRIX).map(([feature, tiers], i) => (
                    <tr
                      key={feature}
                      className={`border-b border-vma-border ${
                        i % 2 === 0 ? 'bg-vma-surface' : 'bg-vma-surface/50'
                      }`}
                    >
                      <td className="px-6 py-3.5 text-vma-text-muted">{feature}</td>
                      {tiers.map((included, ti) => (
                        <td key={ti} className="px-4 py-3.5 text-center">
                          {included ? (
                            <Check
                              className="h-4 w-4 text-vma-violet mx-auto"
                              aria-label="Included"
                            />
                          ) : (
                            <span className="text-vma-text-dim" aria-label="Not included">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-vma-text mb-3 text-center">
              ROI Calculator
            </h2>
            <p className="text-vma-text-muted text-center mb-12">
              Estimate the projected value of hitting your growth targets.
            </p>

            <form
              className="gradient-border rounded-2xl bg-vma-surface p-8 space-y-8"
              aria-label="ROI calculator"
            >
              {/* LTV */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="roi-ltv" className="text-sm font-medium text-vma-text-muted">
                    Average customer lifetime value
                  </label>
                  <span className="font-mono text-lg font-bold text-vma-violet">
                    {formatCurrency(ltv)}
                  </span>
                </div>
                <input
                  {...register('ltv', { valueAsNumber: true })}
                  id="roi-ltv"
                  type="range"
                  min={500}
                  max={50000}
                  step={500}
                  className="w-full accent-vma-violet"
                  aria-valuemin={500}
                  aria-valuemax={50000}
                  aria-valuenow={ltv}
                />
                <div className="flex justify-between text-xs text-vma-text-dim">
                  <span>$500</span>
                  <span>$50k</span>
                </div>
              </div>

              {/* Current customers */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="roi-current" className="text-sm font-medium text-vma-text-muted">
                    Current monthly new customers
                  </label>
                  <span className="font-mono text-lg font-bold text-vma-violet">{current}</span>
                </div>
                <input
                  {...register('currentCustomers', { valueAsNumber: true })}
                  id="roi-current"
                  type="range"
                  min={0}
                  max={500}
                  step={1}
                  className="w-full accent-vma-violet"
                  aria-valuemin={0}
                  aria-valuemax={500}
                  aria-valuenow={current}
                />
                <div className="flex justify-between text-xs text-vma-text-dim">
                  <span>0</span>
                  <span>500</span>
                </div>
              </div>

              {/* Target customers */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="roi-target" className="text-sm font-medium text-vma-text-muted">
                    Target monthly new customers
                  </label>
                  <span className="font-mono text-lg font-bold text-vma-violet">{target}</span>
                </div>
                <input
                  {...register('targetCustomers', { valueAsNumber: true })}
                  id="roi-target"
                  type="range"
                  min={0}
                  max={1000}
                  step={1}
                  className="w-full accent-vma-violet"
                  aria-valuemin={0}
                  aria-valuemax={1000}
                  aria-valuenow={target}
                />
                <div className="flex justify-between text-xs text-vma-text-dim">
                  <span>0</span>
                  <span>1,000</span>
                </div>
              </div>

              {/* Result */}
              <div className="rounded-xl border border-vma-violet/30 bg-vma-violet-dim p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-vma-text-dim mb-2">
                  Projected Additional Annual Revenue
                </p>
                <p className="font-mono text-4xl font-bold text-vma-violet">
                  {additionalAnnualRevenue.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p className="text-xs text-vma-text-muted mt-2">
                  {additionalCustomers} additional customers × {formatCurrency(ltv)} LTV × 12 months
                </p>
              </div>

              <div className="text-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white rounded-xl glow-violet"
                  style={{ background: 'var(--vma-gradient-brand)' }}
                >
                  Let&apos;s Make This Happen →
                </Link>
              </div>
            </form>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
