import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: {
    template: '%s | VMA',
    default: 'Sign In | VMA',
  },
}

export default function AuthLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-vma-black grid-mesh">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-vma-violet opacity-[0.04] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full bg-vma-magenta opacity-[0.03] blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-display text-xl font-bold text-vma-text hover:opacity-80 transition-opacity"
          aria-label="VMA home"
        >
          VMA<span className="text-vma-violet">.</span>
        </Link>
      </header>

      {/* Centered card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      <footer className="relative z-10 p-6 text-center">
        <p className="text-vma-text-dim text-xs">
          © {new Date().getFullYear()} Versatile Marketing Agency. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
