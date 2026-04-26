import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDistanceToNow } from 'date-fns'

export const metadata: Metadata = { title: 'Proposals' }

export default async function ProposalsPage(): Promise<React.JSX.Element> {
  const proposals = await prisma.proposal.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      organization: { select: { id: true, name: true } },
    },
  })

  const totalValue = proposals
    .filter((p) => p.status === 'ACCEPTED')
    .reduce((sum, p) => sum + Number(p.totalValue), 0)

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-vma-text">Proposals</h1>
          <p className="text-vma-text-muted text-sm mt-0.5">
            {proposals.length} proposal{proposals.length !== 1 ? 's' : ''}
            {totalValue > 0 && (
              <span className="ml-2 font-mono font-bold text-vma-violet">
                · ${totalValue.toLocaleString()} accepted
              </span>
            )}
          </p>
        </div>
        <Link
          href="/admin/proposals/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'var(--vma-gradient-brand)' }}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Proposal
        </Link>
      </div>

      <div className="rounded-xl border border-vma-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-vma-surface border-b border-vma-border">
              <tr>
                {['Title', 'Client', 'Status', 'Value', 'Valid Until', 'Viewed', 'Created'].map((h) => (
                  <th key={h} className="text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim px-5 py-3.5 text-left">
                    {h}
                  </th>
                ))}
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {proposals.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-vma-text-muted">
                    No proposals yet. Create one to get started.
                  </td>
                </tr>
              )}
              {proposals.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-b border-vma-border last:border-0 hover:bg-vma-surface-2 transition-colors ${
                    i % 2 === 0 ? 'bg-vma-surface' : 'bg-vma-surface/60'
                  }`}
                >
                  <td className="px-5 py-4 font-medium text-vma-text">{p.title}</td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/clients/${p.organization.id}`}
                      className="text-xs text-vma-violet hover:underline"
                    >
                      {p.organization.name}
                    </Link>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-4 font-mono text-xs font-bold text-vma-violet">
                    ${Number(p.totalValue).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-xs text-vma-text-muted">
                    {p.validUntil ? formatDistanceToNow(new Date(p.validUntil), { addSuffix: true }) : '—'}
                  </td>
                  <td className="px-5 py-4 text-xs text-vma-text-muted">
                    {p.viewedAt ? formatDistanceToNow(new Date(p.viewedAt), { addSuffix: true }) : 'Not viewed'}
                  </td>
                  <td className="px-5 py-4 text-xs text-vma-text-muted">
                    {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-5 py-4 flex items-center gap-2">
                    <Link
                      href={`/admin/proposals/${p.id}/edit`}
                      className="text-xs text-vma-text-muted hover:text-vma-violet transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/p/${p.publicToken}`}
                      target="_blank"
                      className="text-xs font-medium text-vma-violet hover:text-vma-violet/80 transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
