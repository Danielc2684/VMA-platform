import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'
import { LeadSource, LeadStatus, Priority } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

const CreateLeadSchema = z.object({
  firstName:      z.string().min(1),
  lastName:       z.string().min(1),
  email:          z.string().email().optional().or(z.literal('')),
  phone:          z.string().optional(),
  company:        z.string().optional(),
  jobTitle:       z.string().optional(),
  website:        z.string().url().optional().or(z.literal('')),
  source:         z.nativeEnum(LeadSource).default(LeadSource.OTHER),
  status:         z.nativeEnum(LeadStatus).default(LeadStatus.NEW),
  priority:       z.nativeEnum(Priority).default(Priority.MEDIUM),
  estimatedValue: z.number().positive().optional(),
  notes:          z.string().optional(),
})

export async function GET(): Promise<Response> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      organization: { select: { name: true } },
      createdBy: { select: { fullName: true, email: true } },
    },
  })
  return Response.json({ leads })
}

export async function POST(req: NextRequest): Promise<Response> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { return Response.json({ error: 'Invalid body' }, { status: 400 }) }

  const parsed = CreateLeadSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })

  const { estimatedValue, email, website, ...rest } = parsed.data

  const lead = await prisma.lead.create({
    data: {
      ...rest,
      email: email || null,
      website: website || null,
      estimatedValue: estimatedValue ? new Decimal(estimatedValue) : null,
      createdById: user.id,
    },
  })

  await logAudit({ userId: user.id, action: 'LEAD_CREATED', entityType: 'Lead', entityId: lead.id })
  return Response.json({ lead }, { status: 201 })
}
