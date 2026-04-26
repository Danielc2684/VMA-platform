import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'

const patchSchema = z.object({
  completedAt: z.string().datetime().nullable(),
})

interface Params {
  params: Promise<{ stepId: string }>
}

export async function PATCH(req: Request, { params }: Params): Promise<Response> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { stepId } = await params
    const body: unknown = await req.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 })

    const { completedAt } = parsed.data

    const step = await prisma.onboardingStep.update({
      where: { id: stepId },
      data: { completedAt: completedAt ? new Date(completedAt) : null },
    })

    await logAudit({
      action: completedAt ? 'onboarding_step_completed' : 'onboarding_step_uncompleted',
      entityType: 'onboarding_step',
      entityId: stepId,
      userId: user.id,
    })

    return Response.json({ step })
  } catch (err) {
    console.error('[onboarding/steps] PATCH error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
