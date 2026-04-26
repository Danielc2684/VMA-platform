import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import type { JSX } from 'react'
import { createClient } from '@/lib/supabase/server'
import { PortalSidebar } from '@/components/portal/PortalSidebar'

export default async function PortalLayout({ children }: { children: ReactNode }): Promise<JSX.Element> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, role')
    .eq('id', user.id)
    .single()

  const ADMIN_ROLES = ['ADMIN', 'MANAGER', 'SUPER_ADMIN']
  const role = (profile?.role as string | undefined) ?? 'CLIENT'

  if (ADMIN_ROLES.includes(role)) {
    redirect('/admin/dashboard')
  }

  const fullName = (profile?.full_name as string | undefined) ?? ''
  const email = (profile?.email as string | undefined) ?? user.email ?? ''
  const firstName = fullName.split(' ')[0] ?? email.split('@')[0] ?? 'there'
  const initials = fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
    || email.slice(0, 2).toUpperCase()

  return (
    <div className="flex h-screen bg-vma-dark overflow-hidden">
      <PortalSidebar
        userEmail={email}
        userFirstName={firstName}
        userInitials={initials}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 grid-mesh">
          {children}
        </main>
      </div>
    </div>
  )
}
