import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(): Promise<Response> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const notifications = await prisma.notification.findMany({
      where: { profileId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const unreadCount = notifications.filter((n) => !n.isRead).length

    return Response.json({ notifications, unreadCount })
  } catch (err) {
    console.error('[notifications] GET error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
