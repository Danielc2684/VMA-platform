import type { ReactNode } from 'react'
import { PublicNavbar } from '@/components/public/PublicNavbar'
import { PublicFooter } from '@/components/public/PublicFooter'
import { CustomCursor } from '@/components/public/CustomCursor'

export default function PublicLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-vma-dark">
      <CustomCursor />
      <PublicNavbar />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}
