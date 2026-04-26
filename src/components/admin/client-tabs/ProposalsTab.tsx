import Link from 'next/link'
import { ExternalLink, FileText } from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDistanceToNow } from 'date-fns'
import type { OrgWithRelations } from './ClientProfileTabs'

interface ProposalsTabProps {
  org: OrgWithRelations
}

export function ProposalsTab({ org }: ProposalsTabProps): React.JSX.Element {
  const { proposals } = org

  if (proposals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-vma-text-dim gap-3">
        <FileText className="h-8 w-8" />
        <p className="text-sm">No proposals yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-vma-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-vma-surface border-b border-vma-border">
            <tr>
              {['Title', 'Status', 'Value', 'Valid Until', 'Viewed', 'Created', ''].map((h) => (
                <th key={h} className="text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim px-4 py-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proposals.map((p, i) => (
              <tr
                key={p.id}
                className={`border-b border-vma-border last:border-0 hover:bg-vma-surface-2 transition-colors ${
                  i % 2 === 0 ? 'bg-vma-surface' : 'bg-vma-surface/60'
                }`}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-vma-text text-xs">{p.title}</p>
                </td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3 font-mono text-xs font-bold text-vma-violet">
                  ${Number(p.totalValue).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs text-vma-text-muted">
                  {p.validUntil ? formatDistanceToNow(new Date(p.validUntil), { addSuffix: true }) : '—'}
                </td>
                <td className="px-4 py-3 text-xs text-vma-text-muted">
                  {p.viewedAt ? formatDistanceToNow(new Date(p.viewedAt), { addSuffix: true }) : 'Not viewed'}
                </td>
                <td className="px-4 py-3 text-xs text-vma-text-muted">
                  {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/p/${p.publicToken}`}
                    target="_blank"
                    className="p-1.5 rounded text-vma-text-dim hover:text-vma-violet hover:bg-vma-violet-dim transition-colors inline-flex"
                    aria-label={`View ${p.title} proposal`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
