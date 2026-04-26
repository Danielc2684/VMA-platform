'use client'

import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  included: readonly string[]
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  included,
}: ServiceCardProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 200, damping: 25 })
  const y = useSpring(rawY, { stiffness: 200, damping: 25 })

  const rotateX = useTransform(y, [-60, 60], [8, -8])
  const rotateY = useTransform(x, [-60, 60], [-8, 8])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      rawX.set(e.clientX - rect.left - rect.width / 2)
      rawY.set(e.clientY - rect.top - rect.height / 2)
    },
    [rawX, rawY],
  )

  const handleMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-2xl bg-vma-surface border border-vma-border p-6 overflow-hidden cursor-default"
    >
      {/* Gradient top border */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'var(--vma-gradient-brand)' }}
        aria-hidden="true"
      />

      {/* Background glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative">
        {/* Icon */}
        <div className="mb-4 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-vma-violet-dim">
          <Icon className="h-5 w-5 text-vma-violet" aria-hidden="true" />
        </div>

        <h3 className="font-display text-lg font-bold text-vma-text mb-2">
          {title}
        </h3>
        <p className="text-sm text-vma-text-muted leading-relaxed mb-4">
          {description}
        </p>

        <ul className="space-y-1.5">
          {included.slice(0, 3).map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-vma-text-muted">
              <span className="w-1 h-1 rounded-full bg-vma-violet flex-shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
