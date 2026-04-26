'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { Testimonial } from './Testimonial'

interface TestimonialData {
  id: string
  name: string
  company: string
  role: string
  rating: number
  quote: string
}

interface TestimonialsCarouselProps {
  items: readonly TestimonialData[]
}

export function TestimonialsCarousel({
  items,
}: TestimonialsCarouselProps): React.JSX.Element {
  const controls = useAnimationControls()
  const trackRef = useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = useState(0)
  const isPaused = useRef(false)

  // Duplicate items for seamless loop
  const doubled = [...items, ...items]

  useEffect(() => {
    if (!trackRef.current) return
    const halfWidth = trackRef.current.scrollWidth / 2
    setTrackWidth(halfWidth)
  }, [])

  useEffect(() => {
    if (trackWidth === 0) return
    void controls.start({
      x: -trackWidth,
      transition: {
        duration: items.length * 6,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      },
    })
  }, [trackWidth, controls, items.length])

  const handleMouseEnter = (): void => {
    isPaused.current = true
    controls.stop()
  }

  const handleMouseLeave = (): void => {
    if (!isPaused.current) return
    isPaused.current = false
    if (trackWidth === 0) return
    void controls.start({
      x: -trackWidth,
      transition: {
        duration: items.length * 6,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      },
    })
  }

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fade edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
        style={{ background: 'linear-gradient(to right, var(--vma-dark), transparent)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
        style={{ background: 'linear-gradient(to left, var(--vma-dark), transparent)' }}
      />

      <motion.div
        ref={trackRef}
        animate={controls}
        className="flex gap-6 pb-4"
        style={{ width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <Testimonial
            key={`${item.id}-${i}`}
            name={item.name}
            company={item.company}
            role={item.role}
            rating={item.rating}
            quote={item.quote}
          />
        ))}
      </motion.div>
    </div>
  )
}
