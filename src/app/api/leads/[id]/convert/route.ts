import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'
import { createNotification } from '@/lib/notifications'
import { LeadStatus, OrgStatus } from '@prisma/client'

const ConvertSchema = z.object({
  orgName:    z.string().min(1),
  website:    z.string().url().optional().or(z.literal('')),
  industry:   z.string().optional(),
  phone:      z.string().optional(),
  address:    z.string().optional(),
  city:       z.string().optional(),
  country:    z.string().optional(),
})

interface Params { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params): Promise<Response> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  let body: unknown
  try { body = await req.json() } catch { return Response.json({ error: 'Invalid body' }, { status: 400 }) }

  const parsed = ConvertSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: 'Validation failed' }, { status: 400 })

  const lead = await prisma.lead.findUnique({ where: { id } })
  if (!lead) return Response.json({ error: 'Lead not found' }, { status: 404 })

  const { orgName, website, ...rest } = parsed.data

  // Generate a URL-safe slug
  const baseSlug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const existing = await prisma.organization.count({ where: { slug: { startsWith: baseSlug } } })
  const slug = existing === 0 ? baseSlug : `${baseSlug}-${existing}`

  const [org] = await prisma.$transaction([
    prisma.organization.create({
      data: {
        name:    orgName,
        slug,
        status:  OrgStatus.ACTIVE,
        website: website || null,
        ...rest,
      },
    }),
    prisma.lead.update({
      where: { id },
      data: {
        status:   LeadStatus.WON,
        closedAt: new Date(),
      },
    }),
  ])

  // Create default onboarding packet
  const DEFAULT_STEPS = [
    'Welcome & Kickoff',
    'Brand Brief',
    'Access to Accounts',
    'Goals & KPIs',
    'Competitor List',
    'Content Guidelines',
    'Approval Workflow',
    'Reporting Preferences',
    'Final Review',
  ]

  await prisma.onboardingPacket.create({
    data: {
      organizationId: org.id,
      steps: {
        create: DEFAULT_STEPS.map((title, i) => ({
          title,
          order:      i,
          isRequired: true,
        })),
      },
    },
  })

  await logAudit({ userId: user.id, action: 'LEAD_CONVERTED', entityType: 'Lead', entityId: id, after: { orgId: org.id } })
  await createNotification({
    userId: user.id,
    type:   'LEAD_CONVERTED',
    title:  'Lead Converted',
    message: `${orgName} is now an active client. Onboarding has been created.`,
    link:   `/admin/clients/${org.id}`,
  })

  return Response.json({ org, success: true }, { status: 201 })
}
