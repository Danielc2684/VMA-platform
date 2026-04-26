'use client'

import { useEffect, useRef, useState } from 'react'

export function CustomCursor(): React.JSX.Element | null {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // Only activate on pointer-capable, non-touch devices at desktop widths
    const mq = window.matchMedia('(hover: hover) and (min-width: 1024px)')
    setActive(mq.matches)

    const onChange = (e: MediaQueryListEvent): void => setActive(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!active) return

    let ringX = 0
    let ringY = 0
    let dotX = 0
    let dotY = 0
    let rafId = 0

    const onMove = (e: MouseEvent): void => {
      dotX = e.clientX
      dotY = e.clientY
    }

    const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

    const tick = (): void => {
      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`
      }
      // Ring lags behind
      ringX = lerp(ringX, dotX, 0.12)
      ringY = lerp(ringY, dotY, 0.12)
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`
      }
      rafId = requestAnimationFrame(tick)
    }

    const onEnterInteractive = (e: MouseEvent): void => {
      const target = e.target as Element
      if (
        target.closest('a, button, [role="button"], input, textarea, select')
      ) {
        setIsHovering(true)
      }
    }
    const onLeaveInteractive = (e: MouseEvent): void => {
      const target = e.target as Element
      if (
        target.closest('a, button, [role="button"], input, textarea, select')
      ) {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onEnterInteractive, { passive: true })
    window.addEventListener('mouseout', onLeaveInteractive, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onEnterInteractive)
      window.removeEventListener('mouseout', onLeaveInteractive)
      cancelAnimationFrame(rafId)
    }
  }, [active])

  if (!active) return null

  return (
    <>
      {/* Small dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 rounded-full bg-vma-violet will-change-transform"
        style={{ transition: 'opacity 0.2s' }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[9999] w-10 h-10 rounded-full border will-change-transform transition-all duration-150 ${
          isHovering
            ? 'scale-150 border-vma-magenta'
            : 'scale-100 border-vma-violet'
        }`}
        style={{ borderWidth: '1.5px' }}
      />

      <style>{`
        @media (hover: hover) and (min-width: 1024px) {
          html { cursor: none; }
          a, button, [role="button"], input, textarea, select { cursor: none; }
        }
      `}</style>
    </>
  )
}
