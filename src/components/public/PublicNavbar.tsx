'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function PublicNavbar(): React.JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = (): void => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-vma-black/90 backdrop-blur-md border-b border-vma-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center justify-between h-16"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl font-bold text-vma-text hover:opacity-80 transition-opacity"
            aria-label="VMA home"
          >
            VMA<span className="text-vma-violet">.</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-vma-violet'
                      : 'text-vma-text-muted hover:text-vma-text'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-vma-text-muted hover:text-vma-text transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all"
              style={{ background: 'var(--vma-gradient-brand)' }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-vma-text-muted hover:text-vma-text transition-colors"
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-vma-black/95 backdrop-blur-md border-b border-vma-border overflow-hidden"
          >
            <ul className="flex flex-col px-4 py-4 space-y-1" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-vma-violet-dim text-vma-violet-light'
                        : 'text-vma-text-muted hover:text-vma-text hover:bg-vma-surface'
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-3 border-t border-vma-border space-y-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-vma-text-muted hover:text-vma-text transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-center text-white"
                  style={{ background: 'var(--vma-gradient-brand)' }}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
