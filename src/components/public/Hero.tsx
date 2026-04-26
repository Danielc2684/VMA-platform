'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import Link from 'next/link'
import { MagneticButton } from './MagneticButton'

const HEADLINE_WORDS = [
  'Precision',
  'Marketing.',
  'Extraordinary',
  'Results.',
]

const GRADIENT_WORD_INDEX = 2 // "Extraordinary"

export function Hero(): React.JSX.Element {
  const auditRef = useRef<HTMLDivElement>(null)
  const controls = useAnimationControls()
  const subtitleControls = useAnimationControls()

  useEffect(() => {
    const sequence = async (): Promise<void> => {
      await controls.start('visible')
      await subtitleControls.start('visible')
    }
    void sequence()
  }, [controls, subtitleControls])

  const scrollToAudit = (): void => {
    const el = document.getElementById('audit')
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 overflow-hidden grain">
      {/* Animated radial gradient mesh */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            animation: 'pulse-slow 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-2/3 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(232,121,249,0.08) 0%, transparent 70%)',
            animation: 'pulse-slow 12s ease-in-out infinite 2s',
          }}
        />
        <div
          className="absolute top-1/2 right-1/5 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(91,141,239,0.07) 0%, transparent 70%)',
            animation: 'pulse-slow 10s ease-in-out infinite 4s',
          }}
        />
      </div>

      {/* Grid mesh */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-mesh opacity-50" />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-vma-border-bright bg-vma-surface mb-10 text-xs font-medium text-vma-text-muted"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-vma-green animate-pulse" aria-hidden="true" />
        AI-Powered Lead Generation — Now Available
      </motion.div>

      {/* Headline */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold text-vma-text leading-[1.05] tracking-tight mb-6">
          <motion.span
            className="flex flex-wrap justify-center gap-x-4 gap-y-2"
            initial="hidden"
            animate={controls}
            variants={{
              visible: {
                transition: { staggerChildren: 0.08 },
              },
            }}
          >
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
                  },
                }}
                className={
                  i === GRADIENT_WORD_INDEX
                    ? 'bg-clip-text text-transparent'
                    : ''
                }
                style={
                  i === GRADIENT_WORD_INDEX
                    ? { backgroundImage: 'var(--vma-gradient-brand)' }
                    : undefined
                }
              >
                {word}
              </motion.span>
            ))}
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={subtitleControls}
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: 'easeOut' },
            },
          }}
          className="text-lg sm:text-xl text-vma-text-muted max-w-2xl mx-auto leading-relaxed mb-10"
        >
          We engineer growth systems for ambitious businesses. From first click to
          lifelong customer — every pixel, every campaign, every conversion, measured.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton variant="primary" onClick={scrollToAudit}>
            Get Your Free Audit →
          </MagneticButton>
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-vma-text rounded-xl border border-vma-border-bright bg-vma-surface hover:bg-vma-surface-2 transition-colors"
          >
            See Our Work
          </Link>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1) translateX(-50%); }
          50% { opacity: 0.7; transform: scale(1.1) translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="pulse-slow"] { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
