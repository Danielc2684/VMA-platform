'use client'

import { useRef, useEffect } from 'react'
import { useMotionValue, useInView, animate } from 'framer-motion'

interface MetricCounterProps {
  value: number
  suffix?: string
  prefix?: string
  label: string
  duration?: number
}

export function MetricCounter({
  value,
  suffix = '',
  prefix = '',
  label,
  duration = 2,
}: MetricCounterProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })
  const count = useMotionValue(0)
  const displayRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!isInView) return
    const controls = animate(count, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        if (displayRef.current) {
          displayRef.current.textContent = Math.round(latest).toString()
        }
      },
    })
    return () => controls.stop()
  }, [isInView, value, duration, count])

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <span className="font-mono text-4xl md:text-5xl font-bold text-vma-violet">
        {prefix}
        <span ref={displayRef}>0</span>
        {suffix}
      </span>
      <span className="mt-2 text-sm text-vma-text-muted">{label}</span>
    </div>
  )
}
