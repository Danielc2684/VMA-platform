import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Send, Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ClientProfileTabs } from '@/components/admin/client-tabs/ClientProfileTabs'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const org = await prisma.organization.findUnique({ where: { id }, select: { name: true } })
  return { title: org?.name ?? 'Client Profile' }
}

export default async function ClientProfilePage({ params }: PageProps): Promise<React.JSX.Element> {
  const { id } = await params

  const [org, auditLogs] = await Promise.all([
    prisma.organization.findUnique({
      where: { id },
      include: {
        members: true,
        leads: { orderBy: { createdAt: 'desc' } },
        documents: {
          include: { template: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        },
        proposals: { orderBy: { createdAt: 'desc' } },
        invoices: { orderBy: { createdAt: 'desc' } },
        reports: { orderBy: { createdAt: 'desc' } },
        assets: { orderBy: { createdAt: 'desc' } },
        onboarding: { include: { steps: { orderBy: { order: 'asc' } } } },
        requests: {
          include: { submittedBy: { select: { fullName: true, email: true } } },
          orderBy: { createdAt: 'desc' },
        },
        appointments: { orderBy: { startTime: 'desc' }, take: 10 },
      },
    }),
    prisma.auditLog.findMany({
      where: { entityType: 'organization', entityId: id },
      include: { actor: { select: { fullName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ])

  if (!org) notFound()

  const initials = org.name.charAt(0).toUpperCase()

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Back */}
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-1.5 text-xs text-vma-text-muted hover:text-vma-text transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to Clients
      </Link>

      {/* Profile header */}
      <div className="rounded-xl border border-vma-border bg-vma-surface p-6">
        <div className="flex items-start gap-5 flex-wrap">
          {/* Logo / initials */}
          {org.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={org.logoUrl}
              alt={`${org.name} logo`}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
              style={{ background: 'var(--vma-gradient-brand)' }}
              aria-hidden="true"
            >
              {initials}
            </div>
          )}

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-2xl font-bold text-vma-text">{org.name}</h1>
              <StatusBadge status={org.status} />
            </div>
            {org.industry && (
              <p className="text-sm text-vma-text-muted mt-0.5">{org.industry}</p>
            )}
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              {org.monthlyBudget && (
                <span className="font-mono text-sm font-bold text-vma-violet">
                  ${Number(org.monthlyBudget).toLocaleString()}/mo
                </span>
              )}
              {org.website && (
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-vma-text-muted hover:text-vma-violet transition-colors"
                >
                  {org.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              <span className="text-xs text-vma-text-dim">
                {org.members.length} member{org.members.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/admin/clients/${org.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-vma-border text-vma-text-muted hover:text-vma-text hover:border-vma-text-muted transition-colors"
            >
              <Edit className="h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </Link>
            <Link
              href={`/admin/documents?org=${org.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-vma-border text-vma-text-muted hover:text-vma-text hover:border-vma-text-muted transition-colors"
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              Send Doc
            </Link>
            <Link
              href={`/admin/proposals/new?org=${org.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white"
              style={{ background: 'var(--vma-gradient-brand)' }}
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              New Proposal
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ClientProfileTabs org={org} auditLogs={auditLogs} />
    </div>
  )
}
