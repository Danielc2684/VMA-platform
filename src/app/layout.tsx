import type { Metadata } from 'next'
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { Providers } from '@/components/shared/Providers'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://versatilema.com',
  ),
  title: {
    template: '%s | VMA',
    default: 'Versatile Marketing Agency — Precision Marketing. Extraordinary Results.',
  },
  description:
    'VMA is a full-service digital marketing agency delivering precision-targeted campaigns, AI-powered lead generation, and data-driven growth for ambitious businesses.',
  openGraph: {
    title: 'Versatile Marketing Agency',
    description: 'Precision Marketing. Extraordinary Results.',
    type: 'website',
    siteName: 'VMA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Versatile Marketing Agency',
    description: 'Precision Marketing. Extraordinary Results.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
