import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'
import { notifyAdmins } from '@/lib/notifications'

const signSchema = z.object({
  signerName:  z.string().min(1),
  signerEmail: z.string().email(),
})

interface Params { params: Promise<{ id: string }> }

export async function POST(req: Request, { params }: Params): Promise<Response> {
  try {
    const { id } = await params
    const body: unknown = await req.json()
    const parsed = signSchema.safeParse(body)
    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 })

    const doc = await prisma.document.findUnique({ where: { id } })
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })

    if (['SIGNED', 'COUNTERSIGNED', 'VOIDED'].includes(doc.status)) {
      return Response.json({ error: 'Document already signed or voided' }, { status: 409 })
    }

    const updated = await prisma.document.update({
      where: { id },
      data: {
        signerName:  parsed.data.signerName,
        signerEmail: parsed.data.signerEmail,
        signedAt:    new Date(),
        status:      'AWAITING_COUNTERSIGN',
      },
    })

    await logAudit({
      action: 'DOCUMENT_SIGNED',
      entityType: 'Document',
      entityId: id,
      after: { signerName: parsed.data.signerName, signerEmail: parsed.data.signerEmail },
    })

    await notifyAdmins({
      type:    'DOCUMENT_SIGNED',
      title:   'Document Signed',
      message: `${parsed.data.signerName} signed "${doc.title}"`,
      link:    `/admin/documents`,
    })

    return Response.json({ document: updated })
  } catch (err) {
    console.error('[documents/sign] POST error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
