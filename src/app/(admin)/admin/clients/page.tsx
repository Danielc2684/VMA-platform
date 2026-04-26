import type { Metadata } from 'next'
import Link from 'next/link'
import { Building2, ExternalLink } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDistanceToNow } from 'date-fns'

export const metadata: Metadata = { title: 'Clients' }

export default async function ClientsPage(): Promise<React.JSX.Element> {
  const orgs = await prisma.organization.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      members: { select: { fullName: true, email: true, role: true }, take: 3 },
      onboarding: { select: { status: true, steps: { select: { completedAt: true } } } },
    },
  })

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-vma-text">Clients</h1>
          <p className="text-vma-text-muted text-sm mt-0.5">{orgs.length} organization{orgs.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/clients/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'var(--vma-gradient-brand)' }}
        >
          <Building2 className="h-4 w-4" aria-hidden="true" />
          Add Client
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-vma-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-vma-surface border-b border-vma-border">
              <tr>
                {['Name', 'Status', 'Monthly Budget', 'Onboarding', 'Members', 'Created'].map((h) => (
                  <th key={h} className="text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim px-5 py-3.5 text-left">
                    {h}
                  </th>
                ))}
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {orgs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-vma-text-muted">
                    No clients yet. Add one to get started.
                  </td>
                </tr>
              )}
              {orgs.map((org, i) => {
                const totalSteps = org.onboarding?.steps.length ?? 0
                const completedSteps = org.onboarding?.steps.filter((s) => s.completedAt).length ?? 0
                const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

                return (
                  <tr
                    key={org.id}
                    className={`border-b border-vma-border last:border-0 hover:bg-vma-surface-2 transition-colors ${
                      i % 2 === 0 ? 'bg-vma-surface' : 'bg-vma-surface/60'
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: 'var(--vma-gradient-brand)' }}
                          aria-hidden="true"
                        >
                          {org.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <Link href={`/admin/clients/${org.id}`} className="font-medium text-vma-text hover:text-vma-violet transition-colors">
                            {org.name}
                          </Link>
                          {org.website && (
                            <p className="text-xs text-vma-text-muted mt-0.5">{org.website.replace(/^https?:\/\//, '')}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={org.status} /></td>
                    <td className="px-5 py-4 font-mono text-xs font-bold text-vma-violet">
                      {org.monthlyBudget ? `$${Number(org.monthlyBudget).toLocaleString()}/mo` : '—'}
                    </td>
                    <td className="px-5 py-4">
                      {org.onboarding ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-20 h-1.5 rounded-full bg-vma-surface-2 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-vma-violet"
                              style={{ width: `${progress}%` }}
                              aria-label={`${progress}% complete`}
                            />
                          </div>
                          <span className="text-xs text-vma-text-muted">
                            {completedSteps}/{totalSteps}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-vma-text-dim">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex -space-x-1">
                        {org.members.slice(0, 3).map((m, mi) => (
                          <div
                            key={mi}
                            className="w-6 h-6 rounded-full bg-vma-surface-2 border-2 border-vma-surface flex items-center justify-center text-[9px] font-bold text-vma-violet"
                            title={m.fullName ?? m.email}
                            aria-label={m.fullName ?? m.email}
                          >
                            {(m.fullName ?? m.email).charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-vma-text-muted">
                      {formatDistanceToNow(new Date(org.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/clients/${org.id}`}
                        className="p-1.5 rounded text-vma-text-dim hover:text-vma-violet hover:bg-vma-violet-dim transition-colors inline-flex"
                        aria-label={`View ${org.name} profile`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
