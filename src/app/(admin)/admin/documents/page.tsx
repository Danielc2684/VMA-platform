import type { Metadata } from 'next'
import Link from 'next/link'
import { Send } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDistanceToNow } from 'date-fns'

export const metadata: Metadata = { title: 'Documents Sent' }

export default async function DocumentsSentPage(): Promise<React.JSX.Element> {
  const documents = await prisma.document.findMany({
    where: { status: { in: ['SENT', 'AWAITING_COUNTERSIGN', 'COUNTERSIGNED', 'SIGNED', 'VOIDED'] } },
    orderBy: { createdAt: 'desc' },
    include: {
      organization: { select: { id: true, name: true } },
      template: { select: { name: true } },
    },
  })

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-vma-text">Documents Sent</h1>
          <p className="text-vma-text-muted text-sm mt-0.5">
            {documents.length} document{documents.length !== 1 ? 's' : ''} sent
          </p>
        </div>
        <Link
          href="/admin/documents/templates"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-vma-border text-vma-text-muted hover:text-vma-text transition-colors"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Templates
        </Link>
      </div>

      <div className="rounded-xl border border-vma-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-vma-surface border-b border-vma-border">
              <tr>
                {['Title', 'Client', 'Category', 'Status', 'Viewed', 'Signed', 'Sent'].map((h) => (
                  <th key={h} className="text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim px-5 py-3.5 text-left">
                    {h}
                  </th>
                ))}
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-vma-text-muted">
                    No documents sent yet.
                  </td>
                </tr>
              )}
              {documents.map((doc, i) => (
                <tr
                  key={doc.id}
                  className={`border-b border-vma-border last:border-0 hover:bg-vma-surface-2 transition-colors ${
                    i % 2 === 0 ? 'bg-vma-surface' : 'bg-vma-surface/60'
                  }`}
                >
                  <td className="px-5 py-4 font-medium text-vma-text text-sm">{doc.title}</td>
                  <td className="px-5 py-4">
                    {doc.organization ? (
                      <Link
                        href={`/admin/clients/${doc.organization.id}`}
                        className="text-xs text-vma-violet hover:underline"
                      >
                        {doc.organization.name}
                      </Link>
                    ) : (
                      <span className="text-xs text-vma-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={doc.category} /></td>
                  <td className="px-5 py-4"><StatusBadge status={doc.status} /></td>
                  <td className="px-5 py-4 text-xs text-vma-text-muted">
                    {doc.viewedAt ? formatDistanceToNow(new Date(doc.viewedAt), { addSuffix: true }) : 'Not viewed'}
                  </td>
                  <td className="px-5 py-4 text-xs text-vma-text-muted">
                    {doc.signedAt ? formatDistanceToNow(new Date(doc.signedAt), { addSuffix: true }) : '—'}
                  </td>
                  <td className="px-5 py-4 text-xs text-vma-text-muted">
                    {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-5 py-4">
                    {doc.publicToken && (
                      <Link
                        href={`/d/${doc.publicToken}`}
                        target="_blank"
                        className="text-xs font-medium text-vma-violet hover:text-vma-violet/80 transition-colors"
                        aria-label={`View ${doc.title} public link`}
                      >
                        View →
                      </Link>
                    )}
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
