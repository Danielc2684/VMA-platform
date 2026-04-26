import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'
import { DocCategory } from '@prisma/client'

const createSchema = z.object({
  name:     z.string().min(1),
  category: z.nativeEnum(DocCategory),
  content:  z.string().min(1),
  isActive: z.boolean().default(true),
})

export async function GET(): Promise<Response> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const templates = await prisma.documentTemplate.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, category: true },
    })
    return Response.json({ templates })
  } catch (err) {
    console.error('[doc-templates] GET error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body: unknown = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 })

    const template = await prisma.documentTemplate.create({ data: parsed.data })
    await logAudit({ userId: user.id, action: 'TEMPLATE_CREATED', entityType: 'DocumentTemplate', entityId: template.id })
    return Response.json({ template }, { status: 201 })
  } catch (err) {
    console.error('[doc-templates] POST error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
