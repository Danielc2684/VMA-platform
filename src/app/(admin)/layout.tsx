import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import type { JSX } from 'react'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { prisma } from '@/lib/prisma'

export default async function AdminLayout({ children }: { children: ReactNode }): Promise<JSX.Element> {
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

  if (!ADMIN_ROLES.includes(role)) {
    redirect('/portal/dashboard')
  }

  const fullName = (profile?.full_name as string | undefined) ?? (profile?.email as string | undefined) ?? ''
  const email = (profile?.email as string | undefined) ?? user.email ?? ''
  const initials = fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
    || email.slice(0, 2).toUpperCase()

  const unreadNotifications = await prisma.notification.count({
    where: { profileId: user.id, isRead: false },
  })

  return (
    <div className="flex h-screen bg-vma-dark overflow-hidden">
      <AdminSidebar
        userEmail={email}
        userRole={role}
        userInitials={initials}
        unreadNotifications={unreadNotifications}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 grid-mesh">
          {children}
        </main>
      </div>
    </div>
  )
}
