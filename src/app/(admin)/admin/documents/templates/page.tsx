import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDistanceToNow } from 'date-fns'

export const metadata: Metadata = { title: 'Document Templates' }

export default async function DocumentTemplatesPage(): Promise<React.JSX.Element> {
  const templates = await prisma.documentTemplate.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { documents: true } },
    },
  })

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-vma-text">Document Templates</h1>
          <p className="text-vma-text-muted text-sm mt-0.5">
            {templates.length} template{templates.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/documents/templates/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'var(--vma-gradient-brand)' }}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Template
        </Link>
      </div>

      <div className="rounded-xl border border-vma-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-vma-surface border-b border-vma-border">
              <tr>
                {['Name', 'Category', 'Used', 'Active', 'Created'].map((h) => (
                  <th key={h} className="text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim px-5 py-3.5 text-left">
                    {h}
                  </th>
                ))}
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {templates.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-vma-text-muted">
                    No templates yet. Create one to get started.
                  </td>
                </tr>
              )}
              {templates.map((tpl, i) => (
                <tr
                  key={tpl.id}
                  className={`border-b border-vma-border last:border-0 hover:bg-vma-surface-2 transition-colors ${
                    i % 2 === 0 ? 'bg-vma-surface' : 'bg-vma-surface/60'
                  }`}
                >
                  <td className="px-5 py-4 font-medium text-vma-text">{tpl.name}</td>
                  <td className="px-5 py-4"><StatusBadge status={tpl.category} /></td>
                  <td className="px-5 py-4 text-xs text-vma-text-muted">{tpl._count.documents} doc{tpl._count.documents !== 1 ? 's' : ''}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                      tpl.isActive
                        ? 'bg-vma-green/10 text-vma-green border-vma-green/20'
                        : 'bg-vma-text-dim/10 text-vma-text-dim border-vma-text-dim/20'
                    }`}>
                      {tpl.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-vma-text-muted">
                    {formatDistanceToNow(new Date(tpl.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/documents/templates/${tpl.id}/edit`}
                      className="text-xs font-medium text-vma-violet hover:text-vma-violet/80 transition-colors"
                    >
                      Edit →
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
