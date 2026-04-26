import type { Metadata } from 'next'
import Link from 'next/link'
import { Target, Users, Zap, Globe } from 'lucide-react'
import { SectionReveal } from '@/components/public/SectionReveal'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Meet the team behind VMA. We are a precision-focused digital marketing agency helping ambitious businesses achieve extraordinary results.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
  },
}

const VALUES = [
  {
    icon: Target,
    title: 'Precision Over Volume',
    description:
      'We believe one well-targeted campaign beats ten scattered ones. Every decision is data-driven and deliberate.',
    stat: '97%',
    statLabel: 'Client Retention',
  },
  {
    icon: Zap,
    title: 'Speed Without Sacrifice',
    description:
      'Moving fast matters. But not at the cost of quality. We have built systems that deliver both.',
    stat: '24h',
    statLabel: 'Audit Turnaround',
  },
  {
    icon: Users,
    title: 'Partnership Mentality',
    description:
      'We don&apos;t have clients — we have partners. Your growth is our growth. Your wins are our wins.',
    stat: '3+',
    statLabel: 'Year Avg. Relationship',
  },
  {
    icon: Globe,
    title: 'Global Perspective',
    description:
      'With partners across three countries, we bring a global lens to every strategy while staying locally relevant.',
    stat: '3',
    statLabel: 'Countries',
  },
]

const MILESTONES = [
  { year: 'TODO: Year', event: 'TODO: Founding milestone' },
  { year: 'TODO: Year', event: 'TODO: First major client or service launch' },
  { year: 'TODO: Year', event: 'TODO: Key achievement or expansion' },
  { year: 'TODO: Year', event: 'TODO: AI lead generation launch' },
]

export default function AboutPage(): React.JSX.Element {
  return (
    <>
      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.06] blur-[160px]"
            style={{ background: 'var(--vma-gradient-accent)' }}
          />
          <div className="absolute inset-0 grid-mesh opacity-30" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold text-vma-text leading-tight">
              We Build{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'var(--vma-gradient-brand)' }}
              >
                Growth
              </span>
              <br />
              Machines.
            </h1>
          </div>
          <p className="mt-6 text-xl text-vma-text-muted max-w-2xl leading-relaxed">
            VMA is a digital marketing agency built on the belief that marketing should be measurable, precise, and extraordinary.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 border-y border-vma-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-vma-violet mb-8">
              Our Mission
            </p>
            <p className="font-display text-2xl md:text-3xl text-vma-text leading-relaxed">
              To make world-class marketing accessible to ambitious businesses — regardless of size — by combining human expertise with AI precision.
            </p>
            <p className="mt-6 text-vma-text-muted leading-relaxed text-lg">
              We started VMA because we saw too many businesses pouring money into marketing that couldn&apos;t be measured, couldn&apos;t be optimized, and couldn&apos;t be scaled. We built the alternative: a marketing operation that runs like engineering.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-vma-text mb-16 text-center">
              Our Values
            </h2>
          </SectionReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => {
              const Icon = value.icon
              return (
                <SectionReveal key={value.title} delay={i * 0.08}>
                  <div className="rounded-2xl bg-vma-surface border border-vma-border p-6 h-full flex flex-col">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-vma-violet-dim mb-4 flex-shrink-0">
                      <Icon className="h-5 w-5 text-vma-violet" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-vma-text mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-vma-text-muted leading-relaxed flex-1">
                      {value.description.replace("&apos;", "'")}
                    </p>
                    <div className="mt-6 pt-4 border-t border-vma-border">
                      <span className="font-mono text-2xl font-bold text-vma-violet">
                        {value.stat}
                      </span>
                      <p className="text-xs text-vma-text-muted mt-1">{value.statLabel}</p>
                    </div>
                  </div>
                </SectionReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 bg-vma-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-vma-text mb-16 text-center">
              The Team
            </h2>
          </SectionReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Founder card — TODO: replace with real info */}
            <SectionReveal>
              <div className="rounded-2xl bg-vma-surface border border-vma-border p-6 text-center">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
                  style={{ background: 'var(--vma-gradient-brand)' }}
                  aria-hidden="true"
                >
                  ?
                </div>
                <h3 className="font-display text-lg font-bold text-vma-text mb-1">
                  TODO: Founder Name
                </h3>
                <p className="text-sm text-vma-violet mb-3">TODO: Title</p>
                <p className="text-xs text-vma-text-muted leading-relaxed">
                  TODO: Brief bio — 2-3 sentences about background and what drives them.
                </p>
              </div>
            </SectionReveal>

            {/* Join Us card */}
            <SectionReveal delay={0.1}>
              <Link
                href="/careers"
                className="block rounded-2xl border border-dashed border-vma-border-bright p-6 text-center hover:border-vma-violet transition-colors group h-full"
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-dashed border-vma-border-bright group-hover:border-vma-violet transition-colors flex items-center justify-center">
                  <span className="text-3xl text-vma-text-dim group-hover:text-vma-violet transition-colors">
                    +
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-vma-text mb-1">
                  Join Our Team
                </h3>
                <p className="text-sm text-vma-text-muted">
                  We&apos;re always looking for exceptional people. View open roles →
                </p>
              </Link>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* MILESTONES */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-vma-text mb-16 text-center">
              Milestones
            </h2>
          </SectionReveal>

          <div className="relative">
            <div
              className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-vma-violet via-vma-magenta/40 to-transparent"
              aria-hidden="true"
            />

            <div className="space-y-10">
              {MILESTONES.map((milestone, i) => (
                <SectionReveal key={i} delay={i * 0.08}>
                  <div className="flex gap-8 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-vma-violet-dim border border-vma-violet flex items-center justify-center text-vma-violet">
                      <span className="w-2 h-2 rounded-full bg-vma-violet" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="font-mono text-sm font-bold text-vma-violet">
                        {milestone.year}
                      </span>
                      <p className="text-vma-text mt-1">{milestone.event}</p>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-vma-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-vma-text mb-4">
              Ready to Work Together?
            </h2>
            <p className="text-vma-text-muted mb-8">
              Let&apos;s talk about your growth goals.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white rounded-xl glow-violet"
              style={{ background: 'var(--vma-gradient-brand)' }}
            >
              Start a Conversation →
            </Link>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
