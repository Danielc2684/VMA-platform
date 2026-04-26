import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { SectionReveal } from '@/components/public/SectionReveal'
import { SERVICES } from '@/lib/content/public-site'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Social media, SEO, paid media, web design, email marketing, and AI content — six disciplines, one integrated growth engine.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/services`,
  },
}

export default function ServicesPage(): React.JSX.Element {
  return (
    <>
      {/* PAGE HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-vma-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.06] blur-[140px]"
            style={{ background: 'var(--vma-gradient-brand)' }}
          />
          <div className="absolute inset-0 grid-mesh opacity-30" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-vma-violet mb-4">
            What We Do
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-vma-text mb-6">
            Six Services.{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--vma-gradient-accent)' }}
            >
              One Engine.
            </span>
          </h1>
          <p className="text-xl text-vma-text-muted max-w-2xl mx-auto leading-relaxed">
            Every service is designed to work independently or as part of an integrated growth system. Choose what you need, scale when you&apos;re ready.
          </p>
        </div>
      </section>

      {/* SERVICE SECTIONS — alternating layout */}
      {SERVICES.map((service, i) => {
        const Icon = service.icon
        const isEven = i % 2 === 0

        return (
          <section
            key={service.slug}
            id={service.slug}
            className={`py-24 ${isEven ? '' : 'bg-vma-black/40'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`grid lg:grid-cols-2 gap-16 items-center ${
                  isEven ? '' : 'lg:[&>*:first-child]:order-2'
                }`}
              >
                {/* Content */}
                <SectionReveal>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-vma-violet-dim mb-6">
                    <Icon className="h-6 w-6 text-vma-violet" aria-hidden="true" />
                  </div>

                  <h2 className="font-display text-4xl md:text-5xl font-bold text-vma-text mb-6 leading-tight">
                    {service.title}
                  </h2>

                  {service.longDescription.map((para, pi) => (
                    <p key={pi} className="text-vma-text-muted leading-relaxed text-lg mb-4">
                      {para}
                    </p>
                  ))}

                  <div className="mt-8 mb-8">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-vma-text-dim mb-4">
                      What&apos;s Included
                    </h3>
                    <ul className="space-y-3">
                      {service.included.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <Check
                            className="h-4 w-4 text-vma-violet flex-shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span className="text-sm text-vma-text-muted">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="px-4 py-2 rounded-xl bg-vma-violet-dim border border-vma-violet/30 text-sm font-semibold text-vma-violet">
                      {service.priceRange}
                    </div>
                    <Link
                      href={`/contact?service=${service.slug}`}
                      className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white rounded-xl glow-violet"
                      style={{ background: 'var(--vma-gradient-brand)' }}
                    >
                      Discuss This Service →
                    </Link>
                  </div>
                </SectionReveal>

                {/* Case study card */}
                <SectionReveal delay={0.15}>
                  <div className="rounded-2xl bg-vma-surface border border-vma-border overflow-hidden">
                    {/* Placeholder image */}
                    <div
                      className="h-64 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(91,141,239,0.08) 100%)`,
                        backgroundImage: `linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)`,
                        backgroundSize: '20px 20px',
                      }}
                    >
                      <Icon className="h-16 w-16 text-vma-violet opacity-20" aria-hidden="true" />
                    </div>

                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-widest text-vma-text-dim mb-2">
                        Case Study Result
                      </p>
                      <p className="font-display text-2xl font-bold text-vma-green">
                        {service.caseStudyResult}
                      </p>
                      <p className="text-sm text-vma-text-muted mt-2">
                        TODO: Add client name and brief 1-2 sentence context for this result.
                      </p>
                    </div>
                  </div>
                </SectionReveal>
              </div>
            </div>
          </section>
        )
      })}

      {/* CTA */}
      <section className="py-24 border-t border-vma-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-vma-text mb-4">
              Not sure where to start?
            </h2>
            <p className="text-vma-text-muted mb-8 max-w-md mx-auto">
              Get a free audit and we&apos;ll tell you exactly which services will move the needle most for your business.
            </p>
            <Link
              href="/#audit"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white rounded-xl glow-violet"
              style={{ background: 'var(--vma-gradient-brand)' }}
            >
              Get My Free Audit →
            </Link>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
