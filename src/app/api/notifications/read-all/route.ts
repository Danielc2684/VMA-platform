import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(): Promise<Response> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    await prisma.notification.updateMany({
      where: { profileId: user.id, isRead: false },
      data: { isRead: true, readAt: new Date() },
    })

    return Response.json({ success: true })
  } catch (err) {
    console.error('[notifications/read-all] POST error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
