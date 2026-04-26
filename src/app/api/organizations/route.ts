import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(): Promise<Response> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const organizations = await prisma.organization.findMany({
      where: { status: { in: ['ACTIVE', 'INACTIVE'] } },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, status: true },
    })

    return Response.json({ organizations })
  } catch (err) {
    console.error('[organizations] GET error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
