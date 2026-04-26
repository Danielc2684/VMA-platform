import Link from 'next/link'
import { ExternalLink, FileText } from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDistanceToNow } from 'date-fns'
import type { OrgWithRelations } from './ClientProfileTabs'

interface DocumentsTabProps {
  org: OrgWithRelations
}

export function DocumentsTab({ org }: DocumentsTabProps): React.JSX.Element {
  const { documents } = org

  if (documents.length === 0) {
    return (
      <EmptyState icon={<FileText className="h-8 w-8" />} message="No documents yet." />
    )
  }

  return (
    <div className="rounded-xl border border-vma-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-vma-surface border-b border-vma-border">
            <tr>
              {['Title', 'Category', 'Status', 'Template', 'Signed', 'Created', ''].map((h) => (
                <th key={h} className="text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim px-4 py-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, i) => (
              <tr
                key={doc.id}
                className={`border-b border-vma-border last:border-0 hover:bg-vma-surface-2 transition-colors ${
                  i % 2 === 0 ? 'bg-vma-surface' : 'bg-vma-surface/60'
                }`}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-vma-text text-xs">{doc.title}</p>
                </td>
                <td className="px-4 py-3"><StatusBadge status={doc.category} /></td>
                <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                <td className="px-4 py-3 text-xs text-vma-text-muted">{doc.template?.name ?? '—'}</td>
                <td className="px-4 py-3 text-xs text-vma-text-muted">
                  {doc.signedAt ? formatDistanceToNow(new Date(doc.signedAt), { addSuffix: true }) : '—'}
                </td>
                <td className="px-4 py-3 text-xs text-vma-text-muted">
                  {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}
                </td>
                <td className="px-4 py-3">
                  {doc.publicToken && (
                    <Link
                      href={`/d/${doc.publicToken}`}
                      target="_blank"
                      className="p-1.5 rounded text-vma-text-dim hover:text-vma-violet hover:bg-vma-violet-dim transition-colors inline-flex"
                      aria-label={`View ${doc.title}`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-vma-text-dim gap-3">
      {icon}
      <p className="text-sm">{message}</p>
    </div>
  )
}
