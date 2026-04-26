import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'
import { DocCategory } from '@prisma/client'

const patchSchema = z.object({
  name:     z.string().min(1).optional(),
  category: z.nativeEnum(DocCategory).optional(),
  content:  z.string().optional(),
  isActive: z.boolean().optional(),
})

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Params): Promise<Response> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body: unknown = await req.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 })

    const template = await prisma.documentTemplate.update({ where: { id }, data: parsed.data })
    await logAudit({ userId: user.id, action: 'TEMPLATE_UPDATED', entityType: 'DocumentTemplate', entityId: id, after: parsed.data })
    return Response.json({ template })
  } catch (err) {
    console.error('[doc-templates] PATCH error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Params): Promise<Response> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await prisma.documentTemplate.delete({ where: { id } })
    await logAudit({ userId: user.id, action: 'TEMPLATE_DELETED', entityType: 'DocumentTemplate', entityId: id })
    return Response.json({ success: true })
  } catch (err) {
    console.error('[doc-templates] DELETE error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
