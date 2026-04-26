import { BarChart3 } from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDistanceToNow } from 'date-fns'
import type { OrgWithRelations } from './ClientProfileTabs'

interface ReportsTabProps {
  org: OrgWithRelations
}

export function ReportsTab({ org }: ReportsTabProps): React.JSX.Element {
  const { reports } = org

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-vma-text-dim gap-3">
        <BarChart3 className="h-8 w-8" />
        <p className="text-sm">No reports published yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-vma-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-vma-surface border-b border-vma-border">
            <tr>
              {['Title', 'Type', 'Status', 'Period', 'Published', 'Created'].map((h) => (
                <th key={h} className="text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim px-4 py-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((report, i) => (
              <tr
                key={report.id}
                className={`border-b border-vma-border last:border-0 hover:bg-vma-surface-2 transition-colors ${
                  i % 2 === 0 ? 'bg-vma-surface' : 'bg-vma-surface/60'
                }`}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-vma-text text-xs">{report.title}</p>
                </td>
                <td className="px-4 py-3"><StatusBadge status={report.type} /></td>
                <td className="px-4 py-3"><StatusBadge status={report.status} /></td>
                <td className="px-4 py-3 text-xs text-vma-text-muted">{report.period ?? '—'}</td>
                <td className="px-4 py-3 text-xs text-vma-text-muted">
                  {report.publishedAt ? formatDistanceToNow(new Date(report.publishedAt), { addSuffix: true }) : '—'}
                </td>
                <td className="px-4 py-3 text-xs text-vma-text-muted">
                  {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
