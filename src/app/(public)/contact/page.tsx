import type { Metadata } from 'next'
import { Mail, Phone, MapPin } from 'lucide-react'
import { ContactForm } from '@/components/public/ContactForm'
import { SectionReveal } from '@/components/public/SectionReveal'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with the VMA team. Start your project, ask a question, or get your free digital audit.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
  },
}

// Placeholder contact constants — will pull from SiteContent table in Phase 4
const CONTACT_INFO = {
  email: 'hello@versatilema.com',
  phone: 'TODO: Add phone number',
  address: 'TODO: Add office address',
} as const

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
] as const

export default function ContactPage(): React.JSX.Element {
  return (
    <>
      {/* PAGE HERO */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-vma-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-[0.06] blur-[140px]"
            style={{ background: 'var(--vma-gradient-brand)' }}
          />
          <div className="absolute inset-0 grid-mesh opacity-30" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-vma-violet mb-4">
            Get In Touch
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-vma-text mb-6">
            Let&apos;s Build{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--vma-gradient-brand)' }}
            >
              Something
            </span>
          </h1>
          <p className="text-xl text-vma-text-muted max-w-xl mx-auto leading-relaxed">
            Tell us about your business and goals. We&apos;ll respond within 1 business day.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* LEFT — Contact info */}
            <div className="lg:col-span-2 space-y-10">
              <SectionReveal>
                <h2 className="font-display text-2xl font-bold text-vma-text mb-6">
                  Reach Us Directly
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-vma-violet-dim flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-vma-violet" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-vma-text-dim uppercase tracking-widest mb-1">Email</p>
                      <a
                        href={`mailto:${CONTACT_INFO.email}`}
                        className="text-vma-text hover:text-vma-violet transition-colors text-sm"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-vma-violet-dim flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-vma-violet" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-vma-text-dim uppercase tracking-widest mb-1">Phone</p>
                      <p className="text-sm text-vma-text">{CONTACT_INFO.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-vma-violet-dim flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-vma-violet" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-vma-text-dim uppercase tracking-widest mb-1">Office</p>
                      <p className="text-sm text-vma-text">{CONTACT_INFO.address}</p>
                    </div>
                  </div>
                </div>

                {/* Social links */}
                <div className="pt-8 border-t border-vma-border">
                  <p className="text-xs text-vma-text-dim uppercase tracking-widest mb-4">
                    Follow Us
                  </p>
                  <div className="flex gap-3">
                    {SOCIAL_LINKS.map(({ label, href, icon }) => (
                      <a
                        key={label}
                        href={href}
                        className="w-10 h-10 rounded-xl bg-vma-surface border border-vma-border flex items-center justify-center text-vma-text-muted hover:text-vma-violet hover:border-vma-violet transition-colors"
                        aria-label={label}
                      >
                        {icon}
                      </a>
                    ))}
                  </div>
                </div>
              </SectionReveal>

              {/* Stylized map — pure CSS, no external dependency */}
              <SectionReveal delay={0.15}>
                <div
                  className="rounded-2xl bg-vma-surface border border-vma-border p-6 h-56 relative overflow-hidden"
                  aria-label="Office location map (stylized)"
                  role="img"
                >
                  {/* Grid lines */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                    aria-hidden="true"
                  />

                  {/* Violet location dot */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  >
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-vma-violet glow-violet" />
                      <div className="absolute inset-0 w-4 h-4 rounded-full bg-vma-violet animate-ping opacity-30" />
                    </div>
                  </div>

                  {/* Diagonal accent lines */}
                  <div
                    className="absolute top-0 left-0 w-full h-full opacity-10"
                    style={{
                      background:
                        'repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(139,92,246,0.3) 30px, rgba(139,92,246,0.3) 31px)',
                    }}
                    aria-hidden="true"
                  />

                  <p className="absolute bottom-4 left-4 text-xs text-vma-text-dim">
                    {CONTACT_INFO.address}
                  </p>
                </div>
              </SectionReveal>
            </div>

            {/* RIGHT — Contact form */}
            <div className="lg:col-span-3">
              <SectionReveal delay={0.1}>
                <div className="rounded-2xl bg-vma-surface border border-vma-border p-8">
                  <h2 className="font-display text-2xl font-bold text-vma-text mb-2">
                    Tell Us About Your Project
                  </h2>
                  <p className="text-sm text-vma-text-muted mb-8">
                    Complete the form and we&apos;ll reach out within 1 business day.
                  </p>
                  <ContactForm />
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
