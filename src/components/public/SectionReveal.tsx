'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionRevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function SectionReveal({
  children,
  className,
  delay = 0,
}: SectionRevealProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
