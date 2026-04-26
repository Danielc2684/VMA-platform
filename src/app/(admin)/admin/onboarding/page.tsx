import type { Metadata } from 'next'
import Link from 'next/link'
import { ClipboardList } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDistanceToNow } from 'date-fns'

export const metadata: Metadata = { title: 'Onboarding' }

export default async function OnboardingPage(): Promise<React.JSX.Element> {
  const packets = await prisma.onboardingPacket.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      organization: { select: { id: true, name: true, logoUrl: true } },
      steps: { select: { completedAt: true } },
    },
  })

  return (
    <div className="space-y-5 max-w-7xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-vma-text">Onboarding</h1>
        <p className="text-vma-text-muted text-sm mt-0.5">
          {packets.length} client{packets.length !== 1 ? 's' : ''} in onboarding
        </p>
      </div>

      <div className="rounded-xl border border-vma-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-vma-surface border-b border-vma-border">
              <tr>
                {['Client', 'Status', 'Progress', 'Steps', 'Due', 'Started'].map((h) => (
                  <th key={h} className="text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim px-5 py-3.5 text-left">
                    {h}
                  </th>
                ))}
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {packets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-vma-text-muted">
                    No onboarding packets yet.
                  </td>
                </tr>
              )}
              {packets.map((packet, i) => {
                const total = packet.steps.length
                const completed = packet.steps.filter((s) => s.completedAt).length
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0

                return (
                  <tr
                    key={packet.id}
                    className={`border-b border-vma-border last:border-0 hover:bg-vma-surface-2 transition-colors ${
                      i % 2 === 0 ? 'bg-vma-surface' : 'bg-vma-surface/60'
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: 'var(--vma-gradient-brand)' }}
                          aria-hidden="true"
                        >
                          {packet.organization.name.charAt(0).toUpperCase()}
                        </div>
                        <Link
                          href={`/admin/onboarding/${packet.organization.id}`}
                          className="font-medium text-vma-text hover:text-vma-violet transition-colors text-sm"
                        >
                          {packet.organization.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={packet.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-20 h-1.5 rounded-full bg-vma-surface-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-vma-violet"
                            style={{ width: `${pct}%` }}
                            aria-label={`${pct}% complete`}
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-vma-violet">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-vma-text-muted">
                      {completed}/{total}
                    </td>
                    <td className="px-5 py-4 text-xs text-vma-text-muted">
                      {packet.dueDate
                        ? formatDistanceToNow(new Date(packet.dueDate), { addSuffix: true })
                        : '—'}
                    </td>
                    <td className="px-5 py-4 text-xs text-vma-text-muted">
                      {packet.startedAt
                        ? formatDistanceToNow(new Date(packet.startedAt), { addSuffix: true })
                        : 'Not started'}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/onboarding/${packet.organization.id}`}
                        className="text-xs font-medium text-vma-violet hover:text-vma-violet/80 transition-colors"
                      >
                        View →
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
