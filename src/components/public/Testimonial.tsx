import { Star } from 'lucide-react'

interface TestimonialProps {
  name: string
  company: string
  role: string
  rating: number
  quote: string
}

export function Testimonial({
  name,
  company,
  role,
  rating,
  quote,
}: TestimonialProps): React.JSX.Element {
  const initials = name
    .split(' ')
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex-shrink-0 w-80 md:w-96 rounded-2xl bg-vma-surface border border-vma-border p-6 flex flex-col gap-4">
      {/* Stars */}
      <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4 text-vma-violet fill-vma-violet"
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm text-vma-text-muted leading-relaxed flex-1">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ background: 'var(--vma-gradient-brand)' }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-vma-text">{name}</p>
          <p className="text-xs text-vma-text-muted">
            {role}, {company}
          </p>
        </div>
      </div>
    </div>
  )
}
