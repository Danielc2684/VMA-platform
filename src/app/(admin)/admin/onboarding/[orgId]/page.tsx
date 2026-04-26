import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { OnboardingTab } from '@/components/admin/client-tabs/OnboardingTab'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface PageProps {
  params: Promise<{ orgId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { orgId } = await params
  const org = await prisma.organization.findUnique({ where: { id: orgId }, select: { name: true } })
  return { title: org ? `${org.name} — Onboarding` : 'Onboarding' }
}

export default async function OrgOnboardingPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { orgId } = await params

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      onboarding: { include: { steps: { orderBy: { order: 'asc' } } } },
    },
  })

  if (!org) notFound()

  // Build a minimal org shape that satisfies OnboardingTab's prop type
  const orgForTab = {
    ...org,
    members: [],
    leads: [],
    documents: [],
    proposals: [],
    invoices: [],
    reports: [],
    assets: [],
    requests: [],
    appointments: [],
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <Link
        href="/admin/onboarding"
        className="inline-flex items-center gap-1.5 text-xs text-vma-text-muted hover:text-vma-text transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to Onboarding
      </Link>

      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-vma-text">{org.name}</h1>
            {org.onboarding && <StatusBadge status={org.onboarding.status} />}
          </div>
          <Link
            href={`/admin/clients/${org.id}`}
            className="text-xs text-vma-text-muted hover:text-vma-violet transition-colors mt-0.5 inline-block"
          >
            View client profile →
          </Link>
        </div>
      </div>

      <OnboardingTab org={orgForTab as Parameters<typeof OnboardingTab>[0]['org']} />
    </div>
  )
}
