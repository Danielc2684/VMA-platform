import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero } from '@/components/public/Hero'
import { LogoMarquee } from '@/components/public/LogoMarquee'
import { MetricCounter } from '@/components/public/MetricCounter'
import { ServiceCard } from '@/components/public/ServiceCard'
import { PortfolioCard } from '@/components/public/PortfolioCard'
import { PricingTier } from '@/components/public/PricingTier'
import { TestimonialsCarousel } from '@/components/public/TestimonialsCarousel'
import { AuditForm } from '@/components/public/AuditForm'
import { SectionReveal } from '@/components/public/SectionReveal'
import {
  SITE_METRICS,
  SERVICES,
  PORTFOLIO_ITEMS,
  PRICING_TIERS,
  TESTIMONIALS,
} from '@/lib/content/public-site'

export const metadata: Metadata = {
  title: 'Versatile Marketing Agency — Precision Marketing. Extraordinary Results.',
  description:
    'VMA engineers growth systems for ambitious businesses. From first click to lifelong customer — every pixel, every campaign, every conversion, measured.',
  openGraph: {
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
}

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discover',
    description:
      'We audit your current presence, map your competitive landscape, and identify the highest-leverage growth opportunities.',
  },
  {
    number: '02',
    title: 'Strategize',
    description:
      'We design a precision growth plan — channels, budgets, timelines, and KPIs — tailored to your specific market.',
  },
  {
    number: '03',
    title: 'Execute',
    description:
      'Our team builds and launches campaigns with meticulous attention to detail. Every asset, every bid, every headline optimized.',
  },
  {
    number: '04',
    title: 'Scale',
    description:
      'We analyze results, double down on what works, and systematically scale your highest-performing channels.',
  },
]

export default function HomePage(): React.JSX.Element {
  return (
    <>
      {/* 1. HERO */}
      <Hero />

      {/* 2. MARQUEE */}
      <LogoMarquee />

      {/* 3. METRICS STRIP */}
      <section className="py-20 border-b border-vma-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {SITE_METRICS.map((m, i) => (
                <div key={m.label} className="relative">
                  <MetricCounter
                    value={m.value}
                    suffix={m.suffix}
                    prefix={'prefix' in m ? m.prefix : undefined}
                    label={m.label}
                  />
                  {i < SITE_METRICS.length - 1 && (
                    <div
                      className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-vma-border"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 4. SERVICES PREVIEW */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-vma-text mb-4">
                What We Do Better
              </h2>
              <p className="text-vma-text-muted max-w-xl mx-auto">
                Six service lines. One integrated growth engine.
              </p>
            </div>
          </SectionReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((service, i) => (
              <SectionReveal key={service.slug} delay={i * 0.06}>
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  included={service.included}
                />
              </SectionReveal>
            ))}
          </div>

          <SectionReveal className="mt-12 text-center" delay={0.3}>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-vma-violet hover:text-vma-violet-light transition-colors"
            >
              Explore all services →
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* 5. FEATURED WORK */}
      <section className="py-24 bg-vma-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-vma-text mb-4">
                Selected Work
              </h2>
              <p className="text-vma-text-muted max-w-xl mx-auto">
                Real results for real businesses.
              </p>
            </div>
          </SectionReveal>

          <div className="grid sm:grid-cols-2 gap-6">
            {PORTFOLIO_ITEMS.map((item, i) => (
              <SectionReveal
                key={item.id}
                delay={i * 0.08}
                className={i % 2 === 1 ? 'sm:mt-10' : ''}
              >
                <PortfolioCard item={item} />
              </SectionReveal>
            ))}
          </div>

          <SectionReveal className="mt-12 text-center" delay={0.3}>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-medium text-vma-violet hover:text-vma-violet-light transition-colors"
            >
              View all case studies →
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center mb-20">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-vma-text mb-4">
                The Process
              </h2>
              <p className="text-vma-text-muted">How we turn strategy into results.</p>
            </div>
          </SectionReveal>

          <div className="relative">
            {/* Vertical connector line */}
            <div
              className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-vma-violet/40 via-vma-magenta/20 to-transparent"
              aria-hidden="true"
            />

            <div className="space-y-16">
              {PROCESS_STEPS.map((step, i) => (
                <SectionReveal key={step.number} delay={i * 0.1}>
                  <div
                    className={`relative flex gap-8 md:gap-0 ${
                      i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Number dot on line */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-vma-violet border-2 border-vma-dark top-1" aria-hidden="true" />

                    {/* Content */}
                    <div className={`pl-16 md:pl-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                      <div className="relative">
                        {/* Giant background number */}
                        <span
                          className="font-display text-8xl md:text-9xl font-bold text-vma-text-dim opacity-10 absolute -top-6 -left-4 leading-none select-none"
                          aria-hidden="true"
                        >
                          {step.number}
                        </span>
                        <div className="relative">
                          <h3 className="font-display text-2xl font-bold text-vma-text mb-3">
                            {step.title}
                          </h3>
                          <p className="text-vma-text-muted leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING TRANSPARENCY */}
      <section className="py-24 bg-vma-black/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center mb-6">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-vma-text mb-4">
                Investment Ranges
              </h2>
              <p className="text-vma-text-muted max-w-lg mx-auto">
                Every engagement is custom — these are typical ranges for what our partners invest.
              </p>
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {PRICING_TIERS.map((tier, i) => (
              <SectionReveal key={tier.name} delay={i * 0.1}>
                <PricingTier tier={tier} />
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FREE AUDIT CTA */}
      <section id="audit" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="gradient-border rounded-2xl bg-vma-surface p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-vma-text mb-4">
                  Get Your Free Digital Audit
                </h2>
                <p className="text-vma-text-muted max-w-lg mx-auto">
                  We&apos;ll analyze your website, SEO, ad presence, and competitor positioning — and deliver a 15-page roadmap within 24 hours. No strings.
                </p>
              </div>
              <AuditForm />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="py-24 bg-vma-black/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <SectionReveal>
            <div className="text-center">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-vma-text mb-4">
                What Our Clients Say
              </h2>
            </div>
          </SectionReveal>
        </div>
        <TestimonialsCarousel items={TESTIMONIALS} />
      </section>

      {/* 10. FINAL CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionReveal>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-vma-text mb-4">
              Ready to Engineer Your Growth?
            </h2>
            <p className="text-vma-text-muted max-w-lg mx-auto mb-10">
              Join ambitious businesses across three countries that trust VMA to build and scale their marketing engine.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold text-white rounded-xl glow-violet transition-opacity hover:opacity-90"
              style={{ background: 'var(--vma-gradient-brand)' }}
            >
              Start Your Project →
            </Link>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
