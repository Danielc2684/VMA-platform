import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'
import { Decimal } from '@prisma/client/runtime/library'

const createSchema = z.object({
  organizationId: z.string().uuid(),
  title:          z.string().min(1),
  totalValue:     z.number().min(0),
  validUntil:     z.string().datetime().optional(),
  notes:          z.string().optional(),
})

export async function POST(req: Request): Promise<Response> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body: unknown = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 })

    const { organizationId, title, totalValue, validUntil, notes } = parsed.data

    const proposal = await prisma.proposal.create({
      data: {
        organizationId,
        title,
        totalValue: new Decimal(totalValue),
        validUntil: validUntil ? new Date(validUntil) : null,
        notes:      notes ?? null,
        content:    { blocks: [] },
      },
    })

    await logAudit({ userId: user.id, action: 'PROPOSAL_CREATED', entityType: 'Proposal', entityId: proposal.id })
    return Response.json({ proposal }, { status: 201 })
  } catch (err) {
    console.error('[proposals] POST error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
