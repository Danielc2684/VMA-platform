'use client'

import { useRef, useCallback } from 'react'
import { motion, useSpring } from 'framer-motion'
import type { ReactNode, MouseEvent } from 'react'

type ButtonVariant = 'primary' | 'ghost' | 'magenta'

interface MagneticButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  onClick?: () => void
  href?: string
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  'aria-label'?: string
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'text-white glow-violet',
  ghost:
    'text-vma-text border border-vma-violet hover:bg-vma-violet-dim',
  magenta:
    'text-white glow-magenta',
}

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: 'var(--vma-gradient-brand)' },
  ghost: {},
  magenta: { background: 'var(--vma-gradient-accent)' },
}

export function MagneticButton({
  children,
  variant = 'primary',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  'aria-label': ariaLabel,
}: MagneticButtonProps): React.JSX.Element {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useSpring(0, { stiffness: 300, damping: 30 })
  const y = useSpring(0, { stiffness: 300, damping: 30 })

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      x.set((e.clientX - centerX) * 0.3)
      y.set((e.clientY - centerY) * 0.3)
    },
    [x, y],
  )

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.button
      ref={ref}
      type={type}
      style={{ x, y, ...VARIANT_STYLES[variant] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold rounded-xl transition-colors ${VARIANT_CLASSES[variant]} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </motion.button>
  )
}
