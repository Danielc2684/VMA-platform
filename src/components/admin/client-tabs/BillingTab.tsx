import { Receipt } from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDistanceToNow } from 'date-fns'
import type { OrgWithRelations } from './ClientProfileTabs'

interface BillingTabProps {
  org: OrgWithRelations
}

export function BillingTab({ org }: BillingTabProps): React.JSX.Element {
  const { invoices } = org

  const totalRevenue = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + Number(inv.total), 0)

  const outstanding = invoices
    .filter((inv) => inv.status === 'SENT' || inv.status === 'OVERDUE')
    .reduce((sum, inv) => sum + Number(inv.total), 0)

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-vma-text-dim gap-3">
        <Receipt className="h-8 w-8" />
        <p className="text-sm">No invoices yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <SummaryCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} />
        <SummaryCard label="Outstanding" value={`$${outstanding.toLocaleString()}`} />
        <SummaryCard label="Total Invoices" value={String(invoices.length)} />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-vma-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-vma-surface border-b border-vma-border">
              <tr>
                {['Invoice #', 'Status', 'Subtotal', 'Tax', 'Total', 'Due', 'Paid'].map((h) => (
                  <th key={h} className="text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim px-4 py-3 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr
                  key={inv.id}
                  className={`border-b border-vma-border last:border-0 hover:bg-vma-surface-2 transition-colors ${
                    i % 2 === 0 ? 'bg-vma-surface' : 'bg-vma-surface/60'
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-vma-violet font-bold">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-vma-text">${Number(inv.subtotal).toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs text-vma-text-muted">${Number(inv.tax).toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs font-bold text-vma-text">${Number(inv.total).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-vma-text-muted">
                    {inv.dueDate ? formatDistanceToNow(new Date(inv.dueDate), { addSuffix: true }) : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-vma-text-muted">
                    {inv.paidAt ? formatDistanceToNow(new Date(inv.paidAt), { addSuffix: true }) : '—'}
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

function SummaryCard({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-xl border border-vma-border bg-vma-surface p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim mb-1">{label}</p>
      <p className="font-mono text-lg font-bold text-vma-violet">{value}</p>
    </div>
  )
}
