import { LOGO_MARQUEE_PHRASES } from '@/lib/content/public-site'

export function LogoMarquee(): React.JSX.Element {
  // Duplicate phrases for seamless infinite loop
  const items = [...LOGO_MARQUEE_PHRASES, ...LOGO_MARQUEE_PHRASES]

  return (
    <div className="relative w-full overflow-hidden border-y border-vma-border bg-vma-black/60 py-4">
      {/* Fade edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10"
        style={{ background: 'linear-gradient(to right, var(--vma-black), transparent)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10"
        style={{ background: 'linear-gradient(to left, var(--vma-black), transparent)' }}
      />

      <div
        className="flex gap-0 will-change-transform"
        style={{ animation: 'marquee 24s linear infinite' }}
        aria-hidden="true"
      >
        {items.map((phrase, i) => (
          <span
            key={i}
            className="flex items-center gap-0 whitespace-nowrap"
          >
            <span className="text-sm font-medium text-vma-text-muted tracking-wider uppercase px-6">
              {phrase}
            </span>
            <span className="text-vma-text-dim text-xl leading-none select-none">
              /
            </span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .will-change-transform { animation: none; }
        }
      `}</style>
    </div>
  )
}
