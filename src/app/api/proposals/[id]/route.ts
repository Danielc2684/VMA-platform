import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'
import { ProposalStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

const patchSchema = z.object({
  title:      z.string().min(1).optional(),
  status:     z.nativeEnum(ProposalStatus).optional(),
  totalValue: z.number().min(0).optional(),
  validUntil: z.string().datetime().nullable().optional(),
  notes:      z.string().nullable().optional(),
  content:    z.record(z.string(), z.unknown()).optional(),
})

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params): Promise<Response> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: { organization: { select: { id: true, name: true } } },
    })
    if (!proposal) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ proposal })
  } catch (err) {
    console.error('[proposals] GET error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: Params): Promise<Response> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body: unknown = await req.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 })

    const { totalValue, validUntil, content, ...rest } = parsed.data

    const proposal = await prisma.proposal.update({
      where: { id },
      data: {
        ...rest,
        ...(totalValue !== undefined && { totalValue: new Decimal(totalValue) }),
        ...(validUntil !== undefined && { validUntil: validUntil ? new Date(validUntil) : null }),
        ...(content !== undefined && { content: content as import('@prisma/client').Prisma.InputJsonValue }),
      },
    })

    await logAudit({ userId: user.id, action: 'PROPOSAL_UPDATED', entityType: 'Proposal', entityId: id, after: rest })
    return Response.json({ proposal })
  } catch (err) {
    console.error('[proposals] PATCH error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Params): Promise<Response> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await prisma.proposal.delete({ where: { id } })
    await logAudit({ userId: user.id, action: 'PROPOSAL_DELETED', entityType: 'Proposal', entityId: id })
    return Response.json({ success: true })
  } catch (err) {
    console.error('[proposals] DELETE error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
