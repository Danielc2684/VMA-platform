import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'
import { LeadStatus, Priority } from '@prisma/client'

const UpdateLeadSchema = z.object({
  status:    z.nativeEnum(LeadStatus).optional(),
  priority:  z.nativeEnum(Priority).optional(),
  firstName: z.string().min(1).optional(),
  lastName:  z.string().min(1).optional(),
  email:     z.string().email().optional().or(z.literal('')),
  phone:     z.string().optional(),
  company:   z.string().optional(),
  notes:     z.string().optional(),
}).partial()

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params): Promise<Response> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  let body: unknown
  try { body = await req.json() } catch { return Response.json({ error: 'Invalid body' }, { status: 400 }) }

  const parsed = UpdateLeadSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: 'Validation failed' }, { status: 400 })

  const lead = await prisma.lead.update({
    where: { id },
    data: parsed.data,
  })

  await logAudit({ userId: user.id, action: 'LEAD_UPDATED', entityType: 'Lead', entityId: id, after: parsed.data })
  return Response.json({ lead })
}

export async function DELETE(_req: NextRequest, { params }: Params): Promise<Response> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  await prisma.lead.delete({ where: { id } })
  await logAudit({ userId: user.id, action: 'LEAD_DELETED', entityType: 'Lead', entityId: id })
  return Response.json({ success: true })
}
