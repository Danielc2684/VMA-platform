import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'
import { notifyAdmins } from '@/lib/notifications'

const signSchema = z.object({
  signerName:  z.string().min(1),
  signerEmail: z.string().email(),
})

interface Params { params: Promise<{ id: string }> }

// POST — accept + sign
export async function POST(req: Request, { params }: Params): Promise<Response> {
  try {
    const { id } = await params

    // id may be a UUID (admin route) or a publicToken (public route)
    const proposal = await prisma.proposal.findFirst({
      where: { OR: [{ id }, { publicToken: id }] },
    })
    if (!proposal) return Response.json({ error: 'Not found' }, { status: 404 })

    if (['ACCEPTED', 'REJECTED', 'EXPIRED'].includes(proposal.status)) {
      return Response.json({ error: 'Proposal already resolved' }, { status: 409 })
    }

    const body: unknown = await req.json()
    const parsed = signSchema.safeParse(body)
    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 })

    const updated = await prisma.proposal.update({
      where: { id: proposal.id },
      data: {
        status:        'ACCEPTED',
        acceptedAt:    new Date(),
        signatureData: JSON.stringify({ signerName: parsed.data.signerName, signerEmail: parsed.data.signerEmail, signedAt: new Date().toISOString() }),
      },
    })

    await logAudit({
      action: 'PROPOSAL_ACCEPTED',
      entityType: 'Proposal',
      entityId: proposal.id,
      after: { signerName: parsed.data.signerName, signerEmail: parsed.data.signerEmail },
    })

    await notifyAdmins({
      type:    'PROPOSAL_ACCEPTED',
      title:   'Proposal Accepted! 🎉',
      message: `${parsed.data.signerName} accepted proposal "${proposal.title}"`,
      link:    `/admin/proposals/${proposal.id}/edit`,
    })

    return Response.json({ proposal: updated })
  } catch (err) {
    console.error('[proposals/sign] POST error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE — decline
export async function DELETE(_req: Request, { params }: Params): Promise<Response> {
  try {
    const { id } = await params

    const proposal = await prisma.proposal.findFirst({
      where: { OR: [{ id }, { publicToken: id }] },
    })
    if (!proposal) return Response.json({ error: 'Not found' }, { status: 404 })

    const updated = await prisma.proposal.update({
      where: { id: proposal.id },
      data: { status: 'REJECTED', rejectedAt: new Date() },
    })

    await logAudit({ action: 'PROPOSAL_REJECTED', entityType: 'Proposal', entityId: proposal.id })
    await notifyAdmins({
      type:    'PROPOSAL_REJECTED',
      title:   'Proposal Declined',
      message: `Proposal "${proposal.title}" was declined by the client.`,
      link:    `/admin/proposals/${proposal.id}/edit`,
    })

    return Response.json({ proposal: updated })
  } catch (err) {
    console.error('[proposals/sign] DELETE error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
